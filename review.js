#!/usr/bin/env node
/**
 * 单模型代码审查脚本 — 把 git diff 发给指定模型，拿回审查结果
 *
 * 用法:
 *   node review.js --diff <diff文件路径> --model <模型key> [--angle <审查角度>] [--config <models.json路径>]
 *
 * 示例:
 *   node review.js --diff /tmp/diff.txt --model deepseek --config ./models.json
 *   node review.js --diff /tmp/diff.txt --model doubao --angle "重点关注安全问题" --config ./models.json
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

// ===== 参数解析 =====

function parseArgs() {
  const argv = process.argv.slice(2);
  const args = { config: path.resolve(__dirname, "models.json"), angle: "" };

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--diff" && argv[i + 1])    args.diff = argv[++i];
    else if (argv[i] === "--model" && argv[i + 1]) args.model = argv[++i];
    else if (argv[i] === "--angle" && argv[i + 1]) args.angle = argv[++i];
    else if (argv[i] === "--config" && argv[i + 1]) args.config = argv[++i];
  }
  return args;
}

// ===== 模型配置加载 =====

function loadModelConfig(configPath, modelKey) {
  if (!fs.existsSync(configPath)) {
    throw new Error(`找不到配置文件: ${configPath}`);
  }
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  if (!config.models || !config.models[modelKey]) {
    throw new Error(`模型 "${modelKey}" 未在配置中找到。可用模型: ${config.models ? Object.keys(config.models).join(", ") : "无"}`);
  }
  return config.models[modelKey];
}

// ===== 审查 prompt =====

function buildReviewPrompt(diffContent, angle) {
  let prompt = `You are a senior code reviewer. Review the following git diff carefully.

## Code Diff
\`\`\`diff
${diffContent}
\`\`\`

## Review Instructions
- Identify bugs, security issues, performance problems, poor design, and maintainability concerns
- For each finding, provide: severity (CRITICAL/HIGH/MEDIUM/LOW), file, description, and suggestion
- Be specific — reference exact lines or code patterns
- If you find no issues, explain what the code does well instead
- Keep your response concise and actionable`;

  if (angle) {
    prompt += `\n\n## Special Focus\n${angle}`;
  }

  return prompt;
}

// ===== API 调用 (OpenAI 兼容格式) =====

function chatCompletion(modelConfig, prompt) {
  const baseUrl = modelConfig.base_url.replace(/\/+$/, "");
  const url = new URL(baseUrl + "/chat/completions");
  const body = JSON.stringify({
    model: modelConfig.model,
    messages: [
      {
        role: "system",
        content: "You are an expert code reviewer. Be honest, specific, and constructive. Output in the same language the user used."
      },
      { role: "user", content: prompt }
    ],
    stream: false,
    max_tokens: 4096,
    temperature: 0.3,
  });

  const transport = url.protocol === "https:" ? https : http;

  return new Promise((resolve, reject) => {
    const req = transport.request(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${modelConfig.api_key}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
      timeout: 120000, // 2 分钟超时
    }, (res) => {
      let data = "";
      res.on("data", (c) => data += c);
      res.on("end", () => {
        if (res.statusCode >= 400) {
          return reject(new Error(`API ${res.statusCode}: ${data.slice(0, 500)}`));
        }
        try {
          const json = JSON.parse(data);
          resolve(json?.choices?.[0]?.message?.content || data);
        } catch {
          resolve(data);
        }
      });
    });
    req.on("timeout", () => { req.destroy(); reject(new Error("请求超时 (120s)")); });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ===== 主函数 =====

async function main() {
  const args = parseArgs();

  // 参数校验
  if (!args.diff) {
    console.error("错误: 需要 --diff 参数指定 diff 文件路径");
    process.exit(1);
  }
  if (!args.model) {
    console.error("错误: 需要 --model 参数指定模型 key");
    process.exit(1);
  }
  if (!fs.existsSync(args.diff)) {
    console.error(`错误: diff 文件不存在: ${args.diff}`);
    process.exit(1);
  }

  try {
    const modelConfig = loadModelConfig(args.config, args.model);
    const diffContent = fs.readFileSync(args.diff, "utf-8");

    if (!diffContent.trim()) {
      console.log("## 审查结果");
      console.log();
      console.log("没有代码改动 (diff 为空)，无需审查。");
      return;
    }

    const prompt = buildReviewPrompt(diffContent, args.angle);

    console.error(`[review.js] 正在调用 ${modelConfig.name} (${modelConfig.model})...`);
    const result = await chatCompletion(modelConfig, prompt);
    console.error(`[review.js] ${modelConfig.name} 返回完成\n`);

    // 输出审查结果到 stdout
    console.log(`## ${modelConfig.name} (${modelConfig.provider})`);
    console.log();
    console.log(result);
  } catch (err) {
    console.error(`[review.js] 错误: ${err.message}`);
    process.exit(1);
  }
}

main();

# Claude Code Multi-Model Review Skill

调用多个外部 AI 模型并行审查代码改动，每个模型给出独立意见，综合对比各模型的发现。

## 为什么需要

Claude Code 本身的模型可能通过代理指向同一个底层模型（如 DeepSeek），审查能力单一。这个 skill 让你同时调用不同厂商的模型（DeepSeek、豆包、千问、OpenAI 等）审查同一份 diff，互相验证，避免单一模型的盲区。

## 功能

- **多模型并行审查** — 同时调用多个外部模型，互不等待
- **独立意见** — 每个模型用自己的角度评审，不做删减
- **交叉验证** — 多个模型同时发现的问题置信度最高
- **分歧对比** — 展示模型之间的不同意见
- **自由扩展** — 随时添加新的模型 API

## 文件结构

```
custom-review/
  SKILL.md      # Skill 编排流程（Claude Code 读这个）
  review.js     # 单模型审查脚本（OpenAI 兼容 API）
  models.json   # 保存用户配置的模型 API（不进 git）
```

## 快速开始

### 1. 安装 Skill

将整个 `custom-review/` 目录放到 `~/.claude/skills/` 下：

```bash
git clone https://github.com/baiyanmo/claude-code-multi-model-review.git
cp -r claude-code-multi-model-review ~/.claude/skills/custom-review
```

### 2. 配置模型

在 Claude Code 中说：

> 添加审查模型

按提示填写模型信息：
- 名称（自定义，如"豆包"）
- API Base URL（OpenAI 兼容格式）
- API Key
- 模型 ID

建议至少配置 2 个模型才能发挥"多模型"的价值。

### 3. 审查代码

在有 git 仓库的目录下说：

> 审查代码 / review / 帮我看看代码

Skill 会触发，让你选择用哪几个模型，然后并行审查当前 diff。

## 支持的模型

任何 OpenAI 兼容 API 都可以，包括但不限于：

| 厂商 | Base URL |
|------|----------|
| DeepSeek | `https://api.deepseek.com/v1` |
| 阿里云百炼（千问） | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| 火山引擎（豆包） | `https://ark.cn-beijing.volces.com/api/v3` |
| OpenAI | `https://api.openai.com/v1` |
| SiliconFlow | `https://api.siliconflow.cn/v1` |
| 其他兼容代理 | 自定义 |

## 命令行用法

也可以直接在终端调用 review.js：

```bash
node review.js --diff /tmp/my_diff.txt --model deepseek --config models.json
node review.js --diff /tmp/my_diff.txt --model doubao --angle "关注安全漏洞" --config models.json
```

## 安全

- `models.json` 包含 API Key，已在 `.gitignore` 中排除
- review.js 只依赖 Node.js 内置模块，无需 `npm install`
- API 调用通过 HTTPS，超时 120 秒

## License

MIT

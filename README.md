# Claude Code Multi-Model Review Skill

Call multiple external AI models to review your code changes in parallel. Each model gives independent feedback, then the results are compared side by side.

## Why

Claude Code's built-in model may route through a proxy to a single backend model (e.g., DeepSeek), limiting review diversity. This skill lets you invoke models from different providers (DeepSeek, Doubao, Qwen, OpenAI, etc.) simultaneously on the same diff — catching blind spots that any single model might miss.

## Features

- **Parallel reviews** — All selected models run at the same time, no waiting
- **Independent opinions** — Each model's output is preserved in full, no truncation
- **Cross-validation** — Issues flagged by multiple models have higher confidence
- **Divergence comparison** — See where models disagree
- **Easy to extend** — Add new model APIs anytime

## File Structure

```
custom-review/
  SKILL.md              # Workflow orchestration (Claude Code reads this)
  review.js             # Single-model review script (OpenAI-compatible API)
  models.example.json   # Example model config template
  models.json           # Your actual model config (gitignored)
```

## Quick Start

### 1. Install

Copy the `custom-review/` directory to `~/.claude/skills/`:

```bash
git clone https://github.com/baiyanmo/claude-code-multi-model-review.git
cp -r claude-code-multi-model-review ~/.claude/skills/custom-review
```

### 2. Configure Models

In Claude Code, say:

> 添加审查模型

Or in English:

> Add a review model

Provide the following info for each model:
- Name (e.g., "DeepSeek")
- API Base URL (OpenAI-compatible format)
- API Key
- Model ID (e.g., `deepseek-v4-pro`)

Configure at least 2 models to get the most out of multi-model review.

### 3. Review Code

In a git repo, say:

> 审查代码 / review / check my changes

The skill triggers, lets you pick which models to use, then runs them all in parallel.

## Supported Providers

Any OpenAI-compatible API works, including:

| Provider | Base URL |
|----------|----------|
| DeepSeek | `https://api.deepseek.com/v1` |
| Alibaba Bailian (Qwen) | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| Volcengine (Doubao) | `https://ark.cn-beijing.volces.com/api/v3` |
| OpenAI | `https://api.openai.com/v1` |
| SiliconFlow | `https://api.siliconflow.cn/v1` |
| Custom proxy | Any URL |

## CLI Usage

You can also run `review.js` directly from the terminal:

```bash
node review.js --diff /tmp/my_diff.txt --model deepseek --config models.json
node review.js --diff /tmp/my_diff.txt --model doubao --angle "Focus on security issues" --config models.json
```

## Security

- `models.json` contains your API keys — excluded via `.gitignore`
- `review.js` uses only Node.js built-in modules (no `npm install` needed)
- API calls go over HTTPS, timeout at 120 seconds

## License

MIT

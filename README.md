# Claude Code Multi-Model Review Skill

**[English](./README.md#en) | [中文](./README.md#zh) | [日本語](./README.md#ja) | [한국어](./README.md#ko)**

---

<a id="en"></a>
## English

Call multiple external AI models to review your code changes in parallel. Each model gives independent feedback, then the results are compared side by side.

### Why

Claude Code's built-in model may route through a proxy to a single backend model (e.g., DeepSeek), limiting review diversity. This skill lets you invoke models from different providers (DeepSeek, Doubao, Qwen, OpenAI, etc.) simultaneously on the same diff — catching blind spots that any single model might miss.

### Features

- **Parallel reviews** — All selected models run at the same time, no waiting
- **Independent opinions** — Each model's output is preserved in full, no truncation
- **Cross-validation** — Issues flagged by multiple models have higher confidence
- **Divergence comparison** — See where models disagree
- **Easy to extend** — Add new model APIs anytime

### File Structure

```
custom-review/
  SKILL.md              # Workflow orchestration (Claude Code reads this)
  review.js             # Single-model review script (OpenAI-compatible API)
  models.example.json   # Example model config template
  models.json           # Your actual model config (gitignored)
```

### Quick Start

#### 1. Install

Copy the `custom-review/` directory to `~/.claude/skills/`:

```bash
git clone https://github.com/baiyanmo/claude-code-multi-model-review.git
cp -r claude-code-multi-model-review ~/.claude/skills/custom-review
```

#### 2. Configure Models

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

#### 3. Review Code

In a git repo, say:

> 审查代码 / review / check my changes

The skill triggers, lets you pick which models to use, then runs them all in parallel.

### Supported Providers

Any OpenAI-compatible API works, including:

| Provider | Base URL |
|----------|----------|
| DeepSeek | `https://api.deepseek.com/v1` |
| Alibaba Bailian (Qwen) | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| Volcengine (Doubao) | `https://ark.cn-beijing.volces.com/api/v3` |
| OpenAI | `https://api.openai.com/v1` |
| SiliconFlow | `https://api.siliconflow.cn/v1` |
| Custom proxy | Any URL |

### CLI Usage

You can also run `review.js` directly from the terminal:

```bash
node review.js --diff /tmp/my_diff.txt --model deepseek --config models.json
node review.js --diff /tmp/my_diff.txt --model doubao --angle "Focus on security issues" --config models.json
```

### Security

- `models.json` contains your API keys — excluded via `.gitignore`
- `review.js` uses only Node.js built-in modules (no `npm install` needed)
- API calls go over HTTPS, timeout at 120 seconds

---

<a id="zh"></a>
## 中文

调用多个外部 AI 模型并行审查代码改动，每个模型给出独立意见，综合对比各模型的发现。

### 为什么需要

Claude Code 本身的模型可能通过代理指向同一个底层模型（如 DeepSeek），审查视角单一。这个 skill 让你同时调用不同厂商的模型（DeepSeek、豆包、千问、OpenAI 等）审查同一份 diff，互相验证，避免单一模型的盲区。

### 功能

- **多模型并行审查** — 同时调用多个外部模型，互不等待
- **独立意见** — 每个模型用自己的角度评审，完整保留不做删减
- **交叉验证** — 多个模型同时发现的问题置信度最高
- **分歧对比** — 展示不同模型之间的意见分歧
- **自由扩展** — 随时添加新的模型 API

### 文件结构

```
custom-review/
  SKILL.md              # Skill 编排流程（Claude Code 读这个）
  review.js             # 单模型审查脚本（OpenAI 兼容 API）
  models.example.json   # 模型配置示例模板
  models.json           # 你的实际模型配置（gitignored）
```

### 快速开始

#### 1. 安装 Skill

将 `custom-review/` 目录复制到 `~/.claude/skills/` 下：

```bash
git clone https://github.com/baiyanmo/claude-code-multi-model-review.git
cp -r claude-code-multi-model-review ~/.claude/skills/custom-review
```

#### 2. 配置模型

在 Claude Code 中说：

> 添加审查模型

按提示填写以下信息：
- 名称（自定义，如"豆包"）
- API Base URL（OpenAI 兼容格式）
- API Key
- 模型 ID（如 `deepseek-v4-pro`、`ep-xxx`）

建议至少配置 2 个模型才能发挥"多模型"的价值。

#### 3. 审查代码

在有 git 仓库的目录下说：

> 审查代码 / review / 帮我看看代码

Skill 会触发，让你选择用哪几个模型，然后并行审查当前 diff。

### 支持的模型

任何 OpenAI 兼容 API 都可以，包括但不限于：

| 厂商 | Base URL |
|------|----------|
| DeepSeek | `https://api.deepseek.com/v1` |
| 阿里云百炼（千问） | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| 火山引擎（豆包） | `https://ark.cn-beijing.volces.com/api/v3` |
| OpenAI | `https://api.openai.com/v1` |
| SiliconFlow | `https://api.siliconflow.cn/v1` |
| 其他兼容代理 | 自定义 |

### 命令行用法

也可以在终端直接调用 review.js：

```bash
node review.js --diff /tmp/my_diff.txt --model deepseek --config models.json
node review.js --diff /tmp/my_diff.txt --model doubao --angle "重点关注安全问题" --config models.json
```

### 安全

- `models.json` 包含 API Key，已在 `.gitignore` 中排除
- review.js 只依赖 Node.js 内置模块，无需 `npm install`
- API 调用通过 HTTPS，超时 120 秒

---

<a id="ja"></a>
## 日本語

複数の外部 AI モデルを並行実行し、コード変更をレビューします。各モデルが独立した意見を出し、結果を横断比較します。

### なぜ必要か

Claude Code のモデルがプロキシ経由で単一のバックエンドモデル（例: DeepSeek）にルーティングされている場合、レビューの視点が偏る可能性があります。この Skill を使うと、異なるプロバイダー（DeepSeek、豆包、Qwen、OpenAI など）のモデルを同じ diff に対して同時に実行し、単一モデルでは見逃す可能性のある問題を検出できます。

### 機能

- **並行レビュー** — 選択した全モデルが同時に実行、待ち時間なし
- **独立した意見** — 各モデルの出力を完全に保持、削除なし
- **クロスバリデーション** — 複数モデルが指摘した問題は信頼度が高い
- **意見の分岐を比較** — モデル間の意見の相違を表示
- **簡単に拡張** — いつでも新しいモデル API を追加可能

### ファイル構成

```
custom-review/
  SKILL.md              # ワークフロー定義 (Claude Code が読み込む)
  review.js             # 単一モデルレビュースクリプト (OpenAI 互換 API)
  models.example.json   # モデル設定のサンプルテンプレート
  models.json           # 実際のモデル設定 (gitignored)
```

### クイックスタート

#### 1. インストール

`custom-review/` ディレクトリを `~/.claude/skills/` にコピーします：

```bash
git clone https://github.com/baiyanmo/claude-code-multi-model-review.git
cp -r claude-code-multi-model-review ~/.claude/skills/custom-review
```

#### 2. モデルの設定

Claude Code で次のように言います：

> 添加审查模型

各モデルの以下の情報を入力してください：
- 名前（例: "DeepSeek"）
- API Base URL（OpenAI 互換形式）
- API Key
- モデル ID（例: `deepseek-v4-pro`）

マルチモデルレビューを最大限活用するために、最低 2 つのモデルを設定することをお勧めします。

#### 3. コードレビュー

git リポジトリ内で次のように言います：

> 审查代码 / review / 帮我看看代码

Skill が起動し、使用するモデルを選択すると、すべてのモデルが並行実行されます。

### 対応プロバイダー

OpenAI 互換 API であればすべて対応しています：

| プロバイダー | Base URL |
|------|----------|
| DeepSeek | `https://api.deepseek.com/v1` |
| Alibaba Bailian (Qwen) | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| Volcengine (Doubao) | `https://ark.cn-beijing.volces.com/api/v3` |
| OpenAI | `https://api.openai.com/v1` |
| SiliconFlow | `https://api.siliconflow.cn/v1` |
| カスタムプロキシ | 任意の URL |

### CLI での使用

ターミナルから直接 `review.js` を実行することもできます：

```bash
node review.js --diff /tmp/my_diff.txt --model deepseek --config models.json
node review.js --diff /tmp/my_diff.txt --model doubao --angle "セキュリティ問題に注目" --config models.json
```

### セキュリティ

- `models.json` には API キーが含まれます — `.gitignore` で除外済み
- `review.js` は Node.js 組み込みモジュールのみを使用（`npm install` 不要）
- API 呼び出しは HTTPS 経由、タイムアウトは 120 秒

---

<a id="ko"></a>
## 한국어

여러 외부 AI 모델을 병렬로 호출하여 코드 변경 사항을 검토합니다. 각 모델이 독립적인 의견을 제시하고, 결과를 나란히 비교합니다.

### 필요한 이유

Claude Code의 모델이 프록시를 통해 단일 백엔드 모델(예: DeepSeek)로 라우팅되는 경우, 리뷰 관점이 편향될 수 있습니다. 이 Skill을 사용하면 서로 다른 제공자(DeepSeek, 豆包, Qwen, OpenAI 등)의 모델을 동일한 diff에 대해 동시에 실행하여, 단일 모델이 놓칠 수 있는 문제를 발견할 수 있습니다.

### 기능

- **병렬 리뷰** — 선택한 모든 모델이 동시에 실행되어 대기 시간 없음
- **독립적인 의견** — 각 모델의 출력을 완전히 보존, 삭제 없음
- **교차 검증** — 여러 모델이 지적한 문제는 신뢰도가 높음
- **의견 차이 비교** — 모델 간 의견 불일치를 표시
- **쉬운 확장** — 언제든지 새 모델 API 추가 가능

### 파일 구조

```
custom-review/
  SKILL.md              # 워크플로우 정의 (Claude Code가 읽음)
  review.js             # 단일 모델 리뷰 스크립트 (OpenAI 호환 API)
  models.example.json   # 모델 설정 예제 템플릿
  models.json           # 실제 모델 설정 (gitignored)
```

### 빠른 시작

#### 1. 설치

`custom-review/` 디렉토리를 `~/.claude/skills/`로 복사합니다:

```bash
git clone https://github.com/baiyanmo/claude-code-multi-model-review.git
cp -r claude-code-multi-model-review ~/.claude/skills/custom-review
```

#### 2. 모델 설정

Claude Code에서 다음과 같이 말합니다:

> 添加审查模型

각 모델에 대해 다음 정보를 입력하세요:
- 이름 (예: "DeepSeek")
- API Base URL (OpenAI 호환 형식)
- API Key
- 모델 ID (예: `deepseek-v4-pro`)

멀티 모델 리뷰를 최대한 활용하려면 최소 2개 이상의 모델을 설정하는 것이 좋습니다.

#### 3. 코드 리뷰

git 저장소에서 다음과 같이 말합니다:

> 审查代码 / review / 帮我看看代码

Skill이 실행되어 사용할 모델을 선택하면, 모든 모델이 병렬로 실행됩니다.

### 지원되는 제공자

OpenAI 호환 API라면 모두 사용 가능합니다:

| 제공자 | Base URL |
|------|----------|
| DeepSeek | `https://api.deepseek.com/v1` |
| Alibaba Bailian (Qwen) | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| Volcengine (Doubao) | `https://ark.cn-beijing.volces.com/api/v3` |
| OpenAI | `https://api.openai.com/v1` |
| SiliconFlow | `https://api.siliconflow.cn/v1` |
| 사용자 정의 프록시 | 임의의 URL |

### CLI 사용법

터미널에서 직접 `review.js`를 실행할 수도 있습니다:

```bash
node review.js --diff /tmp/my_diff.txt --model deepseek --config models.json
node review.js --diff /tmp/my_diff.txt --model doubao --angle "보안 문제에 집중" --config models.json
```

### 보안

- `models.json`에는 API 키가 포함됩니다 — `.gitignore`로 제외됨
- `review.js`는 Node.js 내장 모듈만 사용 (`npm install` 불필요)
- API 호출은 HTTPS를 통해 이루어지며, 타임아웃은 120초

---

## License

MIT

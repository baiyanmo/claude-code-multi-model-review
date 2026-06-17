# Claude Code マルチモデルコードレビュー Skill

複数の外部 AI モデルを並行実行し、コード変更をレビューします。各モデルが独立した意見を出し、結果を横断比較します。

## なぜ必要か

Claude Code のモデルがプロキシ経由で単一のバックエンドモデル（例: DeepSeek）にルーティングされている場合、レビューの視点が偏る可能性があります。この Skill を使うと、異なるプロバイダー（DeepSeek、豆包、Qwen、OpenAI など）のモデルを同じ diff に対して同時に実行し、単一モデルでは見逃す可能性のある問題を検出できます。

## 機能

- **並行レビュー** — 選択した全モデルが同時に実行、待ち時間なし
- **独立した意見** — 各モデルの出力を完全に保持、削除なし
- **クロスバリデーション** — 複数モデルが指摘した問題は信頼度が高い
- **意見の分岐を比較** — モデル間の意見の相違を表示
- **簡単に拡張** — いつでも新しいモデル API を追加可能

## ファイル構成

```
custom-review/
  SKILL.md              # ワークフロー定義 (Claude Code が読み込む)
  review.js             # 単一モデルレビュースクリプト (OpenAI 互換 API)
  models.example.json   # モデル設定のサンプルテンプレート
  models.json           # 実際のモデル設定 (gitignored)
```

## クイックスタート

### 1. インストール

`custom-review/` ディレクトリを `~/.claude/skills/` にコピーします：

```bash
git clone https://github.com/baiyanmo/claude-code-multi-model-review.git
cp -r claude-code-multi-model-review ~/.claude/skills/custom-review
```

### 2. モデルの設定

Claude Code で次のように言います：

> 添加审查模型

各モデルの以下の情報を入力してください：
- 名前（例: "DeepSeek"）
- API Base URL（OpenAI 互換形式）
- API Key
- モデル ID（例: `deepseek-v4-pro`）

マルチモデルレビューを最大限活用するために、最低 2 つのモデルを設定することをお勧めします。

### 3. コードレビュー

git リポジトリ内で次のように言います：

> 审查代码 / review / 帮我看看代码

Skill が起動し、使用するモデルを選択すると、すべてのモデルが並行実行されます。

## 対応プロバイダー

OpenAI 互換 API であればすべて対応しています：

| プロバイダー | Base URL |
|------|----------|
| DeepSeek | `https://api.deepseek.com/v1` |
| Alibaba Bailian (Qwen) | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| Volcengine (Doubao) | `https://ark.cn-beijing.volces.com/api/v3` |
| OpenAI | `https://api.openai.com/v1` |
| SiliconFlow | `https://api.siliconflow.cn/v1` |
| カスタムプロキシ | 任意の URL |

## CLI での使用

ターミナルから直接 `review.js` を実行することもできます：

```bash
node review.js --diff /tmp/my_diff.txt --model deepseek --config models.json
node review.js --diff /tmp/my_diff.txt --model doubao --angle "セキュリティ問題に注目" --config models.json
```

## セキュリティ

- `models.json` には API キーが含まれます — `.gitignore` で除外済み
- `review.js` は Node.js 組み込みモジュールのみを使用（`npm install` 不要）
- API 呼び出しは HTTPS 経由、タイムアウトは 120 秒

## ライセンス

MIT

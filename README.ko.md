# Claude Code 멀티 모델 코드 리뷰 Skill

여러 외부 AI 모델을 병렬로 호출하여 코드 변경 사항을 검토합니다. 각 모델이 독립적인 의견을 제시하고, 결과를 나란히 비교합니다.

## 필요한 이유

Claude Code의 모델이 프록시를 통해 단일 백엔드 모델(예: DeepSeek)로 라우팅되는 경우, 리뷰 관점이 편향될 수 있습니다. 이 Skill을 사용하면 서로 다른 제공자(DeepSeek, 豆包, Qwen, OpenAI 등)의 모델을 동일한 diff에 대해 동시에 실행하여, 단일 모델이 놓칠 수 있는 문제를 발견할 수 있습니다.

## 기능

- **병렬 리뷰** — 선택한 모든 모델이 동시에 실행되어 대기 시간 없음
- **독립적인 의견** — 각 모델의 출력을 완전히 보존, 삭제 없음
- **교차 검증** — 여러 모델이 지적한 문제는 신뢰도가 높음
- **의견 차이 비교** — 모델 간 의견 불일치를 표시
- **쉬운 확장** — 언제든지 새 모델 API 추가 가능

## 파일 구조

```
custom-review/
  SKILL.md              # 워크플로우 정의 (Claude Code가 읽음)
  review.js             # 단일 모델 리뷰 스크립트 (OpenAI 호환 API)
  models.example.json   # 모델 설정 예제 템플릿
  models.json           # 실제 모델 설정 (gitignored)
```

## 빠른 시작

### 1. 설치

`custom-review/` 디렉토리를 `~/.claude/skills/`로 복사합니다:

```bash
git clone https://github.com/baiyanmo/claude-code-multi-model-review.git
cp -r claude-code-multi-model-review ~/.claude/skills/custom-review
```

### 2. 모델 설정

Claude Code에서 다음과 같이 말합니다:

> 添加审查模型

각 모델에 대해 다음 정보를 입력하세요:
- 이름 (예: "DeepSeek")
- API Base URL (OpenAI 호환 형식)
- API Key
- 모델 ID (예: `deepseek-v4-pro`)

멀티 모델 리뷰를 최대한 활용하려면 최소 2개 이상의 모델을 설정하는 것이 좋습니다.

### 3. 코드 리뷰

git 저장소에서 다음과 같이 말합니다:

> 审查代码 / review / 帮我看看代码

Skill이 실행되어 사용할 모델을 선택하면, 모든 모델이 병렬로 실행됩니다.

## 지원되는 제공자

OpenAI 호환 API라면 모두 사용 가능합니다:

| 제공자 | Base URL |
|------|----------|
| DeepSeek | `https://api.deepseek.com/v1` |
| Alibaba Bailian (Qwen) | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| Volcengine (Doubao) | `https://ark.cn-beijing.volces.com/api/v3` |
| OpenAI | `https://api.openai.com/v1` |
| SiliconFlow | `https://api.siliconflow.cn/v1` |
| 사용자 정의 프록시 | 임의의 URL |

## CLI 사용법

터미널에서 직접 `review.js`를 실행할 수도 있습니다:

```bash
node review.js --diff /tmp/my_diff.txt --model deepseek --config models.json
node review.js --diff /tmp/my_diff.txt --model doubao --angle "보안 문제에 집중" --config models.json
```

## 보안

- `models.json`에는 API 키가 포함됩니다 — `.gitignore`로 제외됨
- `review.js`는 Node.js 내장 모듈만 사용 (`npm install` 불필요)
- API 호출은 HTTPS를 통해 이루어지며, 타임아웃은 120초

## 라이선스

MIT

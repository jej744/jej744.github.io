# 🚀 My Blog - 기존 블로그 복원 및 n8n AI 챗봇 탑재

이 리포지토리는 깔끔한 **HTML, CSS, Vanilla JavaScript** 기반의 정적 블로그 소스코드입니다.
기존의 소중한 블로그 디자인과 글 목록을 완벽하게 복원하고, 우측 하단에 **n8n AI 어시스턴트 챗봇**을 탑재하여 더욱 세련된 대화형 블로그로 완성되었습니다.

---

## 📂 파일 구조 (File Architecture)

```
c:/github/
├── index.html                  # 메인 페이지 및 실시간 검색, 챗봇 위젯 탑재
├── post.html                   # 마크다운 렌더러 및 프리즘 코드 하이라이터, 챗봇 위젯 탑재
├── posts.json                  # 블로그 포스트 메타데이터 인덱스 (자동 생성)
├── style.css                   # 임시 보관 중인 스타일시트
├── css/
│   ├── style.css               # 블로그 오리지널 스타일시트
│   └── prism.css               # 코드 하이라이트 스타일시트
├── js/
│   ├── theme.js                # 다크/라이트 테마 제어 스크립트
│   ├── app.js                  # 메인 글 목록 렌더링 및 검색 제어 모듈
│   └── post-loader.js          # 포스트 본문 파싱 및 렌더링 스크립트
├── pages/
│   └── example.md              # 블로그 마크다운 포스트 파일들
└── .github/
    ├── scripts/
    │   └── generate-posts.js   # pages/*.md 파일들을 분석해 posts.json을 빌드하는 스크립트
    └── workflows/
        └── deploy.yml          # 푸시 시 자동 빌드 후 GitHub Pages에 배포하는 워크플로우
```

---

## ✨ 블로그 핵심 기능 및 강점

1. **완벽한 정적 블로그**: 빌드 프레임워크나 외부 데이터베이스 없이 순수 마크다운(`.md`) 파일들만 `pages/`에 추가하면 작동합니다.
2. **클라이언트 사이드 렌더링**: `marked.js`가 브라우저에서 포스트 내용을 실시간 렌더링하고, `prism.js`가 깔끔한 코드 문법 강조를 실행합니다.
3. **GitHub Actions 배포 자동화**: `pages/` 폴더에 글을 쓰고 Push만 하면 깃허브 액션이 알아서 `posts.json` 메타데이터 인덱스를 새로 빌드하고 GitHub Pages로 즉시 재배포합니다.
4. **n8n AI 챗봇 비서 탑재**: 우측 하단의 말풍선 버튼을 클릭하여 본인의 n8n 클라우드 기반 AI 챗봇 비서와 실시간으로 이야기할 수 있습니다.

---

## 🛠️ n8n AI 챗봇 워크플로우 연동 가이드

챗봇이 질문에 실제 똑똑한 답변을 연동하도록 세팅하는 순서입니다.

### 1단계: n8n 워크플로우 불러오기
1. 본인의 **n8n Cloud 인스턴스**([https://jej744.app.n8n.cloud](https://jej744.app.n8n.cloud))에 로그인합니다.
2. 우측 상단의 **Add Workflow** 버튼을 눌러 새 워크플로우를 생성합니다.
3. 준비된 챗봇 연동 JSON 텍스트를 통째로 복사(`Ctrl+C`)하여 워크플로우 작업 영역(캔버스)에 붙여넣기(`Ctrl+V`)합니다.

### 2단계: 크레덴셜(자격증명) 및 API 연결
1. **Gemini Chat 노드**를 더블 클릭하여 본인의 **Google Gemini API Key**를 발급받아 연결합니다.
2. **구글 시트(Sheets) 저장 노드**를 더블 클릭하여 본인의 Google 계정을 연결합니다.

### 3단계: 구글 스프레드시트 로그 DB 준비
1. 구글 스프레드시트에서 새 문서를 만든 뒤 첫 번째 탭의 이름을 `chatbot_logs`로 변경합니다.
2. 스프레드시트 URL에서 `https://docs.google.com/spreadsheets/d/` 바로 뒤에 나오는 긴 문자열(**Spreadsheet ID**)을 복사합니다.
3. n8n의 구글 시트 저장 노드 내 `documentId` 항목에 복사한 ID를 입력합니다.
4. 구글 시트의 1행에 아래 헤더들을 정확하게 기입합니다:
   * `timestamp` | `session_id` | `category` | `question` | `answer`

### 4단계: 워크플로우 활성화
1. n8n 워크플로우 화면 우측 상단의 **Active(활성화)** 스위치를 켭니다.
2. 이제 블로그의 챗봇 말풍선을 클릭하고 **"Send us a message"**를 눌러 대화를 시작해 보세요! 실시간으로 작동하는 모습을 바로 보실 수 있습니다.

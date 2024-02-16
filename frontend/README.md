# 🙊 Speechless Front-End

스피치 연습 플랫폼 Speechless의 Front-End 입니다.

## 사용 기술

- Node.js 20.11.0
- React.js 18.2.0
- Vite
- Typescript
- Zustand
- tailwindCSS

## 사용 라이브러리

|이름|버전|설명|
|------|---|---|
|zustand|^4.5.0|상태 관리 라이브러리|
|tailwindcss|^3.4.1|유틸리티 기반 스타일링 적용|
|face-api.js|^0.22.2|표정 분석 기능 구현|
|openvidu-browser|^2.29.1|발표 세션 구현을 위한 OpenVidu 라이브러리|
|axios|^1.6.5|API 통신간 처리 편의성을 위해 사용|
|chart.js|^4.4.1|리포트, 변화 추이 그래프를 그리는 데 사용|
|classnames|^2.5.1|tailwindCSS와 함께 동적 className 바인딩을 편리하게 사용|
|@fullcalendar|^6.1.10|메인페이지 일정 관리용 달력 구현|
|@tinymce/tinymce-react|^4.3.2|글 작성시 텍스트 편집기 제공|
|dompurify|^3.0.8|텍스트 편집기에서 작성한 HTML을 보여줄 때 Sanitize|
|flowbite-react|^0.7.2|UI 컴포넌트 라이브러리|
|react-countdown-circle-timer|^3.2.1|면접 세션 타이머 구현|
<br/>

## 소스 코드 빌드

- NodeJs 설치

```shell
sudo apt install nodejs npm
```


<br/>

### .env 파일 설정

- frontend 프로젝트 폴더로 들어간다.

```shell
cd <프로젝트 폴더 경로>/frontend
```

- frontend 폴더 내 .env 설정 파일로 다음의 내용이 추가 필요

```env
VITE_API_BASE_URL=https://<API 서버>

VITE_GOOGLE_CLIENT_ID= <구글 소셜로그인 서비스 클라이언트 아이디>

VITE_GOOGLE_REDIRECT_URI=https://<API 서버>/auth/google

VITE_KAKAO_CLIENT_ID= <카카오 소셜로그인 서비스 클라이언트 아이디>

VITE_KAKAO_REDIRECT_URI=https://<API 서버>/auth/kakao

VITE_NAVER_CLIENT_ID=<네이버 소셜로그인 서비스 클라이언트 아이디>

VITE_NAVER_REDIRECT_URI=https://<API 서버>/auth/naver

VITE_JWT_EXPIRE_TIME=3600

VITE_USE_AI_API=true

VITE_TINY_API_KEY=<발급받은 TinyMCE API Key>
```

- <소셜로그인 서비스 클라이언트 아이디>는 각 서비스 제공자에게서 발급 받은 값

<br/>

### 빌드

- 빌드는 pnpm을 이용하므로, pnpm을 추가로 설치하여 빌드

```shell
npm i pnpm
pnpm i
pnpm run build
```

<br/>
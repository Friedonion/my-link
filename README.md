<div align="center">

![Main Image](./main_image.jpg)

# 🔗 MY-link
**"모든 링크를 하나로, 당신의 개성을 세상에."**  
[실제 서비스 바로가기](https://friedonionml.vercel.app/)

인스타그램, 유튜브, 블로그까지. 나만의 모든 링크를 한 페이지에 담고 실시간 성과를 확인하세요.

<br />

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&style=flat-square)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&style=flat-square)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_|_Firestore-FFCA28?logo=firebase&style=flat-square)](https://firebase.google.com/)
[![React Query](https://img.shields.io/badge/React_Query-Latest-FF4154?logo=react-query&style=flat-square)](https://tanstack.com/query/latest)

</div>

<br />

## 🌟 주요 기능 (Key Features)

- ⚡ **초고속 설정**: 구글 로그인 한 번이면 나만의 페이지가 즉시 생성됩니다.
- 📊 **실시간 통계**: 어떤 링크가 가장 인기가 많은지 실시간 클릭 수를 분석합니다.
- 🎨 **직관적인 편집**: 관리자 페이지에서 직접 텍스트를 클릭해 수정하는 인라인 에디팅을 지원합니다.
- 🖼️ **동적 OG 이미지**: 링크 공유 시 내 프로필 사진과 정보가 담긴 아름다운 카드가 자동으로 생성됩니다.
- 📱 **완벽한 반응형**: 모바일과 데스크톱 어디서나 최적화된 레이아웃을 제공합니다.
- 🔍 **자동 파비콘**: URL만 입력하세요. 해당 사이트의 아이콘을 자동으로 추출하여 적용합니다.

<br />

## 🚀 시작하기 (Getting Started)

### 환경 변수 설정
`.env.local` 파일을 생성하고 아래 Firebase 설정값을 입력해주세요.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 실행 방법
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드 및 프로덕션 실행
npm run build
npm run start
```

<br />

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**: Next.js (App Router), React 19, Tailwind CSS 4
- **UI Components**: Shadcn UI, Lucide Icons, Recharts
- **State Management**: TanStack Query (React Query)
- **Backend/BaaS**: Firebase (Authentication, Firestore, Storage)
- **Deployment**: Vercel

<br />

## 📁 프로젝트 구조 (Folder Structure)

```text
app/
├── [displayName]/    # 공개 프로필 페이지 (동적 경로)
├── stats/            # 링크 통계 분석 페이지
├── page.js           # 홈페이지 (랜딩 및 관리자 뷰)
├── layout.js         # 공통 레이아웃 및 메타데이터
└── opengraph-image.js # 기본 OG 이미지 생성
components/
├── ui/               # Shadcn UI 공용 컴포넌트
└── Header.jsx        # 공통 헤더 컴포넌트
lib/
└── firebase.js       # Firebase 초기화 및 설정
```

<br />

## 📝 라이선스 (License)

이 프로젝트는 [MIT](./LICENSE) 라이선스를 따릅니다.

---
<div align="center">
  Proudly created by <b>Friedonion</b>
</div>

# 마이링크 (MyLink) - 프로젝트 가이드

이 프로젝트는 여러 링크를 하나의 통합된 페이지로 모아서 공유할 수 있게 해주는 '링크트리' 클론 서비스입니다.

## 1. 프로젝트 개요
- **목적**: 크리에이터와 브랜드가 자신의 다양한 소셜 미디어 및 웹 콘텐츠를 단일 링크로 효율적으로 홍보할 수 있는 플랫폼 제공.
- **핵심 기술**: Next.js (App Router), React 19, Tailwind CSS 4, Shadcn UI, Firebase.
- **주요 문서**: `docs/PRD.md` (제품 요구사항), `docs/USER_SCENARIOS.md` (사용자 시나리오).

## 2. 기술 스택 (Tech Stack)
- **프론트엔드**: Next.js 16 (App Router), React 19
- **스타일링**: Tailwind CSS 4 (PostCSS 활용)
- **UI 컴포넌트**: Shadcn UI (Radix UI 기반)
- **백엔드/BaaS**: Firebase (Authentication, Firestore, Storage)
- **아이콘**: Lucide React, Google Favicon API (자동 파비콘 추출)

## 3. 디렉토리 구조
```text
C:\Users\HJ\Documents\my-link\
├── app/              # Next.js App Router 페이지 및 레이아웃
├── components/       # 재사용 가능한 UI 컴포넌트 (Shadcn UI 포함)
├── docs/             # 프로젝트 기획 및 설계 문서
├── lib/              # 공통 유틸리티 함수 (예: utils.js의 cn 함수)
├── public/           # 이미지, 아이콘 등 정적 자산
└── package.json      # 프로젝트 의존성 및 스크립트 설정
```

## 4. 개발 및 빌드 명령어
- `npm run dev`: 개발 서버 실행 (http://localhost:3000)
- `npm run build`: 프로덕션 빌드 생성
- `npm run start`: 빌드된 프로덕션 서버 실행
- `npm run lint`: ESLint를 사용한 코드 정적 분석

## 5. 개발 컨벤션 및 주의사항
- **스타일링**: Tailwind CSS 4를 기본으로 사용하며, 복잡한 클래스 조합은 `lib/utils.js`의 `cn` 함수를 활용합니다.
- **UI 컴포넌트**: 새로운 UI 조각이 필요한 경우 Shadcn UI를 먼저 검토하십시오.
- **데이터 관리**: 사용자 인증과 데이터 저장은 Firebase를 적극 활용합니다. (상태 관리는 Zustand 사용 예정)
- **반응형 디자인**: 모바일 중심(Mobile-First) 디자인을 지향하며, PC에서도 모바일 뷰포트 크기를 유지하는 레이아웃을 사용합니다.
- **설정 주의**: `jsconfig.json`과 `components.json`에 `src/` 경로가 포함되어 있을 수 있으나, 현재 프로젝트 구조는 루트에 `app/`, `components/` 등이 위치하므로 경로 참조 시 주의가 필요합니다.

## 6. 핵심 기능 구현 가이드 (PRD 기준)
- **인라인 편집**: 관리자 페이지에서 텍스트를 클릭하여 직접 수정하는 UX 구현.
- **자동 파비콘**: 링크 등록 시 Google Favicon API를 사용하여 아이콘 자동 설정.
- **고유 URL**: `mylink.com/[username]` 형태의 공개 프로필 페이지 제공.

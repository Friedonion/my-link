# 마이링크 (MyLink) - 프로젝트 가이드

이 프로젝트는 여러 링크를 하나의 통합된 페이지로 모아서 공유할 수 있게 해주는 '링크트리' 클론 서비스입니다.

## 1. 프로젝트 개요
- **목적**: 크리에이터와 브랜드가 자신의 다양한 소셜 미디어 및 웹 콘텐츠를 단일 링크로 효율적으로 홍보할 수 있는 플랫폼 제공.
- **핵심 기술**: Next.js (App Router), React 19, Tailwind CSS 4, Shadcn UI, Firebase.
- **주요 문서**:
  - `docs/PRD.md`: 제품 요구사항 및 데이터 구조 정의.
  - `docs/WIREFRAME.md`: 화면 설계, 사용자 여정 및 인터랙션 상세.
  - `docs/USER_SCENARIOS.md`: 사용자 시나리오.

## 2. 기술 스택 (Tech Stack)
- **프론트엔드**: Next.js 16 (App Router), React 19
- **스타일링**: Tailwind CSS 4 (PostCSS 활용)
- **UI 컴포넌트**: Shadcn UI (Radix UI 기반)
- **백엔드/BaaS**: Firebase (Authentication, Firestore, Storage)
- **아이콘**: Lucide React, Google Favicon API (자동 파비콘 추출)

## 3. UI/UX 및 디자인 가이드라인 (WIREFRAME 기준)
### 3.1 레이아웃 원칙
- **모바일 중심(Mobile-First)**: 모든 화면은 모바일 기기에 최적화된 중앙 정렬 레이아웃을 기본으로 합니다.
- **반응형 대응**: 데스크탑 접속 시에도 컨테이너 폭을 약 500~600px로 제한하여 카드형 레이아웃을 유지합니다.

### 3.2 주요 화면 및 기능 로직
1. **메인 홈 (/)**: 서비스 소개 및 구글 소셜 로그인 제공.
2. **주소 설정 (/setup)**: 최초 가입 시 중복되지 않는 `username` 설정. (영문 소문자, 숫자, 특수문자 일부 허용 / 실시간 중복 체크 필수)
3. **프로필 관리 및 조회 (/:username)**:
   - **관리자 모드**: 프로필 사진, 이름, 소개글, 링크를 별도의 버튼 없이 직접 클릭하여 수정하는 **인라인 편집(Inline Editing)** 및 **자동 저장(Auto-save)** 기능 구현.
   - **방문자 모드**: 데이터 로딩 중 **스켈레톤(Skeleton) UI** 제공, 존재하지 않는 주소 접근 시 404 페이지 안내.

### 3.3 인터랙션 상세
- **링크 동작**: 모든 외부 링크는 `target="_blank" rel="noopener noreferrer"`로 새 탭에서 열려야 합니다.
- **피드백**: 링크 호버 시 부드러운 애니메이션(떠오르기, 색상 변경) 및 텍스트 초과 시 말줄임표(`...`) 처리를 적용합니다.
- **공유하기**: Web Share API 또는 클립보드 복사 기능을 통해 간편한 주소 공유를 지원합니다.

## 4. 디렉토리 구조
```text
C:\Users\HJ\Documents\my-link\
├── app/              # Next.js App Router 페이지 및 레이아웃
├── components/       # 재사용 가능한 UI 컴포넌트 (Shadcn UI 포함)
├── docs/             # 프로젝트 기획 및 설계 문서
├── lib/              # 공통 유틸리티 함수 (예: utils.js의 cn 함수)
├── public/           # 이미지, 아이콘 등 정적 자산
└── package.json      # 프로젝트 의존성 및 스크립트 설정
```

## 5. 개발 및 빌드 명령어
- `npm run dev`: 개발 서버 실행 (http://localhost:3000)
- `npm run build`: 프로덕션 빌드 생성
- `npm run start`: 빌드된 프로덕션 서버 실행
- `npm run lint`: ESLint를 사용한 코드 정적 분석

## 6. 개발 시 주의사항
- **스타일링**: Tailwind CSS 4를 기본으로 사용하며, 복잡한 클래스 조합은 `cn` 함수를 활용합니다.
- **데이터 관리**: Firestore 보안 규칙을 고려하여 `users/{uid}/links` 서브 컬렉션 구조를 준수합니다.
- **파일 참조 컨벤션**: 이 프로젝트에서 파일을 언급하거나 참조할 때는 파일명 앞에 `@`을 붙인 형태(예: `@app/page.js`, `@docs/PRD.md`)를 권장합니다.
- **설정 주의**: 현재 프로젝트 구조는 루트에 `app/`이 위치하므로, `jsconfig.json` 등에서 `@/` 별칭이 루트를 가리키도록 설정되어 있는지 확인이 필요합니다.

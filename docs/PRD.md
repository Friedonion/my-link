# 마이링크 (MyLink) - 제품 요구사항 정의서 (PRD)

## 1. 프로젝트 개요
- **프로젝트명**: 마이링크 (MyLink)
- **목적**: 여러 개의 링크를 하나의 통합된 페이지로 모아서 공유할 수 있게 해주는 서비스 (링크트리 클론). 소셜 미디어 프로필 등에 단일 링크를 제공하여 팔로워들이 사용자의 다양한 콘텐츠, 웹사이트, 소셜 채널 등에 쉽게 접근할 수 있도록 돕습니다.
- **대상 사용자**:
  - 다수의 소셜 미디어 채널이나 웹사이트를 운영하는 크리에이터, 인플루언서
  - 포트폴리오나 이력서를 하나의 링크로 공유하고 싶은 프리랜서 및 구직자
  - 자사의 다양한 이벤트, 프로모션, 공식 채널을 안내하고자 하는 기업 브랜드 및 소상공인
- **서비스 정책**: 모든 기능은 **무료**로 제공됩니다.

---

## 2. 핵심 기능 목록

### 필수 기능 (Must-have)
1. **회원 가입 및 인증 (Auth)**
   - 파이어베이스(Firebase) 기반의 **구글 소셜 로그인(Google OAuth)**만 지원
   - 가입 완료 시 고유한 사용자 ID(username) 설정 (페이지 URL로 사용: 예: `mylink.com/username`)
2. **프로필 관리**
   - 프로필 이미지 업로드 및 변경
   - 프로필 이름 및 짧은 소개글(Bio) 작성
3. **링크 관리**
   - 새로운 링크 추가 (제목, URL 필드)
   - 등록된 링크 수정 및 삭제
   - 링크 항목 표시 시 대상 웹사이트의 파비콘(Favicon)을 아이콘으로 자동 설정
4. **퍼블릭 프로필 페이지 (Public Page)**
   - 사용자별 고유 URL(`mylink.com/username`)을 통해 외부인 누구나 접근 가능한 페이지 제공
   - 다양한 기기(PC, 태블릿, 모바일)를 아우르는 반응형(Responsive) 기반의 유연한 UI/UX 제공

---

## 3. 기능 상세 설명

### 3.1 회원가입 및 인증
- 사용자는 별도의 이메일/비밀번호 입력 없이 구글 계정을 연동하여 즉시 가입 및 로그인할 수 있습니다.
- 최초 로그인(가입) 시, 전체 서비스 내에서 중복되지 않는 고유한 `username`을 필수로 설정해야 합니다.
- 사용자 인증 상태 및 세션 관리는 Firebase Authentication을 통해 안전하게 처리됩니다.

### 3.2 프로필 관리
- 별도의 관리자 폼 페이지로 이동하지 않고, 화면에 표시된 텍스트(이름, 소개글)를 클릭하여 직접 수정하는 **인라인 편집(Inline Editing)** 방식을 사용합니다.
- 프로필 이미지는 적절한 크기(예: 5MB 이하)로 제한하며, 업로드 시 원형으로 표시되도록 자동 리사이징/크롭 처리를 진행합니다. (Firebase Storage 활용)
- 변경된 내용은 저장 즉시 퍼블릭 페이지에 실시간 반영되어야 합니다.

### 3.3 링크 관리
- 링크 추가 시 '제목(Title)'과 '목적지 주소(URL)' 필드가 활성화됩니다.
- 등록된 링크의 제목이나 URL 역시 화면에서 텍스트를 클릭하여 즉시 수정할 수 있는 **인라인 편집** 기능을 지원합니다.
- 입력된 URL을 바탕으로 대상 웹사이트의 파비콘(Favicon)을 자동으로 가져와 링크 아이템의 아이콘으로 설정합니다.

### 3.4 퍼블릭 페이지 제공
- 서비스 방문자가 접근하는 퍼블릭 페이지는 모바일 기기 크기에 최적화된 중앙 정렬 레이아웃 형태를 기본으로 하는 반응형(Responsive) 웹으로 구현합니다. PC에서 접속 시에도 뷰포트 중앙에 모바일 크기의 컨테이너로 표시됩니다.
- 검색 엔진 노출 및 빠른 로딩 속도를 위해 성능을 최적화합니다.

---

## 4. 기술 스택 (Tech Stack)

### 4.1 프론트엔드 (Frontend)
- **프레임워크**: Next.js (App Router)
- **스타일링 및 UI**: Tailwind CSS, shadcn/ui
- **상태 관리**: Zustand

### 4.2 백엔드 (Backend & BaaS)
- **서비스**: Firebase
  - **Authentication**: 구글 소셜 로그인(Google OAuth) 처리
  - **Firestore**: 사용자 프로필 정보(username, bio 등), 링크 데이터(제목, URL, 파비콘 정보) 저장
  - **Storage**: 사용자 프로필 이미지 업로드 및 호스팅
  - **Hosting**: 웹 사이트 배포 및 호스팅

### 4.3 기타 API 및 도구
- **파비콘(Favicon) 추출**: Google Favicon API(`https://www.google.com/s2/favicons?domain=...`)를 사용하여 등록한 URL의 아이콘 자동 로드
- **버전 관리 및 배포**: Git / GitHub

---

## 5. 데이터베이스 설계 (Firestore 구조)

Firestore의 NoSQL 특성을 활용하여 다음과 같이 컬렉션(Collection)과 문서(Document)를 설계합니다.

### 5.1 `users` 컬렉션
사용자 프로필 및 계정 기본 정보를 저장합니다.
- **Document ID**: `uid` (Firebase Auth에서 제공하는 고유 사용자 ID)
- **Fields**:
  - `username` (String): 서비스 내 고유한 ID (URL 생성용, 예: `mylink.com/username`)
  - `displayName` (String): 프로필에 표시될 이름
  - `bio` (String): 짧은 소개글
  - `photoURL` (String): 프로필 이미지 URL (Firebase Storage 주소)
  - `createdAt` (Timestamp): 계정 생성일
  - `updatedAt` (Timestamp): 프로필 마지막 수정일

### 5.2 `links` 서브 컬렉션 (`users/{uid}/links`)
특정 사용자가 등록한 링크 목록을 관리합니다. 사용자 문서 하위의 서브 컬렉션으로 관리하여 보안 규칙 적용과 조회를 용이하게 합니다.
- **Document ID**: Firestore 자동 생성 ID
- **Fields**:
  - `id` (String): 링크 고유 식별자 (Firestore Document ID)
  - `title` (String): 링크 제목
  - `url` (String): 목적지 URL 주소
  - `faviconUrl` (String): 파비콘 이미지 URL
  - `createdAt` (Timestamp): 링크 생성일 (생성순 정렬 등에 활용)

### 5.3 `usernames` 컬렉션
`username` 중복 가입을 방지하고, 방문자가 퍼블릭 페이지 접속 시 매핑되는 `uid`를 빠르게 찾기 위해 사용합니다.
- **Document ID**: `username` (사용자가 입력한 고유 ID 값)
- **Fields**:
  - `uid` (String): 해당 ID를 소유한 사용자의 UID

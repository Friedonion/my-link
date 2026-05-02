# 마이링크 (MyLink) 화면 와이어프레임

이 문서는 MyLink 메인 페이지의 전체적인 레이아웃과 인라인 편집 모드의 구성을 시각적으로 나타냅니다. 모바일 우선(Mobile-first) 디자인을 기준으로 작성되었습니다.

## 1. 퍼블릭 페이지 및 편집 화면 레이아웃

```mermaid
graph TD
    classDef container fill:#f9f9fc,stroke:#ddd,stroke-width:2px;
    classDef profile fill:#ffffff,stroke:#bbbbbb,stroke-width:1px;
    classDef link fill:#ffffff,stroke:#007BFF,stroke-width:2px;
    classDef action fill:#f0f4ff,stroke:#999999,stroke-width:1px,stroke-dasharray: 4 4;

    subgraph "스마트폰 뷰 (또는 PC 화면 중앙 컨테이너)"
        direction TB
        
        P_Img(( "👤 프로필 사진<br>(클릭 시 이미지 변경)" )):::profile
        P_Name[ "사용자 이름<br>(클릭 시 인라인 텍스트 편집)" ]:::profile
        P_Bio[ "나를 표현하는 짧은 소개글<br>(클릭 시 인라인 텍스트 편집)" ]:::profile
        
        L_1[ "🌐 구글아이콘 | 내 블로그 구경하기<br>........................................ 🗑️" ]:::link
        L_2[ "🌐 인스타아이콘 | 일상 인스타그램<br>........................................ 🗑️" ]:::link
        
        L_Add[ "➕ 새 링크 추가<br>(관리자 본인에게만 노출)" ]:::action
        
        Footer[ "Powered by MyLink" ]
    end
    
    P_Img --> P_Name
    P_Name --> P_Bio
    P_Bio -.-> L_1
    L_1 -.-> L_2
    L_2 -.-> L_Add
    L_Add -.-> Footer
```

## 2. 화면 구성 요소 상세 설명

1. **프로필 이미지 (`P_Img`)**
   - 화면 최상단 중앙에 위치합니다. 
   - 원형 프레임으로 표시되며, 페이지 소유자가 클릭 시 파일 탐색기가 열려 즉시 사진을 변경할 수 있습니다.
2. **이름 및 소개글 (`P_Name`, `P_Bio`)**
   - 프로필 사진 하단에 위치합니다. 
   - 일반 방문자에게는 단순 텍스트로 보이지만, 소유자가 텍스트를 클릭하면 해당 영역이 즉시 입력창(Input/Textarea)으로 변하여 인라인 편집이 가능해집니다.
3. **링크 아이템 (`L_1`, `L_2`)**
   - 가로로 긴 둥근 형태의 버튼 박스로 렌더링됩니다.
   - 왼쪽: 입력된 URL을 기반으로 자동 추출된 **파비콘(Favicon)** 아이콘이 표시됩니다.
   - 중앙: 링크의 제목이 텍스트로 표시되며, 소유자 클릭 시 제목과 URL을 즉시 수정할 수 있습니다.
   - 우측: 소유자에게만 보이는 **휴지통(삭제) 아이콘**이 배치됩니다. 클릭 시 확인 절차 후 링크가 제거됩니다.
4. **새 링크 추가 버튼 (`L_Add`)**
   - 기존 링크 목록 하단에 점선 테두리 등의 형태로 눈에 띄게 위치합니다.
   - 클릭하면 빈 상태의 새 링크 아이템 블록이 화면에 즉시 생성되어 입력할 수 있습니다.

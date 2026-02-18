# 프로젝트명

건설 도면 뷰어 (Construction Drawing Viewer)

## 실행 방법

```bash
npm install
npm run dev
```

## 기술 스택

- React, Tailwind CSS, Context API

## 구현 기능

### 도면 탐색

- 사이드바 형태로 탐색

### 도면 표시

- 드롭다운 형태로 필터링하여 도면 표시
- 줌인/줌아웃/팬 기능
- 비교 모드(리비전과의 비교)
- 다중 오버레이 모드(공종과의 비교를 통한 겹침 여부 확인)

### 컨텍스트 인식

- 헤더를 통해 현재 보고 있는 도면 이름 표시

## 미완성 기능

- 반응형 디자인

## 프로젝트 구조

```
  📦src
   ┣ 📂components
   ┃ ┣ 📂Drawing
   ┃ ┃ ┣ 📂controls
   ┃ ┃ ┃ ┣ 📜DrawingFilters.tsx        # 공종·리비전 필터
   ┃ ┃ ┃ ┣ 📜LayerItem.tsx             # 레이어 단일 항목
   ┃ ┃ ┃ ┗ 📜MultiDisciplineLayerControls.tsx  # 레이어 목록
   ┃ ┃ ┣ 📂panels
   ┃ ┃ ┃ ┣ 📜RevisionMetadataPanel.tsx # 리비전 메타정보
   ┃ ┃ ┃ ┗ 📜ViewModeHeader.tsx        # 뷰모드 상단 헤더
   ┃ ┃ ┣ 📂renderers
   ┃ ┃ ┃ ┣ 📜ImageCanvas.tsx           # 도면 캔버스 컨테이너
   ┃ ┃ ┃ ┗ 📜ImageLayer.tsx            # 이미지 단일 레이어
   ┃ ┃ ┗ 📂views
   ┃ ┃ ┃ ┣ 📜CompareView.tsx           # 리비전 비교 뷰
   ┃ ┃ ┃ ┣ 📜DrawingViewer.tsx         # 도면 표시
   ┃ ┃ ┃ ┗ 📜MultiDisciplineView.tsx   # 다중 공종 비교 뷰
   ┃ ┣ 📂Navigation
   ┃ ┃ ┗ 📜TreeView.tsx                # 도면 트리 목록
   ┃ ┗ 📂ui
   ┃ ┃ ┣ 📜OpacitySlider.tsx           # 투명도 슬라이더
   ┃ ┃ ┗ 📜ZoomControls.tsx            # 줌 버튼 UI
   ┣ 📂context
   ┃ ┗ 📜AppContext.tsx                # Context API
   ┣ 📂hooks
   ┃ ┣ 📜useDrawingData.ts             # 도면 데이터 로딩
   ┃ ┗ 📜usePanAndZoom.ts             # 패닝·줌 인터랙션
   ┣ 📂type
   ┃ ┗ 📜index.ts                      # 타입 정의
   ┣ 📂utils
   ┃ ┣ 📜disciplineColors.ts           # 공종별 색상 맵
   ┃ ┣ 📜layerUtils.ts                 # 레이어 생성 유틸
   ┃ ┣ 📜normalized.ts                 # 데이터 정규화
   ┃ ┣ 📜parser.ts                     # JSON 파싱·fetch
   ┣ 📜App.tsx
   ┣ 📜index.css
   ┗ 📜main.tsx
```

---

## UI 스크린샷

### 1. 초기 화면 — 도면 목록 사이드바

![초기 화면](./screenshots/01_main.png)

- 좌측 사이드바에 도면 목록(트리 구조)이 표시됩니다.
- 우측 메인 영역에는 도면 선택 안내 문구가 표시됩니다.
- 공종/리비전 드롭다운은 도면 미선택 시 비활성화됩니다.

---

### 2. 도면 선택 — 전체 배치도

![전체 배치도 선택](./screenshots/02_drawing_selected.png)

- 사이드바에서 도면을 클릭하면 우측에 도면 이미지가 렌더링됩니다.
- 헤더에 선택된 도면 이름이 컨텍스트로 표시됩니다.
- 줌 컨트롤(−, %, +, 리셋)이 우측 상단에 나타납니다.

---

### 3. 공종 선택 드롭다운 활성화

![공종 드롭다운 활성화](./screenshots/03_drawing_with_disciplines.png)

- 공종 데이터가 있는 도면 선택 시 공종 드롭다운이 활성화됩니다.
- 공종 목록: 구조, 소방, 설비, 조경

---

### 4. 공종 선택 후 리비전 드롭다운 활성화

![공종 선택](./screenshots/04_discipline_selected.png)

- 공종(구조) 선택 시 해당 공종의 리비전 목록이 드롭다운에 나타납니다.
- 최신 리비전은 `(최신)` 레이블로 명확히 구분됩니다.

---

### 5. 리비전 선택 — 도면 표시 및 컨텍스트 인식

![리비전 선택 후 도면 표시](./screenshots/05_revision_selected.png)

- 리비전 선택 후 해당 공종의 도면 이미지가 표시됩니다.
- 헤더에 `공종 배지 + 리비전` 형태로 현재 컨텍스트가 표시됩니다.
- `📋 정보 표시` 버튼으로 리비전 상세 정보 패널을 열 수 있습니다.

---

### 6. 리비전 상세 정보 패널

![리비전 정보 패널](./screenshots/06_revision_info_panel.png)

- 리비전 번호, 발행일, 설명, 변경사항 없음 여부를 테이블 형태로 보여줍니다.
- `metadata.json`의 `changes` 필드를 활용하여 변경 내역을 표시합니다.

---

### 7. 다중 오버레이 모드 진입

![다중 오버레이 모드](./screenshots/07_multi_overlay.png)

- `다중 오버레이` 버튼 클릭 시 레이어 제어 패널이 좌측에 나타납니다.
- 각 공종(구조, 소방, 설비, 조경)을 체크박스로 선택하여 레이어를 추가합니다.

---

### 8. 다중 오버레이 활성화 — 구조 + 소방 레이어

![오버레이 활성화](./screenshots/08_overlay_active.png)

- 여러 공종 도면을 동시에 겹쳐 표시합니다.
- 각 레이어별 투명도 슬라이더로 개별 조절이 가능합니다.
- 레이어 숨기기(👁) 및 제거(🗑) 버튼으로 레이어를 관리합니다.

---

### 9. 사이드바 접힘 — 도면 영역 확장

![사이드바 접힌 상태](./screenshots/09_sidebar_collapsed.png)

- 사이드바 닫기 버튼으로 좌측 트리를 접어 도면 뷰 영역을 최대화합니다.
- 좌측 상단 햄버거 아이콘으로 사이드바를 다시 열 수 있습니다.

---

### 10. 줌인 — 도면 상세 확인

![줌인 상태](./screenshots/10_zoom_in.png)

- `+` 버튼 또는 마우스 휠로 도면을 확대합니다.
- 확대 시 현재 포인터 위치를 중심으로 줌이 적용됩니다.
- 두 공종의 오버레이가 확대된 상태에서도 투명도와 레이어가 유지됩니다.

---

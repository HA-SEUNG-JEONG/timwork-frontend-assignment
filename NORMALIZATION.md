# 데이터 정규화 설계 결정 (ADR)

> **ADR(Architecture Decision Record)**: 이 문서는 `src/utils/normalized.ts`에서 수행하는 데이터 정규화 작업의 필요성과 설계 근거를 기술합니다.

---

## 1. 배경 — 원본 데이터의 구조적 한계

애플리케이션은 `/data/metadata.json`을 단일 진입점으로 모든 도면 데이터를 받아옵니다. 이 JSON의 구조는 아래와 같습니다.

```
Metadata
├── project          { name, unit }
├── disciplines      Discipline[]         ← 전체 공종 목록 (배열)
└── drawings         { [id]: Drawing }    ← flat한 맵 구조
     └── Drawing
          ├── id, name, image, parent
          └── disciplines?               ← optional
               └── { [name]: DrawingDiscipline }
                    ├── image?           ← optional
                    ├── revisions?       ← optional
                    └── regions?         ← optional
```

이 구조에는 세 가지 근본적인 문제가 있습니다.

---

## 2. 문제 1 — 트리 구조가 코드에 없다

### 원본 데이터

`Drawing`들은 **flat한 맵**으로 저장됩니다. 부모-자식 관계는 `parent` 필드(ID 문자열)로만 표현됩니다.

```json
{
  "drawings": {
    "site":       { "parent": null,     "name": "부지 전체" },
    "building-a": { "parent": "site",   "name": "A동" },
    "floor-1":    { "parent": "building-a", "name": "1층" }
  }
}
```

### 정규화 없이 TreeView를 그리면?

`TreeView.tsx`는 도면 목록을 계층형 트리로 렌더링합니다. 정규화 없이 원본 데이터를 그대로 사용하면, **렌더링할 때마다** 아래 연산을 반복해야 합니다.

```typescript
// ❌ 정규화 없이 — 렌더마다 O(n) 탐색 반복
function TreeView({ drawings }) {
  const roots = Object.values(drawings).filter(d => d.parent === null);

  function renderNode(drawing) {
    // 렌더링할 때마다 자식 목록을 탐색해야 함
    const children = Object.values(drawings).filter(d => d.parent === drawing.id);
    return (
      <div>
        {drawing.name}
        {children.map(child => renderNode(child))}
      </div>
    );
  }

  return roots.map(root => renderNode(root));
}
```

### 정규화 후

`normalizeDrawings()`는 앱 시작 시 **단 한 번** 맵을 트리로 변환합니다.

```typescript
// normalized.ts — 앱 초기화 시 1회 실행
for (const drawing of drawings) {
  if (drawing.parent) {
    drawingMap.get(drawing.parent)!.children.push(drawingMap.get(drawing.id)!);
  } else {
    rootDrawings.push(drawingMap.get(drawing.id)!);
  }
}
```

결과로 나온 `NormalizedDrawing`에는 `children: NormalizedDrawing[]` 배열이 포함됩니다. 이 덕분에 실제 `TreeView.tsx`는 트리 탐색 로직 없이 순수하게 렌더링에만 집중합니다.

```tsx
// ✅ TreeView.tsx — 재귀 렌더링만 담당
const TreeViewNode = ({ node }: { node: NormalizedDrawing }) => (
  <div className="ml-4">
    <div onClick={() => setSelectedDrawing(node)}>{node.name}</div>
    {node.children.map(child => (
      <TreeViewNode key={child.id} node={child} />
    ))}
  </div>
);
```

---

## 3. 문제 2 — Optional 필드의 방어 코드 확산

### 원본 타입

`DrawingDiscipline`의 모든 필드는 `optional`입니다.

```typescript
interface DrawingDiscipline {
  image?: string;
  imageTransform?: Transform;
  polygon?: Polygon;
  revisions?: Revision[];  // ← 있을 수도, 없을 수도 있음
  regions?: { ... };
}
```

### 정규화 없이 사용하면?

`revisions`가 `undefined`일 수 있으므로, 이 데이터를 사용하는 **모든 컴포넌트**가 직접 방어 코드를 작성해야 합니다.

```typescript
// ❌ 정규화 없이 — 방어 코드가 컴포넌트 전체에 분산됨
const revisions = selectedDrawing
  ?.disciplines?.[selectedDiscipline.name]
  ?.revisions ?? [];
```

`layerUtils.ts`의 `getLatestRevision()`, `DrawingViewer.tsx`의 `availableRevisions` 계산, `CompareView.tsx`의 리비전 목록 등 **revisions에 접근하는 모든 지점**이 이 처리를 반복해야 합니다.

### 정규화 후

`NormalizedDiscipline`에서 `revisions`는 **항상 배열을 보장**합니다.

```typescript
export interface NormalizedDiscipline extends Discipline {
  revisions: Revision[];  // ← 항상 존재 (빈 배열 포함)
  // ...
}
```

`convertToNormalized()` 안에서 undefined를 한 번만 처리합니다.

```typescript
// normalized.ts — 경계선에서 단 한 번 처리
acc[disciplineName] = {
  name: disciplineName,
  revisions: disciplineData.revisions || [],  // ← 여기서만 처리
  // ...
};
```

이제 `layerUtils.ts`는 방어 코드 없이 바로 사용할 수 있습니다.

```typescript
// ✅ layerUtils.ts — undefined 걱정 없이 사용
const revisions: Revision[] = [...disciplineData.revisions];
```

---

## 4. 문제 3 — Discipline 이름이 값(value)이 아닌 키(key)에 있다

### 원본 구조

원본 데이터에서 공종의 이름은 객체의 **키**입니다.

```json
{
  "disciplines": {
    "건축": { "image": "arch.png", "revisions": [...] },
    "구조": { "image": "str.png",  "revisions": [...] }
  }
}
```

### 문제

`Object.values(drawing.disciplines)`로 순회하면 각 `DrawingDiscipline` 객체 안에 `name`이 없습니다. 컴포넌트가 공종 이름을 표시하려면 `key`를 따로 추적해야 합니다.

```typescript
// ❌ 정규화 없이 — key와 value를 항상 같이 들고 다녀야 함
Object.entries(drawing.disciplines).map(([name, data]) => {
  // name은 entry에서만 알 수 있고, data 안에는 없음
  return <div key={name}>{name}: {data.revisions?.length}</div>;
});
```

`MultiDisciplineLayerControls.tsx`처럼 `discipline.name`을 사용하는 컴포넌트에 `Discipline` 객체를 그대로 prop으로 넘기려면, 이름이 객체 안에 있어야 합니다.

### 정규화 후

`NormalizedDiscipline`은 `name` 필드를 값 안에 포함합니다.

```typescript
export interface NormalizedDiscipline extends Discipline {
  name: string;  // ← 값 안에 포함됨
  revisions: Revision[];
  // ...
}
```

이제 `Object.values()`만으로 완전한 정보를 가진 객체를 순회할 수 있습니다.

```typescript
// ✅ MultiDisciplineLayerControls.tsx — discipline.name 바로 사용 가능
availableDisciplines.map((discipline) => (
  <label key={discipline.name}>
    <span>{discipline.name}</span>
  </label>
));
```

---

## 5. 설계 원칙 — 경계선에서의 단일 변환

이 세 가지 문제의 공통 해결책은 **"불일치를 경계선에서 한 번만 처리한다"** 는 원칙입니다.

```
[외부 API/JSON] → [정규화 레이어] → [React 컴포넌트들]
                        ↑
               이 지점에서만 방어 코드,
               구조 변환, 타입 보정이 발생
```

정규화 레이어(`normalized.ts` + `useDrawingData.ts`) 덕분에 컴포넌트 레이어는 아래를 **가정**할 수 있습니다.

- `NormalizedDrawing.children`은 항상 배열이다
- `NormalizedDiscipline.revisions`는 항상 배열이다
- `NormalizedDiscipline.name`은 항상 존재한다

이 가정이 깨지는 시점은 오직 경계선(정규화 함수) 하나뿐입니다.

---

## 6. 요약 비교표

| 항목 | 정규화 이전 | 정규화 이후 |
|------|------------|------------|
| 트리 구조 계산 | 렌더마다 O(n) 탐색 | 앱 초기화 시 1회 |
| `optional` 처리 | 모든 컴포넌트에서 `?.` 방어 | `normalized.ts` 1곳에서만 |
| Discipline name | key-value 동시 추적 필요 | 객체 내부에 포함 |
| 컴포넌트 책임 | 데이터 변환 + 렌더링 | 렌더링만 |
| 타입 안전성 | `undefined` 가능성 상존 | 보장된 구조 |

---

## 7. 관련 파일

| 파일 | 역할 |
|------|------|
| `src/utils/normalized.ts` | 정규화 함수 구현 |
| `src/hooks/useDrawingData.ts` | 데이터 페치 + 정규화 호출 |
| `src/type/index.ts` | 원본/정규화 타입 정의 |
| `src/context/AppContext.tsx` | 정규화된 데이터를 앱 전역에 제공 |
| `src/components/Navigation/TreeView.tsx` | `children` 배열로 트리 렌더링 |
| `src/utils/layerUtils.ts` | `revisions` 보장 덕에 방어 코드 불필요 |

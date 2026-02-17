interface Project {
  name: string;
  unit: string;
}

export interface Discipline {
  name: string;
}

interface Position {
  vertices: [number, number][]; // 다각형 꼭짓점 좌표 배열 `[[x, y], ...]`. 상위 도면 이미지의 픽셀 좌표
  imageTransform: Transform; // 이 건물 이미지를 상위 도면 위에 정렬하기 위한 변환
}

interface Transform {
  relativeTo?: string; // 기준이 되는 이미지 파일명
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface Polygon {
  vertices: [number, number][];
  polygonTransform: Transform; // 폴리곤 꼭짓점을 화면에 렌더링할 때 적용하는 좌표계 변환
}

export interface Revision {
  version: string;
  image: string;
  date: string;
  description: string;
  changes: string[];
  imageTransform?: Transform;
  polygon?: Polygon;
}

export interface DrawingDiscipline {
  image?: string;
  imageTransform?: Transform;
  polygon?: Polygon;
  regions?: {
    [key: string]: {
      polygon: Polygon;
      revisions: Revision[];
    };
  };
  revisions?: Revision[];
}

export interface Drawing {
  id: string;
  name: string;
  image: string;
  parent: string | null;
  position: Position | null;
  disciplines?: {
    [key: string]: DrawingDiscipline;
  };
  children?: Drawing[];
}

export interface Metadata {
  project: Project;
  disciplines: Discipline[];
  drawings: {
    [key: string]: Drawing;
  };
}

export interface NormalizedDiscipline extends Discipline {
  image?: string;
  imageTransform?: Transform;
  polygon?: Polygon;
  revisions: Revision[];
  regions?: {
    [key: string]: {
      polygon: Polygon;
      revisions: Revision[];
    };
  };
}

export interface NormalizedDrawing {
  id: string;
  name: string;
  parent: string | null;
  position: Position | null;
  image: string;
  disciplines: {
    [key: string]: NormalizedDiscipline;
  };
  children: NormalizedDrawing[];
}

export interface OverlayLayer {
  id: string; // 고유 식별자
  discipline: Discipline; // 공종 정보
  revision: Revision | null; // 선택된 리비전 (MVP에서는 자동으로 최신 리비전)
  opacity: number; // 0.0 ~ 1.0 (기본값: 0.7)
  visible: boolean; // 표시/숨김 (기본값: true)
  zIndex: number; // 레이어 순서
}

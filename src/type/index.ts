export interface Project {
	name: string;
	unit: string;
}

export interface Discipline {
	name: string;
}

export interface Position {
	vertices: [number, number][];
	imageTransform: Transform;
}

export interface Transform {
	relativeTo?: string;
	x: number;
	y: number;
	scale: number;
	rotation: number;
}

export interface Polygon {
	vertices: [number, number][];
	polygonTransform: Transform;
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

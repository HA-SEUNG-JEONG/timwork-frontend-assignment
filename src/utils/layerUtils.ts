import type {
	Discipline,
	Revision,
	OverlayLayer,
	NormalizedDrawing,
	Metadata,
} from "../type";

/**
 * 고유한 레이어 ID 생성
 */
export function generateLayerId(): string {
	return `layer-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 새로운 오버레이 레이어 생성
 * @param discipline 공종
 * @param zIndex 레이어 순서
 * @param latestRevision 자동으로 선택할 최신 리비전 (선택사항)
 */
export function createOverlayLayer(
	discipline: Discipline,
	zIndex: number,
	latestRevision: Revision | null = null,
): OverlayLayer {
	return {
		id: generateLayerId(),
		discipline,
		revision: latestRevision,
		opacity: 0.7,
		visible: true,
		zIndex,
	};
}

/**
 * 레이어 배열에서 다음 zIndex 계산
 */
export function getNextZIndex(layers: OverlayLayer[]): number {
	if (layers.length === 0) return 1;
	const maxZIndex = Math.max(...layers.map((layer) => layer.zIndex));
	return maxZIndex + 1;
}

/**
 * 레이어의 이미지 URL 추출
 */
export function getLayerImageUrl(
	layer: OverlayLayer,
	drawing: NormalizedDrawing,
	metadata: Metadata,
): string | null {
	const disciplineData =
		metadata.drawings[drawing.id]?.disciplines?.[layer.discipline.name];

	if (!disciplineData) return null;

	// 리비전이 선택된 경우
	if (layer.revision?.image) {
		return `/data/drawings/${layer.revision.image}`;
	}

	// 공종 이미지가 있는 경우
	if (disciplineData.image) {
		return `/data/drawings/${disciplineData.image}`;
	}

	// 기본 도면 이미지
	return `/data/drawings/${drawing.image}`;
}

/**
 * 특정 공종의 최신 리비전 가져오기
 */
export function getLatestRevision(
	drawing: NormalizedDrawing,
	discipline: Discipline,
	metadata: Metadata,
): Revision | null {
	const disciplineData =
		metadata.drawings[drawing.id]?.disciplines?.[discipline.name];

	if (!disciplineData) return null;

	const revisions: Revision[] = [...(disciplineData.revisions || [])];

	if (disciplineData.regions) {
		for (const region of Object.values(disciplineData.regions)) {
			revisions.push(...region.revisions);
		}
	}

	// 리비전이 있으면 첫 번째(최신) 리비전 반환
	return revisions.length > 0 ? revisions[0] : null;
}

import type {
	Discipline,
	Revision,
	OverlayLayer,
	NormalizedDrawing,
	Metadata,
} from "@/type";

export function createOverlayLayer(
	discipline: Discipline,
	zIndex: number,
	latestRevision: Revision | null = null,
): OverlayLayer {
	return {
		id: `layer-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
		discipline,
		revision: latestRevision,
		opacity: 0.7,
		visible: true,
		zIndex,
	};
}

export function getNextZIndex(layers: OverlayLayer[]): number {
	if (layers.length === 0) return 1;
	const maxZIndex = Math.max(...layers.map((layer) => layer.zIndex));
	return maxZIndex + 1;
}

export function getLayerImageUrl(
	layer: OverlayLayer,
	drawing: NormalizedDrawing,
	metadata: Metadata,
): string | null {
	const disciplineData =
		metadata.drawings[drawing.id]?.disciplines?.[layer.discipline.name];

	if (!disciplineData) return null;

	const base = `/data/drawings`;

	// 리비전이 선택된 경우
	if (layer.revision?.image) {
		return `${base}/${layer.revision.image}`;
	}

	// 기본 도면 이미지
	return `${base}/${drawing.image}`;
}

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

	return revisions.length > 0 ? revisions[0] : null;
}

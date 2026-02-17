import { useEffect, useMemo, useState } from "react";
import type { Revision } from "@/type";
import { useAppContext } from "@/context/AppContext";
import { ViewModeHeader } from "../panels/ViewModeHeader";
import { ZoomControls } from "@/components/ui/ZoomControls";
import { OpacitySlider } from "@/components/ui/OpacitySlider";
import { usePanAndZoom } from "@/hooks/usePanAndZoom";
import { ImageLayer } from "../renderers/ImageLayer";

interface RevisionSelectProps {
	label: string;
	value: string;
	revisions: Revision[];
	focusColorClass: string;
	onChange: (version: string) => void;
}

const RevisionSelect = ({
	label,
	value,
	revisions,
	focusColorClass,
	onChange,
}: RevisionSelectProps) => (
	<div className="flex items-center gap-2">
		<label className="text-sm font-medium text-gray-700">{label}</label>
		<select
			value={value}
			onChange={(e) => onChange(e.target.value)}
			className={`px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${focusColorClass}`}
		>
			<option value="">선택하세요</option>
			{revisions.map((rev) => (
				<option key={rev.version} value={rev.version}>
					{rev.version}
				</option>
			))}
		</select>
	</div>
);

export const CompareView = () => {
	const { selectedDrawing, selectedDiscipline, metadata } = useAppContext();

	const [selectedVersionA, setSelectedVersionA] = useState<string | null>(null);
	const [selectedVersionB, setSelectedVersionB] = useState<string | null>(null);
	const [overlayOpacity, setOverlayOpacity] = useState(0.5);

	const {
		transform,
		isPanning,
		containerRef,
		handleMouseDown,
		zoomIn,
		zoomOut,
		resetTransform,
	} = usePanAndZoom();

	useEffect(() => {
		resetTransform();
	}, [selectedDrawing, resetTransform]);

	const availableRevisions = useMemo(() => {
		if (!selectedDrawing || !selectedDiscipline || !metadata) return [];

		const selectedDrawingById = metadata.drawings[selectedDrawing.id];
		const selectedDisciplines = selectedDrawingById.disciplines;
		const drawingDisciplineName =
			selectedDisciplines?.[selectedDiscipline.name];

		if (!drawingDisciplineName) return [];

		const revisions: Revision[] = [...(drawingDisciplineName.revisions || [])];

		if (drawingDisciplineName.regions) {
			for (const region of Object.values(drawingDisciplineName.regions)) {
				revisions.push(...region.revisions);
			}
		}

		return revisions;
	}, [selectedDrawing, selectedDiscipline, metadata]);

	// 선택된 버전이 현재 availableRevisions에 없으면 기본값(첫/두 번째 리비전) 사용
	const versionA =
		selectedVersionA &&
		availableRevisions.some((r) => r.version === selectedVersionA)
			? selectedVersionA
			: (availableRevisions[0]?.version ?? null);

	const versionB =
		selectedVersionB &&
		availableRevisions.some((r) => r.version === selectedVersionB)
			? selectedVersionB
			: (availableRevisions[1]?.version ?? null);

	const imageUrlA = useMemo(() => {
		const revision = availableRevisions.find((r) => r.version === versionA);
		return revision?.image ? `/data/drawings/${revision.image}` : null;
	}, [availableRevisions, versionA]);

	const imageUrlB = useMemo(() => {
		const revision = availableRevisions.find((r) => r.version === versionB);
		return revision?.image ? `/data/drawings/${revision.image}` : null;
	}, [availableRevisions, versionB]);

	return (
		<main className="flex-1 flex flex-col p-4 bg-gray-100 h-screen">
			<ViewModeHeader
				availableRevisions={availableRevisions}
				availableDisciplines={[]}
			/>
			<div className="flex gap-4 mb-2">
				<RevisionSelect
					label="리비전 A:"
					value={versionA ?? ""}
					revisions={availableRevisions}
					focusColorClass="focus:ring-blue-500"
					onChange={setSelectedVersionA}
				/>
				<RevisionSelect
					label="리비전 B:"
					value={versionB ?? ""}
					revisions={availableRevisions}
					focusColorClass="focus:ring-green-500"
					onChange={setSelectedVersionB}
				/>
			</div>
			<div className="flex-1 overflow-auto">
				<div
					ref={containerRef}
					onMouseDown={handleMouseDown}
					className={`relative w-full h-full border overflow-hidden ${
						isPanning ? "cursor-grabbing" : "cursor-grab"
					}`}
				>
					{imageUrlA || imageUrlB ? (
						<>
							<div className="relative w-full h-full">
								{imageUrlA && (
									<ImageLayer
										imageUrl={imageUrlA}
										alt="리비전 A"
										transform={transform}
										isPanning={isPanning}
									/>
								)}
								{imageUrlB && (
									<ImageLayer
										imageUrl={imageUrlB}
										alt="리비전 B"
										transform={transform}
										isPanning={isPanning}
										opacity={overlayOpacity}
									/>
								)}
								{imageUrlB && (
									<OpacitySlider
										opacity={overlayOpacity}
										onChange={setOverlayOpacity}
										label="상단 레이어 투명도"
									/>
								)}
							</div>
							<ZoomControls
								scale={transform.scale}
								onZoomIn={zoomIn}
								onZoomOut={zoomOut}
								onReset={resetTransform}
							/>
						</>
					) : (
						<div className="flex items-center justify-center h-full">
							<p className="text-gray-500">비교할 리비전을 선택하세요.</p>
						</div>
					)}
				</div>
			</div>
		</main>
	);
};

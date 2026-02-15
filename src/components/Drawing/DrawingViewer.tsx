import { useEffect, useState } from "react";
import { DrawingFilters } from "./DrawingFilters";
import { DrawingContextHeader } from "./DrawingContextHeader";
import { RevisionMetadataPanel } from "./RevisionMetadataPanel";
import { MultiDisciplineLayerControls } from "./MultiDisciplineLayerControls";

import { useAppContext } from "../../context/AppContext";
import type { Discipline, DrawingDiscipline, Revision } from "../../type";
import { ImageCanvas } from "./ImageCanvas";
import {
	createOverlayLayer,
	getNextZIndex,
	getLatestRevision,
} from "../../utils/layerUtils";

export const DrawingViewer = () => {
	const {
		metadata,
		selectedDrawing,
		selectedDiscipline,
		setSelectedDiscipline,
		selectedRevision,
		setSelectedRevision,
		isMultiDisciplineMode,
		setIsMultiDisciplineMode,
		overlayLayers,
		setOverlayLayers,
	} = useAppContext();

	const [isCompareMode, setIsCompareMode] = useState(false);
	const [revisionA, setRevisionA] = useState<Revision | null>(null);
	const [revisionB, setRevisionB] = useState<Revision | null>(null);

	const handleDisciplineChange = (discipline: Discipline | null) => {
		setSelectedDiscipline(discipline);
		setSelectedRevision(null);

		setIsCompareMode(false);
		setRevisionA(null);
		setRevisionB(null);
	};

	const handleRevisionChange = (revision: Revision | null) => {
		setSelectedRevision(revision);
	};

	const handleToggleCompareMode = () => {
		const newCompareMode = !isCompareMode;
		setIsCompareMode(newCompareMode);

		if (newCompareMode) {
			if (availableRevisions.length >= 2) {
				setRevisionA(availableRevisions[0]);
				setRevisionB(availableRevisions[1]);
			}

			setIsMultiDisciplineMode(false);
			setOverlayLayers([]);
		} else {
			setRevisionA(null);
			setRevisionB(null);
		}
	};

	const handleToggleMultiDisciplineMode = () => {
		const newMode = !isMultiDisciplineMode;
		setIsMultiDisciplineMode(newMode);

		if (newMode) {
			setIsCompareMode(false);
			setRevisionA(null);
			setRevisionB(null);
		} else {
			setOverlayLayers([]);
		}
	};

	const handleAddLayer = (discipline: Discipline) => {
		if (!selectedDrawing || !metadata) return;

		const latestRevision = getLatestRevision(
			selectedDrawing,
			discipline,
			metadata,
		);
		const newLayer = createOverlayLayer(
			discipline,
			getNextZIndex(overlayLayers),
			latestRevision,
		);
		setOverlayLayers([...overlayLayers, newLayer]);
	};

	const handleRemoveLayer = (layerId: string) => {
		setOverlayLayers(overlayLayers.filter((layer) => layer.id !== layerId));
	};

	const handleOpacityChange = (layerId: string, opacity: number) => {
		setOverlayLayers(
			overlayLayers.map((layer) =>
				layer.id === layerId ? { ...layer, opacity } : layer,
			),
		);
	};

	const handleVisibilityToggle = (layerId: string) => {
		setOverlayLayers(
			overlayLayers.map((layer) =>
				layer.id === layerId ? { ...layer, visible: !layer.visible } : layer,
			),
		);
	};

	const disciplineMap = !metadata
		? new Map<string, Discipline>()
		: new Map(metadata.disciplines.map((d) => [d.name, d]));

	const availableDisciplines = (() => {
		if (!selectedDrawing || !metadata) return [];
		const drawingData = metadata.drawings[selectedDrawing.id];
		if (!drawingData?.disciplines) return [];
		return Object.keys(drawingData.disciplines)
			.map((name) => disciplineMap.get(name))
			.filter((d): d is Discipline => d !== undefined);
	})();

	useEffect(() => {
		if (!selectedDiscipline) return;

		const isDisciplineAvailable = availableDisciplines.some(
			(availableDiscipline) =>
				availableDiscipline.name === selectedDiscipline.name,
		);

		if (!isDisciplineAvailable) {
			setSelectedDiscipline(null);
			setSelectedRevision(null);
		}
	}, [
		selectedDrawing,
		availableDisciplines,
		selectedDiscipline,
		setSelectedDiscipline,
		setSelectedRevision,
	]);

	const availableRevisions = (() => {
		if (!selectedDrawing || !selectedDiscipline || !metadata) return [];
		const drawingDiscipline =
			metadata.drawings[selectedDrawing.id]?.disciplines?.[
				selectedDiscipline.name
			];
		if (!drawingDiscipline) return [];

		const revisions: Revision[] = [...(drawingDiscipline.revisions || [])];

		if (drawingDiscipline.regions) {
			for (const region of Object.values(drawingDiscipline.regions)) {
				revisions.push(...region.revisions);
			}
		}

		return revisions;
	})();

	const imageUrl = (() => {
		if (!selectedDrawing) return null;

		let image = selectedDrawing.image;
		if (selectedDiscipline) {
			const disciplineData: DrawingDiscipline | undefined =
				metadata?.drawings[selectedDrawing.id]?.disciplines?.[
					selectedDiscipline.name
				];
			if (disciplineData?.image) {
				image = disciplineData.image;
			}
		}
		if (selectedRevision?.image) {
			image = selectedRevision.image;
		}

		return image ? `/data/drawings/${image}` : null;
	})();

	const imageUrlA = revisionA?.image
		? `/data/drawings/${revisionA.image}`
		: null;
	const imageUrlB = revisionB?.image
		? `/data/drawings/${revisionB.image}`
		: null;

	return (
		<main className="flex-1 flex flex-col p-4 bg-gray-100 h-screen">
			<DrawingContextHeader
				drawingName={selectedDrawing?.name || "도면을 선택하세요"}
				disciplineName={
					isMultiDisciplineMode ? undefined : selectedDiscipline?.name
				}
				revisionVersion={isCompareMode ? undefined : selectedRevision?.version}
			/>
			{/* 모드 토글 버튼 */}
			<div className="mb-2 flex gap-2">
				{selectedDiscipline && availableRevisions.length >= 2 && (
					<button
						onClick={handleToggleCompareMode}
						className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
							isCompareMode
								? "bg-indigo-600 text-white hover:bg-indigo-700"
								: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
						}`}
					>
						{isCompareMode ? "📊 비교 모드" : "비교 모드"}
					</button>
				)}
				{availableDisciplines.length >= 2 && (
					<button
						onClick={handleToggleMultiDisciplineMode}
						className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
							isMultiDisciplineMode
								? "bg-purple-600 text-white hover:bg-purple-700"
								: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
						}`}
					>
						{isMultiDisciplineMode ? "🎨 다중 오버레이 모드" : "다중 오버레이"}
					</button>
				)}
			</div>
			{isMultiDisciplineMode ? (
				// 다중 오버레이 모드: 패널과 Canvas를 가로 배치
				<div className="flex-1 flex gap-3 overflow-hidden">
					<MultiDisciplineLayerControls
						availableDisciplines={availableDisciplines}
						overlayLayers={overlayLayers}
						onAddLayer={handleAddLayer}
						onRemoveLayer={handleRemoveLayer}
						onOpacityChange={handleOpacityChange}
						onVisibilityToggle={handleVisibilityToggle}
					/>
					<div className="flex-1 overflow-auto">
						<ImageCanvas
							imageUrl={imageUrl}
							selectedDrawing={selectedDrawing}
							isCompareMode={false}
							imageUrlA={null}
							imageUrlB={null}
							isMultiDisciplineMode={true}
							overlayLayers={overlayLayers}
							metadata={metadata}
						/>
					</div>
				</div>
			) : (
				// 단일/비교 모드: 기존 구조 유지
				<>
					{!isCompareMode ? (
						<div className="flex items-start gap-3 mb-2">
							<DrawingFilters
								availableDisciplines={availableDisciplines}
								availableRevisions={availableRevisions}
								onDisciplineChange={handleDisciplineChange}
								onRevisionChange={handleRevisionChange}
							/>

							{selectedRevision && (
								<RevisionMetadataPanel revision={selectedRevision} />
							)}
						</div>
					) : (
						<div className="flex gap-4 mb-2">
							{/* 리비전 A 선택 */}
							<div className="flex items-center gap-2">
								<label className="text-sm font-medium text-gray-700">
									리비전 A:
								</label>
								<select
									value={revisionA?.version || ""}
									onChange={(e) => {
										const selected = availableRevisions.find(
											(r) => r.version === e.target.value,
										);
										setRevisionA(selected || null);
									}}
									className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<option value="">선택하세요</option>
									{availableRevisions.map((rev) => (
										<option key={rev.version} value={rev.version}>
											{rev.version}
										</option>
									))}
								</select>
							</div>
							<div className="flex items-center gap-2">
								<label className="text-sm font-medium text-gray-700">
									리비전 B:
								</label>
								<select
									value={revisionB?.version || ""}
									onChange={(e) => {
										const selected = availableRevisions.find(
											(r) => r.version === e.target.value,
										);
										setRevisionB(selected || null);
									}}
									className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
								>
									<option value="">선택하세요</option>
									{availableRevisions.map((rev) => (
										<option key={rev.version} value={rev.version}>
											{rev.version}
										</option>
									))}
								</select>
							</div>
						</div>
					)}
					<div className="flex-1 overflow-auto">
						<ImageCanvas
							imageUrl={imageUrl}
							selectedDrawing={selectedDrawing}
							isCompareMode={isCompareMode}
							imageUrlA={imageUrlA}
							imageUrlB={imageUrlB}
							isMultiDisciplineMode={false}
							overlayLayers={overlayLayers}
							metadata={metadata}
						/>
					</div>
				</>
			)}
		</main>
	);
};

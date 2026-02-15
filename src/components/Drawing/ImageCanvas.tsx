import { useEffect } from "react";
import { ZoomControls } from "../ZoomControls";
import { usePanAndZoom } from "../../hooks/usePanAndZoom";
import type { NormalizedDrawing } from "../../type";

interface ImageCanvasProps {
	imageUrl?: string | null;
	selectedDrawing: NormalizedDrawing | null;
	isCompareMode?: boolean;
	imageUrlA?: string | null;
	imageUrlB?: string | null;
}

const EmptyState = (
	<div className="flex items-center justify-center h-full">
		<p className="text-gray-500">좌측 트리에서 도면을 선택하세요.</p>
	</div>
);

export const ImageCanvas = ({
	imageUrl,
	selectedDrawing,
	isCompareMode = false,
	imageUrlA,
	imageUrlB,
}: ImageCanvasProps) => {
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

	if (isCompareMode) {
		const hasImages = imageUrlA || imageUrlB;

		const bottomLayerUrl = imageUrlA;
		const topLayerUrl = imageUrlB;
		const bottomLabel = "A";
		const topLabel = "B";

		return (
			<div className="relative w-full h-full border overflow-hidden">
				{hasImages ? (
					<>
						<div
							ref={containerRef}
							onMouseDown={handleMouseDown}
							className={`relative w-full h-full overflow-hidden ${
								isPanning ? "grabbing" : "grab"
							}`}
						>
							{bottomLayerUrl && (
								<div
									className={`absolute top-0 left-0 w-full h-full origin-top-left ${
										isPanning ? "will-change-transform" : ""
									}`}
									style={{
										transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
									}}
								>
									<img
										src={bottomLayerUrl}
										alt={`리비전 ${bottomLabel}`}
										draggable={false}
										className="absolute top-0 left-0 w-full h-full object-contain"
									/>
								</div>
							)}
							{topLayerUrl && (
								<div
									className={`absolute top-0 left-0 w-full h-full origin-top-left opacity-50 ${
										isPanning ? "will-change-transform" : ""
									}`}
									style={{
										transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
									}}
								>
									<img
										src={topLayerUrl}
										alt={`리비전 ${topLabel}`}
										draggable={false}
										className="absolute top-0 left-0 w-full h-full object-contain"
									/>
								</div>
							)}

							{/* 레이어 라벨 */}
							<div className="absolute top-4 left-4 flex gap-2 z-10">
								{bottomLayerUrl && (
									<div className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded shadow-md">
										{bottomLabel} (하단)
									</div>
								)}
								{topLayerUrl && (
									<div className="px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded shadow-md">
										{topLabel} (상단)
									</div>
								)}
							</div>
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
		);
	}

	// 일반 모드 렌더링
	return (
		<div
			ref={containerRef}
			onMouseDown={handleMouseDown}
			className={`relative w-full h-full border overflow-hidden ${
				isPanning ? "cursor-grabbing" : "cursor-grab"
			}`}
		>
			{imageUrl ? (
				<>
					<div
						className={`relative w-full h-full origin-top-left ${
							isPanning ? "will-change-transform" : ""
						}`}
						style={{
							transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
						}}
					>
						<img
							src={imageUrl}
							alt={selectedDrawing?.name}
							draggable={false}
							className="absolute top-0 left-0 w-full h-full object-contain"
						/>
					</div>
					<ZoomControls
						scale={transform.scale}
						onZoomIn={zoomIn}
						onZoomOut={zoomOut}
						onReset={resetTransform}
					/>
				</>
			) : (
				EmptyState
			)}
		</div>
	);
};

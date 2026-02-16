import { useEffect, useState } from "react";
import { ZoomControls } from "../ZoomControls";
import { OpacitySlider } from "../OpacitySlider";
import { usePanAndZoom } from "../../hooks/usePanAndZoom";
import type { NormalizedDrawing, OverlayLayer, Metadata } from "../../type";
import { getLayerImageUrl } from "../../utils/layerUtils";

interface ImageCanvasProps {
	imageUrl?: string | null;
	selectedDrawing: NormalizedDrawing | null;
	isCompareMode?: boolean;
	imageUrlA?: string | null;
	imageUrlB?: string | null;
	isMultiDisciplineMode?: boolean;
	overlayLayers?: OverlayLayer[];
	metadata?: Metadata | null;
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
	isMultiDisciplineMode = false,
	overlayLayers = [],
	metadata = null,
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

	const [overlayOpacity, setOverlayOpacity] = useState(0.5);

	useEffect(() => {
		resetTransform();
	}, [selectedDrawing, resetTransform]);

	if (isMultiDisciplineMode) {
		const selectedVisibleOverlayLayers = overlayLayers.filter(
			(layer) => layer.visible,
		);
		const visibleLayers = selectedVisibleOverlayLayers.sort(
			(a, b) => a.zIndex - b.zIndex,
		);

		const hasLayers = visibleLayers.length > 0;

		return (
			<div
				ref={containerRef}
				onMouseDown={handleMouseDown}
				className={`relative w-full h-full border overflow-hidden ${
					isPanning ? "cursor-grabbing" : "cursor-grab"
				}`}
			>
				{hasLayers && selectedDrawing && metadata ? (
					<>
						<div className="relative w-full h-full">
							{visibleLayers.map((layer) => {
								const imageUrl = getLayerImageUrl(
									layer,
									selectedDrawing,
									metadata,
								);

								return (
									<div
										key={layer.id}
										className={`absolute top-0 left-0 w-full h-full origin-top-left ${
											isPanning ? "will-change-transform" : ""
										}`}
										style={{
											transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
											opacity: layer.opacity,
											zIndex: layer.zIndex,
										}}
									>
										{imageUrl && (
											<img
												src={imageUrl}
												alt={layer.discipline.name}
												draggable={false}
												className="absolute top-0 left-0 w-full h-full object-contain"
											/>
										)}
									</div>
								);
							})}
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
						<p className="text-gray-500">
							좌측 패널에서 공종을 선택하여 레이어를 추가하세요.
						</p>
					</div>
				)}
			</div>
		);
	}

	if (isCompareMode) {
		const hasImages = imageUrlA || imageUrlB;

		const bottomLayerUrl = imageUrlA;
		const topLayerUrl = imageUrlB;
		const bottomLabel = "A";
		const topLabel = "B";

		return (
			<div
				ref={containerRef}
				onMouseDown={handleMouseDown}
				className={`relative w-full h-full border overflow-hidden ${
					isPanning ? "cursor-grabbing" : "cursor-grab"
				}`}
			>
				{hasImages ? (
					<>
						<div className="relative w-full h-full">
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
									className={`absolute top-0 left-0 w-full h-full origin-top-left ${
										isPanning ? "will-change-transform" : ""
									}`}
									style={{
										transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
										opacity: overlayOpacity,
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

							{topLayerUrl && (
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

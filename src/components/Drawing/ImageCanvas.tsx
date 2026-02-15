import { useEffect, useState } from "react";
import { ZoomControls } from "../ZoomControls";
import { OverlayControls } from "./OverlayControls";
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

	const [overlayOpacity, setOverlayOpacity] = useState<number>(0.5);
	const [isLayerSwapped, setIsLayerSwapped] = useState<boolean>(false);

	const handleSwapLayers = () => {
		setIsLayerSwapped(!isLayerSwapped);
	};

	useEffect(() => {
		resetTransform();
	}, [selectedDrawing, resetTransform]);

	if (isCompareMode) {
		const hasImages = imageUrlA || imageUrlB;

		const bottomLayerUrl = isLayerSwapped ? imageUrlB : imageUrlA;
		const topLayerUrl = isLayerSwapped ? imageUrlA : imageUrlB;
		const bottomLabel = isLayerSwapped ? "B" : "A";
		const topLabel = isLayerSwapped ? "A" : "B";

		return (
			<div className="relative w-full h-full border overflow-hidden">
				{hasImages ? (
					<>
						{/* 오버레이 컨테이너 */}
						<div
							ref={containerRef}
							onMouseDown={handleMouseDown}
							className="relative w-full h-full overflow-hidden"
							style={{ cursor: isPanning ? "grabbing" : "grab" }}
						>
							{/* 하단 레이어 (리비전 A 또는 B) */}
							{bottomLayerUrl && (
								<div
									style={{
										transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
										transformOrigin: "0 0",
										width: "100%",
										height: "100%",
										willChange: "transform",
										position: "absolute",
										top: 0,
										left: 0,
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

							{/* 상단 레이어 (투명도 조절 가능) */}
							{topLayerUrl && (
								<div
									style={{
										transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
										transformOrigin: "0 0",
										width: "100%",
										height: "100%",
										willChange: "transform",
										position: "absolute",
										top: 0,
										left: 0,
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

							{/* 레이어 라벨 */}
							<div className="absolute top-4 left-4 flex gap-2 z-10">
								{bottomLayerUrl && (
									<div
										className={`px-3 py-1 ${
											isLayerSwapped ? "bg-green-600" : "bg-blue-600"
										} text-white text-sm font-semibold rounded shadow-md`}
									>
										{bottomLabel} (하단)
									</div>
								)}
								{topLayerUrl && (
									<div
										className={`px-3 py-1 ${
											isLayerSwapped ? "bg-blue-600" : "bg-green-600"
										} text-white text-sm font-semibold rounded shadow-md`}
									>
										{topLabel} (상단)
									</div>
								)}
							</div>
						</div>

						{/* 오버레이 컨트롤 (투명도 슬라이더) */}
						<OverlayControls
							opacity={overlayOpacity}
							onOpacityChange={setOverlayOpacity}
							onSwapLayers={handleSwapLayers}
						/>

						{/* 줌 컨트롤 */}
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
			className="relative w-full h-full border overflow-hidden"
			style={{ cursor: isPanning ? "grabbing" : "grab" }}
		>
			{imageUrl ? (
				<>
					<div
						style={{
							transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
							transformOrigin: "0 0",
							width: "100%",
							height: "100%",
							willChange: "transform",
							position: "relative",
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

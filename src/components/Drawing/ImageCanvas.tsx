import { useEffect } from "react";
import { ZoomControls } from "../ZoomControls";
import { usePanAndZoom } from "../../hooks/usePanAndZoom";
import type { NormalizedDrawing } from "../../type";

interface ImageCanvasProps {
	imageUrl: string | null;
	selectedDrawing: NormalizedDrawing | null;
}

const EmptyState = (
	<div className="flex items-center justify-center h-full">
		<p className="text-gray-500">좌측 트리에서 도면을 선택하세요.</p>
	</div>
);

export const ImageCanvas = ({
	imageUrl,
	selectedDrawing,
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

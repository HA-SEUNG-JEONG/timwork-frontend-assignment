import { useEffect } from "react";
import { ZoomControls } from "../ZoomControls";
import { usePanAndZoom } from "../../hooks/usePanAndZoom";
import { useAppContext } from "../../context/AppContext";

interface ImageCanvasProps {
	imageUrl?: string | null;
}

const EmptyState = (
	<div className="flex items-center justify-center h-full">
		<p className="text-gray-500">좌측 트리에서 도면을 선택하세요.</p>
	</div>
);

export const ImageCanvas = ({ imageUrl }: ImageCanvasProps) => {
	const { selectedDrawing } = useAppContext();

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

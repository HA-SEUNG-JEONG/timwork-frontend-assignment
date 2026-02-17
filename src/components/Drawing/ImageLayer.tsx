interface ImageLayerProps {
	imageUrl: string;
	alt: string;
	transform: { x: number; y: number; scale: number };
	isPanning: boolean;
	opacity?: number;
}

export const ImageLayer = ({
	imageUrl,
	alt,
	transform,
	isPanning,
	opacity,
}: ImageLayerProps) => (
	<div
		className={`absolute top-0 left-0 w-full h-full origin-top-left ${
			isPanning ? "will-change-transform" : ""
		}`}
		style={{
			transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
			opacity,
		}}
	>
		<img
			src={imageUrl}
			alt={alt}
			draggable={false}
			className="absolute top-0 left-0 w-full h-full object-contain"
		/>
	</div>
);

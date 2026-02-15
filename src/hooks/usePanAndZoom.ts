import { useCallback, useEffect, useRef, useState } from "react";

interface Transform {
	x: number;
	y: number;
	scale: number;
}

const MIN_SCALE = 0.1;
const MAX_SCALE = 10;
const ZOOM_RATIO = 1.25;
const WHEEL_SENSITIVITY = 0.001;

export function usePanAndZoom() {
	const [transform, setTransform] = useState<Transform>({
		x: 0,
		y: 0,
		scale: 1,
	});
	const [isPanning, setIsPanning] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const transformRef = useRef(transform);
	const panStartRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

	useEffect(() => {
		transformRef.current = transform;
	}, [transform]);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const onWheel = (e: WheelEvent) => {
			e.preventDefault();

			const rect = container.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			const { x, y, scale } = transformRef.current;
			const normalizedDelta = Math.max(-100, Math.min(100, e.deltaY));
			const zoomDelta = -normalizedDelta * WHEEL_SENSITIVITY;
			const newScale = Math.min(
				MAX_SCALE,
				Math.max(MIN_SCALE, scale * (1 + zoomDelta)),
			);

			const pointX = (mouseX - x) / scale;
			const pointY = (mouseY - y) / scale;
			const newX = mouseX - pointX * newScale;
			const newY = mouseY - pointY * newScale;

			setTransform({ x: newX, y: newY, scale: newScale });
		};

		container.addEventListener("wheel", onWheel, { passive: false });
		return () => container.removeEventListener("wheel", onWheel);
	}, []);

	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		if (e.button !== 0) return;
		setIsPanning(true);
		panStartRef.current = {
			x: e.clientX,
			y: e.clientY,
			tx: transformRef.current.x,
			ty: transformRef.current.y,
		};

		const onMouseMove = (event: MouseEvent) => {
			const dx = event.clientX - panStartRef.current.x;
			const dy = event.clientY - panStartRef.current.y;
			setTransform((prev) => ({
				...prev,
				x: panStartRef.current.tx + dx,
				y: panStartRef.current.ty + dy,
			}));
		};

		const onMouseUp = () => {
			setIsPanning(false);
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", onMouseUp);
		};

		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("mouseup", onMouseUp);
	}, []);

	const zoomBy = useCallback((direction: 1 | -1) => {
		const container = containerRef.current;
		if (!container) return;
		const rect = container.getBoundingClientRect();
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		setTransform((prev) => {
			const newScale =
				direction === 1
					? Math.min(MAX_SCALE, prev.scale * ZOOM_RATIO)
					: Math.max(MIN_SCALE, prev.scale / ZOOM_RATIO);

			const pointX = (centerX - prev.x) / prev.scale;
			const pointY = (centerY - prev.y) / prev.scale;

			return {
				x: centerX - pointX * newScale,
				y: centerY - pointY * newScale,
				scale: newScale,
			};
		});
	}, []);

	const zoomIn = useCallback(() => zoomBy(1), [zoomBy]);
	const zoomOut = useCallback(() => zoomBy(-1), [zoomBy]);

	const resetTransform = useCallback(() => {
		setTransform({ x: 0, y: 0, scale: 1 });
	}, []);

	return {
		transform,
		isPanning,
		containerRef,
		handleMouseDown,
		zoomIn,
		zoomOut,
		resetTransform,
	};
}

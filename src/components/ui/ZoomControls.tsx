import React from "react";

interface ZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export const ZoomControls = React.memo(
  ({ scale, onZoomIn, onZoomOut, onReset }: ZoomControlsProps) => {
    const stop = (e: React.MouseEvent) => e.stopPropagation();

    return (
      <div
        className="absolute top-4 right-4 flex items-center gap-1 z-50 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 px-2 py-1 select-none"
        onMouseDown={stop}
      >
        <button
          type="button"
          onClick={onZoomOut}
          className="px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
        >
          −
        </button>
        <span className="px-2 py-1 text-sm font-mono text-gray-600 min-w-16 text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          onClick={onZoomIn}
          className="px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
        >
          +
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={onReset}
          className="px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
        >
          리셋
        </button>
      </div>
    );
  },
);

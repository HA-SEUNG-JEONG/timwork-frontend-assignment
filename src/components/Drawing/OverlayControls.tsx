import React from "react";

interface OverlayControlsProps {
    opacity: number;
    onOpacityChange: (opacity: number) => void;
    onSwapLayers: () => void;
}

export const OverlayControls = React.memo(
    ({ opacity, onOpacityChange, onSwapLayers }: OverlayControlsProps) => {
        const stop = (e: React.MouseEvent) => e.stopPropagation();

        return (
            <div
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 px-4 py-3 select-none z-20"
                onMouseDown={stop}
            >
                {/* 투명도 라벨 */}
                <span className="text-sm font-medium text-gray-700">
                    투명도
                </span>

                {/* A 라벨 */}
                <span className="text-xs font-semibold text-blue-600">A</span>

                {/* 슬라이더 */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={opacity * 100}
                    onChange={(e) =>
                        onOpacityChange(Number(e.target.value) / 100)
                    }
                    className="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />

                {/* B 라벨 */}
                <span className="text-xs font-semibold text-green-600">B</span>

                {/* 현재 투명도 표시 */}
                <span className="text-sm font-mono text-gray-600 min-w-[3rem] text-center">
                    {Math.round(opacity * 100)}%
                </span>

                {/* 구분선 */}
                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* 레이어 순서 변경 버튼 */}
                <button
                    type="button"
                    onClick={onSwapLayers}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
                    title="레이어 순서 변경"
                >
                    ⇅ 순서
                </button>
            </div>
        );
    }
);

OverlayControls.displayName = "OverlayControls";

import React from "react";
import type { OverlayLayer } from "../../type";
import { getDisciplineColor } from "../../utils/disciplineColors";

interface LayerItemProps {
	layer: OverlayLayer;
	onOpacityChange: (layerId: string, opacity: number) => void;
	onVisibilityToggle: (layerId: string) => void;
	onRemove: (layerId: string) => void;
}

export const LayerItem = React.memo(
	({
		layer,
		onOpacityChange,
		onVisibilityToggle,
		onRemove,
	}: LayerItemProps) => {
		const colors = getDisciplineColor(layer.discipline.name);
		const percentage = Math.round(layer.opacity * 100);

		const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const value = Number.parseFloat(e.target.value);
			onOpacityChange(layer.id, value);
		};

		return (
			<div className="flex flex-col gap-2 p-3 bg-white border border-gray-200 rounded-md">
				{/* 헤더: 공종명 + 컨트롤 버튼 */}
				<div className="flex items-center justify-between">
					<div
						className={`px-2 py-1 rounded text-xs font-medium ${colors.bg} ${colors.text} ${colors.border} border`}
					>
						{layer.discipline.name}
					</div>
					<div className="flex items-center gap-1">
						<button
							type="button"
							onClick={() => onVisibilityToggle(layer.id)}
							className={`p-1 rounded hover:bg-gray-100 transition-colors ${
								layer.visible ? "text-gray-700" : "text-gray-400"
							}`}
							title={layer.visible ? "숨기기" : "표시하기"}
						>
							{layer.visible ? "👁" : "👁‍🗨"}
						</button>
						{/* 삭제 버튼 */}
						<button
							type="button"
							onClick={() => onRemove(layer.id)}
							className="p-1 rounded hover:bg-red-50 text-red-600 transition-colors"
							title="레이어 제거"
						>
							🗑
						</button>
					</div>
				</div>

				{/* 투명도 슬라이더 */}
				<div className="flex flex-col gap-1">
					<div className="flex items-center justify-between">
						<span className="text-xs text-gray-600">투명도</span>
						<span className="text-xs font-mono text-gray-500">
							{percentage}%
						</span>
					</div>
					<input
						type="range"
						min="0"
						max="1"
						step="0.01"
						value={layer.opacity}
						onChange={handleOpacityChange}
						className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
					/>
				</div>
			</div>
		);
	},
);

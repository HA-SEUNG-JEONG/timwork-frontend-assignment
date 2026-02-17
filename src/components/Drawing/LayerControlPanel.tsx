import type { OverlayLayer } from "../../type";
import { LayerItem } from "./LayerItem";

interface LayerControlPanelProps {
	layers: OverlayLayer[];
	onOpacityChange: (layerId: string, opacity: number) => void;
	onVisibilityToggle: (layerId: string) => void;
	onRemove: (layerId: string) => void;
}

export const LayerControlPanel = ({
	layers,
	onOpacityChange,
	onVisibilityToggle,
	onRemove,
}: LayerControlPanelProps) => {
	const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);

	if (sortedLayers.length === 0) {
		return (
			<div className="flex items-center justify-center h-32 text-sm text-gray-500">
				공종을 선택하여 레이어를 추가하세요
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			<div className="text-xs font-medium text-gray-600 mb-1">
				레이어 목록 ({sortedLayers.length}개)
			</div>
			{sortedLayers.map((layer) => (
				<LayerItem
					key={layer.id}
					layer={layer}
					onOpacityChange={onOpacityChange}
					onVisibilityToggle={onVisibilityToggle}
					onRemove={onRemove}
				/>
			))}
		</div>
	);
};

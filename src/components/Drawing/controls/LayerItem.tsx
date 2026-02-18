import type { OverlayLayer } from "@/type";
import { getDisciplineColor } from "@/utils/disciplineColors";

interface LayerItemProps {
  layer: OverlayLayer;
  onOpacityChange: (layerId: string, opacity: number) => void;
}

export const LayerItem = ({ layer, onOpacityChange }: LayerItemProps) => {
  const colors = getDisciplineColor(layer.discipline.name);
  const percentage = Math.round(layer.opacity * 100);

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value);
    onOpacityChange(layer.id, value);
  };

  return (
    <div className="flex flex-col gap-2 p-3 bg-white border border-gray-200 rounded-md">
      <div className="flex items-center justify-between">
        <div
          className={`px-2 py-1 rounded text-xs font-medium ${colors.bg} ${colors.text}`}
        >
          {layer.discipline.name}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">투명도</span>
          <span className="text-xs font-mono text-gray-500">{percentage}%</span>
        </div>
        <input
          type="range"
          aria-label="투명도 조절"
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
};

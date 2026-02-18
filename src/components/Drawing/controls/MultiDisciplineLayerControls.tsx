import React from "react";
import type { Discipline, OverlayLayer } from "@/type";
import { getDisciplineColor } from "@/utils/disciplineColors";
import { LayerItem } from "./LayerItem";

interface MultiDisciplineLayerControlsProps {
  availableDisciplines: Discipline[];
  overlayLayers: OverlayLayer[];
  onAddLayer: (discipline: Discipline) => void;
  onOpacityChange: (layerId: string, opacity: number) => void;
}

export const MultiDisciplineLayerControls = React.memo(
  ({
    availableDisciplines,
    overlayLayers,
    onAddLayer,
    onOpacityChange,
  }: MultiDisciplineLayerControlsProps) => {
    const selectedDisciplineNames = overlayLayers.map(
      (layer) => layer.discipline.name,
    );

    const handleDisciplineToggle = (
      discipline: Discipline,
      isSelected: boolean,
    ) => {
      if (isSelected) {
        onAddLayer(discipline);
      }
    };

    const sortedLayers = [...overlayLayers].sort((a, b) => a.zIndex - b.zIndex);

    return (
      <div className="flex flex-col gap-4 w-64 shrink-0 bg-white border border-gray-200 rounded-lg p-4 h-full overflow-y-auto">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
          <span className="text-lg font-semibold text-gray-800">
            다중 오버레이
          </span>
          <span className="text-xs text-gray-500">레이어 제어</span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium text-gray-600 mb-1">
            공종 선택
          </div>
          <div className="flex flex-col gap-2">
            {availableDisciplines.map((discipline) => {
              const colors = getDisciplineColor(discipline.name);
              const isSelected = selectedDisciplineNames.includes(
                discipline.name,
              );

              return (
                <label
                  key={discipline.name}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) =>
                      handleDisciplineToggle(discipline, e.target.checked)
                    }
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                  <div
                    className={`px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}
                  >
                    {discipline.name}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-3">
          {sortedLayers.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-gray-500">
              공종을 선택하여 레이어를 추가하세요
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="text-xs font-medium text-gray-600 mb-1">
                레이어 목록 ({sortedLayers.length}개)
              </div>
              {sortedLayers.map((layer) => (
                <LayerItem
                  key={layer.id}
                  layer={layer}
                  onOpacityChange={onOpacityChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
);

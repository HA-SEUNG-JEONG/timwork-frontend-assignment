import React from "react";
import type { Discipline, OverlayLayer } from "../../type";
import { DisciplineSelector } from "./DisciplineSelector";
import { LayerControlPanel } from "./LayerControlPanel";

interface MultiDisciplineLayerControlsProps {
    availableDisciplines: Discipline[];
    overlayLayers: OverlayLayer[];
    onAddLayer: (discipline: Discipline) => void;
    onRemoveLayer: (layerId: string) => void;
    onOpacityChange: (layerId: string, opacity: number) => void;
    onVisibilityToggle: (layerId: string) => void;
}

export const MultiDisciplineLayerControls = React.memo(
    ({
        availableDisciplines,
        overlayLayers,
        onAddLayer,
        onRemoveLayer,
        onOpacityChange,
        onVisibilityToggle,
    }: MultiDisciplineLayerControlsProps) => {
        const selectedDisciplineNames = overlayLayers.map(
            (layer) => layer.discipline.name
        );

        const handleDisciplineToggle = (
            discipline: Discipline,
            isSelected: boolean
        ) => {
            if (isSelected) {
                onAddLayer(discipline);
            } else {
                const layerToRemove = overlayLayers.find(
                    (layer) => layer.discipline.name === discipline.name
                );
                if (layerToRemove) {
                    onRemoveLayer(layerToRemove.id);
                }
            }
        };

        return (
            <div className="flex flex-col gap-4 w-64 shrink-0 bg-white border border-gray-200 rounded-lg p-4 h-full overflow-y-auto">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                    <span className="text-lg font-semibold text-gray-800">
                        다중 오버레이
                    </span>
                    <span className="text-xs text-gray-500">레이어 제어</span>
                </div>

                <DisciplineSelector
                    availableDisciplines={availableDisciplines}
                    selectedDisciplineNames={selectedDisciplineNames}
                    onToggle={handleDisciplineToggle}
                />

                <div className="border-t border-gray-200 pt-3">
                    <LayerControlPanel
                        layers={overlayLayers}
                        onOpacityChange={onOpacityChange}
                        onVisibilityToggle={onVisibilityToggle}
                        onRemove={onRemoveLayer}
                    />
                </div>
            </div>
        );
    }
);

import { useCallback, useEffect, useMemo } from "react";
import type { Discipline } from "@/type";
import { useAppContext } from "@/context/AppContext";
import { MultiDisciplineLayerControls } from "../controls/MultiDisciplineLayerControls";
import { ViewModeHeader } from "../panels/ViewModeHeader";
import { ZoomControls } from "@/components/ui/ZoomControls";
import { usePanAndZoom } from "@/hooks/usePanAndZoom";
import {
  createOverlayLayer,
  getNextZIndex,
  getLayerImageUrl,
  getLatestRevision,
} from "@/utils/layerUtils";

export const MultiDisciplineView = () => {
  const { selectedDrawing, metadata, overlayLayers, setOverlayLayers } =
    useAppContext();

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

  const availableDisciplines = useMemo(() => {
    if (!selectedDrawing || !metadata) return [];
    const drawingData = metadata.drawings[selectedDrawing.id];
    if (!drawingData?.disciplines) return [];

    const disciplineMap = new Map(metadata.disciplines.map((d) => [d.name, d]));
    return Object.keys(drawingData.disciplines)
      .map((name) => disciplineMap.get(name))
      .filter((d) => d !== undefined);
  }, [selectedDrawing, metadata]);

  const handleAddLayer = useCallback(
    (discipline: Discipline) => {
      if (!selectedDrawing || !metadata) return;

      const latestRevision = getLatestRevision(
        selectedDrawing,
        discipline,
        metadata,
      );
      const newLayer = createOverlayLayer(
        discipline,
        getNextZIndex(overlayLayers),
        latestRevision,
      );
      setOverlayLayers([...overlayLayers, newLayer]);
    },
    [selectedDrawing, metadata, overlayLayers, setOverlayLayers],
  );

  const handleRemoveLayer = useCallback(
    (layerId: string) => {
      setOverlayLayers(overlayLayers.filter((layer) => layer.id !== layerId));
    },
    [overlayLayers, setOverlayLayers],
  );

  const handleOpacityChange = useCallback(
    (layerId: string, opacity: number) => {
      setOverlayLayers(
        overlayLayers.map((layer) =>
          layer.id === layerId ? { ...layer, opacity } : layer,
        ),
      );
    },
    [overlayLayers, setOverlayLayers],
  );

  const handleVisibilityToggle = useCallback(
    (layerId: string) => {
      setOverlayLayers(
        overlayLayers.map((layer) =>
          layer.id === layerId ? { ...layer, visible: !layer.visible } : layer,
        ),
      );
    },
    [overlayLayers, setOverlayLayers],
  );

  const visibleLayers = overlayLayers
    .filter((layer) => layer.visible)
    .sort((a, b) => a.zIndex - b.zIndex);

  const hasLayers = visibleLayers.length > 0;

  return (
    <main className="flex-1 flex flex-col p-4 bg-gray-100 h-screen">
      <ViewModeHeader
        availableRevisions={[]}
        availableDisciplines={availableDisciplines}
      />
      <div className="flex-1 flex gap-3 overflow-hidden">
        <MultiDisciplineLayerControls
          availableDisciplines={availableDisciplines}
          overlayLayers={overlayLayers}
          onAddLayer={handleAddLayer}
          onRemoveLayer={handleRemoveLayer}
          onOpacityChange={handleOpacityChange}
          onVisibilityToggle={handleVisibilityToggle}
        />
        <div className="flex-1 overflow-auto">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            className={`relative w-full h-full border overflow-hidden ${
              isPanning ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            {hasLayers && selectedDrawing && metadata ? (
              <>
                <div className="relative w-full h-full">
                  {visibleLayers.map((layer) => {
                    const layerImageUrl = getLayerImageUrl(
                      layer,
                      selectedDrawing,
                      metadata,
                    );

                    return (
                      <div
                        key={layer.id}
                        className={`absolute top-0 left-0 w-full h-full origin-top-left ${
                          isPanning ? "will-change-transform" : ""
                        }`}
                        style={{
                          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                          opacity: layer.opacity,
                          zIndex: layer.zIndex,
                        }}
                      >
                        {layerImageUrl && (
                          <img
                            src={layerImageUrl}
                            alt={layer.discipline.name}
                            draggable={false}
                            className="absolute top-0 left-0 w-full h-full object-contain"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <ZoomControls
                  scale={transform.scale}
                  onZoomIn={zoomIn}
                  onZoomOut={zoomOut}
                  onReset={resetTransform}
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  좌측 패널에서 공종을 선택하여 레이어를 추가하세요.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

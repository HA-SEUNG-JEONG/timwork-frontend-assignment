import { useCallback, useEffect, useMemo } from "react";
import { DrawingFilters } from "../controls/DrawingFilters";
import { RevisionMetadataPanel } from "../panels/RevisionMetadataPanel";
import { CompareView } from "./CompareView";
import { MultiDisciplineView } from "./MultiDisciplineView";
import { ViewModeHeader } from "../panels/ViewModeHeader";

import { useAppContext } from "@/context/AppContext";
import type { Discipline, Revision } from "@/type";
import { ImageCanvas } from "../renderers/ImageCanvas";

export const DrawingViewer = () => {
  const {
    metadata,
    selectedDrawing,
    selectedDiscipline,
    setSelectedDiscipline,
    selectedRevision,
    setSelectedRevision,
    isCompareMode,
    isMultiDisciplineMode,
  } = useAppContext();

  const disciplineMap = useMemo(
    () =>
      !metadata
        ? new Map<string, Discipline>()
        : new Map(metadata.disciplines.map((d) => [d.name, d])),
    [metadata],
  );

  const availableDisciplines = useMemo(() => {
    if (!selectedDrawing) return [];

    const disciplineNames = Object.keys(selectedDrawing.disciplines).map(
      (name) => disciplineMap.get(name),
    );
    return disciplineNames.filter((d) => d !== undefined);
  }, [selectedDrawing, disciplineMap]);

  const availableRevisions = useMemo(() => {
    if (!selectedDrawing || !selectedDiscipline) return [];

    const drawingDisciplineName =
      selectedDrawing.disciplines[selectedDiscipline.name];

    if (!drawingDisciplineName) return [];

    const revisions: Revision[] = [...drawingDisciplineName.revisions];

    if (drawingDisciplineName.regions) {
      for (const region of Object.values(drawingDisciplineName.regions)) {
        revisions.push(...region.revisions);
      }
    }

    return revisions;
  }, [selectedDrawing, selectedDiscipline]);

  const baseImageUrl = useMemo(() => {
    if (!selectedDrawing) return null;

    let image = selectedDrawing.image;

    if (selectedDiscipline) {
      const disciplineData =
        selectedDrawing.disciplines[selectedDiscipline.name];
      if (disciplineData?.image) {
        image = disciplineData.image;
      }
    }

    if (selectedRevision?.image) {
      image = selectedRevision.image;
    }

    return image ? `/data/drawings/${image}` : null;
  }, [selectedDrawing, selectedDiscipline, selectedRevision]);

  const handleDisciplineChange = useCallback(
    (discipline: Discipline | null) => {
      setSelectedDiscipline(discipline);
      setSelectedRevision(null);
    },
    [setSelectedDiscipline, setSelectedRevision],
  );

  const handleRevisionChange = useCallback(
    (revision: Revision | null) => {
      setSelectedRevision(revision);
    },
    [setSelectedRevision],
  );

  useEffect(() => {
    if (!selectedDiscipline) return;

    const isDisciplineAvailable = availableDisciplines.some(
      (availableDiscipline) =>
        availableDiscipline.name === selectedDiscipline.name,
    );

    if (!isDisciplineAvailable) {
      setSelectedDiscipline(null);
      setSelectedRevision(null);
    }
  }, [
    selectedDrawing,
    availableDisciplines,
    selectedDiscipline,
    setSelectedDiscipline,
    setSelectedRevision,
  ]);

  if (isMultiDisciplineMode) return <MultiDisciplineView />;
  if (isCompareMode) return <CompareView />;

  return (
    <main className="flex-1 flex flex-col p-4 bg-gray-100 h-screen">
      <ViewModeHeader
        availableRevisions={availableRevisions}
        availableDisciplines={availableDisciplines}
      />
      <div className="flex items-start gap-3 mb-2">
        <DrawingFilters
          availableDisciplines={availableDisciplines}
          availableRevisions={availableRevisions}
          onDisciplineChange={handleDisciplineChange}
          onRevisionChange={handleRevisionChange}
        />

        {selectedRevision && (
          <RevisionMetadataPanel revision={selectedRevision} />
        )}
      </div>
      <div className="flex-1 overflow-auto">
        <ImageCanvas imageUrl={baseImageUrl} />
      </div>
    </main>
  );
};

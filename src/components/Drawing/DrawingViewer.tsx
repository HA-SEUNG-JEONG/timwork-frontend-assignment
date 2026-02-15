import { useMemo, useEffect } from "react";
import { DrawingFilters } from "./DrawingFilters";
import { DrawingContextHeader } from "./DrawingContextHeader";
import { RevisionMetadataPanel } from "./RevisionMetadataPanel";

import { useAppContext } from "../../context/AppContext";
import type { Discipline, DrawingDiscipline, Revision } from "../../type";
import { ImageCanvas } from "./ImageCanvas";

export const DrawingViewer = () => {
    const {
        metadata,
        selectedDrawing,
        selectedDiscipline,
        setSelectedDiscipline,
        selectedRevision,
        setSelectedRevision,
        isSidebarVisible,
        toggleSidebar,
    } = useAppContext();

    const handleDisciplineChange = (discipline: Discipline | null) => {
        setSelectedDiscipline(discipline);
        setSelectedRevision(null);
    };

    const handleRevisionChange = (revision: Revision | null) => {
        setSelectedRevision(revision);
    };

    const disciplineMap = useMemo(() => {
        if (!metadata) return new Map<string, Discipline>();
        return new Map(metadata.disciplines.map((d) => [d.name, d]));
    }, [metadata]);

    const availableDisciplines = useMemo(() => {
        if (!selectedDrawing || !metadata) return [];
        const drawingData = metadata.drawings[selectedDrawing.id];
        if (!drawingData?.disciplines) return [];
        return Object.keys(drawingData.disciplines)
            .map((name) => disciplineMap.get(name))
            .filter((d): d is Discipline => d !== undefined);
    }, [selectedDrawing, metadata, disciplineMap]);

    useEffect(() => {
        if (!selectedDiscipline) return;

        const isDisciplineAvailable = availableDisciplines.some(
            (availableDiscipline) =>
                availableDiscipline.name === selectedDiscipline.name
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

    const availableRevisions = useMemo(() => {
        if (!selectedDrawing || !selectedDiscipline || !metadata) return [];
        const drawingDiscipline =
            metadata.drawings[selectedDrawing.id]?.disciplines?.[
                selectedDiscipline.name
            ];
        if (!drawingDiscipline) return [];

        const revisions: Revision[] = [...(drawingDiscipline.revisions || [])];

        if (drawingDiscipline.regions) {
            for (const region of Object.values(drawingDiscipline.regions)) {
                revisions.push(...region.revisions);
            }
        }

        return revisions;
    }, [selectedDrawing, selectedDiscipline, metadata]);

    const imageUrl = useMemo(() => {
        if (!selectedDrawing) return null;

        let image = selectedDrawing.image;
        if (selectedDiscipline) {
            const disciplineData: DrawingDiscipline | undefined =
                metadata?.drawings[selectedDrawing.id]?.disciplines?.[
                    selectedDiscipline.name
                ];
            if (disciplineData?.image) {
                image = disciplineData.image;
            }
        }
        if (selectedRevision?.image) {
            image = selectedRevision.image;
        }

        return image ? `/data/drawings/${image}` : null;
    }, [selectedDrawing, selectedDiscipline, selectedRevision, metadata]);

    return (
        <main className="flex-1 flex flex-col p-4 bg-gray-100 h-screen">
            <DrawingContextHeader
                drawingName={selectedDrawing?.name || "도면을 선택하세요"}
                disciplineName={selectedDiscipline?.name}
                revisionVersion={selectedRevision?.version}
            />

            <div className="mb-2 flex gap-2">
                {!isSidebarVisible && (
                    <button
                        onClick={toggleSidebar}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                        title="사이드바 표시"
                    >
                        ▶ 사이드바 표시
                    </button>
                )}
            </div>

            <>
                <DrawingFilters
                    availableDisciplines={availableDisciplines}
                    availableRevisions={availableRevisions}
                    onDisciplineChange={handleDisciplineChange}
                    onRevisionChange={handleRevisionChange}
                />

                {selectedRevision && (
                    <div className="mb-4">
                        <RevisionMetadataPanel revision={selectedRevision} />
                    </div>
                )}
            </>

            <div className="flex-1 overflow-auto">
                <ImageCanvas
                    imageUrl={imageUrl}
                    selectedDrawing={selectedDrawing}
                />
            </div>
        </main>
    );
};

import { DrawingFilters } from "./DrawingFilters";

import { useAppContext } from "../../context/AppContext";
import type { Discipline, NormalizedDrawing, Revision } from "../../type";

export const DrawingViewer = () => {
    const {
        metadata,
        selectedDrawing,
        selectedDiscipline,
        setSelectedDiscipline,
        selectedRevision,
        setSelectedRevision,
    } = useAppContext();

    const handleDisciplineChange = (discipline: Discipline | null) => {
        setSelectedDiscipline(discipline);
        setSelectedRevision(null);
    };

    const handleRevisionChange = (revision: Revision | null) => {
        setSelectedRevision(revision);
    };

    const getAvailableDisciplines = (drawing: NormalizedDrawing | null) => {
        if (!drawing || !metadata) return [];
        const drawingData = metadata.drawings[drawing.id];
        return Object.keys(drawingData.disciplines).map(
            (name) => metadata.disciplines.find((d) => d.name === name)!
        );
    };

    const getAvailableRevisions = (
        drawing: NormalizedDrawing | null,
        discipline: Discipline | null
    ) => {
        if (!drawing || !discipline || !metadata) return [];
        const drawingDiscipline =
            metadata.drawings[drawing.id]?.disciplines[discipline.name];
        return drawingDiscipline?.revisions || [];
    };

    const availableDisciplines = getAvailableDisciplines(selectedDrawing);
    const availableRevisions = getAvailableRevisions(
        selectedDrawing,
        selectedDiscipline
    );

    const displayRevision = selectedRevision ?? availableRevisions[0] ?? null;
    const rawImage = displayRevision?.image ?? null;
    const imageUrl =
        rawImage &&
        (rawImage.startsWith("http") || rawImage.startsWith("/")
            ? rawImage
            : `/data/drawings/${rawImage}`);
    return (
        <main className="flex-1 flex flex-col p-4 bg-gray-100 h-screen overflow-auto">
            <DrawingFilters
                selectedDrawing={selectedDrawing}
                selectedDiscipline={selectedDiscipline}
                selectedRevision={selectedRevision}
                availableDisciplines={availableDisciplines}
                availableRevisions={availableRevisions}
                onDisciplineChange={handleDisciplineChange}
                onRevisionChange={handleRevisionChange}
            />
            <section className="flex-1 min-h-0 mt-4 bg-white rounded-lg border border-gray-200 overflow-auto">
                {!selectedDrawing && (
                    <p className="p-4 text-gray-500">도면을 선택하세요.</p>
                )}
                {selectedDrawing && !selectedDiscipline && (
                    <p className="p-4 text-gray-500">공종을 선택하세요.</p>
                )}
                {selectedDrawing &&
                    selectedDiscipline &&
                    availableRevisions.length === 0 && (
                        <p className="p-4 text-gray-500">
                            이 공종에 사용 가능한 리비전이 없습니다.
                        </p>
                    )}
                {selectedDrawing &&
                    selectedDiscipline &&
                    availableRevisions.length > 0 &&
                    !imageUrl && (
                        <p className="p-4 text-gray-500">
                            도면 이미지를 불러올 수 없습니다.
                        </p>
                    )}
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={
                            selectedDrawing
                                ? `${selectedDrawing.name} - ${
                                      selectedDiscipline?.name ?? ""
                                  } - ${displayRevision?.version ?? ""}`
                                : "도면"
                        }
                        className="max-w-full h-auto object-contain"
                    />
                )}
            </section>
        </main>
    );
};

// src/components/Drawing/DrawingFilters.tsx
import React from "react";
import type { Discipline, NormalizedDrawing, Revision } from "../../type";

interface DrawingFiltersProps {
    selectedDrawing: NormalizedDrawing | null;
    selectedDiscipline: Discipline | null;
    selectedRevision: Revision | null;
    availableDisciplines: Discipline[];
    availableRevisions: Revision[];
    onDisciplineChange: (discipline: Discipline | null) => void;
    onRevisionChange: (revision: Revision | null) => void;
}

export const DrawingFilters = ({
    selectedDrawing,
    selectedDiscipline,
    selectedRevision,
    availableDisciplines,
    availableRevisions,
    onDisciplineChange,
    onRevisionChange,
}: DrawingFiltersProps) => {
    const handleDisciplineChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const disciplineName = e.target.value;
        const discipline =
            availableDisciplines.find((d) => d.name === disciplineName) || null;
        onDisciplineChange(discipline);
    };

    const handleRevisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const revisionVersion = e.target.value;
        const revision =
            availableRevisions.find((r) => r.version === revisionVersion) ||
            null;
        onRevisionChange(revision);
    };

    return (
        <div className="flex gap-4 mb-4">
            <div>
                <label
                    htmlFor="discipline-select"
                    className="block text-sm font-medium text-gray-700"
                >
                    공종 선택
                </label>
                <select
                    id="discipline-select"
                    disabled={!selectedDrawing}
                    value={selectedDiscipline?.name || ""}
                    onChange={handleDisciplineChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="">-- 공종 --</option>
                    {availableDisciplines.map((d) => (
                        <option key={d.name} value={d.name}>
                            {d.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label
                    htmlFor="revision-select"
                    className="block text-sm font-medium text-gray-700"
                >
                    리비전 선택
                </label>
                <select
                    id="revision-select"
                    disabled={
                        !selectedDiscipline || availableRevisions.length === 0
                    }
                    value={selectedRevision?.version || ""}
                    onChange={handleRevisionChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="">-- 리비전 --</option>
                    {availableRevisions.map((r: Revision) => (
                        <option key={r.version} value={r.version}>
                            {r.version} - {r.description}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

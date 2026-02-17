import React from "react";
import type { Discipline, Revision } from "@/type";
import { isLatestRevision } from "@/utils/revisionUtils";
import { useAppContext } from "@/context/AppContext";

interface DrawingFiltersProps {
  availableDisciplines: Discipline[];
  availableRevisions: Revision[];
  onDisciplineChange: (discipline: Discipline | null) => void;
  onRevisionChange: (revision: Revision | null) => void;
}

export const DrawingFilters = ({
  availableDisciplines,
  availableRevisions,
  onDisciplineChange,
  onRevisionChange,
}: DrawingFiltersProps) => {
  const { selectedDrawing, selectedDiscipline, selectedRevision } =
    useAppContext();

  const handleDisciplineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const disciplineName = e.target.value;
    const discipline =
      availableDisciplines.find((d) => d.name === disciplineName) || null;
    onDisciplineChange(discipline);
  };

  const handleRevisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const revisionVersion = e.target.value;
    const revision =
      availableRevisions.find((r) => r.version === revisionVersion) || null;
    onRevisionChange(revision);
  };

  const hasDisciplineNoRevisions =
    selectedDiscipline !== null && availableRevisions.length === 0;

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex gap-4">
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
            disabled={!selectedDiscipline || availableRevisions.length === 0}
            value={selectedRevision?.version || ""}
            onChange={handleRevisionChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">-- 리비전 --</option>
            {availableRevisions.map((r: Revision) => {
              const isLatest = isLatestRevision(r, availableRevisions);
              return (
                <option key={r.version} value={r.version}>
                  {r.version}
                  {isLatest ? " (최신)" : ""}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      {hasDisciplineNoRevisions && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-amber-50 text-amber-800 text-sm"
          role="status"
          aria-live="polite"
        >
          <span aria-hidden="true">ℹ️</span>
          <span>
            선택한 공종({selectedDiscipline.name})에 등록된 리비전이 없습니다.
          </span>
        </div>
      )}
    </div>
  );
};

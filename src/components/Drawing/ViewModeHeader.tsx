import { useCallback } from "react";
import type { Discipline, Revision } from "../../type";
import { useAppContext } from "../../context/AppContext";
import { getDisciplineColor } from "../../utils/disciplineColors";

interface ViewModeHeaderProps {
	availableRevisions: Revision[];
	availableDisciplines: Discipline[];
}

export const ViewModeHeader = ({
	availableRevisions,
	availableDisciplines,
}: ViewModeHeaderProps) => {
	const {
		selectedDrawing,
		selectedDiscipline,
		selectedRevision,
		isCompareMode,
		setIsCompareMode,
		isMultiDisciplineMode,
		setIsMultiDisciplineMode,
		setOverlayLayers,
	} = useAppContext();

	const handleToggleCompareMode = useCallback(() => {
		const newMode = !isCompareMode;
		setIsCompareMode(newMode);
		if (newMode) {
			setIsMultiDisciplineMode(false);
			setOverlayLayers([]);
		}
	}, [
		isCompareMode,
		setIsCompareMode,
		setIsMultiDisciplineMode,
		setOverlayLayers,
	]);

	const handleToggleMultiDisciplineMode = useCallback(() => {
		const newMode = !isMultiDisciplineMode;
		setIsMultiDisciplineMode(newMode);
		if (newMode) {
			setIsCompareMode(false);
		} else {
			setOverlayLayers([]);
		}
	}, [
		isMultiDisciplineMode,
		setIsMultiDisciplineMode,
		setIsCompareMode,
		setOverlayLayers,
	]);

	const drawingName = selectedDrawing?.name || "도면을 선택하세요";
	const disciplineName = isMultiDisciplineMode
		? undefined
		: selectedDiscipline?.name;
	const revisionVersion = isCompareMode ? undefined : selectedRevision?.version;
	const disciplineColors = disciplineName
		? getDisciplineColor(disciplineName)
		: null;

	return (
		<>
			<div className="mb-4 p-4 bg-white rounded-lg">
				<h2 className="text-xl font-bold mb-2">{drawingName}</h2>
				<div className="flex gap-2 items-center">
					{disciplineName && disciplineColors && (
						<span
							className={`px-3 py-1 text-sm font-medium rounded-full ${disciplineColors.bg} ${disciplineColors.text}`}
						>
							{disciplineName}
						</span>
					)}
					{revisionVersion && (
						<span className="text-sm text-gray-600">
							리비전: {revisionVersion}
						</span>
					)}
				</div>
			</div>
			<div className="mb-2 flex gap-2">
				{selectedDiscipline && availableRevisions.length >= 2 && (
					<button
						onClick={handleToggleCompareMode}
						className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
							isCompareMode
								? "bg-indigo-600 text-white hover:bg-indigo-700"
								: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
						}`}
					>
						{isCompareMode ? "📊 비교 모드" : "비교 모드"}
					</button>
				)}
				{availableDisciplines.length >= 2 && (
					<button
						onClick={handleToggleMultiDisciplineMode}
						className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
							isMultiDisciplineMode
								? "bg-purple-600 text-white hover:bg-purple-700"
								: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
						}`}
					>
						{isMultiDisciplineMode ? "🎨 다중 오버레이 모드" : "다중 오버레이"}
					</button>
				)}
			</div>
		</>
	);
};

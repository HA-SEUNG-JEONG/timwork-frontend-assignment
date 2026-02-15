import React from "react";
import type { Discipline } from "../../type";
import { getDisciplineColor } from "../../utils/disciplineColors";

interface DisciplineSelectorProps {
	availableDisciplines: Discipline[];
	selectedDisciplineNames: string[];
	onToggle: (discipline: Discipline, isSelected: boolean) => void;
}

export const DisciplineSelector = React.memo(
	({
		availableDisciplines,
		selectedDisciplineNames,
		onToggle,
	}: DisciplineSelectorProps) => {
		const handleCheckboxChange = (
			discipline: Discipline,
			e: React.ChangeEvent<HTMLInputElement>,
		) => {
			onToggle(discipline, e.target.checked);
		};

		return (
			<div className="flex flex-col gap-2">
				<div className="text-xs font-medium text-gray-600 mb-1">공종 선택</div>
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
									onChange={(e) => handleCheckboxChange(discipline, e)}
									className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
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
		);
	},
);

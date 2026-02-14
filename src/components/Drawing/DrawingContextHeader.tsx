import React from "react";
import { getDisciplineColor } from "../../utils/disciplineColors";

interface DrawingContextHeaderProps {
	drawingName: string;
	disciplineName?: string;
	revisionVersion?: string;
}

export const DrawingContextHeader: React.FC<DrawingContextHeaderProps> = ({
	drawingName,
	disciplineName,
	revisionVersion,
}) => {
	const disciplineColor = disciplineName
		? getDisciplineColor(disciplineName)
		: null;

	return (
		<div className="mb-4 pb-4 border-b border-gray-300">
			<div className="flex items-center gap-3">
				<h2 className="text-2xl font-bold text-gray-900">{drawingName}</h2>
				{disciplineName && disciplineColor && (
					<span
						className={`px-3 py-1 text-sm font-medium rounded-full ${disciplineColor.bg} ${disciplineColor.text}`}
					>
						{disciplineName}
					</span>
				)}
				{revisionVersion && (
					<span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
						{revisionVersion}
					</span>
				)}
			</div>
		</div>
	);
};

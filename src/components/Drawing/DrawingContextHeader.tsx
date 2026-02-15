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
	return (
		<div className="mb-2 p-3 bg-white rounded-lg shadow-sm border border-gray-200">
			<h2 className="text-lg font-bold mb-1.5">{drawingName}</h2>

			<div className="flex gap-2 items-center">
				{disciplineName && (
					<span
						className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
							getDisciplineColor(disciplineName).bg
						} ${getDisciplineColor(disciplineName).text}`}
					>
						{disciplineName}
					</span>
				)}
				{revisionVersion && (
					<span className="text-xs text-gray-600">
						리비전: {revisionVersion}
					</span>
				)}
			</div>
		</div>
	);
};

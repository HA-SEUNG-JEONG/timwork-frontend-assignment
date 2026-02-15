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
		<div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
			<h2 className="text-xl font-bold mb-2">{drawingName}</h2>

			<div className="flex gap-2 items-center">
				{disciplineName && (
					<span
						className={`px-3 py-1 text-sm font-medium rounded-full ${
							getDisciplineColor(disciplineName).bg
						} ${getDisciplineColor(disciplineName).text}`}
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
	);
};

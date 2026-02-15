import React from "react";
import type { Revision } from "../../type";
import { formatRevisionDate } from "../../utils/dateFormatter";

interface RevisionMetadataPanelProps {
	revision: Revision | null;
}

export const RevisionMetadataPanel: React.FC<RevisionMetadataPanelProps> = ({
	revision,
}) => {
	if (!revision) return null;

	const formattedDate = formatRevisionDate(revision.date, "long");

	return (
		<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
			<h3 className="text-lg font-bold mb-3">리비전 정보</h3>

			<div className="space-y-3">
				<div>
					<span className="text-sm font-medium text-gray-500">버전</span>
					<p className="text-base font-semibold">{revision.version}</p>
				</div>

				<div>
					<span className="text-sm font-medium text-gray-500">발행일</span>
					<p className="text-base">{formattedDate}</p>
				</div>

				<div>
					<span className="text-sm font-medium text-gray-500">설명</span>
					<p className="text-base">{revision.description}</p>
				</div>

				<div>
					<span className="text-sm font-medium text-gray-500">변경사항</span>
					{revision.changes && revision.changes.length > 0 ? (
						<ul className="mt-1 space-y-1">
							{revision.changes.map((change, index) => (
								<li
									key={index}
									className="text-sm text-gray-700 flex items-start"
								>
									<span className="mr-2">•</span>
									<span>{change}</span>
								</li>
							))}
						</ul>
					) : (
						<p className="text-sm text-gray-400 italic">변경사항 없음</p>
					)}
				</div>
			</div>
		</div>
	);
};

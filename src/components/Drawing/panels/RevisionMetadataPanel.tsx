import { useState } from "react";
import type { Revision } from "@/type";
import { formatRevisionDate } from "@/utils/dateFormatter";

interface RevisionMetadataPanelProps {
	revision: Revision;
}

export const RevisionMetadataPanel = ({
	revision,
}: RevisionMetadataPanelProps) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const formattedDate = formatRevisionDate(revision.date, "short");

	return (
		<div className="mb-2">
			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
			>
				<span className="font-medium text-gray-700">
					{isExpanded ? "📋 정보 숨김" : "📋 정보 표시"}
				</span>
				<span className="text-gray-500">
					{revision.version} · {formattedDate}
				</span>
			</button>

			{isExpanded && (
				<div className="mt-2 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
					<div className="text-base font-bold mb-3 text-gray-800">
						리비전 상세 정보
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div>
							<span className="text-xs font-medium text-gray-500 uppercase">
								버전
							</span>
							<p className="text-sm font-semibold text-gray-900 mt-1">
								{revision.version}
							</p>
						</div>

						<div>
							<span className="text-xs font-medium text-gray-500 uppercase">
								발행일
							</span>
							<p className="text-sm text-gray-900 mt-1">
								{formatRevisionDate(revision.date, "long")}
							</p>
						</div>

						<div>
							<span className="text-xs font-medium text-gray-500 uppercase">
								설명
							</span>
							<p className="text-sm text-gray-900 mt-1">
								{revision.description}
							</p>
						</div>

						<div>
							<span className="text-xs font-medium text-gray-500 uppercase">
								변경사항
							</span>
							{revision.changes && revision.changes.length > 0 ? (
								<ul className="mt-1 space-y-1">
									{revision.changes.map((change, index) => (
										<li
											key={index}
											className="text-sm text-gray-700 flex items-start"
										>
											<span className="mr-1.5">•</span>
											<span>{change}</span>
										</li>
									))}
								</ul>
							) : (
								<p className="text-sm text-gray-400 italic mt-1">
									변경사항 없음
								</p>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

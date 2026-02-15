import React from "react";

import { useAppContext } from "../../context/AppContext";

import type { NormalizedDrawing } from "../../type";

const TreeViewNode = React.memo(({ node }: { node: NormalizedDrawing }) => {
	const { selectedDrawing, setSelectedDrawing } = useAppContext();
	const isSelected = selectedDrawing?.id === node.id;

	const handleSelect = () => {
		setSelectedDrawing(node);
	};

	return (
		<div className="ml-4">
			<div
				onClick={handleSelect}
				className={`
                    cursor-pointer px-3 py-2.5
                    border-l-4 transition-colors duration-150
                    ${
											isSelected
												? "bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold hover:bg-indigo-100"
												: "bg-transparent border-transparent text-gray-700 font-normal hover:bg-gray-50"
										}
                `}
			>
				{node.name}
			</div>
			{node.children.length > 0 ? (
				<div>
					{node.children.map((child) => (
						<TreeViewNode key={child.id} node={child} />
					))}
				</div>
			) : null}
		</div>
	);
});

export const TreeView = () => {
	const { normalizedData, loading, error, toggleSidebar } = useAppContext();

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	return (
		<div className="w-[300px] flex flex-col p-4 border-r border-gray-200 h-screen overflow-y-auto bg-white shadow-sm">
			<h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-2 flex justify-between items-center">
				도면 목록
				<button
					onClick={toggleSidebar}
					className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-300 transition-colors"
					title="사이드바 숨기기"
				>
					◀
				</button>
			</h2>
			{normalizedData.map((node) => (
				<TreeViewNode key={node.id} node={node} />
			))}
		</div>
	);
};

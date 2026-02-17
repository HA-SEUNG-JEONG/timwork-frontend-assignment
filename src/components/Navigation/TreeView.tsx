import { useAppContext } from "@/context/AppContext";

import type { NormalizedDrawing } from "@/type";

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
		<div className="w-75 flex flex-col p-4 border-r border-gray-200 h-screen overflow-y-auto bg-white shadow-sm">
			<div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-2">
				<h2 className="text-lg font-semibold text-gray-800">도면 목록</h2>
				<button
					onClick={toggleSidebar}
					className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
					title="사이드바 닫기"
					aria-label="사이드바 닫기"
				>
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>
			</div>
			{normalizedData.map((node) => (
				<TreeViewNode key={node.id} node={node} />
			))}
		</div>
	);
};

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
		<div className="pl-4">
			<div
				onClick={handleSelect}
				className={`cursor-pointer ${
					isSelected ? "font-bold" : "font-normal"
				} p-2 ${isSelected ? "bg-gray-200" : "bg-transparent"}`}
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
	const { normalizedData, loading, error } = useAppContext();

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	return (
		<div
			style={{
				width: "300px",
				borderRight: "1px solid #ccc",
				height: "100vh",
				overflowY: "auto",
			}}
		>
			<h2>도면 목록</h2>
			{normalizedData.map((node) => (
				<TreeViewNode key={node.id} node={node} />
			))}
		</div>
	);
};

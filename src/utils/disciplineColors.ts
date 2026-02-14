const DISCIPLINE_COLORS: Record<
	string,
	{ bg: string; text: string; border: string }
> = {
	건축: {
		bg: "bg-blue-100",
		text: "text-blue-800",
		border: "border-blue-300",
	},
	구조: {
		bg: "bg-red-100",
		text: "text-red-800",
		border: "border-red-300",
	},
	공조설비: {
		bg: "bg-green-100",
		text: "text-green-800",
		border: "border-green-300",
	},
	배관설비: {
		bg: "bg-cyan-100",
		text: "text-cyan-800",
		border: "border-cyan-300",
	},
	소방: {
		bg: "bg-orange-100",
		text: "text-orange-800",
		border: "border-orange-300",
	},
	설비: {
		bg: "bg-purple-100",
		text: "text-purple-800",
		border: "border-purple-300",
	},
};

export function getDisciplineColor(name: string) {
	return (
		DISCIPLINE_COLORS[name] || {
			bg: "bg-gray-100",
			text: "text-gray-800",
			border: "border-gray-300",
		}
	);
}

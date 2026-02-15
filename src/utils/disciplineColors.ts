const DISCIPLINE_COLORS: Record<string, { bg: string; text: string }> = {
	건축: {
		bg: "bg-blue-100",
		text: "text-blue-800",
	},
	구조: {
		bg: "bg-red-100",
		text: "text-red-800",
	},
	공조설비: {
		bg: "bg-green-100",
		text: "text-green-800",
	},
	배관설비: {
		bg: "bg-cyan-100",
		text: "text-cyan-800",
	},
	소방: {
		bg: "bg-orange-100",
		text: "text-orange-800",
	},
	설비: {
		bg: "bg-purple-100",
		text: "text-purple-800",
	},
};

export function getDisciplineColor(name: string) {
	return (
		DISCIPLINE_COLORS[name] || {
			bg: "bg-gray-100",
			text: "text-gray-800",
		}
	);
}

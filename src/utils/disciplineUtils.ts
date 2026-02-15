import type { Discipline } from "../type";

export function findDisciplineByName(disciplines: Discipline[], name: string) {
	return disciplines.find((d) => d.name === name);
}

export function isDisciplineAvailable(
	disciplines: Discipline[],
	targetDiscipline: Discipline | null,
): boolean {
	if (!targetDiscipline) return false;
	return disciplines.some((d) => d.name === targetDiscipline.name);
}

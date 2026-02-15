import type { Revision, DrawingDiscipline } from "../type";

export function collectRevisions(discipline: DrawingDiscipline) {
	const revisions: Revision[] = [...(discipline.revisions || [])];

	if (discipline.regions) {
		for (const region of Object.values(discipline.regions)) {
			revisions.push(...region.revisions);
		}
	}

	return revisions;
}

export function getLatestRevision(revisions: Revision[]): Revision | null {
	if (revisions.length === 0) return null;

	return revisions.reduce((latest, current) => {
		const latestDate = new Date(latest.date);
		const currentDate = new Date(current.date);
		return currentDate > latestDate ? current : latest;
	});
}

export function isLatestRevision(
	revision: Revision,
	revisions: Revision[],
): boolean {
	const latest = getLatestRevision(revisions);
	return latest?.version === revision.version;
}

import type { Revision } from "@/type";

export function getLatestRevision(revisions: Revision[]): Revision | null {
	if (revisions.length === 0) return null;
	return revisions.reduce((latest, current) =>
		new Date(current.date) > new Date(latest.date) ? current : latest,
	);
}

export function isLatestRevision(
	revision: Revision,
	revisions: Revision[],
): boolean {
	const latest = getLatestRevision(revisions);
	return latest?.version === revision.version;
}

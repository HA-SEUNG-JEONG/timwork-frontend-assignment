
import { useEffect, useState } from "react";
import type { Metadata, NormalizedDrawing } from "../type";
import { fetchMetadata } from "../parser";
import { normalizeDrawings } from "../normalized";


export function useDrawingData() {
	const [metadata, setMetadata] = useState<Metadata | null>(null);
	const [normalizedData, setNormalizedData] = useState<NormalizedDrawing[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		async function loadData() {
			try {
				setLoading(true);
				const rawData = await fetchMetadata();

				setMetadata(rawData);
				const normalized = normalizeDrawings(rawData);
				setNormalizedData(normalized);
			} catch (err) {
				setError(err as Error);
			} finally {
				setLoading(false);
			}
		}

		loadData();
	}, []);

	return { metadata, normalizedData, loading, error };
}

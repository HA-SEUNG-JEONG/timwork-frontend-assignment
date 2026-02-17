import type { Metadata } from "@/type";

export async function fetchMetadata(): Promise<Metadata> {
	const response = await fetch("/data/metadata.json");
	if (!response.ok) {
		throw new Error("데이터를 불러올 수 없습니다.");
	}
	const data = await response.json();
	return data;
}

export function formatRevisionDate(
  date: string,
  format: "short" | "long" = "short",
) {
  const options: Intl.DateTimeFormatOptions =
    format === "short"
      ? { year: "2-digit", month: "2-digit", day: "2-digit" }
      : { year: "numeric", month: "long", day: "numeric" };

  return new Date(date).toLocaleDateString("ko-KR", options);
}

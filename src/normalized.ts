import type { Drawing, Metadata, NormalizedDrawing } from "./type";


export function normalizeDrawings(metadata: Metadata): NormalizedDrawing[] {
  const drawings = Object.values(metadata.drawings);
  const drawingMap = new Map<string, Drawing>(
    drawings.map((d) => [d.id, { ...d, children: [] }]),
  );

  const rootDrawings: Drawing[] = [];

  for (const drawing of drawings) {
    if (drawing.parent) {
      const parent = drawingMap.get(drawing.parent);
      if (parent) {
        parent.children?.push(drawingMap.get(drawing.id)!);
      }
    } else {
      rootDrawings.push(drawingMap.get(drawing.id)!);
    }
  }

  const convertToNormalized = (
    drawing: Drawing,
  ): NormalizedDrawing => {
    return {
      ...drawing,
      children:
        drawing.children?.map((child) => convertToNormalized(child)) || [],
      disciplines: {}, // Will be populated as needed
    };
  };

  return rootDrawings.map(convertToNormalized);
}
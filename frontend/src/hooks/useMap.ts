import { useMemo, useState } from "react";
import type { MapPoint } from "../types";
export function useMap(points: MapPoint[]) {
  const [selectedId, setSelectedId] = useState<string>();
  const [zoom, setZoom] = useState(1);
  const selected = points.find((point) => point.id === selectedId) || points[0];
  const projected = useMemo(() => {
    if (!points.length) return [];
    const latitudes = points.map((point) => point.coordinates.latitude);
    const longitudes = points.map((point) => point.coordinates.longitude);
    const centerLat = (Math.max(...latitudes) + Math.min(...latitudes)) / 2;
    const centerLng = (Math.max(...longitudes) + Math.min(...longitudes)) / 2;
    const latSpan = Math.max(
      0.025,
      Math.max(...latitudes) - Math.min(...latitudes),
    );
    const lngSpan = Math.max(
      0.025,
      Math.max(...longitudes) - Math.min(...longitudes),
    );
    return points.map((point) => ({
      ...point,
      x: 50 + ((point.coordinates.longitude - centerLng) / lngSpan) * 65 * zoom,
      y: 50 - ((point.coordinates.latitude - centerLat) / latSpan) * 65 * zoom,
    }));
  }, [points, zoom]);
  return {
    selected,
    select: setSelectedId,
    projected,
    zoom,
    zoomIn: () => setZoom((value) => Math.min(2, value + 0.25)),
    zoomOut: () => setZoom((value) => Math.max(0.5, value - 0.25)),
    reset: () => setZoom(1),
  };
}

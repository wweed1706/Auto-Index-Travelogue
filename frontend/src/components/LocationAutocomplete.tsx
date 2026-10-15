import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { divIcon, type LeafletEventHandlerFnMap, type Marker as LeafletMarker } from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { ILocation } from "../types";
import {
  mockLocationProvider,
  type LocationSearchProvider,
} from "../services/locations";
import { MapPin, X } from "./Icons";

const DEFAULT_MAP_CENTER: [number, number] = [16.0471, 108.2062];

const locationMarkerIcon = divIcon({
  className: "",
  html: '<span style="display:block;width:32px;height:32px;border:4px solid white;border-radius:50% 50% 50% 0;background:#0d9488;box-shadow:0 4px 12px rgba(15,23,42,.3);transform:rotate(-45deg)"><span style="display:block;width:8px;height:8px;margin:8px;border-radius:9999px;background:white"></span></span>',
  iconAnchor: [16, 32],
  iconSize: [32, 32],
});

function MapClickHandler({
  disabled,
  onCoordinateChange,
}: {
  disabled: boolean;
  onCoordinateChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(event) {
      if (!disabled) onCoordinateChange(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

function MapFlyTo({ target }: { target: Pick<ILocation, "lat" | "lng"> | null }) {
  const map = useMap();

  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], Math.max(map.getZoom(), 13), {
        duration: 0.8,
      });
    }
  }, [map, target]);

  return null;
}

function DraggableLocationMarker({
  location,
  disabled,
  onCoordinateChange,
}: {
  location: ILocation | null;
  disabled: boolean;
  onCoordinateChange: (lat: number, lng: number) => void;
}) {
  const markerRef = useRef<LeafletMarker | null>(null);
  const eventHandlers = useMemo<LeafletEventHandlerFnMap>(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (!marker) return;
        const position = marker.getLatLng();
        onCoordinateChange(position.lat, position.lng);
      },
    }),
    [onCoordinateChange],
  );

  if (!location) return null;

  return (
    <Marker
      ref={markerRef}
      position={[location.lat, location.lng]}
      icon={locationMarkerIcon}
      draggable={!disabled}
      eventHandlers={eventHandlers}
      alt="Vị trí đã chọn"
      title="Kéo để tinh chỉnh vị trí"
    />
  );
}

function InteractiveMap({
  location,
  focusTarget,
  disabled,
  onCoordinateChange,
  onRemove,
}: {
  location: ILocation | null;
  focusTarget: Pick<ILocation, "lat" | "lng"> | null;
  disabled: boolean;
  onCoordinateChange: (lat: number, lng: number) => void;
  onRemove: () => void;
}) {
  return (
    <div
      role="region"
      aria-label="Bản đồ chọn địa điểm"
      className="relative z-0 mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 animate-in fade-in slide-in-from-top-2 duration-300"
    >
      <div className="h-56 w-full">
        <MapContainer
          center={location ? [location.lat, location.lng] : DEFAULT_MAP_CENTER}
          zoom={location ? 13 : 5}
          minZoom={3}
          maxZoom={19}
          scrollWheelZoom={!disabled}
          dragging={!disabled}
          doubleClickZoom={!disabled}
          touchZoom={!disabled}
          boxZoom={!disabled}
          keyboard={!disabled}
          zoomControl
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler disabled={disabled} onCoordinateChange={onCoordinateChange} />
          <MapFlyTo target={focusTarget} />
          <DraggableLocationMarker
            location={location}
            disabled={disabled}
            onCoordinateChange={onCoordinateChange}
          />
        </MapContainer>
      </div>
      <div className="flex items-start justify-between gap-3 border-t border-slate-200 bg-white px-3.5 py-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-slate-700">
            {location?.name || "Nhấp vào bản đồ để chọn vị trí"}
          </p>
          <p className="mt-1 truncate text-[11px] text-slate-500">
            {location
              ? location.address || `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`
              : "Bạn có thể phóng to, kéo bản đồ và đặt ghim ở bất kỳ đâu."}
          </p>
        </div>
        {location && (
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Xóa vị trí
          </button>
        )}
      </div>
    </div>
  );
}

export default function LocationAutocomplete({
  value,
  onChange,
  disabled = false,
  provider = mockLocationProvider,
}: {
  value: ILocation | null;
  onChange: (location: ILocation | null) => void;
  disabled?: boolean;
  provider?: LocationSearchProvider;
}) {
  const id = useId();
  const [query, setQuery] = useState(value?.name ?? "");
  const [suggestions, setSuggestions] = useState<ILocation[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [focusTarget, setFocusTarget] = useState<Pick<ILocation, "lat" | "lng"> | null>(null);

  useEffect(() => {
    if (value) setQuery(value.name);
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    setLoading(true);
    void provider
      .search(query, controller.signal)
      .then((items) => {
        setSuggestions(items);
        setActiveIndex(0);
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError"))
          setSuggestions([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [open, provider, query]);

  const select = (location: ILocation) => {
    setQuery(location.name);
    onChange(location);
    setFocusTarget({ lat: location.lat, lng: location.lng });
    setOpen(false);
  };
  const clear = () => {
    setQuery("");
    onChange(null);
    setFocusTarget(null);
    setOpen(false);
  };
  const updateFromMap = useCallback(
    (lat: number, lng: number) => {
      const normalizedLat = Number(lat.toFixed(6));
      const normalizedLng = Number(lng.toFixed(6));
      const coordinateLabel = `Tọa độ đã chọn: ${normalizedLat.toFixed(5)}, ${normalizedLng.toFixed(5)}`;
      setQuery(coordinateLabel);
      onChange({
        name: coordinateLabel,
        address: coordinateLabel,
        lat: normalizedLat,
        lng: normalizedLng,
      });
      setOpen(false);
    },
    [onChange],
  );

  return (
    <div className="min-w-0 text-xs font-medium text-slate-600">
      <label htmlFor={id}>Địa điểm</label>
      <div
        className="relative mt-2"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
        }}
      >
        <MapPin aria-hidden="true" className="pointer-events-none absolute left-3.5 top-3.5 z-10 h-4 w-4 text-slate-400" />
        <input
          id={id}
          required
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={`${id}-options`}
          aria-activedescendant={open && suggestions[activeIndex] ? `${id}-option-${activeIndex}` : undefined}
          disabled={disabled}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            onChange(null);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              setOpen(true);
              setActiveIndex((current) =>
                suggestions.length
                  ? (current + (event.key === "ArrowDown" ? 1 : -1) + suggestions.length) % suggestions.length
                  : 0,
              );
            } else if (event.key === "Enter" && open && suggestions[activeIndex]) {
              event.preventDefault();
              select(suggestions[activeIndex]);
            } else if (event.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder="Tìm thành phố hoặc địa điểm"
          className="input !mt-0 !pl-10 !pr-10"
        />
        {(query || value) && (
          <button
            type="button"
            onClick={clear}
            aria-label="Xóa nội dung địa điểm"
            className="absolute right-2.5 top-2.5 z-10 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {open && (
          <div
            id={`${id}-options`}
            role="listbox"
            className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
          >
            {loading ? (
              <p className="px-3 py-3 text-xs font-normal text-slate-500">Đang tìm địa điểm…</p>
            ) : suggestions.length ? (
              suggestions.map((location, index) => (
                <button
                  key={location.placeId || `${location.lat}:${location.lng}`}
                  id={`${id}-option-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => select(location)}
                  className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${index === activeIndex ? "bg-teal-50" : "hover:bg-slate-50"}`}
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-medium text-slate-700">{location.name}</span>
                    <span className="mt-0.5 block truncate text-[11px] font-normal text-slate-500">{location.address}</span>
                  </span>
                </button>
              ))
            ) : (
              <p className="px-3 py-3 text-xs font-normal text-slate-500">Không tìm thấy trong dữ liệu mẫu.</p>
            )}
          </div>
        )}
      </div>
      <InteractiveMap
        location={value}
        focusTarget={focusTarget}
        disabled={disabled}
        onCoordinateChange={updateFromMap}
        onRemove={clear}
      />
    </div>
  );
}

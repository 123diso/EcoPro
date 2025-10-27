// src/components/Map/LeafletMap.tsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { LatLngExpression, Icon } from "leaflet";
import { useEffect } from "react";
import type { DandiPoint } from "../../types";

// Icono Dandi
const dandiIcon: Icon = new L.Icon({
  iconUrl: "/imgMap/pin-dandi.png",
  iconSize: [60, 60],
  iconAnchor: [30, 60],
  popupAnchor: [0, -50],
});

// Helpers
const valid = (p: DandiPoint) =>
  Number.isFinite(p.lat) && Number.isFinite(p.lng);

// Ajusta bounds salvo que esté deshabilitado (p.ej. cuando hay un seleccionado)
function FitToPoints({
  points,
  fallback,
  disabled,
}: {
  points: DandiPoint[];
  fallback: LatLngExpression;
  disabled?: boolean;
}) {
  const map = useMap();
  useEffect(() => {
    if (disabled) return;

    const valids = points.filter(valid);
    if (valids.length === 0) {
      map.setView(fallback, 12);
      return;
    }
    if (valids.length === 1) {
      map.setView([valids[0].lat, valids[0].lng], 15);
      return;
    }
    const bounds = L.latLngBounds(
      valids.map((p) => [p.lat, p.lng] as [number, number])
    );
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [points, fallback, disabled, map]);

  return null;
}

function ZoomToPoint({ point }: { point: DandiPoint | null }) {
  const map = useMap();
  useEffect(() => {
    if (point) {
      map.flyTo([point.lat, point.lng], 16, { duration: 1.2 });
    }
  }, [point, map]);
  return null;
}

// ✅ Marcador sin `any`, usando useMap()
function ClickableMarker({ p }: { p: DandiPoint }) {
  const map = useMap();
  return (
    <Marker
      position={[p.lat, p.lng] as LatLngExpression}
      icon={dandiIcon}
      eventHandlers={{
        click: () => {
          map.flyTo([p.lat, p.lng], 16, { duration: 1 });
        },
      }}
    >
      <Popup>
        <strong>{p.name}</strong>
      </Popup>
    </Marker>
  );
}

export default function LeafletMap({
  points,
  selectedPoint = null,
  initialCenter = { lat: 3.405, lng: -76.538 },
  initialZoom = 13,
  children,
}: {
  points: DandiPoint[];
  selectedPoint?: DandiPoint | null;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  children?: React.ReactNode;
}) {
  const center: LatLngExpression = [initialCenter.lat, initialCenter.lng];
  const valids = points.filter(valid);

  return (
    <MapContainer
      center={center}
      zoom={initialZoom}
      style={{ width: "100%", height: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
      />

      <FitToPoints
        points={valids}
        fallback={center}
        disabled={!!selectedPoint}
      />
      <ZoomToPoint point={selectedPoint} />

      {valids.map((p) => (
        <ClickableMarker key={p.id} p={p} />
      ))}

      {children /* <UserLocationMarker /> */}
    </MapContainer>
  );
}

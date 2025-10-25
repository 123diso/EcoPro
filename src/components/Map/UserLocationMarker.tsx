// src/components/Map/UserLocationMarker.tsx
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const userIcon = new L.Icon({
  iconUrl: "/imgMap/user-pin.png", // tu asset
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

export default function UserLocationMarker() {
  const map = useMap();

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const here = L.latLng(latitude, longitude);

        L.marker(here, { icon: userIcon })
          .addTo(map)
          .bindPopup("📍 Estás aquí")
          .openPopup();

        // centra/zoomea al usuario sin perder los puntos
        map.setView(here, Math.max(map.getZoom(), 14));
      },
      (err) => {
        // opcional: manejo de error
        console.warn("No se pudo obtener ubicación:", err.message);
      }
    );
  }, [map]);

  return null;
}

// src/pages/PuntoDetalle/PuntoDetalle.tsx
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { DandiPoint, SuggestedItem } from "../../types";
import pointsData from "../../assets/dandiPoints.json";
import suggestedRaw from "../../assets/suggestedItems.json";
import LeafletMap from "../../components/Map/LeafletMap";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "./PuntoDetalle.css";
import { useAllProducts } from "../../context/AllProductsContext";

// Datos estáticos
const allPoints: DandiPoint[] = pointsData as DandiPoint[];
const suggested: SuggestedItem[] = suggestedRaw as SuggestedItem[];

// ---------- Popup estilizado sobre Leaflet ----------
function SelectedPopup({ point }: { point: DandiPoint }) {
  const map = useMap();

  useEffect(() => {
    const popup = L.popup({
      className: "dandi-popup",
      closeButton: false,
      autoPan: true,
      offset: L.point(0, -20),
    })
      .setLatLng([point.lat, point.lng])
      .setContent(
        `<div class="dandi-pop">
           <div class="dandi-pop__title">${point.name}</div>
           <div class="dandi-pop__meta">
             +${point.newPosts} Publicaciones nuevas<br/>
             +${point.activeUsers} Usuarios activos
           </div>
           <div class="dandi-pop__badge">${point.distance}</div>
         </div>`
      );

    popup.openOn(map);
    return () => {
      map.closePopup(popup);
    };
  }, [map, point]);

  return null;
}

export default function PuntoDetalle() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Productos reales desde el contexto
  const { allProducts } = useAllProducts();

  // Punto Dandi actual
  const point = allPoints.find((p) => String(p.id) === id);

  // Trueques reales asociados a este punto
  const tradesForPoint = useMemo(() => {
    if (!point) return [];

    const norm = (s: string) =>
      s
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase();

    const pointName = norm(point.name);

    return allProducts.filter((p) => {
      if (!p.location) return false;
      const loc = norm(p.location);
      // Coincidencia flexible entre nombre del punto y location del producto
      return loc.includes(pointName) || pointName.includes(loc);
    });
  }, [allProducts, point]);

  // Si el punto no existe, salimos
  if (!point) {
    return (
      <main className="punto-layout">
        <section className="punto-left">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ↩ Volver
          </button>
          <p>Punto no encontrado.</p>
        </section>
        <section className="punto-right" />
      </main>
    );
  }

  return (
    <main className="punto-layout">
      {/* Columna izquierda */}
      <section className="punto-left">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <h2 className="punto-title">Punto Dandi: {point.name}</h2>

        <h3 className="block-title">Recomendado para ti</h3>
        <div className="grid-reco">
          {suggested.slice(0, 4).map((item: SuggestedItem, i: number) => (
            <div className="reco-card" key={item.id ?? i}>
              <img
                src={item.image}
                alt={item.title ?? item.name ?? "Recomendado"}
              />
            </div>
          ))}
        </div>

        <h3 className="block-title">Todos los trueques</h3>
        <div className="grid-trueques">
          {tradesForPoint.length === 0 && (
            <p>No hay trueques registrados en este punto todavía.</p>
          )}

          {tradesForPoint.map((t) => (
            <div className="trade-card" key={t.id}>
              <img src={t.image} alt={t.title} />
              <div className="trade-title">{t.title}</div>
              <div className="trade-meta">Estado: {t.condition}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Columna derecha: mapa solo con este punto */}
      <section className="punto-right">
        <div className="punto-map-wrapper">
          <LeafletMap points={[point]} selectedPoint={point}>
            <SelectedPopup point={point} />
          </LeafletMap>

          {/* Mensaje "tienda cerca" sobre el mapa */}
          <div className="store-near-popup">Esta tienda queda cerca de ti</div>
        </div>
      </section>
    </main>
  );
}

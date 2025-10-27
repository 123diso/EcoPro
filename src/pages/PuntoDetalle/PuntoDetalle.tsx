// src/pages/PuntoDetalle/PuntoDetalle.tsx
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { DandiPoint, SuggestedItem, TradeItem } from "../../types";
import pointsData from "../../assets/dandiPoints.json";
import suggestedRaw from "../../assets/suggestedItems.json";
import tradesRaw from "../../assets/tradesItems.json";
import LeafletMap from "../../components/Map/LeafletMap";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "./PuntoDetalle.css";

const allPoints: DandiPoint[] = pointsData as DandiPoint[];
const suggested: SuggestedItem[] = suggestedRaw as SuggestedItem[];
const trades: TradeItem[] = tradesRaw as TradeItem[];

// ---------- Popup estilizado sobre Leaflet ----------
function SelectedPopup({ point }: { point: DandiPoint }) {
  const map = useMap();

  useMemo(() => {
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
           <div class="dandi-pop__meta">+${point.newPosts} Publicaciones nuevas<br/>+${point.activeUsers} Usuarios activos</div>
           <div class="dandi-pop__badge">${point.distance}</div>
         </div>`
      );

    popup.openOn(map);
    return () => map.closePopup(popup);
  }, [map, point]);

  return null;
}

export default function PuntoDetalle() {
  const navigate = useNavigate();
  const { id } = useParams();

  const point = allPoints.find((p) => String(p.id) === id);
  const nearby = allPoints.filter((p) => String(p.id) !== id);

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
          {trades.slice(0, 9).map((t: TradeItem, i: number) => (
            <div className="trade-card" key={t.id ?? i}>
              <img src={t.image} alt={t.title ?? "Trueque"} />
              <div className="trade-title">{t.title ?? "Item"}</div>
              {t.available !== undefined && (
                <div className="trade-meta">
                  <span>Disponible: {t.available}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Columna derecha: mapa con el punto seleccionado y cercanos */}
      <section className="punto-right">
        <LeafletMap points={[point, ...nearby]} selectedPoint={point}>
          <SelectedPopup point={point} />
        </LeafletMap>
      </section>
    </main>
  );
}

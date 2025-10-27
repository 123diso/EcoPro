// src/components/PointCard/PointCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import "./PointCard.css";
import type { DandiPoint } from "../../types";

type Props = {
  point: DandiPoint;
  onFly?: () => void; // para que el lado derecho haga flyTo
};

const PointCard: React.FC<Props> = ({ point, onFly }) => {
  const isNearby = point.type === "nearby";

  return (
    <article
      className={`point ${isNearby ? "point--nearby" : "point--regular"}`}
    >
      {/* ZONA IZQUIERDA: navega a detalle */}
      <Link
        to={`/punto/${point.id}`}
        className="point__left"
        aria-label={`Ver detalles de ${point.name}`}
      >
        <img
          className="point__logo"
          src={point.logo}
          alt={point.name}
          loading="lazy"
        />
        <div className="point__text">
          <h3 className="point__title">{point.name}</h3>
          <div className="point__meta">
            <span>+{point.newPosts} Publicaciones nuevas</span>
            <span className="dot">•</span>
            <span>+{point.activeUsers} Usuarios activos</span>
          </div>
        </div>
      </Link>

      {/* ZONA DERECHA: hace flyTo en el mapa */}
      <button
        type="button"
        className="point__right"
        aria-label={`Centrar mapa en ${point.name} (${point.distance})`}
        onClick={onFly}
      >
        <img
          className="point__pin"
          src={point.pin ?? "/imgMap/distance.png"}
          alt=""
          loading="lazy"
        />
        <span className="point__distance">{point.distance}</span>
      </button>
    </article>
  );
};

export default PointCard;

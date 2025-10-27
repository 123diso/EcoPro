// src/pages/Map/MapPage.tsx
import React, { useMemo, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import PointCard from "../../components/PointCard/PointCard";
import Button from "../../components/Button/Button";
import type { DandiPoint } from "../../types";
import pointsData from "../../assets/dandiPoints.json";
import LeafletMap from "../../components/Map/LeafletMap";
import UserLocationMarker from "../../components/Map/UserLocationMarker";
import "./map.css";

const allPoints: DandiPoint[] = pointsData as DandiPoint[];

const MapPage: React.FC = () => {
  const [q, setQ] = useState("");
  const [selectedPoint, setSelectedPoint] = useState<DandiPoint | null>(null);

  const nearby = useMemo(
    () =>
      allPoints.filter(
        (p) =>
          p.type === "nearby" && p.name.toLowerCase().includes(q.toLowerCase())
      ),
    [q]
  );

  const regular = useMemo(
    () =>
      allPoints.filter(
        (p) =>
          p.type === "regular" && p.name.toLowerCase().includes(q.toLowerCase())
      ),
    [q]
  );

  const visiblePoints = useMemo(
    () => [...nearby, ...regular],
    [nearby, regular]
  );

  return (
    <main className="map-layout">
      <section className="map-left">
        <SearchBar onSearch={setQ} placeholder="Buscar punto Dandi..." />

        {nearby.length > 0 && (
          <div className="map-section">
            <h2 className="map-section__title">Puntos Dandi cercanos</h2>
            {nearby.map((p) => (
              <PointCard
                key={p.id}
                point={p}
                onFly={() => setSelectedPoint(p)}
              />
            ))}
          </div>
        )}

        <div className="map-section">
          <div className="map-section__header">
            <h2 className="map-section__title">Puntos Dandi</h2>
            <Button to="/puntos">sur</Button>
          </div>
          {regular.map((p) => (
            <PointCard key={p.id} point={p} onFly={() => setSelectedPoint(p)} />
          ))}
        </div>
      </section>

      <section className="map-right">
        <LeafletMap points={visiblePoints} selectedPoint={selectedPoint}>
          <UserLocationMarker />
        </LeafletMap>
      </section>
    </main>
  );
};

export default MapPage;

// src/pages/Map/MapPage.tsx
import React, { useMemo, useState, useEffect } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import PointCard from "../../components/PointCard/PointCard";
import Button from "../../components/Button/Button";
import type { DandiPoint } from "../../types";
import pointsData from "../../assets/dandiPoints.json";
import LeafletMap from "../../components/Map/LeafletMap";
import UserLocationMarker from "../../components/Map/UserLocationMarker";
import { useUserProducts } from "../../context/UserProductsContext"; // 👈 USAR ESTE
import "./map.css";

const allPoints: DandiPoint[] = pointsData as DandiPoint[];

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

const MapPage: React.FC = () => {
  const [q, setQ] = useState("");
  const [selectedPoint, setSelectedPoint] = useState<DandiPoint | null>(null);

  // 👈 AHORA USAS SOLO LOS TRUEQUES DEL USUARIO ACTUAL
  const { userProducts, fetchUserProducts } = useUserProducts();

  // 🔥 IMPORTANTE: cargar los trueques del usuario cuando entras al mapa
  useEffect(() => {
    fetchUserProducts();
  }, [fetchUserProducts]);

  // 1️⃣ Tiendas donde ESTE USUARIO tiene trueques
  const usedLocations = useMemo(() => {
    const set = new Set<string>();
    userProducts.forEach((p) => {
      if (p.location) set.add(p.location);
    });
    return Array.from(set);
  }, [userProducts]);

  // 2️⃣ PUNTOS VERDES = puntos donde este usuario tiene trueques
  const nearby = useMemo(() => {
    const qNorm = q.toLowerCase();

    return allPoints.filter((p) => {
      const nameNorm = normalize(p.name);

      const isUsedByThisUser = usedLocations.some((loc) => {
        const locNorm = normalize(loc);

        // coincide si uno contiene al otro
        return (
          locNorm === nameNorm ||
          locNorm.includes(nameNorm) ||
          nameNorm.includes(locNorm)
        );
      });

      return isUsedByThisUser && p.name.toLowerCase().includes(qNorm);
    });
  }, [usedLocations, q]);

  // 3️⃣ LISTA NARANJA = TODOS LOS PUNTOS
  const allFiltered = useMemo(() => {
    const qNorm = q.toLowerCase();
    return allPoints.filter((p) => p.name.toLowerCase().includes(qNorm));
  }, [q]);

  // 4️⃣ El mapa ve todos
  const visiblePoints = allFiltered;

  return (
    <main className="map-layout">
      <section className="map-left">
        <SearchBar onSearch={setQ} placeholder="Buscar punto Dandi..." />

        {/* 💚 PUNTOS VERDES: solo mis trueques */}
        {nearby.length > 0 && (
          <div className="map-section">
            <h2 className="map-section__title">Puntos Dandi cercanos</h2>
            {nearby.map((p) => (
              <PointCard
                key={p.id}
                point={p}
                variant="nearby" // 💚 fuerza verde
                onFly={() => setSelectedPoint(p)}
              />
            ))}
          </div>
        )}

        {/* 🧡 PUNTOS NARANJA: todos los puntos */}
        <div className="map-section">
          <div className="map-section__header">
            <h2 className="map-section__title">Puntos Dandi</h2>
            <Button to="/puntos">sur</Button>
          </div>

          {allFiltered.map((p) => (
            <PointCard
              key={p.id}
              point={p}
              variant="regular" // 🧡 fuerza naranja
              onFly={() => setSelectedPoint(p)}
            />
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

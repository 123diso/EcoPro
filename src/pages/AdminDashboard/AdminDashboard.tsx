import React, { useEffect, useState } from "react";
import styles from "./AdminDashboard.module.css";
import type { UserProduct } from "../../context/UserProductsContext";
import { getAllProducts, deleteProductById } from "../../services/adminService";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

/* Reportes fake */
interface Report {
  id: string;
  title: string;
  user: string;
  status: "Pendiente" | "Resuelto";
  description: string;
}

/* Trueques reales de la tabla SUPABASE */
interface Trade {
  id: string;
  product_offer_id: string;
  product_receive_id: string;
  offering_user_id: string;
  receiving_user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<UserProduct[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* Obtener trueques reales */
  const fetchTrades = async () => {
    const { data, error } = await supabase.from("trades").select("*");

    if (!error && data) {
      setTrades(data as Trade[]);
    } else {
      setTrades([]);
    }
  };

  /* Cambiar estado */
  const updateTradeStatus = async (tradeId: string, newStatus: string) => {
    await supabase.from("trades").update({ status: newStatus }).eq("id", tradeId);
    fetchTrades();
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllProducts();
      setProducts(data);

      await fetchTrades();

      /* Fake reports */
      setReports([
        {
          id: "r1",
          title: "Producto duplicado",
          user: "María Gómez",
          status: "Pendiente",
          description: "Se registró dos veces el mismo artículo en el sistema.",
        },
        {
          id: "r2",
          title: "Imagen inapropiada",
          user: "Juan Pérez",
          status: "Resuelto",
          description: "Se cambió la imagen de un producto con contenido inadecuado.",
        },
      ]);

      setLoading(false);
    };

    fetchData();
  }, []);

  /* 🗑 Eliminar producto */
  const handleDelete = async (id: string) => {
    const ok = window.confirm("¿Eliminar este producto?");
    if (!ok) return;

    const success = await deleteProductById(id);
    if (success) setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  /* Cambiar estado de reporte */
  const toggleReportStatus = (id: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === "Pendiente" ? "Resuelto" : "Pendiente" }
          : r
      )
    );
  };

  if (loading) return <main style={{ padding: 24 }}>Cargando...</main>;

  /* Trueque quemado si no hay registros en Supabase */
  const tradesToShow =
    trades.length > 0
      ? trades
      : [
          {
            id: "demo1234",
            product_offer_id: "prodA123",
            product_receive_id: "prodB999",
            offering_user_id: "user111",
            receiving_user_id: "user222",
            status: "pendiente",
            created_at: "2025-02-10",
            updated_at: "2025-02-10",
          },
        ];

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Valle de Lili</h1>
        <p>Panel de administración</p>
      </header>

      {/* Estadísticas */}
      <section className={styles.statsPanel}>
        <div className={styles.statCard}>
          Trueques activos <span>{tradesToShow.length}</span>
        </div>
        <div className={styles.statCard}>Artículos próximos <span>5</span></div>
        <div className={styles.statCard}>Reportes <span>{reports.length}</span></div>
      </section>

      {/* TRUEQUES REALES */}
      <section className={styles.reportsSection}>
        <h3>Trueques registrados</h3>

        <div className={styles.tradeList}>
          {tradesToShow.map((t) => (
            <div key={t.id} className={styles.tradeCard}>
              <div className={styles.tradeInfo}>
                <h4>Trueque #{t.id.slice(0, 8)}</h4>

                <p><strong>Producto entregado:</strong> {t.product_offer_id}</p>
                <p><strong>Producto recibido:</strong> {t.product_receive_id}</p>

                <p><strong>Usuario A:</strong> {t.offering_user_id}</p>
                <p><strong>Usuario B:</strong> {t.receiving_user_id}</p>

                <p><strong>Estado:</strong> {t.status}</p>
              </div>

              <div className={styles.tradeActions}>
                <select
                  value={t.status}
                  onChange={(e) => updateTradeStatus(t.id, e.target.value)}
                  className={styles.tradeSelect}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_proceso">En proceso</option>
                  <option value="finalizado">Finalizado</option>
                  <option value="cancelado">Cancelado</option>
                </select>

                <button
                  className={styles.tradeButton}
                  onClick={() => navigate(`/trade/${t.id}`)}
                >
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTOS */}
      <section className={styles.reportsSection}>
        <h3>Productos registrados</h3>

        <div className={styles.productList}>
          {products.map((p) => (
            <div key={p.id} className={styles.productCard}>
              <img
                src={p.image || "/img-placeholder.png"}
                alt={p.title}
                className={styles.productImage}
              />
              <div className={styles.productInfo}>
                <h4>{p.title}</h4>
                <p>{p.category}</p>
                <small>{p.description}</small>
              </div>
              <button
                onClick={() => handleDelete(String(p.id))}
                className={styles.deleteBtn}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* REPORTES */}
      <section className={styles.reportSection}>
        <h3>Reportes de usuarios</h3>

        <div className={styles.reportList}>
          {reports.map((r) => (
            <div
              key={r.id}
              className={`${styles.reportCard} ${
                r.status === "Pendiente"
                  ? styles.reportPending
                  : styles.reportResolved
              }`}
            >
              <div>
                <h4>{r.title}</h4>
                <p><strong>Usuario:</strong> {r.user}</p>
                <small>{r.description}</small>
              </div>

              <div className={styles.reportActions}>
                <span className={styles.reportStatus}>{r.status}</span>
                <button
                  onClick={() => toggleReportStatus(r.id)}
                  className={styles.resolveBtn}
                >
                  {r.status === "Pendiente" ? "Marcar como resuelto" : "Reabrir reporte"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;

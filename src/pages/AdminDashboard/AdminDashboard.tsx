import React, { useEffect, useState } from "react";
import styles from "./AdminDashboard.module.css";
import type { UserProduct } from "../../context/UserProductsContext";
import { getAllProducts, deleteProductById } from "../../services/adminService";

interface Report {
  id: string;
  title: string;
  user: string;
  status: "Pendiente" | "Resuelto";
  description: string;
}

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<UserProduct[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllProducts();
      setProducts(data);

      // Simulación de reportes (puedes luego conectarlo a Supabase)
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
          description:
            "Se cambió la imagen de un producto con contenido no permitido.",
        },
        {
          id: "r3",
          title: "Título confuso",
          user: "Ana Torres",
          status: "Pendiente",
          description:
            "El nombre del producto no describe correctamente el artículo.",
        },
      ]);

      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("¿Estás seguro de eliminar este producto?");
    if (!confirmed) return;

    const success = await deleteProductById(id);
    if (success) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert("Error al eliminar el producto.");
    }
  };

  const toggleReportStatus = (id: string) => {
    setReports((prevReports) =>
      prevReports.map((r) =>
        r.id === id
          ? {
              ...r,
              status: r.status === "Pendiente" ? "Resuelto" : "Pendiente",
            }
          : r
      )
    );
  };

  if (loading) return <main style={{ padding: 24 }}>Cargando productos...</main>;

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Valle de Lili</h1>
        <p>Panel de administración</p>
      </header>

      {/* Estadísticas */}
      <section className={styles.statsPanel}>
        <div className={styles.statCard}>
          Trueques activos <span>15</span>
        </div>
        <div className={styles.statCard}>
          Artículos próximos <span>5</span>
        </div>
        <div className={styles.statCard}>
          Reportes <span>{reports.length}</span>
        </div>
      </section>

      {/* Acciones principales */}
      <div className={styles.mainAction}>
        <button>Registrar nuevo trueque</button>
      </div>

      {/* Alertas */}
      <section className={styles.alertsSection}>
        <h2>Notificaciones y alertas</h2>

        <div className={styles.alertCard}>
          <div className={styles.alertInfo}>
            <strong>Revisión inmediata</strong>
            <p>Trueque de Juan Pérez necesita atención urgente</p>
          </div>
          <button className={styles.alertButton}>Ver más</button>
        </div>

        <div className={`${styles.alertCard} ${styles.warning}`}>
          <div className={`${styles.alertInfo} ${styles.warning}`}>
            <strong>Vencimiento próximo</strong>
            <p>El trueque de “Lámpara de escritorio” está por vencer</p>
          </div>
          <button className={styles.alertButton}>Ver más</button>
        </div>
      </section>

      {/* Productos */}
      <section className={styles.reportsSection}>
        <h3>Productos registrados</h3>
        <div className={styles.productList}>
          {products.length === 0 ? (
            <p>No hay productos registrados.</p>
          ) : (
            products.map((p) => (
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
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(p.id)}
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Reportes */}
      <section className={styles.reportSection}>
        <h3>Reportes de usuarios</h3>
        <div className={styles.reportList}>
          {reports.map((r) => (
            <div
              key={r.id}
              className={`${styles.reportCard} ${
                r.status === "Pendiente" ? styles.reportPending : styles.reportResolved
              }`}
            >
              <div>
                <h4>{r.title}</h4>
                <p>
                  <strong>Usuario:</strong> {r.user}
                </p>
                <small>{r.description}</small>
              </div>

              <div className={styles.reportActions}>
                <span className={styles.reportStatus}>{r.status}</span>
                <button
                  onClick={() => toggleReportStatus(r.id)}
                  className={styles.resolveBtn}
                >
                  {r.status === "Pendiente"
                    ? "Marcar como resuelto"
                    : "Reabrir reporte"}
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

import React from "react";
import "./AdminDashboard.css";

const AdminDashboard: React.FC = () => {
  const branchName = "Valle de Lili";
  const userName = "Juan Pérez";
  const stats = {
    activeTrades: 15,
    upcomingItems: 5,
    unresolvedReports: 4,
  };
  const alerts = [
    {
      id: 1,
      type: "urgente",
      title: "Revisión inmediata",
      message: "Trueque de Juan Pérez necesita atención urgente",
    },
    {
      id: 2,
      type: "vencimiento",
      title: "Vencimiento próximo",
      message:
        'El trueque de "lámpara de escritorio" está próximo a cumplir su tiempo',
    },
  ];

  return (
    <div className="admin-dashboard">
      <header className="header">
        <h2>Bienvenido a tu sucursal...</h2>
        <div className="branch-info">
          <h1>{branchName}</h1>
          <p>Administrador: {userName}</p>
        </div>
      </header>

      <section className="panel">
        <h3>Panel de administración</h3>
        <div className="stats-container">
          <div className="stat">
            <h4>Trueques activos</h4>
            <span>{stats.activeTrades}</span>
          </div>
          <div className="stat">
            <h4>Artículos próximos a vencer</h4>
            <span>{stats.upcomingItems}</span>
          </div>
          <div className="stat">
            <h4>Reportes sin resolver</h4>
            <span>{stats.unresolvedReports}</span>
          </div>
        </div>

        <button className="register-button">
          Registra e inicia procesos de trueques aquí →
        </button>
      </section>

      <section className="alerts">
        <h3>Notificaciones y alertas</h3>
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`alert ${
              alert.type === "urgente" ? "urgent" : "warning"
            }`}
          >
            <div>
              <strong>{alert.title}</strong>
              <p>{alert.message}</p>
            </div>
            <button className="view-more">Ver más →</button>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AdminDashboard;

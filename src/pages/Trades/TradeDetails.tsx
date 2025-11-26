import React from "react";
import "./TradeDetails.css";
import { useParams, useNavigate } from "react-router-dom";

const TradeDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Datos quemados temporales
  const trade = {
    id,
    status: "Completado",
    created_at: "2025/07/15",
    updated_at: "2025/07/17",

    productA: {
      title: "Saga Harry Potter",
      image:
        "https://m.media-amazon.com/images/I/81YOuOGFCJL._AC_UF1000,1000_QL80_.jpg",
      category: "Entretenimiento",
      condition: "Pocos usos",
    },

    productB: {
      title: "Saga Jujutsu Kaisen",
      image:
        "https://cloudfront-us-east-1.images.arcpublishing.com/infobae/ZNM3FD5M2JEKLACQZ447CYBLRE.webp",
      category: "Entretenimiento",
      condition: "Pocos usos",
    },

    users: [
      {
        name: "Laura Sánchez",
        rating: "4.9 / 5",
        avatar: "https://i.pravatar.cc/150?img=47",
      },
      {
        name: "Diego Hernández",
        rating: "4.5 / 5",
        avatar: "https://i.pravatar.cc/150?img=56",
      },
    ],
  };

  const timeline = [
    { title: "Solicitud iniciada", date: "2025/07/15", hour: "10:00 AM" },
    {
      title: "Espera de llegada de productos",
      date: "2025/07/15",
      hour: "11:30 PM",
    },
    {
      title: "Productos en sucursal",
      date: "2025/07/15",
      hour: "11:38 PM",
    },
    {
      title: "Aprobación trueque",
      date: "2025/07/15",
      hour: "1:30 PM",
    },
    {
      title: "Aviso a usuarios",
      date: "2025/07/15",
      hour: "11:30 PM",
    },
    {
      title: "Trueque completado",
      date: "2025/07/15",
      hour: "11:30 PM",
    },
  ];

  return (
    <div className="trade-wrapper">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ←
      </button>

      <h1 className="page-title">Detalles del trueque</h1>

      <div className="columns-wrapper">
        {/* COLUMNA IZQUIERDA */}
        <div className="left-column">
          <div className="summary-card">
            <h2>Resumen del trueque</h2>

            <div className="summary-row">
              <span>ID del trueque</span>
              <strong>#{trade.id}</strong>
            </div>

            <div className="summary-row">
              <span>Estado</span>
              <strong className="status approved">✔ Completado</strong>
            </div>

            <div className="summary-row">
              <span>Fecha de creación</span>
              <strong>{trade.created_at}</strong>
            </div>

            <div className="summary-row">
              <span>Última actualización</span>
              <strong>{trade.updated_at}</strong>
            </div>
          </div>

          <h2 className="section-title">Productos a Intercambiar</h2>

          <div className="products-grid">
            <div className="product-card">
              <img src={trade.productA.image} alt="" />
              <h3>{trade.productA.title}</h3>
              <small>{trade.productA.category}</small>
              <p>{trade.productA.condition}</p>
            </div>

            <div className="product-card">
              <img src={trade.productB.image} alt="" />
              <h3>{trade.productB.title}</h3>
              <small>{trade.productB.category}</small>
              <p>{trade.productB.condition}</p>
            </div>
          </div>

          <h2 className="section-title">Usuarios involucrados</h2>

          <div className="users-grid">
            {trade.users.map((u, i) => (
              <div key={i} className="user-card">
                <img src={u.avatar} className="avatar" />
                <div>
                  <h4>{u.name}</h4>
                  <small>{u.rating}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA — HISTORIAL */}
        <div className="right-column">
          <div className="timeline-card">
            <h2>Historial del trueque</h2>

            <div className="timeline">
              {timeline.map((t, i) => (
                <div key={i} className="timeline-item">
                  <div className="dot" />
                  <div>
                    <h4>{t.title}</h4>
                    <p>{t.date}</p>
                    <small>{t.hour}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeDetails;

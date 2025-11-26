import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./TradeDetails.css"; // ← IMPORTANTE

const TradeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trade, setTrade] = useState<any>(null);

  const fetchTrade = async () => {
    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .eq("product_id", id)
      .single();

    if (!error) setTrade(data);
  };

  useEffect(() => {
    fetchTrade();
  }, []);

  if (!trade) return <p>Cargando...</p>;

  return (
    <div className="trade-details-page">
      <h2 className="trade-details-title">
        <span onClick={() => navigate(-1)}>←</span>
        Detalles del trueque
      </h2>

      <div className="trade-details-grid">
        {/* Resumen */}
        <div className="trade-summary-box">
          <h3>Resumen del Trueque</h3>

          <div className="trade-summary-item">
            <span>ID del trueque</span>
            <span>#{trade.product_id}</span>
          </div>

          <div className="trade-summary-item">
            <span>Estado</span>
            <span>
              {trade.status} <span className="trade-status-icon"></span>
            </span>
          </div>

          <div className="trade-summary-item">
            <span>Fecha de creación</span>
            <span>{trade.timestamp}</span>
          </div>

          <div className="trade-summary-item">
            <span>Última actualización</span>
            <span>{trade.updated_at || trade.timestamp}</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="trade-timeline-box">
          <h3>Historial del Trueque</h3>

          <div className="timeline-list">
            <div className="timeline-item">
              <p className="timeline-item-title">Solicitud iniciada</p>
              <p className="timeline-item-date">{trade.timestamp}</p>
            </div>

            <div className="timeline-item">
              <p className="timeline-item-title">En proceso</p>
              <p className="timeline-item-date">—</p>
            </div>

            <div className="timeline-item">
              <p className="timeline-item-title">Aprobación</p>
              <p className="timeline-item-date">—</p>
            </div>

            <div className="timeline-item">
              <p className="timeline-item-title">Trueque completado</p>
              <p className="timeline-item-date">—</p>
            </div>
          </div>
        </div>
      </div>

      {/* Productos */}
      <div className="trade-products-box">
        <h3>Productos a Intercambiar</h3>

        <div className="trade-products-grid">
          <div className="trade-product-card">
            <img src={trade.image} alt="Producto" />
            <h4>{trade.name}</h4>
            <p>{trade.category}</p>
            <p>{trade.condition}</p>
          </div>
        </div>
      </div>

      {/* Usuarios — Placeholder */}
      <div className="trade-users-box">
        <h3>Usuarios involucrados</h3>

        <div className="trade-user-card">
          <p>Laura Sánchez</p>
        </div>

        <div className="trade-user-card">
          <p>Diego Hernández</p>
        </div>
      </div>
    </div>
  );
};

export default TradeDetails;

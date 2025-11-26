import React from "react";
import { useNavigate } from "react-router-dom";
import "./TradeCard.css";
import type { TradeCardProps as TradeCardPropsType } from "../../types/types";

const TradeCard: React.FC<TradeCardPropsType> = ({
  tradeId,
  offerProduct,
  receiveProduct,
  status,
  isIncoming,
  createdAt
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/trade/${tradeId}`);
  };

  const getStatusColor = () => {
    const colors = {
      pending: '#FFA500',
      accepted: '#28a745',
      rejected: '#dc3545',
      in_progress: '#007bff',
      completed: '#6c757d',
      cancelled: '#dc3545'
    };
    return colors[status];
  };

  const getStatusText = () => {
    const texts = {
      pending: 'Pendiente',
      accepted: 'Aceptado',
      rejected: 'Rechazado',
      in_progress: 'En Proceso',
      completed: 'Completado',
      cancelled: 'Cancelado'
    };
    return texts[status];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="trade-card" onClick={handleClick}>
      <div className="trade-card__header">
        <span className="trade-type">
          {isIncoming ? '📥 Propuesta Recibida' : '📤 Propuesta Enviada'}
        </span>
        <span 
          className="trade-status"
          style={{ backgroundColor: getStatusColor() }}
        >
          {getStatusText()}
        </span>
      </div>

      <div className="trade-products">
        <div className="trade-product">
          <div className="product-label">{isIncoming ? 'Te ofrecen:' : 'Ofreces:'}</div>
          <div className="product-info">
            <div 
              className="product-image"
              style={{ backgroundImage: offerProduct.image ? `url(${offerProduct.image})` : 'none' }}
            />
            <div className="product-details">
              <h4>{offerProduct.title}</h4>
              <span>{offerProduct.category}</span>
              <span>Estado: {offerProduct.condition}</span>
            </div>
          </div>
        </div>

        <div className="trade-arrow">⇄</div>

        <div className="trade-product">
          <div className="product-label">{isIncoming ? 'Por tu producto:' : 'Por el producto:'}</div>
          <div className="product-info">
            <div 
              className="product-image"
              style={{ backgroundImage: receiveProduct.image ? `url(${receiveProduct.image})` : 'none' }}
            />
            <div className="product-details">
              <h4>{receiveProduct.title}</h4>
              <span>{receiveProduct.category}</span>
              <span>Estado: {receiveProduct.condition}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="trade-card__footer">
        <span className="trade-date">Creado: {formatDate(createdAt)}</span>
        <button className="view-details-btn">Ver Detalles</button>
      </div>
    </div>
  );
};

export default TradeCard;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { useTrades } from "../../context/TradesContext";
import { useAuth } from "../../context/useAuthContext";
import "./TradeDetailPage.css";

const TradeDetailPage: React.FC = () => {
  const { tradeId } = useParams();
  const navigate = useNavigate();
  const { getTradeById, updateTradeStatus } = useTrades();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [trade, setTrade] = useState<any>(null);

  useEffect(() => {
    if (tradeId) {
      const tradeData = getTradeById(tradeId);
      setTrade(tradeData);
    }
  }, [tradeId, getTradeById]);

  const handleAccept = async () => {
    if (!tradeId) return;
    
    setLoading(true);
    try {
      await updateTradeStatus(tradeId, 'accepted');
      navigate('/notificaciones');
    } catch (error) {
      console.error('Error aceptando trueque:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!tradeId) return;
    
    setLoading(true);
    try {
      await updateTradeStatus(tradeId, 'rejected');
      navigate('/notificaciones');
    } catch (error) {
      console.error('Error rechazando trueque:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!tradeId) return;
    
    setLoading(true);
    try {
      await updateTradeStatus(tradeId, 'completed');
      navigate('/notificaciones');
    } catch (error) {
      console.error('Error completando trueque:', error);
    } finally {
      setLoading(false);
    }
  };

 const getStatusMessage = () => {
  const messages: Record<string, string> = {
    pending: "Esperando respuesta...",
    accepted: "Trueque aceptado ✓",
    rejected: "Trueque rechazado ✗",
    in_progress: "Trueque en proceso...",
    completed: "Trueque completado ✅",
    cancelled: "Trueque cancelado"
  };
  return messages[trade?.status] || "";
};

const getStatusColor = () => {
  const colors: Record<string, string> = {
    pending: '#FFA500',
    accepted: '#28a745',
    rejected: '#dc3545',
    in_progress: '#007bff',
    completed: '#6c757d',
    cancelled: '#dc3545'
  };
  return colors[trade?.status] || '#666';
};

  if (!trade) {
    return (
      <div className="trade-detail-page">
        <div className="loading-container">
          <p>Cargando detalles del trueque...</p>
        </div>
      </div>
    );
  }

  const isReceiver = user?.id === trade.receiving_user_id;
  const canAcceptReject = isReceiver && trade.status === 'pending';
  const canComplete = trade.status === 'accepted' || trade.status === 'in_progress';

  return (
    <div className="trade-detail-page">
      <button 
        onClick={() => navigate('/notificaciones')} 
        className="back-button"
      >
        ← Volver a notificaciones
      </button>

      <div className="trade-detail-header">
        <h1>Detalles del Trueque</h1>
        <div 
          className="trade-status-badge"
          style={{ backgroundColor: getStatusColor() }}
        >
          {getStatusMessage()}
        </div>
      </div>

      <div className="trade-products-section">
        {/* Producto ofrecido */}
        <div className="trade-product-card">
          <h3>{isReceiver ? 'Te ofrecen:' : 'Estás ofreciendo:'}</h3>
          <div className="product-detail">
            <div 
              className="product-image-large"
              style={{ backgroundImage: trade.offer_product?.image ? `url(${trade.offer_product.image})` : 'none' }}
            />
            <div className="product-info">
              <h4>{trade.offer_product?.title}</h4>
              <p><strong>Categoría:</strong> {trade.offer_product?.category}</p>
              <p><strong>Estado:</strong> {trade.offer_product?.condition}</p>
              <p><strong>Descripción:</strong> {trade.offer_product?.description}</p>
              <p><strong>Ubicación:</strong> {trade.offer_product?.location}</p>
            </div>
          </div>
        </div>

        <div className="trade-arrow-large">⇄</div>

        {/* Producto deseado */}
        <div className="trade-product-card">
          <h3>{isReceiver ? 'Por tu producto:' : 'Por el producto:'}</h3>
          <div className="product-detail">
            <div 
              className="product-image-large"
              style={{ backgroundImage: trade.receive_product?.image ? `url(${trade.receive_product.image})` : 'none' }}
            />
            <div className="product-info">
              <h4>{trade.receive_product?.title}</h4>
              <p><strong>Categoría:</strong> {trade.receive_product?.category}</p>
              <p><strong>Estado:</strong> {trade.receive_product?.condition}</p>
              <p><strong>Descripción:</strong> {trade.receive_product?.description}</p>
              <p><strong>Ubicación:</strong> {trade.receive_product?.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Información del QR y estado */}
      <div className="trade-info-section">
        <div className="qr-section">
          <h3>Tu Código QR</h3>
          <div className="qr-container">
            <QRCode 
              value={JSON.stringify({
                tradeId: trade.id,
                productId: isReceiver ? trade.receive_product?.id : trade.offer_product?.id,
                type: 'trade_verification',
                timestamp: new Date().toISOString()
              })}
              size={120}
            />
          </div>
          <p className="qr-help">
            Muestra este código QR al administrador para verificar el trueque
          </p>
        </div>

        <div className="status-section">
          <h3>Estado del Proceso</h3>
          <div className="status-timeline">
            <div className={`status-step ${trade.status !== 'pending' ? 'completed' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-text">Propuesta enviada</span>
            </div>
            <div className={`status-step ${['accepted', 'in_progress', 'completed'].includes(trade.status) ? 'completed' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-text">Trueque aceptado</span>
            </div>
            <div className={`status-step ${trade.status === 'in_progress' ? 'current' : trade.status === 'completed' ? 'completed' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-text">En proceso de intercambio</span>
            </div>
            <div className={`status-step ${trade.status === 'completed' ? 'completed' : ''}`}>
              <span className="step-number">4</span>
              <span className="step-text">Trueque completado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="trade-actions">
        {canAcceptReject && (
          <>
            <button 
              onClick={handleAccept} 
              className="accept-button"
              disabled={loading}
            >
              {loading ? 'Procesando...' : '✅ Aceptar Trueque'}
            </button>
            <button 
              onClick={handleReject} 
              className="reject-button"
              disabled={loading}
            >
              {loading ? 'Procesando...' : '❌ Rechazar Trueque'}
            </button>
          </>
        )}
        
        {canComplete && (
          <button 
            onClick={handleComplete} 
            className="complete-button"
            disabled={loading}
          >
            {loading ? 'Procesando...' : '🏁 Marcar como Completado'}
          </button>
        )}

        {trade.status === 'completed' && (
          <div className="completed-message">
            <h3>¡Trueque Completado!</h3>
            <p>El intercambio ha sido finalizado exitosamente.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeDetailPage;
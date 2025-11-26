import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationsContext";
import { useTrades } from "../../context/TradesContext";
import { useAuth } from "../../context/useAuthContext";
import TradeCard from "../../components/TradeCard/TradeCard";
import "./NotificationsPage.css";

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    loading: notificationsLoading, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();
  
  const { 
    trades, 
    loading: tradesLoading 
  } = useTrades();

  const [activeTab, setActiveTab] = useState<"notificaciones" | "trueques">("notificaciones");

  // Separar notificaciones por tipo
  const { savedNotifications, tradeNotifications, tradeUpdates } = useMemo(() => {
    const saved = notifications.filter(n => n.type === 'saved');
    const tradeProposals = notifications.filter(n => n.type === 'trade_proposal');
    const updates = notifications.filter(n => n.type === 'trade_update');
    
    return {
      savedNotifications: saved,
      tradeNotifications: tradeProposals,
      tradeUpdates: updates
    };
  }, [notifications]);

  // Separar trades por tipo
  const { incomingTrades, outgoingTrades, activeTrades } = useMemo(() => {
    const incoming = trades.filter(trade => trade.receiving_user_id === user?.id);
    const outgoing = trades.filter(trade => trade.offering_user_id === user?.id);
    const active = trades.filter(trade => 
      ['accepted', 'in_progress'].includes(trade.status)
    );
    
    return {
      incomingTrades: incoming,
      outgoingTrades: outgoing,
      activeTrades: active
    };
  }, [trades, user]);

  const handleNotificationClick = async (notification: any) => {
    await markAsRead(notification.id);
    
    if (notification.related_trade_id) {
      navigate(`/trade/${notification.related_trade_id}`);
    } else if (notification.related_product_id) {
      navigate(`/producto/${notification.related_product_id}`);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'saved':
        return '📑';
      case 'trade_proposal':
        return '🔄';
      case 'trade_update':
        return 'ℹ️';
      default:
        return '🔔';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Ayer";
    if (diffDays > 1) return `Hace ${diffDays} días`;
    
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    if (diffHours > 1) return `Hace ${diffHours} horas`;
    
    return "Hace unos minutos";
  };

  if (notificationsLoading || tradesLoading) {
    return (
      <div className="notifications-page">
        <div className="loading-container">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      {/* Header */}
      <div className="notifications-header">
        <h1 className="notifications-title">Centro de Actividad</h1>
        {unreadCount > 0 && activeTab === "notificaciones" && (
          <button onClick={markAllAsRead} className="mark-all-read">
            Marcar todas como leídas
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="notifications-tabs">
        <button
          className={`tab ${activeTab === "notificaciones" ? "active" : ""}`}
          onClick={() => setActiveTab("notificaciones")}
        >
          🔔 Notificaciones ({notifications.length})
        </button>
        <button
          className={`tab ${activeTab === "trueques" ? "active" : ""}`}
          onClick={() => setActiveTab("trueques")}
        >
          🔄 Trueques ({trades.length})
        </button>
      </div>

      {/* Contenido de Notificaciones */}
      {activeTab === "notificaciones" && (
        <div className="notifications-content">
          {/* Notificaciones de Guardados */}
          {savedNotifications.length > 0 && (
            <section className="notifications-section">
              <h3 className="section-title">Guardados</h3>
              <div className="notifications-list">
                {savedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-content">
                      <div className="notification-header">
                        <h4 className="notification-title">{notification.title}</h4>
                        <span className="notification-time">
                          {formatDate(notification.created_at)}
                        </span>
                      </div>
                      <p className="notification-message">{notification.message}</p>
                      {notification.from_user_name && (
                        <div className="notification-from">
                          De: {notification.from_user_name}
                        </div>
                      )}
                    </div>
                    {!notification.is_read && <div className="unread-dot"></div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Propuestas de Trueque */}
          {tradeNotifications.length > 0 && (
            <section className="notifications-section">
              <h3 className="section-title">Propuestas de Trueque</h3>
              <div className="notifications-list">
                {tradeNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-content">
                      <div className="notification-header">
                        <h4 className="notification-title">{notification.title}</h4>
                        <span className="notification-time">
                          {formatDate(notification.created_at)}
                        </span>
                      </div>
                      <p className="notification-message">{notification.message}</p>
                      {notification.from_user_name && (
                        <div className="notification-from">
                          De: {notification.from_user_name}
                        </div>
                      )}
                      <div className="notification-action">
                        <button className="action-button">Ver Propuesta</button>
                      </div>
                    </div>
                    {!notification.is_read && <div className="unread-dot"></div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Actualizaciones de Trueques */}
          {tradeUpdates.length > 0 && (
            <section className="notifications-section">
              <h3 className="section-title">Actualizaciones de Trueques</h3>
              <div className="notifications-list">
                {tradeUpdates.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-content">
                      <div className="notification-header">
                        <h4 className="notification-title">{notification.title}</h4>
                        <span className="notification-time">
                          {formatDate(notification.created_at)}
                        </span>
                      </div>
                      <p className="notification-message">{notification.message}</p>
                      <div className="notification-action">
                        <button className="action-button">Ver Estado</button>
                      </div>
                    </div>
                    {!notification.is_read && <div className="unread-dot"></div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Estado vacío */}
          {notifications.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🔔</div>
              <h3>No tienes notificaciones</h3>
              <p>Las notificaciones sobre tus actividades aparecerán aquí</p>
            </div>
          )}
        </div>
      )}

      {/* Contenido de Trueques */}
      {activeTab === "trueques" && (
        <div className="trades-content">
          {/* Trueques Activos */}
          {activeTrades.length > 0 && (
            <section className="trades-section">
              <h3 className="section-title">Trueques en Proceso</h3>
              <div className="trades-grid">
                {activeTrades.map((trade) => (
                  <TradeCard
                    key={trade.id}
                    tradeId={trade.id}
                    offerProduct={trade.offer_product}
                    receiveProduct={trade.receive_product}
                    status={trade.status}
                    isIncoming={trade.receiving_user_id === user?.id}
                    createdAt={trade.created_at}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Trueques Entrantes */}
          {incomingTrades.length > 0 && (
            <section className="trades-section">
              <h3 className="section-title">Propuestas Recibidas</h3>
              <div className="trades-grid">
                {incomingTrades.map((trade) => (
                  <TradeCard
                    key={trade.id}
                    tradeId={trade.id}
                    offerProduct={trade.offer_product}
                    receiveProduct={trade.receive_product}
                    status={trade.status}
                    isIncoming={true}
                    createdAt={trade.created_at}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Trueques Salientes */}
          {outgoingTrades.length > 0 && (
            <section className="trades-section">
              <h3 className="section-title">Propuestas Enviadas</h3>
              <div className="trades-grid">
                {outgoingTrades.map((trade) => (
                  <TradeCard
                    key={trade.id}
                    tradeId={trade.id}
                    offerProduct={trade.offer_product}
                    receiveProduct={trade.receive_product}
                    status={trade.status}
                    isIncoming={false}
                    createdAt={trade.created_at}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Estado vacío */}
          {trades.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🔄</div>
              <h3>No tienes trueques activos</h3>
              <p>Cuando hagas o recibas propuestas de trueque, aparecerán aquí</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
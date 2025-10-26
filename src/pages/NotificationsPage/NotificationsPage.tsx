import React from "react";
import "./NotificationsPage.css";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "trade" | "message" | "system" | "alert";
  isRead: boolean;
  createdAt: string;
  fromUser?: string;
}

const NotificationsPage: React.FC = () => {
  // Datos de ejemplo - después vendrán de la base de datos
  const notifications: NotificationItem[] = [
    {
      id: "1",
      title: "Nueva oferta de trueque",
      message: "Juan quiere intercambiar su guitarra por tu bicicleta",
      type: "trade",
      isRead: false,
      createdAt: "2024-01-15T10:30:00Z",
      fromUser: "Juan Pérez"
    },
    {
      id: "2",
      title: "Mensaje nuevo",
      message: "Tienes un nuevo mensaje de María",
      type: "message",
      isRead: true,
      createdAt: "2024-01-14T15:45:00Z",
      fromUser: "María García"
    },
    {
      id: "3",
      title: "Trueque completado",
      message: "Tu trueque con Carlos ha sido completado exitosamente",
      type: "system",
      isRead: true,
      createdAt: "2024-01-13T09:20:00Z"
    },
    {
      id: "4",
      title: "Recordatorio",
      message: "No olvides confirmar tu trueque pendiente",
      type: "alert",
      isRead: false,
      createdAt: "2024-01-12T14:10:00Z"
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "trade":
        return "🔄";
      case "message":
        return "💬";
      case "system":
        return "ℹ️";
      case "alert":
        return "⚠️";
      default:
        return "🔔";
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

  const markAsRead = (notificationId: string) => {
    // Aquí iría la lógica para marcar como leído en la base de datos
    console.log("Marcar como leído:", notificationId);
  };

  const markAllAsRead = () => {
    // Lógica para marcar todas como leídas
    console.log("Marcar todas como leídas");
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1 className="notifications-title">Notificaciones</h1>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="mark-all-read">
            Marcar todas como leídas
          </button>
        )}
      </div>

      <div className="notifications-container">
        {notifications.length === 0 ? (
          <div className="empty-notifications">
            <div className="empty-icon">🔔</div>
            <h3>No tienes notificaciones</h3>
            <p>Las notificaciones sobre tus trueques aparecerán aquí</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="notification-content">
                  <div className="notification-header">
                    <h4 className="notification-title">{notification.title}</h4>
                    <span className="notification-time">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                  
                  <p className="notification-message">{notification.message}</p>
                  
                  {notification.fromUser && (
                    <div className="notification-from">
                      De: {notification.fromUser}
                    </div>
                  )}
                </div>

                {!notification.isRead && (
                  <div className="unread-dot"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
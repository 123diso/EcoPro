import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";
import { useAuth } from "../../context/useAuthContext";
import "./SettingsPage.css";

const SettingsPage: React.FC = () => {
  const { settings, updateSettings, loading } = useSettings();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [tempLocation, setTempLocation] = useState(settings.location);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  const languages = [
    { code: "es", name: "Español" },
    { code: "en", name: "English" },
    { code: "pt", name: "Português" },
    { code: "fr", name: "Français" }
  ];

  // Sincronizar tempLocation cuando cambien las settings
  useEffect(() => {
    setTempLocation(settings.location);
  }, [settings.location]);

  const handleToggleNotifications = async () => {
    setSaveStatus("saving");
    try {
      await updateSettings({ notifications: !settings.notifications });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  const handleLocationEdit = () => {
    setIsEditingLocation(true);
  };

  const handleLocationSave = async () => {
    setSaveStatus("saving");
    try {
      await updateSettings({ location: tempLocation });
      setIsEditingLocation(false);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  const handleLocationCancel = () => {
    setTempLocation(settings.location);
    setIsEditingLocation(false);
  };

  const handleLanguageChange = async (language: string) => {
    setSaveStatus("saving");
    try {
      await updateSettings({ language });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const handleHelpSupport = () => {
    // Aquí puedes redirigir a una página de ayuda o abrir un modal
    console.log("Ayuda y soporte");
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case "saving":
        return "Guardando...";
      case "success":
        return "¡Guardado!";
      case "error":
        return "Error al guardar";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="settings-page">
        <div className="settings-loading">
          <p>Cargando configuraciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      {/* Encabezado */}
      <div className="settings-header">
        <h1 className="settings-title">Configuración</h1>
        <p className="settings-subtitle">Personaliza tu experiencia en Dandi</p>
        {saveStatus !== "idle" && (
          <div className={`save-status ${saveStatus}`}>
            {getSaveStatusText()}
          </div>
        )}
      </div>

      {/* Información del usuario */}
      <div className="user-info-section">
        <h3 className="user-info-title">Cuenta actual</h3>
        <div className="user-details">
          <p><strong>Usuario:</strong> {user?.user_metadata?.username || user?.email}</p>
          <p><strong>Email:</strong> {user?.email}</p>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="settings-container">
        {/* Notificaciones */}
        <div className="setting-block">
          <div className="setting-icon">🔔</div>
          <div className="setting-content">
            <h3 className="setting-label">Notificaciones</h3>
            <div className="setting-field">
              <span>Recibir notificaciones</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={handleToggleNotifications}
                  disabled={saveStatus === "saving"}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <p className="setting-description">
              Recibe notificaciones sobre tus trueques y mensajes
            </p>
          </div>
        </div>

        {/* Ubicación */}
        <div className="setting-block">
          <div className="setting-icon">📍</div>
          <div className="setting-content">
            <h3 className="setting-label">Ubicación</h3>
            <div className="setting-field">
              {isEditingLocation ? (
                <div className="location-edit">
                  <input
                    type="text"
                    value={tempLocation}
                    onChange={(e) => setTempLocation(e.target.value)}
                    placeholder="Ej: Calle 28A #123, Ciudad"
                    className="location-input"
                    disabled={saveStatus === "saving"}
                  />
                  <div className="location-actions">
                    <button 
                      onClick={handleLocationSave} 
                      className="location-save"
                      disabled={saveStatus === "saving"}
                    >
                      ✓
                    </button>
                    <button 
                      onClick={handleLocationCancel} 
                      className="location-cancel"
                      disabled={saveStatus === "saving"}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <div className="location-display">
                  <span>{settings.location || "No especificada"}</span>
                  <button 
                    onClick={handleLocationEdit} 
                    className="location-edit-btn"
                    disabled={saveStatus === "saving"}
                  >
                    ✏️
                  </button>
                </div>
              )}
            </div>
            <p className="setting-description">
              Tu ubicación ayuda a mostrar trueques cercanos
            </p>
          </div>
        </div>

        {/* Idioma */}
        <div className="setting-block">
          <div className="setting-icon">🌐</div>
          <div className="setting-content">
            <h3 className="setting-label">Idioma</h3>
            <div className="setting-field">
              <span>Idioma de la aplicación</span>
              <div className="language-selector">
                <select
                  value={settings.language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="language-select"
                  disabled={saveStatus === "saving"}
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <span className="language-arrow">▼</span>
              </div>
            </div>
            <p className="setting-description">
              Elige el idioma de la interfaz
            </p>
          </div>
        </div>

        {/* Ayuda y Soporte */}
        <div className="setting-block">
          <div className="setting-icon">👤</div>
          <div className="setting-content">
            <h3 className="setting-label">Cuenta</h3>
            <div className="setting-field">
              <button 
                onClick={handleHelpSupport} 
                className="help-button"
                disabled={saveStatus === "saving"}
              >
                Ayuda y soporte
              </button>
            </div>
            <p className="setting-description">
              Obtén ayuda sobre el uso de la aplicación
            </p>
          </div>
        </div>

        {/* Cerrar Sesión */}
        <div className="setting-block">
          <button 
            onClick={handleSignOut} 
            className="signout-button"
            disabled={saveStatus === "saving"}
          >
            <span>Cerrar sesión</span>
            <span className="signout-icon">🚪</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
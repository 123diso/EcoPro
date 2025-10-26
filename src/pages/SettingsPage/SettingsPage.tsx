import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";
import { useAuth } from "../../context/useAuthContext";
import "./SettingsPage.css";

const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [tempLocation, setTempLocation] = useState(settings.location);

  const languages = [
    { code: "es", name: "Español" },
    { code: "en", name: "English" },
    { code: "pt", name: "Português" },
    { code: "fr", name: "Français" }
  ];

  const handleToggleNotifications = () => {
    updateSettings({ notifications: !settings.notifications });
  };

  const handleToggleDarkMode = () => {
    updateSettings({ darkMode: !settings.darkMode });
  };

  const handleLocationEdit = () => {
    setIsEditingLocation(true);
  };

  const handleLocationSave = () => {
    updateSettings({ location: tempLocation });
    setIsEditingLocation(false);
  };

  const handleLocationCancel = () => {
    setTempLocation(settings.location);
    setIsEditingLocation(false);
  };

  const handleLanguageChange = (language: string) => {
    updateSettings({ language });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const handleHelpSupport = () => {
    // Aquí puedes redirigir a una página de ayuda o abrir un modal
    console.log("Ayuda y soporte");
  };

  return (
    <div className="settings-page">
      {/* Encabezado */}
      <div className="settings-header">
        <h1 className="settings-title">Configuración</h1>
        <p className="settings-subtitle">Personaliza tu experiencia en Dandi</p>
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
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Apariencia */}
        <div className="setting-block">
          <div className="setting-icon">🌙</div>
          <div className="setting-content">
            <h3 className="setting-label">Apariencia</h3>
            <div className="setting-field">
              <span>Modo oscuro</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={handleToggleDarkMode}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
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
                    placeholder="Calle 28A #..."
                    className="location-input"
                  />
                  <div className="location-actions">
                    <button onClick={handleLocationSave} className="location-save">
                      ✓
                    </button>
                    <button onClick={handleLocationCancel} className="location-cancel">
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <div className="location-display">
                  <span>{settings.location || "No especificada"}</span>
                  <button onClick={handleLocationEdit} className="location-edit-btn">
                    ✏️
                  </button>
                </div>
              )}
            </div>
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
          </div>
        </div>

        {/* Ayuda y Soporte */}
        <div className="setting-block">
          <div className="setting-icon">👤</div>
          <div className="setting-content">
            <h3 className="setting-label">Cuenta</h3>
            <div className="setting-field">
              <button onClick={handleHelpSupport} className="help-button">
                Ayuda y soporte
              </button>
            </div>
          </div>
        </div>

        {/* Cerrar Sesión */}
        <div className="setting-block">
          <button onClick={handleSignOut} className="signout-button">
            <span>Cerrar sesión</span>
            <span className="signout-icon">🚪</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
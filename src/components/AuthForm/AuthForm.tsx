import React, { useState } from "react";
import { Input } from "../Input/Input";
import { useAuthActions } from "../../hooks/useAuth";
import { EmailConfirmation } from "../EmailConfirmation/EmailConfirmation";
import type { AuthFormData } from "../../types/types";
import "./AuthForm.css";

interface AuthFormProps {
  mode: "login" | "register";
  onSuccess?: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onSuccess }) => {
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    fullName: "",
    username: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { signIn, signUp, loading, error, clearError } = useAuthActions();

  // Validación de contraseña
  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const passwordValidation = validatePassword(formData.password);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (mode === "register") {
      if (formData.password !== confirmPassword) {
        return;
      }
      if (!isPasswordValid) {
        return;
      }
    }

    const result =
      mode === "login"
        ? await signIn({ email: formData.email, password: formData.password })
        : await signUp(formData);

    if (result.success) {
      if (mode === "register") {
        setShowConfirmation(true);
      } else if (onSuccess) {
        onSuccess();
      }
    }
  };

  if (showConfirmation) {
    return <EmailConfirmation />;
  }

  return (
    <div className="auth-form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2 className="auth-title">
          {mode === "login" ? "Iniciar Sesión" : "Registrarse"}
        </h2>

        <div className="form-group">
          <Input
            type="email"
            placeholder="Correo electronico"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <Input
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            required
          />
          {mode === "register" && formData.password && (
            <div className="password-requirements">
              <h4>Requisitos de contraseña:</h4>
              <div className="requirement-item">
                <span
                  className={`requirement-icon ${
                    passwordValidation.length ? "valid" : "invalid"
                  }`}
                >
                  {passwordValidation.length ? "✓" : "✗"}
                </span>
                <span
                  className={`requirement-text ${
                    passwordValidation.length ? "valid" : "invalid"
                  }`}
                >
                  Mínimo 8 caracteres
                </span>
              </div>
              <div className="requirement-item">
                <span
                  className={`requirement-icon ${
                    passwordValidation.uppercase ? "valid" : "invalid"
                  }`}
                >
                  {passwordValidation.uppercase ? "✓" : "✗"}
                </span>
                <span
                  className={`requirement-text ${
                    passwordValidation.uppercase ? "valid" : "invalid"
                  }`}
                >
                  Al menos una mayúscula
                </span>
              </div>
              <div className="requirement-item">
                <span
                  className={`requirement-icon ${
                    passwordValidation.lowercase ? "valid" : "invalid"
                  }`}
                >
                  {passwordValidation.lowercase ? "✓" : "✗"}
                </span>
                <span
                  className={`requirement-text ${
                    passwordValidation.lowercase ? "valid" : "invalid"
                  }`}
                >
                  Al menos una minúscula
                </span>
              </div>
              <div className="requirement-item">
                <span
                  className={`requirement-icon ${
                    passwordValidation.number ? "valid" : "invalid"
                  }`}
                >
                  {passwordValidation.number ? "✓" : "✗"}
                </span>
                <span
                  className={`requirement-text ${
                    passwordValidation.number ? "valid" : "invalid"
                  }`}
                >
                  Al menos un número
                </span>
              </div>
              <div className="requirement-item">
                <span
                  className={`requirement-icon ${
                    passwordValidation.special ? "valid" : "invalid"
                  }`}
                >
                  {passwordValidation.special ? "✓" : "✗"}
                </span>
                <span
                  className={`requirement-text ${
                    passwordValidation.special ? "valid" : "invalid"
                  }`}
                >
                  Al menos un carácter especial
                </span>
              </div>
            </div>
          )}
        </div>

        {mode === "register" && (
          <>
            <div className="form-group">
              <Input
                type="text"
                placeholder="Nombre completo"
                value={formData.fullName || ""}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <Input
                type="text"
                placeholder="Nombre de usuario"
                value={formData.username || ""}
                onChange={(e) => handleInputChange('username', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <Input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </>
        )}

        {error && <div className="error-message">{error}</div>}

        {mode === "register" &&
          formData.password !== confirmPassword &&
          formData.password &&
          confirmPassword && (
            <div className="error-message">Las contraseñas no coinciden</div>
          )}

        {mode === "register" && formData.password && !isPasswordValid && (
          <div className="error-message">
            La contraseña debe cumplir todos los requisitos
          </div>
        )}

        <button type="submit" className="auth-button" disabled={loading}>
          {loading
            ? "Cargando..."
            : mode === "login"
            ? "Iniciar Sesión"
            : "Registrarse"}
        </button>
      </form>
    </div>
  );
};
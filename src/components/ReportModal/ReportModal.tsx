import React, { useState } from "react";
import "./ReportModal.css";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string) => Promise<void>;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert("Por favor escribe un título para el reporte.");
    setLoading(true);

    try {
      await onSubmit(title, description);
      setTitle("");
      setDescription("");
      alert("Reporte enviado correctamente.");
      onClose();
    } catch (error) {
      console.error("Error al enviar reporte:", error);
      alert("Error al enviar reporte, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h2>Reportar producto</h2>
        <form onSubmit={handleSubmit}>
          <label>Título del reporte</label>
          <input
            type="text"
            placeholder="Ej. Imagen inapropiada"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Descripción</label>
          <textarea
            placeholder="Describe brevemente el problema..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="modal-actions">
            <button type="button" className="cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar reporte"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;

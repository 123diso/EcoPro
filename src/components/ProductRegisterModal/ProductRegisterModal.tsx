import React, { useState } from "react";
import "./ProductRegisterModal.css";

interface ProductRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (productData: ProductFormData) => void;
}

export interface ProductFormData {
  name: string;
  category: string;
  description: string;
  condition: string;
}

const ProductRegisterModal: React.FC<ProductRegisterModalProps> = ({
  isOpen,
  onClose,
  onRegister,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    category: "",
    description: "",
    condition: "",
  });

  const categories = [
    "Electrónica",
    "Ropa",
    "Hogar",
    "Deportes",
    "Libros",
    "Juguetes",
    "Otros",
  ];

  const conditions = [
    "Nuevo",
    "Como nuevo",
    "Buen estado",
    "Regular",
    "Necesita reparación",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    if (
      !formData.name ||
      !formData.category ||
      !formData.description ||
      !formData.condition
    ) {
      return; // No hacer nada si faltan campos
    }

    onRegister(formData);
    // El cierre del modal y limpieza se manejará en el componente padre
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      condition: "",
    });
    onClose();
  };

  const handleBackArrow = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Encabezado del modal */}
        <div className="modal-header">
          <button
            className="back-button"
            onClick={handleBackArrow}
            type="button"
          >
            ←
          </button>
          <h2 className="modal-title">Registro de artículo</h2>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-container">
            {/* Columna izquierda */}
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Nombre del Artículo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej. Bicicleta de montaña"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category" className="form-label">
                  Categoría
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detalles del artículo"
                  className="form-textarea"
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="condition" className="form-label">
                  Estado del producto
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">selecciona estado</option>
                  {conditions.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Botón Generar QR */}
          <div className="qr-section">
            <button type="button" className="qr-button">
              🧾 Generar QR
            </button>
          </div>

          {/* Botones de acción */}
          <div className="form-actions">
            <button
              type="submit"
              className="action-button trade-button"
              disabled={
                !formData.name ||
                !formData.category ||
                !formData.description ||
                !formData.condition
              }
            >
              Hacer trueque
            </button>
            <button
              type="button"
              className="action-button cancel-button"
              onClick={handleCancel}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductRegisterModal;

import React, { useState } from "react";
import "./ProductRegisterModal.css";
import type { ProductFormData } from "../../types";

interface ProductRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (productData: ProductFormData) => void;
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
    image: "",
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
      !formData.condition ||
      !formData.image
    ) {
      return;
    }

    onRegister(formData);
    // Limpiar formulario después de registrar
    setFormData({
      name: "",
      category: "",
      description: "",
      condition: "",
      image: "",
    });
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      condition: "",
      image: "",
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

              <div className="form-group">
                <label htmlFor="image" className="form-label">
                  URL de la imagen
                </label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="form-input"
                  required
                />
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

          {/* Vista previa de la imagen */}
          {formData.image && (
            <div className="image-preview">
              <h4 className="preview-title">Vista previa:</h4>
              <div className="preview-image">
                <img src={formData.image} alt="Vista previa" />
              </div>
            </div>
          )}

          {/* Botón Generar QR */}
          <div className="qr-section">
            <button type="button" className="qr-button">
              Generar QR
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
                !formData.condition ||
                !formData.image
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
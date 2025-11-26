import React, { useState } from "react";
import QRCode from "react-qr-code";
import "./ProductRegisterModal.css";
import type { ProductFormData } from "../../types/types";
import dandiPointsData from "../../assets/dandiPoints.json";

interface ProductRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (productData: ProductFormData) => Promise<void>;
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
    location: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [qrValue, setQrValue] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    if (
      !formData.name ||
      !formData.category ||
      !formData.description ||
      !formData.condition ||
      !formData.image ||
      !formData.location
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onRegister(formData);
      // El formulario se limpia en el componente padre después del registro exitoso
    } catch (error) {
      console.error("Error en el formulario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para generar el QR
const handleGenerateQr = () => {
  if (!formData.name || !formData.category || !formData.description || !formData.condition) {
    alert("Completa los datos del producto antes de generar el QR.");
    return;
  }

  const productId = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const qrURL = `${window.location.origin}/trade/start?productId=${productId}`;

  setQrValue(qrURL);
  setShowQr(true);
};

  const handleCancel = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      condition: "",
      image: "",
      location: "",
    });
    setQrValue(null);
    setShowQr(false);
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
            disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  placeholder="Detalles del artículo, características, etc."
                  className="form-textarea"
                  rows={4}
                  required
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                >
                  <option value="">selecciona estado</option>
                  {conditions.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="location" className="form-label">
                  Tienda
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Seleccionar tienda</option>
                  {dandiPointsData.map((store) => (
                    <option key={store.id} value={store.name}>
                      {store.name}
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
            <button
              type="button"
              className="qr-button"
              onClick={handleGenerateQr}
              disabled={
                isSubmitting ||
                !formData.name ||
                !formData.category ||
                !formData.description ||
                !formData.condition
              }
            >
              {isSubmitting ? "Procesando..." : "Generar QR"}
            </button>
          </div>

          {/* Mostrar QR generado */}
          {showQr && qrValue && (
            <div className="image-preview">
              <h4 className="preview-title">QR del producto:</h4>
              <div className="preview-image">
                <QRCode value={qrValue} size={160} />
              </div>
            </div>
          )}

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
                !formData.image ||
                !formData.location ||
                isSubmitting
              }
            >
              {isSubmitting ? "Registrando..." : "Hacer trueque"}
            </button>
            <button
              type="button"
              className="action-button cancel-button"
              onClick={handleCancel}
              disabled={isSubmitting}
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
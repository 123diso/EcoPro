import React, { useState } from "react";
import QRCode from "react-qr-code";
import "./ProductPublishModal.css";
import type { ProductFormData } from "../../types/types";
import dandiPointsData from "../../assets/dandiPoints.json";

interface ProductPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (productData: ProductFormData) => Promise<void>;
}

const ProductPublishModal: React.FC<ProductPublishModalProps> = ({
  isOpen,
  onClose,
  onPublish,
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
      await onPublish(formData);
      // Limpiar formulario después de publicar exitosamente
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
    } catch (error) {
      console.error("Error en el formulario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para generar el QR
  const handleGenerateQr = () => {
    // Validamos que haya datos básicos del producto
    if (
      !formData.name ||
      !formData.category ||
      !formData.description ||
      !formData.condition
    ) {
      alert("Completa los datos del producto antes de generar el QR.");
      return;
    }

    // Crear un ID único para el producto
    const productId = `pub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Información para el QR
    const payload = JSON.stringify({
      productId: productId,
      name: formData.name,
      category: formData.category,
      condition: formData.condition,
      description: formData.description,
      image: formData.image,
      location: formData.location,
      timestamp: new Date().toISOString(),
      type: "published_product"
    });

    setQrValue(payload);
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
    <div className="publish-modal-overlay">
      <div className="publish-modal-container">
        {/* Encabezado del modal */}
        <div className="publish-modal-header">
          <button
            className="publish-back-button"
            onClick={handleBackArrow}
            type="button"
            disabled={isSubmitting}
          >
            ←
          </button>
          <h2 className="publish-modal-title">Publicar Nuevo Producto</h2>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="publish-product-form">
          <div className="publish-form-container">
            {/* Columna izquierda */}
            <div className="publish-form-column">
              <div className="publish-form-group">
                <label htmlFor="name" className="publish-form-label">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej. Bicicleta de montaña, iPhone 13, Sofá cama..."
                  className="publish-form-input"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="publish-form-group">
                <label htmlFor="category" className="publish-form-label">
                  Categoría *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="publish-form-select"
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

              <div className="publish-form-group">
                <label htmlFor="image" className="publish-form-label">
                  URL de la imagen *
                </label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://ejemplo.com/imagen-producto.jpg"
                  className="publish-form-input"
                  required
                  disabled={isSubmitting}
                />
                <small className="publish-form-help">
                  Puedes usar servicios como Imgur, Google Photos, etc.
                </small>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="publish-form-column">
              <div className="publish-form-group">
                <label htmlFor="description" className="publish-form-label">
                  Descripción del Producto *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe tu producto: características, estado, lo que incluye, etc."
                  className="publish-form-textarea"
                  rows={4}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="publish-form-group">
                <label htmlFor="condition" className="publish-form-label">
                  Estado del Producto *
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="publish-form-select"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Selecciona el estado</option>
                  {conditions.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond}
                    </option>
                  ))}
                </select>
              </div>

              <div className="publish-form-group">
                <label htmlFor="location" className="publish-form-label">
                  Tienda *
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="publish-form-select"
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
            <div className="publish-image-preview">
              <h4 className="publish-preview-title">Vista previa de la imagen:</h4>
              <div className="publish-preview-image">
                <img src={formData.image} alt="Vista previa del producto" />
              </div>
            </div>
          )}

          {/* Sección QR */}
          <div className="publish-qr-section">
            <button
              type="button"
              className="publish-qr-button"
              onClick={handleGenerateQr}
              disabled={
                isSubmitting ||
                !formData.name ||
                !formData.category ||
                !formData.description ||
                !formData.condition
              }
            >
              {isSubmitting ? "Procesando..." : "🔳 Generar Código QR"}
            </button>
          </div>

          {/* Mostrar QR generado */}
          {showQr && qrValue && (
            <div className="publish-image-preview">
              <h4 className="publish-preview-title">Código QR del producto:</h4>
              <div className="publish-preview-image">
                <QRCode value={qrValue} size={160} />
              </div>
              <small className="publish-form-help">
                Escanea este código QR para acceder rápidamente a la información del producto
              </small>
            </div>
          )}

          {/* Información adicional */}
          <div className="publish-info-section">
            <h4 className="publish-info-title">💡 Consejos para una buena publicación:</h4>
            <ul className="publish-info-list">
              <li>Usa fotos claras y bien iluminadas</li>
              <li>Describe honestamente el estado del producto</li>
              <li>Incluye todas las características relevantes</li>
              <li>Especifica si incluye accesorios o manuales</li>
              <li>Genera el código QR para identificar fácilmente tu producto</li>
            </ul>
          </div>

          {/* Botones de acción */}
          <div className="publish-form-actions">
            <button
              type="submit"
              className="publish-action-button publish-button"
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
              {isSubmitting ? "Publicando..." : "📤 Publicar Producto"}
            </button>
            <button
              type="button"
              className="publish-action-button cancel-button"
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

export default ProductPublishModal;
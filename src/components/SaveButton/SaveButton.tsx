import React from "react";
import { useSaved } from "../../context/SavedContext";
import "./SaveButton.css";
import type { SaveButtonProps } from "../../types/types";

const SaveButton: React.FC<SaveButtonProps> = ({ 
  id, 
  title, 
  image, 
  category, 
  condition, 
  location 
}) => {
  const { isProductSaved, toggleProduct, loading } = useSaved();

  const isSaved = isProductSaved(id);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (loading) return; // Evitar múltiples clicks
    
    toggleProduct({
      id,
      title,
      image,
      category,
      condition,
      location
    });
  };

  return (
    <button 
      className={`save-btn ${isSaved ? 'is-saved' : ''} ${loading ? 'is-loading' : ''}`} 
      onClick={handleSaveClick}
      disabled={loading}
      aria-label={isSaved ? "Quitar de guardados" : "Guardar producto"}
    >
      {loading ? (
        <div className="save-btn__loading">⏳</div>
      ) : (
        <img 
          src={isSaved ? "/bookmark 2.png" : "/bookmark.png"} 
          alt={isSaved ? "Producto guardado" : "Guardar producto"}
          className="save-btn__icon"
        />
      )}
    </button>
  );
};

export default SaveButton;
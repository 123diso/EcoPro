import React from "react";
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
  const handleSave = () => {
    console.log("Guardando producto:", {
      id,
      title,
      image,
      category,
      condition,
      location
    });
    // Aquí irá la lógica para guardar el producto
  };

  return (
    <button className="save-btn" onClick={handleSave}>
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
      </svg>
    </button>
  );
};

export default SaveButton;
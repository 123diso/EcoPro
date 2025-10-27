import React from "react";
import "./SaveButton.css";

interface SaveButtonProps {
  id: string | number;
  title: string;
  image?: string;
  category: string;
  condition: string;
  location: string;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  id,
  title,
  image,
  category,
  condition,
  location,
}) => {
  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Guardado:", { id, title, image, category, condition, location });
  };

  return (
    <button className="save-btn" onClick={handleSave}>
      Guardar
    </button>
  );
};

export default SaveButton;

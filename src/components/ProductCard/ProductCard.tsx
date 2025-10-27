import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";
import SaveButton from "../SaveButton/SaveButton";

interface ProductCardProps {
  id: number | string;
  title: string;
  category: string;
  condition: string;
  location: string;
  image?: string;
  onDelete?: (id: string | number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  category,
  condition,
  location,
  image,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!onDelete) navigate(`/producto/${id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onDelete) onDelete(id);
  };

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-card__image">
        <div
          className="product-card__image-placeholder"
          style={{
            backgroundImage: image ? `url(${image})` : "none",
            backgroundColor: image ? "transparent" : "#e9e6dc",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

      <div className="product-card__content">
        <h3 className="product-card__title">{title}</h3>
        <div className="product-card__details">
          <span className="product-card__category">{category}</span>
          <span className="product-card__condition">Estado: {condition}</span>
          <span className="product-card__location">{location}</span>
        </div>
      </div>

      {onDelete ? (
        <button className="delete-button" onClick={handleDeleteClick}>
          Eliminar
        </button>
      ) : (
        <SaveButton
          id={id}
          title={title}
          image={image || ""}
          category={category}
          condition={condition}
          location={location}
        />
      )}
    </div>
  );
};


export default ProductCard;

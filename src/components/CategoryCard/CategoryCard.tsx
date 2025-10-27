import React from "react";
import { useNavigate } from "react-router-dom";
import "./CategoryCard.css";

export interface Category {
  id: string;
  name: string;
  image: string;
  description?: string;
}

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    navigate(`/categoria/${category.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCategoryClick();
    }
  };

  return (
    <div
      className="category-card"
      onClick={handleCategoryClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Explorar categoría ${category.name}`}
    >
      <div className="category-card__frame">
        <div className="category-card__image-container">
          <img
            src={category.image}
            alt={category.name}
            className="category-card__image"
            loading="lazy"
          />
        </div>
        
        <h3 className="category-card__name">{category.name}</h3>
      </div>
    </div>
  );
};

export default CategoryCard;
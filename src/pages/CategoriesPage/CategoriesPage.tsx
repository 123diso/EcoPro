import React, { useState, useMemo } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import type { Category } from "../../components/CategoryCard/CategoryCard";
import categoriesData from "../../assets/categories.json";
import "./CategoriesPage.css";

const CategoriesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Cargar categorías desde el archivo JSON
  const categories: Category[] = categoriesData as Category[];

  // Filtrar categorías basado en la búsqueda
  const filteredCategories = useMemo(() => {
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, categories]);

  return (
    <div className="categories-page">
      {/* Barra de búsqueda */}
      <div className="categories-search">
        <SearchBar 
          onSearch={setSearchQuery}
          placeholder="Buscar categorías..."
          defaultValue={searchQuery}
        />
      </div>

      {/* Título principal */}
      <div className="categories-header">
        <h1 className="categories-title">Todas las categorías</h1>
        <p className="categories-subtitle">
          Explora productos por categoría
        </p>
      </div>

      {/* Cuadrícula de categorías */}
      <div className="categories-grid">
        {filteredCategories.length === 0 ? (
          <div className="categories-empty">
            <div className="empty-icon">🔍</div>
            <h3>No se encontraron categorías</h3>
            <p>Intenta con otros términos de búsqueda</p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
            />
          ))
        )}
      </div>

      {/* Pie de página visual */}
      <div className="categories-footer"></div>
    </div>
  );
};

export default CategoriesPage;
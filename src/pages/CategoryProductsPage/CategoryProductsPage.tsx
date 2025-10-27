import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductsGrid from "../../components/ProductsGrid/ProductsGrid";
import type { Product } from "../../components/ProductsGrid/ProductsGrid";
import productsData from "../../assets/productCards.json";
import categoriesData from "../../assets/categories.json";
import "./CategoryProductsPage.css";

const CategoryProductsPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  // Cargar productos y categorías desde archivos JSON
  const allProducts: Product[] = productsData as Product[];
  const categories = categoriesData;

  // Encontrar la categoría actual
  const currentCategory = useMemo(() => {
    return categories.find(cat => cat.id === categoryId);
  }, [categoryId, categories]);

  // Filtrar productos por categoría
  const categoryProducts = useMemo(() => {
    if (!categoryId || !currentCategory) return [];
    return allProducts.filter(product => 
      product.category.toLowerCase() === currentCategory.name.toLowerCase()
    );
  }, [categoryId, currentCategory, allProducts]);

  // Si la categoría no existe, redirigir
  if (!currentCategory) {
    return (
      <div className="category-not-found">
        <h1>Categoría no encontrada</h1>
        <button onClick={() => navigate("/categorias")} className="back-button">
          Volver a categorías
        </button>
      </div>
    );
  }

  return (
    <div className="category-products-page">
      {/* Botón de volver */}
      <button 
        onClick={() => navigate("/categorias")} 
        className="back-to-categories"
      >
        ← Volver a categorías
      </button>

      {/* Componente reutilizable de grid de productos */}
      <ProductsGrid
        products={categoryProducts}
        categoryName={currentCategory.name}
        showSearch={true}
        emptyMessage={`No hay productos en la categoría ${currentCategory.name}`}
      />
    </div>
  );
};

export default CategoryProductsPage;
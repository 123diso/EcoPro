import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductsGrid from "../../components/ProductsGrid/ProductsGrid";
import { useAllProducts } from "../../context/AllProductsContext";
import type { Product } from "../../types/types";
import categoriesData from "../../assets/categories.json";
import productCardsData from "../../assets/productCards.json";
import "./CategoryProductsPage.css";

const exampleProducts: Product[] = productCardsData as unknown as Product[];

const CategoryProductsPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { allProducts, loading } = useAllProducts();

  // Cargar categorías desde archivos JSON
  const categories = categoriesData;

  // Encontrar la categoría actual
  const currentCategory = useMemo(() => {
    return categories.find(cat => cat.id === categoryId);
  }, [categoryId, categories]);

  // Combinar productos de ejemplo con productos reales y filtrar por categoría
  const categoryProducts = useMemo((): Product[] => {
    if (!categoryId || !currentCategory) return [];
    
    // Convertir productos de la BD al formato de Product
    const dbProducts: Product[] = allProducts.map(product => ({
      id: product.id,
      title: product.title,
      category: product.category,
      condition: product.condition,
      location: product.location,
      image: product.image,
      description: product.description
    }));

    // Combinar productos de ejemplo con productos reales
    const allProductsCombined = [...exampleProducts, ...dbProducts];
    
    // Filtrar por categoría
    return allProductsCombined.filter(product => 
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

  if (loading) {
    return (
      <div className="category-products-page">
        <div className="loading-container">
          <p>Cargando productos...</p>
        </div>
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
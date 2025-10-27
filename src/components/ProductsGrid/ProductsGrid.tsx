import React, { useMemo, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import SearchBar from "../SearchBar/SearchBar";
import "./ProductsGrid.css";
import type { Product } from "../../types/types";

interface ProductsGridProps {
  products: Product[];
  categoryName?: string;
  showSearch?: boolean;
  emptyMessage?: string;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  categoryName,
  showSearch = true,
  emptyMessage = "No se encontraron productos"
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrar productos basado en la búsqueda
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    
    return products.filter(product =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  return (
    <div className="products-grid-page">
      {/* Header con título de categoría */}
      {categoryName && (
        <div className="products-grid-header">
          <h1 className="products-grid-title">{categoryName}</h1>
          <p className="products-grid-count">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Barra de búsqueda */}
      {showSearch && (
        <div className="products-grid-search">
          <SearchBar 
            onSearch={setSearchQuery}
            placeholder="Buscar productos..."
            defaultValue={searchQuery}
          />
        </div>
      )}

      {/* Grid de productos */}
      <div className="products-grid-container">
        {filteredProducts.length === 0 ? (
          <div className="products-grid-empty">
            <div className="empty-icon">🔍</div>
            <h3>{emptyMessage}</h3>
            <p>Intenta con otros términos de búsqueda</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                category={product.category}
                condition={product.condition}
                location={product.location}
                image={product.image}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsGrid;
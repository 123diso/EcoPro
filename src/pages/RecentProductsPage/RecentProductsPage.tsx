import React, { useMemo} from "react";
import { useNavigate } from "react-router-dom";
import ProductsGrid from "../../components/ProductsGrid/ProductsGrid";
import { useAllProducts } from "../../context/AllProductsContext";
import type { Product } from "../../types/types";
import "./RecentProductsPage.css";

const RecentProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { allProducts, loading } = useAllProducts();

  const recentProducts = useMemo((): Product[] => {
    return [...allProducts]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map(product => ({
        id: product.id,
        title: product.title,
        category: product.category,
        condition: product.condition,
        location: product.location,
        image: product.image,
        description: product.description
      }));
  }, [allProducts]);

  if (loading && allProducts.length === 0) {
    return (
      <div className="recent-products-page">
        <div className="loading-container">
          <p>Cargando productos recientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-products-page">
      {/* Botón de volver */}
      <button 
        onClick={() => navigate(-1)} 
        className="back-to-home"
      >
        ← Volver al inicio
      </button>

      {/* Componente reutilizable de grid de productos */}
      <ProductsGrid
        products={recentProducts}
        categoryName="Todos los productos recientes"
        showSearch={true}
        emptyMessage="No hay productos recientes. ¡Sé el primero en publicar!"
      />
    </div>
  );
};

export default RecentProductsPage;
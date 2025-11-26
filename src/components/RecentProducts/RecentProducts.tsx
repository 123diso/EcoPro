import React from "react";
import ProductCard from "../ProductCard/ProductCard";
import Button from "../Button/Button";
import { useAllProducts } from "../../context/AllProductsContext";
import "./RecentProducts.css";

const RecentProducts: React.FC = () => {
  const { allProducts, loading } = useAllProducts();

  // Obtener solo los 4 productos más recientes
  const recentProducts = allProducts
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  if (loading && allProducts.length === 0) {
    return (
      <section className="recent-products">
        <div className="loading-container">
          <p>Cargando productos recientes...</p>
        </div>
      </section>
    );
  }

  if (recentProducts.length === 0) {
    return (
      <section className="recent-products">
        <header className="recent-products__header">
          <h2 className="recent-products__title">Añadidos Recientemente</h2>
        </header>
        <div className="no-recent-products">
          <div className="empty-icon">📦</div>
          <h3>No hay productos recientes</h3>
          <p>Sé el primero en publicar un producto</p>
          <Button to="/perfil" className="create-first-btn">
            Crear mi primera publicación
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="recent-products">
      <header className="recent-products__header">
        <h2 className="recent-products__title">Añadidos Recientemente</h2>
        <Button to="/recientes">Ver más</Button>
      </header>

      <div className="products-section__list">
        {recentProducts.map((product) => (
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
    </section>
  );
};

export default RecentProducts;
import React, { useMemo, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import HeroBanner from "../../components/HeroBanner/HeroBanner";
import SuggestedCard from "../../components/SuggestedCard/SuggestedCard";
import ProductCard from "../../components/ProductCard/ProductCard";
import MapBanner from "../../components/MapBanner/MapBanner";
import Button from "../../components/Button/Button";
import { useAllProducts } from "../../context/AllProductsContext";
import type { CardItem, Product } from "../../types/types";
import suggestedItemsData from "../../assets/suggestedItems.json";
import tradesItemsData from "../../assets/tradesItems.json";
import productCardsData from "../../assets/productCards.json";
import "./suggested.css";

const suggestedItems: CardItem[] = suggestedItemsData;
const tradesItems: CardItem[] = tradesItemsData;
const exampleProducts: Product[] = productCardsData as unknown as Product[];

const HomePage: React.FC = () => {
  const [query, setQuery] = useState("");
  const { allProducts, loading } = useAllProducts();

  const filteredSuggested = useMemo(
    () =>
      suggestedItems.filter((i) =>
        i.name.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  const filteredTrades = useMemo(
    () =>
      tradesItems.filter((i) =>
        i.name.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  // Combinar productos de ejemplo con productos reales de la base de datos
  const combinedProducts = useMemo(() => {
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

    // Combinar y eliminar duplicados (por título)
    const allProductsCombined = [...exampleProducts, ...dbProducts];
    const uniqueProducts = allProductsCombined.filter((product, index, self) =>
      index === self.findIndex(p => p.title === product.title)
    );

    return uniqueProducts;
  }, [allProducts]);

  // Productos "Según tus intereses" - filtrar por búsqueda
  const filteredProducts = useMemo(
    () =>
      combinedProducts
        .filter((p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 8), // Mostrar solo los 8 más recientes
    [combinedProducts, query]
  );

  if (loading) {
    return (
      <main style={{ padding: 24 }}>
        <div className="loading-container">
          <p>Cargando productos...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <SearchBar onSearch={setQuery} placeholder="Buscar por nombre..." />

      <HeroBanner />

      {/* Sugeridos */}
      <section className="suggested">
        <header className="suggested__header">
          <h2 className="suggested__title">Sugeridos de hoy</h2>
          <Button to="/sugeridos">Ver más</Button>
        </header>
        <div className="suggested__row">
          {filteredSuggested.map(({ id, name, image }) => (
            <SuggestedCard key={id} name={name} image={image} />
          ))}
        </div>
      </section>

      {/* Trueques */}
      <section className="suggested">
        <header className="suggested__header">
          <h2 className="suggested__title">Trueques cerca de ti</h2>
          <Button to="/trueques">Ver más</Button>
        </header>
        <div className="suggested__row">
          {filteredTrades.map(({ id, name, image }) => (
            <SuggestedCard key={id} name={name} image={image} />
          ))}
        </div>
      </section>

      {/* Según tus intereses - Productos combinados (ejemplo + reales) */}
      <section className="products-section">
        <header className="products-section__header">
          <h2 className="suggested__title">Productos disponibles</h2>
          <Button to="/categorias">Ver más →</Button>
        </header>

        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <p>No hay productos disponibles. ¡Sé el primero en publicar!</p>
          </div>
        ) : (
          <div className="products-section__list">
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
      </section>

      {/* Banner del Mapa */}
      <MapBanner />
    </main>
  );
};

export default HomePage;
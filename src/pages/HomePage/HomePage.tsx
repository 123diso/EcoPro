import React, { useMemo, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import HeroBanner from "../../components/HeroBanner/HeroBanner";
import SuggestedCard from "../../components/SuggestedCard/SuggestedCard";
import ProductCard from "../../components/ProductCard/ProductCard";
import MapBanner from "../../components/MapBanner/MapBanner";
import Button from "../../components/Button/Button";
import type { CardItem } from "../../types";
import suggestedItemsData from "../../assets/suggestedItems.json";
import tradesItemsData from "../../assets/tradesItems.json";
import productCardsData from "../../assets/productCards.json";
import "./suggested.css";


const suggestedItems: CardItem[] = suggestedItemsData;
const tradesItems: CardItem[] = tradesItemsData;


interface ProductData {
  id: number;
  title: string;
  category: string;
  condition: string;
  location: string;
  image?: string;
}


const products: ProductData[] = productCardsData as unknown as ProductData[];


const HomePage: React.FC = () => {
  const [query, setQuery] = useState("");

  // Filtros de búsqueda
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

  const filteredProducts = useMemo(
    () =>
      products.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

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

      {/* Productos */}
      <section className="products-section">
        <header className="products-section__header">
          <h2 className="suggested__title">Según tus intereses</h2>
          <Button to="/productos">Ver más →</Button>
        </header>

        <div className="products-section__list">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              title={p.title}
              category={p.category}
              condition={p.condition}
              location={p.location}
              image={p.image}
            />
          ))}
        </div>
      </section>

      <MapBanner />
    </main>
  );
};

export default HomePage;

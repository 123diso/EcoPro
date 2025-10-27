import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Product, DandiPoint, ProductFormData } from "../../types/types";
import productsRaw from "../../assets/productCards.json";
import ProductRegisterModal from "../../components/ProductRegisterModal/ProductRegisterModal";
import pointsRaw from "../../assets/dandiPoints.json";
import LeafletMap from "../../components/Map/LeafletMap";
import SaveButton from "../../components/SaveButton/SaveButton";
import { useUserProducts } from "../../context/UserProductsContext";
import "./ProductDetail.css";

const products: Product[] = productsRaw as Product[];
const points: DandiPoint[] = pointsRaw as DandiPoint[];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { addProduct } = useUserProducts();

  const product = products.find((p) => String(p.id) === id);

  const matchedPoint: DandiPoint | null = useMemo(() => {
    if (!product?.location) return null;
    const norm = (s: string) =>
      s
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase();
    const target = norm(product.location);
    return (
      points.find((p) => target.includes(norm(p.name))) ??
      points.find((p) => norm(p.name).includes(target)) ??
      null
    );
  }, [product?.location]);

  const nearby: DandiPoint[] = useMemo(() => {
    if (!matchedPoint) return [];
    return points.filter((p) => p.id !== matchedPoint.id);
  }, [matchedPoint]);

  const handleTradeClick = () => {
    setShowRegisterModal(true);
  };

  const handleRegisterProduct = async (productData: ProductFormData) => {
    try {
      await addProduct({
        title: productData.name,
        category: productData.category,
        description: productData.description,
        condition: productData.condition,
        image: productData.image,
        location: "Tu ubicación"
      });
      setShowRegisterModal(false);
      // Opcional: mostrar mensaje de éxito o redirigir
      console.log("Producto registrado exitosamente");
    } catch (error) {
      console.error("Error al registrar producto:", error);
    }
  };

  if (!product) {
    return (
      <main className="prod-layout">
        <section className="prod-left">
          <button className="back" onClick={() => navigate(-1)}>
            ←
          </button>
          <p>Producto no encontrado.</p>
        </section>
      </main>
    );
  }

  const gallery =
    product.images && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];

  return (
    <>
      <main className="prod-layout">
        {/* Columna izquierda */}
        <section className="prod-left">
          <button className="back" onClick={() => navigate(-1)}>
            ←
          </button>

          {/* Hero card */}
          <article className="prod-hero">
            <div className="prod-hero__image">
              <div
                className="prod-hero__image-ph"
                style={{
                  backgroundImage: gallery[0] ? `url(${gallery[0]})` : "none",
                }}
              />
            </div>

            <div className="prod-hero__body">
              <div className="prod-hero__row">
                <h1 className="prod-title">{product.title}</h1>
                <SaveButton />
              </div>

              <div className="prod-mini">
                <div className="prod-meta">
                  <div className="prod-cat">{product.category}</div>
                  <div className="prod-cond">
                    Estado: <strong>{product.condition}</strong>
                  </div>
                  <div className="prod-loc">{product.location}</div>
                </div>

                {/* mini-galería */}
                <div className="prod-thumbs">
                  {gallery.slice(0, 5).map((src, i) => (
                    <div
                      key={i}
                      className="thumb"
                      style={{ backgroundImage: `url(${src})` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* Detalles */}
          <h2 className="section-title">Detalles</h2>
          <p className="prod-desc">
            {product.description ??
              "Descripción no disponible. Este artículo se ofrece para trueque en la ubicación indicada."}
          </p>

          {/* Publicado por */}
          <div className="seller">
            <div className="seller__title">Publicado por:</div>
            <div className="seller__card">
              <img className="seller__avatar" src="/avatars/default.png" alt="" />
              <div className="seller__info">
                <div className="seller__name">
                  {product.sellerName ?? "Usuario Dandi"}
                </div>
                <div className="seller__stats">
                  {product.sellerRating ?? "★ 4.5/5"} •{" "}
                  {product.sellerStats ?? "14+ trueques"}
                </div>
              </div>
              <button className="seller__btn" aria-label="Contactar">
                ✳
              </button>
            </div>
          </div>

          {/* Información del trueque */}
          <div className="info-box">
            <div className="info-title">Información del trueque</div>
            <ul>
              <li>Condición: {product.condition}</li>
              <li>Intercambio por artículos de valor similar</li>
              <li>
                Estado del ítem:{" "}
                {product.condition === "Nuevo" ? "Nuevo" : "Usado"}
              </li>
              <li>Disponibilidad: Disponible</li>
            </ul>
          </div>

          {/* Acciones */}
          <div className="actions">
            <button className="btn-primary" onClick={handleTradeClick}>
              Hacer trueque
            </button>
            <button className="btn-ghost">Reportar</button>
          </div>
        </section>

        {/* Columna derecha: Mapa pequeño */}
        <section className="prod-right">
          <div className="map-card">
            <LeafletMap
              points={matchedPoint ? [matchedPoint, ...nearby] : []}
              selectedPoint={matchedPoint ?? null}
              initialCenter={
                matchedPoint
                  ? { lat: matchedPoint.lat, lng: matchedPoint.lng }
                  : { lat: 3.405, lng: -76.538 }
              }
              initialZoom={15}
            />
          </div>
        </section>
      </main>

      {/* Modal de registro de producto */}
      <ProductRegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegisterProduct}
      />
    </>
  );
}
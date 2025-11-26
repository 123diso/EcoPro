import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAllProducts } from "../../context/AllProductsContext";
import { useTrades } from "../../context/TradesContext";
import { useAuth } from "../../context/useAuthContext";
import { useUserProducts } from "../../context/UserProductsContext";
import type { DandiPoint, ProductFormData, Product, BasicProduct } from "../../types/types";
import ProductRegisterModal from "../../components/ProductRegisterModal/ProductRegisterModal";
import pointsRaw from "../../assets/dandiPoints.json";
import productCardsData from "../../assets/productCards.json";
import LeafletMap from "../../components/Map/LeafletMap";
import SaveButton from "../../components/SaveButton/SaveButton";
import "./ProductDetail.css";

const points: DandiPoint[] = pointsRaw as DandiPoint[];
const exampleProducts: BasicProduct[] = productCardsData as unknown as BasicProduct[];

interface ExtendedProduct extends BasicProduct {
  user_id?: string;
  user_name?: string;
  user_email?: string;
  created_at?: string;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerStatus, setRegisterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { addProduct } = useUserProducts();
  const { allProducts, refreshProducts } = useAllProducts();
  const { createTrade } = useTrades();
  const { user } = useAuth();
  const { userProducts } = useUserProducts();

  // Buscar producto en productos combinados (ejemplo + reales)
  const product = useMemo(() => {
    if (!id) return undefined;

    // Convertir productos de la BD al formato de Product extendido
    const dbProducts: ExtendedProduct[] = allProducts.map(product => ({
      id: product.id,
      title: product.title,
      category: product.category,
      condition: product.condition,
      location: product.location,
      image: product.image,
      description: product.description,
      user_id: product.user_id,
      user_name: (product as any).user_name,
      user_email: (product as any).user_email,
      created_at: product.created_at
    }));

    // Combinar productos de ejemplo con productos reales
    const allProductsCombined = [...exampleProducts, ...dbProducts];
    
    // Buscar el producto por ID
    return allProductsCombined.find((p) => String(p.id) === id) as ExtendedProduct | undefined;
  }, [allProducts, id]);

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
    setRegisterStatus("loading");
    try {
      await addProduct({
        title: productData.name,
        category: productData.category,
        description: productData.description,
        condition: productData.condition,
        image: productData.image,
        location: productData.location
      });
      
      // Refrescar todos los productos para que aparezca inmediatamente
      await refreshProducts();
      
      setRegisterStatus("success");
      setShowRegisterModal(false);
      
      setTimeout(() => {
        setRegisterStatus("idle");
      }, 2000);
      
    } catch (error) {
      console.error("Error al registrar producto:", error);
      setRegisterStatus("error");
      
      setTimeout(() => {
        setRegisterStatus("idle");
      }, 3000);
    }
  };

  const handleProposeTrade = async () => {
    if (!user) {
      alert('Debes iniciar sesión para proponer un trueque');
      return;
    }

    if (!product || !product.user_id) {
      alert('No se puede proponer trueque para este producto');
      return;
    }

    if (userProducts.length === 0) {
      alert('Necesitas tener productos publicados para proponer un trueque');
      return;
    }

    // Por simplicidad, usar el primer producto del usuario
    const userProductToOffer = userProducts[0];
    
    try {
      await createTrade(userProductToOffer.id, String(product.id), user.id, product.user_id);
      alert('✅ Propuesta de trueque enviada correctamente');
    } catch (error) {
      console.error('Error proponiendo trueque:', error);
      alert('❌ Error al enviar la propuesta de trueque');
    }
  };

  const getRegisterStatusMessage = () => {
    switch (registerStatus) {
      case "loading":
        return "Registrando producto...";
      case "success":
        return "Producto registrado exitosamente!";
      case "error":
        return "Error al registrar el producto. Intenta nuevamente.";
      default:
        return "";
    }
  };

  if (!product) {
    return (
      <main className="prod-layout">
        <section className="prod-left">
          <button className="back" onClick={() => navigate(-1)}>
            Volver
          </button>
          <p>Producto no encontrado.</p>
        </section>
      </main>
    );
  }

  const gallery = product.image ? [product.image] : [];

  return (
    <>
      <main className="prod-layout">
        {/* Columna izquierda */}
        <section className="prod-left">
          <button className="back" onClick={() => navigate(-1)}>
            Volver
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
                <SaveButton 
                  id={product.id}
                  title={product.title}
                  category={product.category}
                  condition={product.condition}
                  location={product.location}
                  image={product.image}
                />
              </div>

              <div className="prod-mini">
                <div className="prod-meta">
                  <div className="prod-cat">{product.category}</div>
                  <div className="prod-cond">
                    Estado: <strong>{product.condition}</strong>
                  </div>
                  <div className="prod-loc">{product.location}</div>
                </div>

                {/* mini-galeria */}
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
            {product.description || "Descripción no disponible. Este artículo se ofrece para trueque en la ubicación indicada."}
          </p>

          {/* Publicado por */}
          <div className="seller">
            <div className="seller__title">Publicado por:</div>
            <div className="seller__card">
              <img className="seller__avatar" src="/avatars/default.png" alt="" />
              <div className="seller__info">
                <div className="seller__name">
                  {product.user_name || "Usuario Dandi"}
                </div>
                <div className="seller__stats">
                  Miembro de Dandi
                </div>
              </div>
              <button className="seller__btn" aria-label="Contactar">
                Contactar
              </button>
            </div>
          </div>

          {/* Informacion del trueque */}
          <div className="info-box">
            <div className="info-title">Informacion del trueque</div>
            <ul>
              <li>Condicion: {product.condition}</li>
              <li>Intercambio por articulos de valor similar</li>
              <li>
                Estado del item:{" "}
                {product.condition === "Nuevo" ? "Nuevo" : "Usado"}
              </li>
              <li>Disponibilidad: Disponible</li>
            </ul>
          </div>

          {/* Acciones */}
          <div className="actions">
            <button 
              className="btn-primary" 
              onClick={handleTradeClick}
              disabled={registerStatus === "loading"}
            >
              {registerStatus === "loading" ? "Registrando..." : "Hacer trueque"}
            </button>
            
            {/* Botón para proponer trueque - solo mostrar si el usuario no es el dueño */}
            {user && product.user_id && user.id !== product.user_id && (
              <button 
                className="btn-trade-proposal"
                onClick={handleProposeTrade}
              >
                🔄 Proponer Trueque
              </button>
            )}
            
            <button className="btn-ghost">Reportar</button>
          </div>

          {/* Mensaje de estado del registro */}
          {registerStatus !== "idle" && (
            <div className={`register-status ${registerStatus}`}>
              {getRegisterStatusMessage()}
            </div>
          )}
        </section>

        {/* Columna derecha: Mapa pequeno */}
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
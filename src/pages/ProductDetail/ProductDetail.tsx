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
import { createTrade } from "../../services/tradeService";
import { useAuth } from "../../context/useAuthContext";
import { createReport } from "../../services/reportService";
import ReportModal from "../../components/ReportModal/ReportModal"; 

const products: Product[] = productsRaw as Product[];
const points: DandiPoint[] = pointsRaw as DandiPoint[];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false); 
  const [registerStatus, setRegisterStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const { addProduct } = useUserProducts();
  const { user } = useAuth();

  const product = products.find((p) => String(p.id) === id);

  const matchedPoint: DandiPoint | null = useMemo(() => {
    if (!product?.location) return null;
    const norm = (s: string) =>
      s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
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


  const handleSubmitReport = async (title: string, description: string) => {
    if (!user || !product?.id) {
      alert("Debes iniciar sesión para reportar un producto.");
      return;
    }

    try {
      await createReport({
        product_id: String(product.id),
        user_id: user.id,
        title,
        description,
      });

      alert("Reporte enviado correctamente.");
      setShowReportModal(false);
    } catch (error) {
      console.error("Error al enviar reporte:", error);
      alert("Ocurrió un error al enviar el reporte.");
    }
  };

  const handleRegisterProduct = async (productData: ProductFormData) => {
    setRegisterStatus("loading");
    try {
      const newProduct = await addProduct({
        title: productData.name,
        category: productData.category,
        description: productData.description,
        condition: productData.condition,
        image: productData.image,
        location: "Tu ubicación",
      });

      if (newProduct?.id && product?.id) {
        await createTrade(newProduct.id, String(product.id));
      }

      setRegisterStatus("success");
      setShowRegisterModal(false);

      setTimeout(() => {
        setRegisterStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("Error al registrar producto o crear trueque:", error);
      setRegisterStatus("error");

      setTimeout(() => {
        setRegisterStatus("idle");
      }, 3000);
    }
  };

  const getRegisterStatusMessage = () => {
    switch (registerStatus) {
      case "loading":
        return "Registrando producto...";
      case "success":
        return "¡Trueque creado exitosamente!";
      case "error":
        return "Error al registrar el trueque. Intenta nuevamente.";
      default:
        return "";
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
        <section className="prod-left">
          <button className="back" onClick={() => navigate(-1)}>
            ←
          </button>

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
                  id={String(product.id)}
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

          <h2 className="section-title">Detalles</h2>
          <p className="prod-desc">
            {product.description ??
              "Descripción no disponible. Este artículo se ofrece para trueque en la ubicación indicada."}
          </p>

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

          <div className="actions">
            <button
              className="btn-primary"
              onClick={handleTradeClick}
              disabled={registerStatus === "loading"}
            >
              {registerStatus === "loading"
                ? "Registrando..."
                : "Hacer trueque"}
            </button>

            {/*  BOTÓN DE REPORTAR */}
            <button
              className="btn-ghost"
              onClick={() => setShowReportModal(true)}
            >
              Reportar
            </button>
          </div>

          {registerStatus !== "idle" && (
            <div className={`register-status ${registerStatus}`}>
              {getRegisterStatusMessage()}
            </div>
          )}
        </section>

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

      {/*  Modal de registro de producto */}
      <ProductRegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegisterProduct}
      />

      {/*  Modal de reporte */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleSubmitReport}
      />
    </>
  );
}

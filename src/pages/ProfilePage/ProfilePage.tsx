import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuthContext";
import { useSaved } from "../../context/SavedContext";
import { useUserProducts } from "../../context/UserProductsContext";
import { useAllProducts } from "../../context/AllProductsContext";
import ProductCard from "../../components/ProductCard/ProductCard";
import ProductPublishModal from "../../components/ProductPublishModal/ProductPublishModal";
import type { ProductFormData } from "../../types/types";
import "./ProfilePage.css";

export const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"guardados" | "posts">("posts");
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishStatus, setPublishStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { saved } = useSaved();
  const { userProducts, fetchUserProducts, addProduct } = useUserProducts();
  const { refreshProducts } = useAllProducts();

  useEffect(() => {
    fetchUserProducts();
  }, [fetchUserProducts]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const handleEdit = () => {};

  const handleCreatePost = () => {
    setShowPublishModal(true);
  };

  const handlePublishProduct = async (productData: ProductFormData) => {
    setPublishStatus("loading");
    try {
      await addProduct({
        title: productData.name,
        category: productData.category,
        description: productData.description,
        condition: productData.condition,
        image: productData.image,
        location: productData.location
      });
      
      // Refrescar todos los productos para que aparezca inmediatamente en toda la app
      await refreshProducts();
      
      setPublishStatus("success");
      setShowPublishModal(false);
      
      // Recargar los productos del usuario
      await fetchUserProducts();
      
      setTimeout(() => {
        setPublishStatus("idle");
      }, 2000);
      
    } catch (error) {
      console.error("Error al publicar producto:", error);
      setPublishStatus("error");
      
      setTimeout(() => {
        setPublishStatus("idle");
      }, 3000);
    }
  };

  const savedList = Object.values(saved.products);

  return (
    <>
      <div className="profile-page">
        <div className="profile-content">
          {/* Banner */}
          <div className="profile-banner">
            <div className="banner-image"></div>
          </div>

          {/* Profile Info */}
          <div className="profile-info">
            <div className="profile-picture">
              <div className="avatar-large">
                {(
                  user?.user_metadata?.username ||
                  user?.user_metadata?.full_name ||
                  user?.email ||
                  "U"
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>
            </div>

            <div className="profile-details">
              <h1 className="profile-name">
                {user?.user_metadata?.username ||
                  user?.user_metadata?.full_name ||
                  "Usuario"}
              </h1>
              <p className="profile-posts">{userProducts.length} Publicaciones</p>
              <div className="profile-rating">
                <span>⭐ 4.5/5</span>
              </div>
            </div>

            <div className="profile-actions">
              <button onClick={handleSignOut} className="action-button logout">
                Cerrar sesión
              </button>
              <button onClick={handleEdit} className="action-button edit">
                Editar
              </button>
            </div>
          </div>

          {/* Botón para crear nueva publicación */}
          <div className="create-post-section">
            <button className="create-post-button" onClick={handleCreatePost}>
              📦 Crear Nueva Publicación
            </button>
            
            {publishStatus !== "idle" && (
              <div className={`publish-status ${publishStatus}`}>
                {publishStatus === "loading" && "📤 Publicando producto..."}
                {publishStatus === "success" && "✅ ¡Producto publicado exitosamente!"}
                {publishStatus === "error" && "❌ Error al publicar el producto"}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="posts-section">
            <div className="posts-header">
              <h2 className="posts-title">Mi Perfil</h2>
              <div className="posts-tabs">
                <button
                  className={`tab ${activeTab === "guardados" ? "active" : ""}`}
                  onClick={() => setActiveTab("guardados")}
                >
                  ❤️ Guardados
                </button>
                <button
                  className={`tab ${activeTab === "posts" ? "active" : ""}`}
                  onClick={() => setActiveTab("posts")}
                >
                  📦 Mis Publicaciones ({userProducts.length})
                </button>
              </div>
            </div>

            {activeTab === "guardados" && (
              <div className="items-grid">
                {savedList.length === 0 ? (
                  <p className="saved-empty">No has guardado ninguna publicación.</p>
                ) : (
                  savedList.map((p) => (
                    <ProductCard
                      key={String(p.id)}
                      id={Number(p.id)}
                      title={p.title}
                      image={p.image}
                      category={p.category ?? ""}
                      condition={p.condition ?? ""}
                      location={p.location ?? ""}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === "posts" && (
              <div className="items-grid">
                {userProducts.length === 0 ? (
                  <p className="saved-empty">
                    Aún no tienes publicaciones. ¡Crea tu primera publicación!
                  </p>
                ) : (
                  userProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      title={product.title}
                      image={product.image}
                      category={product.category}
                      condition={product.condition}
                      location={product.location}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de publicación de producto */}
      <ProductPublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onPublish={handlePublishProduct}
      />
    </>
  );
};
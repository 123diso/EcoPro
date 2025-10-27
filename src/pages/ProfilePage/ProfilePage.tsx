import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuthContext";
import { useSaved } from "../../context/SavedContext";
import { useUserProducts } from "../../context/UserProductsContext";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./ProfilePage.css";

export const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"guardados" | "posts">("posts");
  const { saved } = useSaved();
  const { userProducts, fetchUserProducts } = useUserProducts();

  useEffect(() => {
    fetchUserProducts();
  }, [fetchUserProducts]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const handleEdit = () => {};
  const handleMessage = () => {};

  const savedList = Object.values(saved.products);

  return (
    <div className="profile-page">
      <div className="profile-content">
        <div className="profile-banner">
          <div className="banner-image"></div>
        </div>

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
            <p className="profile-posts">{userProducts.length} Posts</p>
            <div className="profile-rating">
              <span>Rating: 4.5</span>
            </div>
          </div>

          <div className="profile-actions">
            <button onClick={handleSignOut} className="action-button logout">
              Cerrar sesión
            </button>
            <button onClick={handleEdit} className="action-button edit">
              Edit
            </button>
            <button onClick={handleMessage} className="action-button message">
              Message
            </button>
          </div>
        </div>

        <div className="posts-section">
          <div className="posts-header">
            <h2 className="posts-title">Perfil</h2>
            <div className="posts-tabs">
              <button
                className={`tab ${activeTab === "guardados" ? "active" : ""}`}
                onClick={() => setActiveTab("guardados")}
              >
                Guardados
              </button>
              <button
                className={`tab ${activeTab === "posts" ? "active" : ""}`}
                onClick={() => setActiveTab("posts")}
              >
                Mis Posts ({userProducts.length})
              </button>
            </div>
          </div>

          {activeTab === "guardados" && (
            <div className="items-grid">
              {savedList.length === 0 ? (
                <p className="saved-empty">No has guardado ningún post.</p>
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
                  No has publicado ningún producto aún.
                </p>
              ) : (
                userProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={Number(product.id)}
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

        {user && (
          <div className="admin-access">
            <button
              className="admin-button"
              onClick={() => navigate("/admin")}
            >
              Ir al panel de administrador
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

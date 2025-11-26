import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/HomePage/HomePage";
import MapPage from "./pages/MapPage/MapPage";
import PuntoDetalle from "./pages/PuntoDetalle/PuntoDetalle";
import RecentProductsPage from "./pages/RecentProductsPage/RecentProductsPage";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { RegisterPage } from "./pages/RegisterPage/RegisterPage";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import NotificationsPage from "./pages/NotificationsPage/NotificationsPage";
import CategoriesPage from "./pages/CategoriesPage/CategoriesPage";
import CategoryProductsPage from "./pages/CategoryProductsPage/CategoryProductsPage";
import { AuthProvider } from "./context/AuthContextProvider";
import { useAuth } from "./context/useAuthContext";
import { SavedProvider } from "./context/SavedContext";
import { UserProductsProvider } from "./context/UserProductsContext";
import { SettingsProvider } from "./context/SettingsContext";
import { AllProductsProvider } from "./context/AllProductsContext";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import "./App.css";
import TradeDetails from "./pages/Trades/TradeDetails";
import TradeConfirm from "./pages/Trades/TradeConfirm";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";

/* ---------- Layout autenticado ---------- */
const Layout: React.FC = () => (
  <SavedProvider>
    <UserProductsProvider>
      <SettingsProvider>
        <AllProductsProvider>
          <Navbar />
          <Outlet />
        </AllProductsProvider>
      </SettingsProvider>
    </UserProductsProvider>
  </SavedProvider>
);

/* ---------- Layout protegido ---------- */
const ProtectedLayout: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return <main style={{ padding: 24 }}>Cargando...</main>;
  if (!user) return <Navigate to="/login" replace />;

  return <Layout />;
};

/* ---------- Rutas públicas ---------- */
const PublicLogin: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return <main style={{ padding: 24 }}>Cargando...</main>;
  if (user) return <Navigate to="/" replace />;

  return <LoginPage />;
};

const PublicRegister: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return <main style={{ padding: 24 }}>Cargando...</main>;
  if (user) return <Navigate to="/" replace />;

  return <RegisterPage />;
};

/* ---------- Definición de rutas ---------- */
const router = createBrowserRouter([
  // Públicas
  { path: "/login", element: <PublicLogin /> },
  { path: "/register", element: <PublicRegister /> },

  // Protegidas
{
  path: "/",
  element: <ProtectedLayout />,
  children: [
    { index: true, element: <HomePage /> },
    { path: "mapa", element: <MapPage /> },
    { path: "categorias", element: <CategoriesPage /> },
    { path: "categoria/:categoryId", element: <CategoryProductsPage /> },
    { path: "punto/:id", element: <PuntoDetalle /> },
    { path: "recientes", element: <RecentProductsPage /> },
    { path: "perfil", element: <ProfilePage /> },
    { path: "configuracion", element: <SettingsPage /> },
    { path: "producto/:id", element: <ProductDetail /> },
    { path: "notificaciones", element: <NotificationsPage /> },
    { path: "trade/:id", element: <TradeDetails /> },
    { path: "trade/confirm", element: <TradeConfirm /> },
    { path: "admin", element: <AdminDashboard /> },


    { path: "*", element: <Navigate to="/" replace /> },
  ],
}
]);

/* ---------- Render principal ---------- */
export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
// App.tsx
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
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { RegisterPage } from "./pages/RegisterPage/RegisterPage";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage"; // 👈 tu página de perfil
import { AuthProvider } from "./context/AuthContextProvider"; // 👈 provider de auth
import { useAuth } from "./context/useAuthContext"; // 👈 hook de auth
import { SavedProvider } from "./context/SavedContext"; // 👈 provider de SavedContext
import "./App.css";

/* ---------- Layout autenticado ---------- */
const Layout: React.FC = () => (
  <SavedProvider>
    <Navbar />
    <Outlet />
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
      { path: "punto/:id", element: <PuntoDetalle /> },
      { path: "perfil", element: <ProfilePage /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

/* ---------- Render principal ---------- */
export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

// App.tsx
import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/HomePage/HomePage";
import MapPage from "./pages/MapPage/MapPage";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard"; 
import "./App.css";

const Layout: React.FC = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "mapa", element: <MapPage /> },
      { path: "admin", element: <AdminDashboard 
        branchName={""} userName={""} stats={{
        activeTrades: 0,
        upcomingItems: 0,
        unresolvedReports: 0
      }} alerts={[]} /> }, 
      {
        path: "*",
        element: <main style={{ padding: 24 }}>Página no encontrada</main>,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

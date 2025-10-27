import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import type { NavIcon } from "../../types";
import navIconsData from "../../assets/navIcons.json";

const navIcons: NavIcon[] = navIconsData;

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleIconClick = (alt: string) => {
    if (alt === "User") {
      navigate("/perfil");
    } else if (alt === "Chat") {
      navigate("/notificaciones");
    } else if (alt === "Menu") {
      navigate("/configuracion");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src="/imgDandi.png" alt="Dandi logo" className="navbar-logo" />
      </div>

      <ul className="navbar-nav">
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/mapa"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Mapa
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/categorias"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Categorías
          </NavLink>
        </li>
      </ul>

      <div className="navbar-icons">
        {navIcons.map(({ id, src, alt }) => (
          <img
            key={id}
            src={src}
            alt={alt}
            className="nav-icon"
            onClick={() => handleIconClick(alt)}
            style={{ cursor: "pointer" }}
          />
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
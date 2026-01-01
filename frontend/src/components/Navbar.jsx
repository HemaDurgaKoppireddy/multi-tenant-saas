import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const role = user?.role;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const closeAll = () => {
      setDropdownOpen(false);
      setMenuOpen(false);
    };
    window.addEventListener("click", closeAll);
    return () => window.removeEventListener("click", closeAll);
  }, []);

  const linkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar" onClick={(e) => e.stopPropagation()}>
      {/* LEFT */}
      <div className="navbar-left">
        <span className="logo" onClick={() => navigate("/dashboard")}>
          MultiTenant SaaS
        </span>
      </div>

      {/* CENTER LINKS */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li>
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/projects" className={linkClass}>
            Projects
          </NavLink>
        </li>

        {(role === "tenant_admin" || role === "super_admin") && (
          <li>
            <NavLink to="/tasks" className={linkClass}>
              Tasks
            </NavLink>
          </li>
        )}

        {role === "tenant_admin" && (
          <li>
            <NavLink to="/users" className={linkClass}>
              Users
            </NavLink>
          </li>
        )}

        {role === "super_admin" && (
          <li>
            <NavLink to="/tenants" className={linkClass}>
              Tenants
            </NavLink>
          </li>
        )}
      </ul>

      {/* RIGHT */}
      <div className="navbar-right">
        {/* USER MENU */}
        <div
          className="user-menu"
          onClick={(e) => {
            e.stopPropagation();
            setDropdownOpen(!dropdownOpen);
          }}
        >
          <span className="user-name">
            {user?.fullName} <small>({role})</small>
          </span>

          {dropdownOpen && (
            <div className="dropdown">
              <button onClick={() => navigate("/profile")}>Profile</button>
              <button onClick={() => navigate("/settings")}>Settings</button>
              <button className="logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>

        {/* HAMBURGER */}
        <button
          className="hamburger"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
        >
          ☰
        </button>
      </div>
    </nav>
  );
}

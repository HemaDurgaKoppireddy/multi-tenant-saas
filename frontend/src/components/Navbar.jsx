import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";


export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const role = user?.role;

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h3 className="logo">MultiTenant SaaS</h3>
        <button className="hamburger" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>

      <ul className={`nav-links ${open ? "open" : ""}`}>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/projects">Projects</Link></li>

        {(role === "tenant_admin" || role === "super_admin") && (
          <li><Link to="/tasks">Tasks</Link></li>
        )}

        {role === "tenant_admin" && (
          <li><Link to="/users">Users</Link></li>
        )}

        {role === "super_admin" && (
          <li><Link to="/tenants">Tenants</Link></li>
        )}
      </ul>

      <div className="nav-user">
        <span>{user?.fullName} ({role})</span>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}

import { useState, useEffect } from "react";
import "../styles/Navbar.css";

export default function Navbar() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <span className="logo-main">PrintHub</span>
        <span className="logo-sub">Purmerend</span>
      </div>

      <div className="nav-links">
        <a href="#">Upload</a>
        <a href="#">Inloggen</a>
      </div>

      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === "light" ? "🌙" : "☀️"}
      </button>
    </nav>
  );
}
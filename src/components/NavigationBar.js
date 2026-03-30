import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import socket from "../socket";
import OrbitLogo from "./OrbitLogo";

function NavigationBar() {
  const [host, setHost] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    const user = localStorage.getItem("user");
    socket.emit("remove-user", user);
    localStorage.clear();
    setHost("");
    navigate("/login");
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .post("http://localhost:3500/user-api/pathjump", { token })
      .then((res) => {
        if (res.data.success !== true) {
          localStorage.clear();
          setHost("");
          navigate("/");
        } else {
          setHost(localStorage.getItem("user") || "");
        }
      })
      .catch(() => {});
  }, [localStorage.getItem("user")]);

  return (
    <nav className="navbar-custom" style={{ position: "relative" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {/* Brand */}
        <NavLink
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <div className="logo-mark"><OrbitLogo /></div>
          <span className="brand-text">OrbitChat</span>
        </NavLink>

        {/* Desktop links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
          className="d-none d-md-flex"
        >
          {!host && (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  "nav-pill" + (isActive ? " active-link" : "")
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  "nav-pill" + (isActive ? " active-link" : "")
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                style={{
                  background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
                  backgroundSize: "200% 200%",
                  color: "white",
                  padding: "8px 20px",
                  borderRadius: 50,
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: "none",
                  animation: "gradientShift 3s ease infinite",
                  transition: "all 0.3s",
                }}
              >
                Register
              </NavLink>
            </>
          )}
          {host && (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 50,
                  padding: "6px 14px",
                  fontSize: 13,
                  color: "var(--color-text-subtle)",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 800,
                    color: "white",
                  }}
                >
                  {host.charAt(0).toUpperCase()}
                </div>
                {host}
              </div>
              <button className="btn-nav-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="d-md-none"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 6,
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: 22,
                height: 2,
                background: "var(--color-text-subtle)",
                borderRadius: 2,
                transition: "all 0.3s",
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="d-md-none glass-dark"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            padding: "16px",
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            borderTop: "1px solid var(--glass-border)",
          }}
        >
          {!host && (
            <>
              <NavLink
                to="/"
                className="nav-pill"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/login"
                className="nav-pill"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="nav-pill"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </NavLink>
            </>
          )}
          {host && (
            <button
              className="btn-nav-logout"
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default NavigationBar;

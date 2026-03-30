import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { BiHide, BiShow } from "react-icons/bi";
import { NavLink, useNavigate } from "react-router-dom";
import socket from "../socket";
import OrbitLogo from "./OrbitLogo";

function AuthIllustration() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 32px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Orbs */}
      <div
        style={{
          position: "absolute",
          top: -60,
          left: -60,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.3), transparent)",
          filter: "blur(60px)",
          animation: "orbPulse 6s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -40,
          right: -40,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.25), transparent)",
          filter: "blur(50px)",
          animation: "orbPulse 8s ease-in-out infinite",
          animationDelay: "-3s",
        }}
      />

      {/* SVG Chat Illustration */}
      <div style={{ animation: "float 7s ease-in-out infinite", position: "relative", zIndex: 1 }}>
        <svg
          viewBox="0 0 320 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", maxWidth: 300 }}
        >
          <defs>
            <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id="lg3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0891b2" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>

          {/* Background glow circle */}
          <circle cx="160" cy="140" r="120" fill="url(#lg1)" opacity="0.06" />

          {/* Main bubble (left / received) */}
          <rect x="24" y="40" width="200" height="88" rx="20" fill="url(#lg1)" opacity="0.85" />
          <polygon points="44,128 84,128 44,152" fill="url(#lg1)" opacity="0.85" />
          {/* Text lines */}
          <rect x="44" y="62" width="110" height="9" rx="4.5" fill="rgba(255,255,255,0.55)" />
          <rect x="44" y="80" width="150" height="9" rx="4.5" fill="rgba(255,255,255,0.55)" />
          <rect x="44" y="98" width="90" height="9" rx="4.5" fill="rgba(255,255,255,0.55)" />

          {/* Secondary bubble (right / sent) */}
          <rect x="96" y="166" width="196" height="72" rx="20" fill="url(#lg2)" opacity="0.8" />
          <polygon points="284,238 260,238 284,258" fill="url(#lg2)" opacity="0.8" />
          {/* Text lines */}
          <rect x="116" y="184" width="120" height="8" rx="4" fill="rgba(255,255,255,0.55)" />
          <rect x="116" y="200" width="88" height="8" rx="4" fill="rgba(255,255,255,0.55)" />

          {/* Avatar A */}
          <circle cx="44" cy="174" r="22" fill="url(#lg1)" />
          <text x="44" y="180" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">A</text>

          {/* Avatar B */}
          <circle cx="276" cy="270" r="22" fill="url(#lg2)" />
          <text x="276" y="276" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">B</text>

          {/* Notification badge */}
          <circle cx="268" cy="46" r="14" fill="#ef4444" />
          <text x="268" y="51" textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="Inter, sans-serif">3</text>

          {/* Floating emoji */}
          <circle cx="240" cy="148" r="16" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <text x="240" y="154" textAnchor="middle" fontSize="14">🚀</text>

          {/* Small decorative dots */}
          <circle cx="18" cy="18" r="5" fill="url(#lg1)" opacity="0.6" />
          <circle cx="302" cy="18" r="4" fill="url(#lg2)" opacity="0.6" />
          <circle cx="18" cy="260" r="3" fill="url(#lg3)" opacity="0.5" />
        </svg>
      </div>

      {/* Tagline */}
      <div style={{ textAlign: "center", marginTop: 24, position: "relative", zIndex: 1 }}>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 8,
          }}
        >
          OrbitChat
        </h2>
        <p style={{ color: "var(--color-text-muted)", fontSize: 13, lineHeight: 1.6 }}>
          Stay in each other's orbit.<br />Real-time messaging, redefined.
        </p>
      </div>
    </div>
  );
}

function Login() {
  const { register, handleSubmit } = useForm();
  const [err, setErr] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function submitLogin(obj) {
    setLoading(true);
    axios
      .post("http://localhost:3500/user-api/login", obj)
      .then((res) => {
        setLoading(false);
        if (res.data.success === true) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", res.data.user);
          setErr("");
          socket.emit("new-connection", res.data.user);
          navigate("/chat");
        } else {
          setErr(res.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setErr(error.message);
      });
  }

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "stretch",
        overflow: "hidden",
      }}
    >
      {/* Left panel */}
      <div
        className="d-none d-md-flex"
        style={{
          flex: 1,
          background:
            "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.08))",
          borderRight: "1px solid var(--glass-border)",
        }}
      >
        <AuthIllustration />
      </div>

      {/* Right: Form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 24px",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 400,
            animation: "fadeInRight 0.7s ease-out",
          }}
        >
          {/* Logo row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 36,
            }}
          >
            <div className="logo-mark"><OrbitLogo /></div>
            <span
              style={{
                fontWeight: 800,
                fontSize: "1.2rem",
                background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              OrbitChat
            </span>
          </div>

          <h1
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: "white",
              marginBottom: 8,
              letterSpacing: "-0.5px",
            }}
          >
            Welcome back
          </h1>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: 15,
              marginBottom: 32,
            }}
          >
            Sign in to continue your conversations
          </p>

          {err && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 10,
                padding: "10px 14px",
                color: "#f87171",
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              ⚠️ {err}
            </div>
          )}

          <form onSubmit={handleSubmit(submitLogin)}>
            <div className="form-group">
              <label className="form-label">User ID</label>
              <input
                type="text"
                className="input-glass"
                placeholder="Enter your user ID"
                {...register("userid", { required: true })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={show ? "text" : "password"}
                  className="input-glass"
                  placeholder="Enter your password"
                  style={{ paddingRight: "48px !important" }}
                  {...register("password", { required: true })}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--color-text-muted)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    fontSize: 18,
                    padding: 0,
                  }}
                >
                  {show ? <BiHide /> : <BiShow />}
                </button>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 24,
                marginTop: -8,
              }}
            >
              <NavLink
                to="/forgotPass"
                style={{
                  color: "#a78bfa",
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                Forgot password?
              </NavLink>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 50,
                background: loading
                  ? "rgba(124,58,237,0.4)"
                  : "linear-gradient(135deg,#7c3aed,#06b6d4)",
                backgroundSize: "200% 200%",
                border: "none",
                color: "white",
                fontWeight: 700,
                fontSize: 16,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s",
                animation: loading ? "none" : "gradientShift 3s ease infinite",
                boxShadow: loading ? "none" : "0 8px 32px rgba(124,58,237,0.35)",
              }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      animation: "spinSlow 0.7s linear infinite",
                      display: "inline-block",
                    }}
                  />
                  Signing in...
                </span>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: 28,
              color: "var(--color-text-muted)",
              fontSize: 14,
            }}
          >
            Don't have an account?{" "}
            <NavLink
              to="/register"
              style={{ color: "#a78bfa", fontWeight: 600, textDecoration: "none" }}
            >
              Create one →
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

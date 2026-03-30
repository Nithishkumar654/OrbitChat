import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { BiHide, BiShow } from "react-icons/bi";
import { NavLink, useNavigate } from "react-router-dom";
import OrbitLogo from "./OrbitLogo";

function RegisterIllustration() {
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
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -60,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(236,72,153,0.25), transparent)",
          filter: "blur(70px)",
          animation: "orbPulse 7s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: -40,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.2), transparent)",
          filter: "blur(55px)",
          animation: "orbPulse 9s ease-in-out infinite",
          animationDelay: "-4s",
        }}
      />

      <div style={{ animation: "float2 8s ease-in-out infinite", position: "relative", zIndex: 1 }}>
        <svg
          viewBox="0 0 320 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", maxWidth: 290 }}
        >
          <defs>
            <linearGradient id="rg1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id="rg2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="rg3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Glow */}
          <circle cx="160" cy="150" r="130" fill="url(#rg1)" opacity="0.05" />

          {/* Profile card */}
          <rect x="80" y="30" width="160" height="200" rx="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

          {/* Avatar circle */}
          <circle cx="160" cy="95" r="36" fill="url(#rg1)" />
          <text x="160" y="102" textAnchor="middle" fill="white" fontSize="22" fontWeight="800" fontFamily="Inter, sans-serif">U</text>

          {/* Online dot */}
          <circle cx="188" cy="70" r="10" fill="#22c55e" stroke="rgba(6,6,15,0.8)" strokeWidth="3" />

          {/* Name line */}
          <rect x="106" y="148" width="108" height="10" rx="5" fill="rgba(255,255,255,0.4)" />
          {/* Info lines */}
          <rect x="110" y="170" width="100" height="7" rx="3.5" fill="rgba(255,255,255,0.2)" />
          <rect x="118" y="186" width="84" height="7" rx="3.5" fill="rgba(255,255,255,0.15)" />

          {/* Action button */}
          <rect x="106" y="206" width="108" height="14" rx="7" fill="url(#rg2)" opacity="0.8" />

          {/* Floating bubbles */}
          <circle cx="40" cy="70" r="18" fill="url(#rg2)" opacity="0.7" />
          <text x="40" y="76" textAnchor="middle" fill="white" fontSize="12" fontFamily="Inter">✓</text>

          <circle cx="280" cy="90" r="16" fill="url(#rg1)" opacity="0.7" />
          <text x="280" y="96" textAnchor="middle" fill="white" fontSize="12" fontFamily="Inter">✉</text>

          <circle cx="42" cy="200" r="14" fill="url(#rg3)" opacity="0.7" />
          <text x="42" y="205" textAnchor="middle" fill="white" fontSize="11" fontFamily="Inter">🔒</text>

          <circle cx="278" cy="210" r="14" fill="url(#rg2)" opacity="0.6" />
          <text x="278" y="215" textAnchor="middle" fill="white" fontSize="10" fontFamily="Inter">★</text>

          {/* Corner dots */}
          <circle cx="20" cy="20" r="5" fill="url(#rg1)" opacity="0.5" />
          <circle cx="300" cy="20" r="4" fill="url(#rg2)" opacity="0.5" />
          <circle cx="20" cy="280" r="4" fill="url(#rg3)" opacity="0.5" />
          <circle cx="300" cy="280" r="5" fill="url(#rg1)" opacity="0.4" />
        </svg>
      </div>

      <div style={{ textAlign: "center", marginTop: 24, position: "relative", zIndex: 1 }}>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            background: "linear-gradient(135deg,#ec4899,#f97316)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 8,
          }}
        >
          Join the Community
        </h2>
        <p style={{ color: "var(--color-text-muted)", fontSize: 13, lineHeight: 1.6 }}>
          Create your free account and start<br />chatting with people worldwide.
        </p>
      </div>
    </div>
  );
}

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [err, setErr] = useState("");
  const [show, setShow] = useState(false);
  const [repeatShow, setRepeatShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function submitRegister(obj) {
    setLoading(true);
    axios
      .post("http://localhost:3500/user-api/register", obj)
      .then((res) => {
        setLoading(false);
        if (res.data.success === true) {
          navigate("/login");
        } else {
          setErr(res.data.message);
        }
      })
      .catch((e) => {
        setLoading(false);
        setErr(e.message);
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
      {/* Left illustration */}
      <div
        className="d-none d-md-flex"
        style={{
          flex: 1,
          background:
            "linear-gradient(135deg, rgba(236,72,153,0.08), rgba(124,58,237,0.08))",
          borderRight: "1px solid var(--glass-border)",
        }}
      >
        <RegisterIllustration />
      </div>

      {/* Right form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            animation: "fadeInRight 0.7s ease-out",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 28,
            }}
          >
            <div className="logo-mark"><OrbitLogo /></div>
            <span
              style={{
                fontWeight: 800,
                fontSize: "1.15rem",
                background: "linear-gradient(135deg,#ec4899,#f97316)",
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
              fontSize: 28,
              fontWeight: 800,
              color: "white",
              marginBottom: 6,
              letterSpacing: "-0.5px",
            }}
          >
            Create your account
          </h1>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: 14,
              marginBottom: 24,
            }}
          >
            Fill in the details below to get started
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
                marginBottom: 18,
              }}
            >
              ⚠️ {err}
            </div>
          )}

          <form onSubmit={handleSubmit(submitRegister)}>
            <div className="form-group">
              <label className="form-label">Display Name</label>
              <input
                type="text"
                className="input-glass"
                placeholder="How should we call you?"
                {...register("username", { required: true })}
              />
              <div className="form-hint">
                This is shown in your conversations
              </div>
              {errors.username && (
                <div className="form-error">Name is required</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">User ID</label>
              <input
                type="text"
                className="input-glass"
                placeholder="Choose a unique ID"
                {...register("userid", { required: true })}
              />
              <div className="form-hint">
                Used to find and message you
              </div>
              {errors.userid && (
                <div className="form-error">User ID is required</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="input-glass"
                placeholder="your@email.com"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <div className="form-error">Email is required</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Mobile (optional)</label>
              <input
                type="number"
                className="input-glass"
                placeholder="Your mobile number"
                {...register("mobile")}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={show ? "text" : "password"}
                  className="input-glass"
                  placeholder="Create a strong password"
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
              {errors.password && (
                <div className="form-error">Password is required</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={repeatShow ? "text" : "password"}
                  className="input-glass"
                  placeholder="Repeat your password"
                  {...register("repeatPassword", { required: true })}
                />
                <button
                  type="button"
                  onClick={() => setRepeatShow(!repeatShow)}
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
                  {repeatShow ? <BiHide /> : <BiShow />}
                </button>
              </div>
              {errors.repeatPassword && (
                <div className="form-error">Please confirm your password</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Profile Picture (optional)</label>
              <input
                type="file"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: "var(--radius-md)",
                  padding: "10px 14px",
                  fontSize: 13,
                  color: "var(--color-text-muted)",
                  width: "100%",
                  cursor: "pointer",
                }}
                {...register("picture")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 50,
                background: loading
                  ? "rgba(236,72,153,0.3)"
                  : "linear-gradient(135deg,#ec4899,#7c3aed)",
                backgroundSize: "200% 200%",
                border: "none",
                color: "white",
                fontWeight: 700,
                fontSize: 16,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s",
                animation: loading ? "none" : "gradientShift 3s ease infinite",
                boxShadow: loading ? "none" : "0 8px 32px rgba(236,72,153,0.3)",
                marginTop: 8,
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
                  Creating account...
                </span>
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: 24,
              color: "var(--color-text-muted)",
              fontSize: 14,
            }}
          >
            Already have an account?{" "}
            <NavLink
              to="/login"
              style={{ color: "#f9a8d4", fontWeight: 600, textDecoration: "none" }}
            >
              Sign in →
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;

import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { BiHide, BiShow } from "react-icons/bi";
import { NavLink, useNavigate } from "react-router-dom";

const steps = ["Email", "OTP", "Reset"];

function ForgotPass() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const [user, setUser] = useState("");
  const [step, setStep] = useState(0); // 0=email, 1=otp, 2=newpass
  const [show, setShow] = useState(false);
  const [repeatShow, setRepeatShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  function submitEmail(obj) {
    setLoading(true);
    setErr("");
    setUser(obj.userid);
    axios
      .post("http://localhost:3500/user-api/sendemail", obj)
      .then((res) => {
        setLoading(false);
        if (res.data.success === true) {
          localStorage.setItem("otpToken", res.data.otpToken);
          localStorage.setItem("hashedOtp", res.data.otp);
          setSuccessMsg("OTP sent to your email inbox!");
          setTimeout(() => setSuccessMsg(""), 3000);
          setStep(1);
          reset();
        } else {
          setErr(res.data.message);
        }
      })
      .catch((e) => {
        setLoading(false);
        setErr(e.message);
      });
  }

  function submitOtp(obj) {
    setLoading(true);
    setErr("");
    obj.token = localStorage.getItem("otpToken");
    obj.hashedOtp = localStorage.getItem("hashedOtp");
    axios
      .post("http://localhost:3500/user-api/verifyotp", obj)
      .then((res) => {
        setLoading(false);
        if (res.data.success === true) {
          localStorage.clear();
          setStep(2);
          reset();
        } else {
          setErr(res.data.message);
        }
      })
      .catch((e) => {
        setLoading(false);
        setErr(e.message);
      });
  }

  function submitNewPass(obj) {
    setLoading(true);
    setErr("");
    obj.userid = user;
    axios
      .post("http://localhost:3500/user-api/update-password", obj)
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

  const submitFns = [submitEmail, submitOtp, submitNewPass];

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        overflowY: "auto",
        position: "relative",
      }}
    >
      {/* Background orbs */}
      <div
        style={{
          position: "absolute",
          top: -100,
          left: "50%",
          transform: "translateX(-50%)",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.2), transparent)",
          filter: "blur(80px)",
          animation: "orbPulse 7s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 440,
          animation: "scaleIn 0.5s ease-out",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Step indicator */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div className="logo-mark" style={{ margin: "0 auto 20px" }}>C</div>

          <div className="step-indicator">
            {steps.map((s, i) => (
              <div
                key={i}
                className={"step-dot" + (i === step ? " active" : "")}
                title={s}
              />
            ))}
          </div>

          <div
            style={{
              fontSize: 12,
              color: "var(--color-text-muted)",
              fontWeight: 600,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Step {step + 1} of 3 — {steps[step]}
          </div>
        </div>

        {/* Card */}
        <div className="card-glass" style={{ padding: "36px 32px" }}>
          {/* Title */}
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "white",
              marginBottom: 8,
              letterSpacing: "-0.5px",
            }}
          >
            {step === 0 && "Forgot Password?"}
            {step === 1 && "Verify OTP"}
            {step === 2 && "New Password"}
          </h1>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: 14,
              marginBottom: 24,
              lineHeight: 1.6,
            }}
          >
            {step === 0 && "Enter your User ID and email to receive an OTP."}
            {step === 1 && `Check your email for a 6-digit OTP.`}
            {step === 2 && "Choose a strong new password for your account."}
          </p>

          {/* Error */}
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
              }}
            >
              ⚠️ {err}
            </div>
          )}

          {/* Success */}
          {successMsg && (
            <div
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.3)",
                borderRadius: 10,
                padding: "10px 14px",
                color: "#4ade80",
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 20,
              }}
            >
              ✓ {successMsg}
            </div>
          )}

          {/* Step 0: Email */}
          {step === 0 && (
            <form onSubmit={handleSubmit(submitFns[0])}>
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
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="input-glass"
                  placeholder="Registered email address"
                  {...register("email", { required: true })}
                />
                <div className="form-hint">
                  Must match the email linked to your account
                </div>
              </div>
              <SubmitBtn loading={loading} label="Send OTP →" />
            </form>
          )}

          {/* Step 1: OTP */}
          {step === 1 && (
            <form onSubmit={handleSubmit(submitFns[1])}>
              <div className="form-group">
                <label className="form-label">One-Time Password</label>
                <input
                  type="number"
                  className="input-glass"
                  placeholder="Enter the 6-digit OTP"
                  style={{ letterSpacing: "4px", textAlign: "center", fontSize: "20px !important" }}
                  {...register("otp", { required: true })}
                />
                <div className="form-hint">
                  OTP expires in 5 minutes
                </div>
              </div>
              <SubmitBtn loading={loading} label="Verify OTP →" />
              <button
                type="button"
                onClick={() => { setStep(0); reset(); setErr(""); }}
                style={{
                  width: "100%",
                  marginTop: 10,
                  background: "none",
                  border: "none",
                  color: "var(--color-text-muted)",
                  fontSize: 13,
                  cursor: "pointer",
                  padding: "8px",
                }}
              >
                ← Back
              </button>
            </form>
          )}

          {/* Step 2: New password */}
          {step === 2 && (
            <form onSubmit={handleSubmit(submitFns[2])}>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={show ? "text" : "password"}
                    className="input-glass"
                    placeholder="Enter new password"
                    {...register("newPass", { required: true })}
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    style={{
                      position: "absolute", right: 14, top: "50%",
                      transform: "translateY(-50%)",
                      background: "none", border: "none",
                      color: "var(--color-text-muted)",
                      cursor: "pointer", display: "flex", alignItems: "center",
                      fontSize: 18, padding: 0,
                    }}
                  >
                    {show ? <BiHide /> : <BiShow />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={repeatShow ? "text" : "password"}
                    className="input-glass"
                    placeholder="Repeat new password"
                    {...register("repeatPass", { required: true })}
                  />
                  <button
                    type="button"
                    onClick={() => setRepeatShow(!repeatShow)}
                    style={{
                      position: "absolute", right: 14, top: "50%",
                      transform: "translateY(-50%)",
                      background: "none", border: "none",
                      color: "var(--color-text-muted)",
                      cursor: "pointer", display: "flex", alignItems: "center",
                      fontSize: 18, padding: 0,
                    }}
                  >
                    {repeatShow ? <BiHide /> : <BiShow />}
                  </button>
                </div>
              </div>
              <SubmitBtn loading={loading} label="Update Password →" color="linear-gradient(135deg,#22c55e,#06b6d4)" />
            </form>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: 20, color: "var(--color-text-muted)", fontSize: 13 }}>
          Remembered it?{" "}
          <NavLink to="/login" style={{ color: "#a78bfa", fontWeight: 600, textDecoration: "none" }}>
            Back to Sign In
          </NavLink>
        </p>
      </div>
    </div>
  );
}

function SubmitBtn({ loading, label, color = "linear-gradient(135deg,#7c3aed,#06b6d4)" }) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        width: "100%",
        padding: "13px",
        borderRadius: 50,
        background: loading ? "rgba(124,58,237,0.3)" : color,
        backgroundSize: "200% 200%",
        border: "none",
        color: "white",
        fontWeight: 700,
        fontSize: 15,
        cursor: loading ? "not-allowed" : "pointer",
        transition: "all 0.3s",
        animation: loading ? "none" : "gradientShift 3s ease infinite",
        marginTop: 8,
      }}
    >
      {loading ? (
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span
            style={{
              width: 15,
              height: 15,
              border: "2px solid rgba(255,255,255,0.3)",
              borderTopColor: "white",
              borderRadius: "50%",
              animation: "spinSlow 0.7s linear infinite",
              display: "inline-block",
            }}
          />
          Processing...
        </span>
      ) : label}
    </button>
  );
}

export default ForgotPass;

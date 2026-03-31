import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";

function EditProfile({ show, setShow }) {
  const { register, setValue, getValues } = useForm();
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function updateProfile() {
    setLoading(true);
    setErr("");
    const updatedProfile = getValues();
    axios
      .post(
        "https://orbitchat-zawb.onrender.com/user-api/profile-update",
        updatedProfile,
      )
      .then((res) => {
        setLoading(false);
        if (res.data.success === true) {
          setSuccess("Profile updated successfully!");
          setTimeout(() => {
            setSuccess("");
            setShow(false);
          }, 1500);
        } else {
          setErr(res.data.message);
        }
      })
      .catch((e) => {
        setLoading(false);
        setErr(e.message);
      });
  }

  useEffect(() => {
    const host = localStorage.getItem("user");
    axios
      .get("https://orbitchat-zawb.onrender.com/user-api/get-users")
      .then((res) => {
        const user = res.data.users.find((obj) => obj.userid === host);
        if (user) {
          setValue("username", user.username);
          setValue("userid", user.userid);
          setValue("email", user.email);
          setValue("mobile", user.mobile);
        }
      })
      .catch((err) => console.log(err));
  }, [show]);

  return (
    <Modal
      show={show}
      size="md"
      centered
      onHide={() => setShow(false)}
      className="modal-dark"
    >
      <Modal.Header
        closeButton
        closeVariant="white"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "20px 24px 16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="logo-mark" style={{ animation: "none" }}>
            C
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: 17,
              color: "white",
            }}
          >
            Edit Profile
          </span>
        </div>
      </Modal.Header>

      <Modal.Body style={{ padding: "24px" }}>
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
        {success && (
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
            ✓ {success}
          </div>
        )}

        <form>
          <div className="form-group">
            <label className="form-label">User ID</label>
            <input
              type="text"
              className="input-glass"
              placeholder="User ID"
              disabled
              {...register("userid", { required: true })}
            />
            <div className="form-hint">User ID cannot be changed</div>
          </div>

          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input
              type="text"
              className="input-glass"
              placeholder="Your display name"
              {...register("username", { required: true })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="input-glass"
              placeholder="your@email.com"
              {...register("email", { required: true })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mobile</label>
            <input
              type="number"
              className="input-glass"
              placeholder="Mobile number"
              {...register("mobile", { required: true })}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Profile Picture</label>
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
        </form>
      </Modal.Body>

      <Modal.Footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "16px 24px",
          gap: 8,
        }}
      >
        <button
          onClick={updateProfile}
          disabled={loading}
          style={{
            padding: "9px 24px",
            borderRadius: 50,
            background: loading
              ? "rgba(124,58,237,0.3)"
              : "linear-gradient(135deg,#7c3aed,#06b6d4)",
            backgroundSize: "200% 200%",
            border: "none",
            color: "white",
            fontWeight: 700,
            fontSize: 14,
            cursor: loading ? "not-allowed" : "pointer",
            animation: loading ? "none" : "gradientShift 3s ease infinite",
            transition: "all 0.3s",
          }}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 14,
                  height: 14,
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  animation: "spinSlow 0.7s linear infinite",
                  display: "inline-block",
                }}
              />
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
        <button
          onClick={() => setShow(false)}
          style={{
            padding: "9px 20px",
            borderRadius: 50,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "var(--color-text-muted)",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 14,
            transition: "all 0.3s",
          }}
        >
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditProfile;

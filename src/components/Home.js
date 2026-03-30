import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const features = [
  {
    icon: "⚡",
    title: "Real-Time Messaging",
    desc: "Instant delivery powered by Socket.io WebSockets. Zero delay, no refresh needed.",
  },
  {
    icon: "📎",
    title: "File Sharing",
    desc: "Send PDFs, images, documents and more. Files stored securely via MongoDB GridFS.",
  },
  {
    icon: "😊",
    title: "Emoji Support",
    desc: "Full emoji picker built in. Make every conversation expressive and fun.",
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    desc: "JWT auth with bcrypt hashing. Your data stays yours, always encrypted.",
  },
  {
    icon: "🟢",
    title: "Online Presence",
    desc: "See who's available in real time with live online indicators.",
  },
  {
    icon: "✍️",
    title: "Typing Indicators",
    desc: "Know when a reply is on its way with animated typing status.",
  },
];

function MockMsg({ text, time, sent, delay = "0s" }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: sent ? "flex-end" : "flex-start",
        alignItems: "flex-end",
        gap: 8,
        animation: `fadeInUp 0.4s ease-out ${delay} both`,
      }}
    >
      {!sent && (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 12,
            color: "white",
            flexShrink: 0,
          }}
        >
          A
        </div>
      )}
      <div
        style={{
          background: sent
            ? "linear-gradient(135deg,#7c3aed,#06b6d4)"
            : "rgba(255,255,255,0.08)",
          border: sent ? "none" : "1px solid rgba(255,255,255,0.07)",
          borderRadius: sent ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          padding: "9px 14px",
          maxWidth: "78%",
        }}
      >
        <div style={{ fontSize: 13, color: "white", lineHeight: 1.45 }}>
          {text}
        </div>
        <div
          style={{
            fontSize: 9,
            color: "rgba(255,255,255,0.4)",
            marginTop: 4,
            textAlign: "right",
          }}
        >
          {time}
        </div>
      </div>
    </div>
  );
}

function ChatPreview() {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 24,
        padding: "20px",
        backdropFilter: "blur(24px)",
        boxShadow: "0 40px 100px rgba(0,0,0,0.55)",
        animation: "fadeInRight 0.9s ease-out",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#ec4899,#f97316)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 16,
            color: "white",
            position: "relative",
          }}
        >
          A
          <span
            style={{
              position: "absolute",
              bottom: 1,
              right: 1,
              width: 10,
              height: 10,
              background: "#22c55e",
              borderRadius: "50%",
              border: "2px solid #06060f",
            }}
          />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "white" }}>
            Alex
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#4ade80",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#22c55e",
                display: "inline-block",
                animation: "blink 2s infinite",
              }}
            />
            Online
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          {["#7c3aed", "#ec4899", "#06b6d4"].map((c, i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: c,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <MockMsg
          text="Hey! Tried the new chat app yet? 🔥"
          time="09:41"
          sent={false}
          delay="0.3s"
        />
        <MockMsg
          text="Yes! Real-time updates are amazing 🚀"
          time="09:42"
          sent={true}
          delay="0.6s"
        />
        <MockMsg
          text="File sharing works great too!"
          time="09:43"
          sent={false}
          delay="0.9s"
        />
        <MockMsg
          text="Totally agree — this app is 🔥"
          time="09:44"
          sent={true}
          delay="1.2s"
        />

        {/* Typing */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 8,
            animation: "fadeInUp 0.4s ease-out 1.6s both",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#ec4899,#f97316)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 12,
              color: "white",
              flexShrink: 0,
            }}
          >
            A
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "18px 18px 18px 4px",
              padding: "10px 16px",
              display: "flex",
              gap: 5,
              alignItems: "center",
            }}
          >
            {[0, 200, 400].map((d, i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#22c55e",
                  animation: `typingBounce 1.2s ${d}ms ease-in-out infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginTop: 18,
          paddingTop: 16,
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 50,
            padding: "9px 16px",
            fontSize: 13,
            color: "var(--color-text-muted)",
          }}
        >
          Type a message...
        </div>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            color: "white",
            cursor: "pointer",
            animation: "gradientShift 3s ease infinite",
            backgroundSize: "200% 200%",
          }}
        >
          ➤
        </div>
      </div>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/chat");
  }, []);

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        background: "var(--bg-primary)",
        position: "relative",
      }}
    >
      {/* ── HERO ── */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "52px 24px 60px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(20px, 4vw, 60px)",
            flexWrap: "wrap",
          }}
        >
          {/* Left text */}
          <div
            style={{
              flex: 1,
              minWidth: 280,
              animation: "fadeInLeft 0.8s ease-out",
            }}
          >
            {/* Live badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(124,58,237,0.12)",
                border: "1px solid rgba(124,58,237,0.3)",
                borderRadius: 50,
                padding: "5px 14px",
                marginBottom: 24,
                fontSize: 12,
                color: "#c4b5fd",
                fontWeight: 700,
                letterSpacing: "0.3px",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#22c55e",
                  animation: "blink 1.5s infinite",
                }}
              />
              LIVE &amp; REAL-TIME
            </div>

            <h1
              style={{
                fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
                fontWeight: 900,
                lineHeight: 1.12,
                marginBottom: 20,
                letterSpacing: "-1.5px",
                color: "white",
              }}
            >
              Connect &amp; Chat<br />
              <span className="gradient-text-animated">Instantly, Freely</span>
            </h1>

            <p
              style={{
                fontSize: 16,
                color: "var(--color-text-subtle)",
                lineHeight: 1.75,
                marginBottom: 36,
                maxWidth: 420,
              }}
            >
              Experience seamless real-time messaging with file sharing, emoji
              reactions, and live typing indicators. Built for people who love
              to connect.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <NavLink
                to="/register"
                style={{
                  textDecoration: "none",
                  padding: "13px 28px",
                  borderRadius: 50,
                  background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
                  backgroundSize: "200% 200%",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 15,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  animation: "gradientShift 3s ease infinite",
                  boxShadow: "0 8px 32px rgba(124,58,237,0.35)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 14px 40px rgba(124,58,237,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(124,58,237,0.35)";
                }}
              >
                Get Started Free →
              </NavLink>
              <NavLink
                to="/login"
                style={{
                  textDecoration: "none",
                  padding: "13px 28px",
                  borderRadius: 50,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "var(--color-text)",
                  fontWeight: 600,
                  fontSize: 15,
                  display: "inline-flex",
                  alignItems: "center",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(124,58,237,0.15)";
                  e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                }}
              >
                Sign In
              </NavLink>
            </div>

            {/* Stats row */}
            <div
              style={{
                display: "flex",
                gap: "clamp(14px, 3vw, 36px)",
                marginTop: 44,
                flexWrap: "wrap",
              }}
            >
              {[
                { n: "99.9%", l: "Uptime" },
                { n: "< 50ms", l: "Latency" },
                { n: "∞", l: "Messages" },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    animation: `fadeInUp ${0.9 + i * 0.15}s ease-out both`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 900,
                      background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {s.n}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--color-text-muted)",
                      marginTop: 2,
                      fontWeight: 500,
                    }}
                  >
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Chat preview */}
          <div
            style={{
              flex: 1,
              minWidth: 280,
              maxWidth: 440,
            }}
          >
            <ChatPreview />
          </div>
        </div>

        {/* ── FEATURES GRID ── */}
        <div style={{ marginTop: "clamp(48px, 8vw, 90px)" }}>
          <div
            style={{
              textAlign: "center",
              marginBottom: 50,
              animation: "fadeInUp 0.8s ease-out",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                fontWeight: 800,
                marginBottom: 12,
                letterSpacing: "-0.5px",
                color: "white",
              }}
            >
              Everything you need to{" "}
              <span className="gradient-text">stay connected</span>
            </h2>
            <p
              style={{
                color: "var(--color-text-muted)",
                fontSize: 16,
                maxWidth: 480,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Powerful features wrapped in a beautifully crafted interface
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 18,
            }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                className="feature-card"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${i * 0.08}s both`,
                }}
              >
                <div className="feature-icon">{f.icon}</div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    marginBottom: 8,
                    color: "white",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--color-text-muted)",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA BANNER ── */}
        <div
          style={{
            marginTop: 80,
            padding: "clamp(28px, 5vw, 52px) clamp(16px, 4vw, 40px)",
            borderRadius: 28,
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(6,182,212,0.12))",
            border: "1px solid rgba(124,58,237,0.25)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            animation: "fadeInUp 0.8s ease-out",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -80,
              right: -80,
              width: 240,
              height: 240,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(124,58,237,0.25), transparent)",
              filter: "blur(40px)",
            }}
          />
          <h2
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 800,
              color: "white",
              marginBottom: 12,
              position: "relative",
            }}
          >
            Ready to start chatting?
          </h2>
          <p
            style={{
              color: "var(--color-text-subtle)",
              fontSize: 16,
              marginBottom: 28,
              position: "relative",
            }}
          >
            Join now — it's completely free.
          </p>
          <NavLink
            to="/register"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 32px",
              borderRadius: 50,
              background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
              backgroundSize: "200% 200%",
              color: "white",
              fontWeight: 700,
              fontSize: 16,
              textDecoration: "none",
              animation: "gradientShift 3s ease infinite",
              boxShadow: "0 10px 40px rgba(124,58,237,0.45)",
              position: "relative",
            }}
          >
            Create your account →
          </NavLink>
        </div>

        {/* Bottom padding */}
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}

export default Home;

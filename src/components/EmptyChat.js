import React from "react";

function EmptyChat() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary)",
        padding: "40px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background orbs */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "15%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.12), transparent)",
          filter: "blur(60px)",
          animation: "orbPulse 8s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "15%",
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.1), transparent)",
          filter: "blur(50px)",
          animation: "orbPulse 10s ease-in-out infinite",
          animationDelay: "-4s",
        }}
      />

      {/* Animated SVG illustration */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          animation: "float 7s ease-in-out infinite",
          marginBottom: 40,
        }}
      >
        <svg
          viewBox="0 0 360 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", maxWidth: 320 }}
        >
          <defs>
            <linearGradient id="eg1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="eg2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id="eg3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Background soft ring */}
          <circle cx="180" cy="150" r="120" stroke="url(#eg1)" strokeWidth="1" opacity="0.15" />
          <circle cx="180" cy="150" r="90" stroke="url(#eg1)" strokeWidth="1" opacity="0.1" />

          {/* Main large bubble */}
          <rect x="50" y="50" width="200" height="100" rx="22" fill="url(#eg1)" opacity="0.18" />
          <rect x="50" y="50" width="200" height="100" rx="22" stroke="url(#eg1)" strokeWidth="1.5" opacity="0.4" />
          <polygon points="80,150 116,150 80,170" fill="url(#eg1)" opacity="0.35" />

          {/* Text lines inside */}
          <rect x="72" y="74" width="100" height="9" rx="4.5" fill="url(#eg1)" opacity="0.4" />
          <rect x="72" y="92" width="140" height="9" rx="4.5" fill="url(#eg1)" opacity="0.3" />
          <rect x="72" y="110" width="75" height="9" rx="4.5" fill="url(#eg1)" opacity="0.25" />

          {/* Right bubble */}
          <rect x="120" y="178" width="180" height="80" rx="22" fill="url(#eg2)" opacity="0.18" />
          <rect x="120" y="178" width="180" height="80" rx="22" stroke="url(#eg2)" strokeWidth="1.5" opacity="0.4" />
          <polygon points="292,258 258,258 292,276" fill="url(#eg2)" opacity="0.35" />

          <rect x="140" y="198" width="110" height="8" rx="4" fill="url(#eg2)" opacity="0.4" />
          <rect x="140" y="214" width="78" height="8" rx="4" fill="url(#eg2)" opacity="0.3" />

          {/* Avatar circles */}
          <circle cx="60" cy="195" r="24" fill="url(#eg1)" opacity="0.9" />
          <text x="60" y="201" textAnchor="middle" fill="white" fontSize="15" fontWeight="800" fontFamily="Inter, sans-serif">A</text>

          <circle cx="300" cy="158" r="22" fill="url(#eg2)" opacity="0.9" />
          <text x="300" y="164" textAnchor="middle" fill="white" fontSize="14" fontWeight="800" fontFamily="Inter, sans-serif">B</text>

          {/* Floating emoji bubbles */}
          <circle cx="30" cy="100" r="18" fill="rgba(124,58,237,0.15)" stroke="rgba(124,58,237,0.3)" strokeWidth="1" />
          <text x="30" y="107" textAnchor="middle" fontSize="14">💬</text>

          <circle cx="330" cy="80" r="16" fill="rgba(6,182,212,0.12)" stroke="rgba(6,182,212,0.25)" strokeWidth="1" />
          <text x="330" y="87" textAnchor="middle" fontSize="12">⚡</text>

          <circle cx="328" cy="240" r="16" fill="rgba(236,72,153,0.12)" stroke="rgba(236,72,153,0.25)" strokeWidth="1" />
          <text x="328" y="247" textAnchor="middle" fontSize="12">🔒</text>

          <circle cx="22" cy="250" r="14" fill="rgba(34,197,94,0.12)" stroke="rgba(34,197,94,0.25)" strokeWidth="1" />
          <text x="22" y="256" textAnchor="middle" fontSize="11">✓</text>

          {/* Typing dots inside a small bubble */}
          <rect x="148" y="240" width="56" height="28" rx="14" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <circle cx="163" cy="254" r="4" fill="url(#eg3)" opacity="0.8" />
          <circle cx="176" cy="254" r="4" fill="url(#eg3)" opacity="0.8" />
          <circle cx="189" cy="254" r="4" fill="url(#eg3)" opacity="0.8" />
        </svg>
      </div>

      {/* Text content */}
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <h2
          style={{
            fontSize: 26,
            fontWeight: 800,
            background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 10,
            letterSpacing: "-0.5px",
          }}
        >
          OrbitChat
        </h2>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: 15,
            lineHeight: 1.7,
            maxWidth: 320,
            margin: "0 auto 24px",
          }}
        >
          Select a conversation from the sidebar to start chatting, or search for a user by their ID.
        </p>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
          }}
        >
          {["⚡ Real-time", "📎 File Sharing", "😊 Emojis", "🟢 Online Status"].map(
            (tag) => (
              <div
                key={tag}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 50,
                  padding: "5px 14px",
                  fontSize: 12,
                  color: "var(--color-text-muted)",
                  fontWeight: 500,
                }}
              >
                {tag}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default EmptyChat;

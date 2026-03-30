import React from "react";
import NavigationBar from "./NavigationBar";
import { Outlet } from "react-router-dom";

function RootLayout() {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-primary)",
        overflow: "hidden",
      }}
    >
      {/* Ambient background orbs */}
      <div
        className="orb orb-purple"
        style={{ width: 500, height: 500, top: -200, left: -150, zIndex: 0 }}
      />
      <div
        className="orb orb-cyan"
        style={{ width: 400, height: 400, bottom: -150, right: -120, zIndex: 0 }}
      />

      {/* Navbar */}
      <div style={{ position: "relative", zIndex: 10, flexShrink: 0 }}>
        <NavigationBar />
      </div>

      {/* Page content */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default RootLayout;

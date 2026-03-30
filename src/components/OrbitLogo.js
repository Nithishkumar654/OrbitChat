import React from "react";

/**
 * OrbitChat logo mark — orbit ring + central hub + satellite chat node.
 * Designed as white-on-transparent so it sits inside the .logo-mark gradient box.
 */
function OrbitLogo({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {/* Orbit ring — tilted ellipse */}
      <ellipse
        cx="10"
        cy="10"
        rx="7.8"
        ry="3.6"
        stroke="white"
        strokeWidth="1.25"
        fill="none"
        opacity="0.78"
        transform="rotate(-30 10 10)"
      />

      {/* Central hub — the shared connection point */}
      <circle cx="10" cy="10" r="2.2" fill="white" />

      {/* Satellite / chat node — orbiting the hub */}
      <circle cx="13.4" cy="5.4" r="1.9" fill="white" opacity="0.95" />

      {/* Trailing dot — motion cue, staying on the orbit path */}
      <circle cx="16.3" cy="8.1" r="0.85" fill="white" opacity="0.45" />
    </svg>
  );
}

export default OrbitLogo;

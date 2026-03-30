import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { HiOutlineUserCircle } from "react-icons/hi";
import EditProfile from "./EditProfile";
import socket from "../socket";

function AllChats({
  show,
  setShow,
  message,
  setMessage,
  showPerson,
  activePerson,
  summaries = {},
  fetchSummaries,
}) {
  const [host, setHost] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchVal, setSearchVal] = useState("");

  // Fetch all users (refresh after profile edit)
  useEffect(() => {
    const currentHost = localStorage.getItem("user");
    setHost(currentHost);
    axios
      .get("https://orbitchat-38y6.onrender.com/user-api/get-users")
      .then((res) => {
        const seen = new Set();
        const contacts = res.data.users.filter((u) => {
          if (u.userid === currentHost || seen.has(u.userid)) return false;
          seen.add(u.userid);
          return true;
        });
        setAllUsers(contacts);
        setSearchVal("");
      })
      .catch((err) => console.log(err));
  }, [showModal]);

  // Socket fallback: covers delete and the case when no conversation is open
  useEffect(() => {
    if (!fetchSummaries) return;
    socket.on("message-sent", fetchSummaries);
    socket.on("delete-message", fetchSummaries);
    return () => {
      socket.off("message-sent", fetchSummaries);
      socket.off("delete-message", fetchSummaries);
    };
  }, [fetchSummaries]);

  // Socket: keep online users updated (with cleanup to prevent listener stacking)
  useEffect(() => {
    socket.emit("reload");
    const onAllUsers = (users) => setOnlineUsers(users);
    socket.on("allusers", onAllUsers);
    return () => socket.off("allusers", onAllUsers);
  }, []);

  const userids = useMemo(() => {
    const lower = searchVal.toLowerCase().trim();
    const filtered = !lower
      ? allUsers
      : allUsers.filter(
          (obj) =>
            obj.userid.toLowerCase().includes(lower) ||
            obj.username.toLowerCase().includes(lower),
        );
    return [...filtered].sort((a, b) => {
      const sa = summaries[a.userid];
      const sb = summaries[b.userid];
      if (sa && !sb) return -1;
      if (!sa && sb) return 1;
      if (sa && sb) return sb.timestamp - sa.timestamp;
      return 0;
    });
  }, [allUsers, searchVal, summaries]);

  function handleChange(event) {
    setSearchVal(event.target.value);
  }

  function handleShow() {
    setShow(false);
    setMessage("");
  }

  const isOnline = (userid) =>
    !!onlineUsers?.find((u) => u.username === userid);

  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  return (
    <div
      className="sidebar-panel"
      style={{ height: "100%", position: "relative" }}
    >
      {/* ── Header ── */}
      <div
        style={{
          padding: "18px 16px 14px",
          borderBottom: "1px solid var(--glass-border)",
          flexShrink: 0,
        }}
      >
        {/* Current user row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 17,
              color: "white",
              flexShrink: 0,
              animation: "glowPulse 4s ease-in-out infinite",
            }}
          >
            {getInitials(host)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: "white",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {host}
            </div>
            <div className="badge-online" style={{ marginTop: 3 }}>
              <span className="status-dot" />
              Active
            </div>
          </div>
          <button
            className="icon-btn"
            onClick={() => setShowModal(true)}
            title="Edit Profile"
          >
            <HiOutlineUserCircle style={{ fontSize: 24 }} />
          </button>
        </div>

        {/* Search box */}
        <div className="search-wrap">
          <AiOutlineSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            value={searchVal}
            onChange={(e) => handleChange(e)}
            placeholder="Search by name or ID..."
          />
        </div>
      </div>

      {/* ── Section label ── */}
      <div
        style={{
          padding: "12px 16px 6px",
          fontSize: 12,
          fontWeight: 700,
          color: "var(--color-text-muted)",
          letterSpacing: "1.2px",
          textTransform: "uppercase",
          flexShrink: 0,
        }}
      >
        Contacts
        {searchVal && (
          <span
            style={{
              marginLeft: 8,
              fontSize: 11,
              color: "#a78bfa",
              textTransform: "none",
              fontWeight: 500,
              letterSpacing: 0,
            }}
          >
            ({userids.length} found)
          </span>
        )}
      </div>

      {/* ── User list ── */}
      <div
        style={{ flex: 1, overflowY: "auto", paddingBottom: show ? 64 : 16 }}
      >
        {userids.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "var(--color-text-muted)",
              fontSize: 14,
            }}
          >
            {searchVal ? (
              <>
                <div style={{ fontSize: 30, marginBottom: 10 }}>🔍</div>
                <div
                  style={{ fontWeight: 600, color: "var(--color-text-subtle)" }}
                >
                  No results for "{searchVal}"
                </div>
                <div style={{ fontSize: 12, marginTop: 4 }}>
                  Try a different name or user ID
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 30, marginBottom: 10 }}>👥</div>
                No contacts yet
              </>
            )}
          </div>
        ) : (
          userids.map((obj) => {
            const active = activePerson?.userid === obj.userid;
            const online = isOnline(obj.userid);
            return (
              <div key={String(obj._id)} onClick={() => showPerson(obj)}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "11px 14px",
                    cursor: "pointer",
                    borderRadius: 12,
                    margin: "2px 10px",
                    transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                    background: active
                      ? "rgba(124,58,237,0.22)"
                      : "transparent",
                    border: active
                      ? "1px solid rgba(124,58,237,0.4)"
                      : "1px solid transparent",
                    transform: active ? "translateX(2px)" : "none",
                    boxShadow: active
                      ? "0 4px 20px rgba(124,58,237,0.15)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "rgba(124,58,237,0.1)";
                      e.currentTarget.style.borderColor =
                        "rgba(124,58,237,0.18)";
                      e.currentTarget.style.transform = "translateX(3px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "transparent";
                      e.currentTarget.style.transform = "none";
                    }
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: stringToGradient(obj.userid),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 16,
                      color: "white",
                      flexShrink: 0,
                      position: "relative",
                      boxShadow: active
                        ? "0 0 0 2px white, 0 0 0 4px rgba(124,58,237,0.6)"
                        : "none",
                      transition: "box-shadow 0.25s",
                    }}
                  >
                    {getInitials(obj.username)}
                    {online && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: 1,
                          right: 1,
                          width: 11,
                          height: 11,
                          background: "#22c55e",
                          borderRadius: "50%",
                          border: "2px solid #0a0a16",
                        }}
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 15,
                        color: active ? "white" : "var(--color-text)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        lineHeight: 1.3,
                      }}
                    >
                      {obj.username}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--color-text-muted)",
                        marginTop: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <span>{obj.userid}</span>
                      {online && (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            color: "#4ade80",
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
                        </span>
                      )}
                    </div>
                    {summaries[obj.userid] && (
                      <div
                        style={{
                          fontSize: 12,
                          color: active
                            ? "rgba(255,255,255,0.5)"
                            : "var(--color-text-muted)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "100%",
                          marginTop: 2,
                        }}
                      >
                        {summaries[obj.userid].fromMe && (
                          <span style={{ marginRight: 3 }}>You:</span>
                        )}
                        {summaries[obj.userid].text
                          ? summaries[obj.userid].text
                          : `📎 ${summaries[obj.userid].fileName}`}
                      </div>
                    )}
                  </div>

                  {/* Active indicator bar */}
                  {active && (
                    <div
                      style={{
                        width: 3,
                        height: 32,
                        borderRadius: 2,
                        background: "linear-gradient(180deg,#7c3aed,#06b6d4)",
                        flexShrink: 0,
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Toast notification ── */}
      {show && (
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: 12,
            right: 12,
            background: "rgba(34,197,94,0.12)",
            border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: 50,
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            animation: "fadeInUp 0.3s ease-out",
            zIndex: 10,
          }}
        >
          <span style={{ color: "#4ade80", fontSize: 14, fontWeight: 500 }}>
            {message}
          </span>
          <button
            onClick={handleShow}
            style={{
              background: "none",
              border: "none",
              color: "#4ade80",
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
              padding: "0 0 0 8px",
            }}
          >
            ×
          </button>
        </div>
      )}

      <EditProfile show={showModal} setShow={setShowModal} />
    </div>
  );
}

function stringToGradient(str) {
  const gradients = [
    "linear-gradient(135deg,#7c3aed,#06b6d4)",
    "linear-gradient(135deg,#ec4899,#f97316)",
    "linear-gradient(135deg,#0891b2,#7c3aed)",
    "linear-gradient(135deg,#22c55e,#06b6d4)",
    "linear-gradient(135deg,#a855f7,#ec4899)",
    "linear-gradient(135deg,#f97316,#eab308)",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash += str.charCodeAt(i);
  return gradients[hash % gradients.length];
}

export default AllChats;

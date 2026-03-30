import React, { useState, useEffect } from "react";
import { AiOutlineSearch, AiOutlineCloseCircle } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { OverlayTrigger, Popover } from "react-bootstrap";
import socket from "../socket";

function Header({ person, showPerson, setSearch }) {
  const [iconActive, setIconActive] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typing, setTyping] = useState(null);
  const [host, setHost] = useState("");

  useEffect(() => {
    socket.emit("reload");
    setHost(localStorage.getItem("user"));
  }, []);

  useEffect(() => {
    const onAllUsers = (users) => setOnlineUsers(users);
    const onTyping = (data) => setTyping(data);
    const onNotTyping = () => setTyping(null);
    socket.on("allusers", onAllUsers);
    socket.on("typing", onTyping);
    socket.on("not-typing", onNotTyping);
    return () => {
      socket.off("allusers", onAllUsers);
      socket.off("typing", onTyping);
      socket.off("not-typing", onNotTyping);
    };
  }, []);

  const isOnline = !!onlineUsers?.find((u) => u.username === person.userid);
  const isTyping =
    typing?.receiverId === host && typing?.senderId === person.userid;

  const initials = person.username
    ? person.username.charAt(0).toUpperCase()
    : "?";

  const gradients = [
    "linear-gradient(135deg,#7c3aed,#06b6d4)",
    "linear-gradient(135deg,#ec4899,#f97316)",
    "linear-gradient(135deg,#0891b2,#7c3aed)",
    "linear-gradient(135deg,#22c55e,#06b6d4)",
    "linear-gradient(135deg,#a855f7,#ec4899)",
  ];
  let hash = 0;
  if (person.userid)
    for (let i = 0; i < person.userid.length; i++)
      hash += person.userid.charCodeAt(i);
  const gradient = gradients[hash % gradients.length];

  return (
    <div className="chat-header">
      {/* Left: Back + Avatar + Name */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          className="icon-btn d-md-none"
          onClick={() => showPerson({})}
          title="Back"
        >
          <BiArrowBack style={{ fontSize: 20 }} />
        </button>

        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 16,
            color: "white",
            flexShrink: 0,
            position: "relative",
          }}
        >
          {initials}
          {isOnline && (
            <span
              style={{
                position: "absolute",
                bottom: 1,
                right: 1,
                width: 11,
                height: 11,
                background: "#22c55e",
                borderRadius: "50%",
                border: "2px solid var(--bg-primary)",
              }}
            />
          )}
        </div>

        <div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 15,
              color: "white",
              lineHeight: 1.3,
            }}
          >
            {person.username
              ? person.username.charAt(0).toUpperCase() +
                person.username.slice(1)
              : ""}
          </div>

          {isOnline ? (
            isTyping ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 2,
                }}
              >
                <div className="typing-dots">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: "#4ade80",
                    fontWeight: 600,
                  }}
                >
                  typing...
                </span>
              </div>
            ) : (
              <div className="badge-online" style={{ marginTop: 3 }}>
                <span className="status-dot" />
                Online
              </div>
            )
          ) : (
            <div
              style={{
                fontSize: 11,
                color: "var(--color-text-muted)",
                marginTop: 2,
              }}
            >
              {person.userid}
            </div>
          )}
        </div>
      </div>

      {/* Right: Search */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <OverlayTrigger
          trigger="click"
          placement="bottom-end"
          rootClose
          overlay={
            <Popover
              style={{
                background: "rgba(10,10,24,0.97)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              }}
            >
              <Popover.Body style={{ padding: 0 }}>
                <input
                  type="text"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "none",
                    borderRadius: 12,
                    color: "var(--color-text)",
                    padding: "10px 14px",
                    fontSize: 13,
                    outline: "none",
                    width: "min(220px, calc(100vw - 80px))",
                    fontFamily: "Inter, sans-serif",
                  }}
                  placeholder="Search messages..."
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
              </Popover.Body>
            </Popover>
          }
        >
          <button
            className="icon-btn"
            onClick={() => setIconActive(!iconActive)}
            title="Search"
          >
            {iconActive ? (
              <AiOutlineSearch style={{ fontSize: 20 }} />
            ) : (
              <AiOutlineCloseCircle
                style={{ fontSize: 20, color: "#a78bfa" }}
                onClick={() => setSearch("")}
              />
            )}
          </button>
        </OverlayTrigger>
      </div>
    </div>
  );
}

export default Header;

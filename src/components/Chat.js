import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AllChats from "./AllChats";
import Conversation from "./Conversation";
import EmptyChat from "./EmptyChat";

function Chat() {
  const [person, showPerson] = useState({});
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, w: 0 });

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .post("https://orbitchat-38y6.onrender.com/user-api/pathjump", { token })
      .then((res) => {
        if (res.data.success !== true) {
          localStorage.clear();
          navigate("/login");
        }
      })
      .catch(() => navigate("/login"));
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    const delta = e.clientX - dragStart.current.x;
    const newW = Math.max(240, Math.min(520, dragStart.current.w + delta));
    setSidebarWidth(newW);
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, [onMouseMove]);

  const onDragHandleMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
    dragStart.current = { x: e.clientX, w: sidebarWidth };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const [summaries, setSummaries] = useState({});

  const fetchSummaries = useCallback(() => {
    const h = localStorage.getItem("user");
    if (!h) return;
    axios
      .post(
        "https://orbitchat-38y6.onrender.com/conversation-api/get-conversation-summaries",
        { host: h },
      )
      .then((res) => setSummaries(res.data.summaries))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetchSummaries();
  }, [fetchSummaries]);

  const chatOpen = !!person.userid;

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        overflow: "hidden",
        background: "var(--bg-primary)",
      }}
    >
      {/* ── Sidebar ──
          Mobile  : show when chatOpen=false, hide when chatOpen=true
          Desktop : always show (overridden by .sidebar-desktop-always CSS below)
      */}
      <div
        className="sidebar-responsive"
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          maxWidth: sidebarWidth,
          flexShrink: 0,
          flexDirection: "column",
          overflow: "hidden",
          /* mobile visibility handled by CSS class */
        }}
        data-chat-open={chatOpen ? "true" : "false"}
      >
        <AllChats
          show={show}
          setShow={setShow}
          message={message}
          setMessage={setMessage}
          showPerson={showPerson}
          activePerson={person}
          summaries={summaries}
          fetchSummaries={fetchSummaries}
        />
      </div>

      {/* ── Drag handle (hidden on mobile via CSS) ── */}
      <div
        className="drag-handle"
        onMouseDown={onDragHandleMouseDown}
        title="Drag to resize"
      />

      {/* ── Chat panel ──
          Mobile  : show only when chatOpen=true
          Desktop : always show
      */}
      <div
        className="chat-panel-responsive"
        data-chat-open={chatOpen ? "true" : "false"}
        style={{
          flex: 1,
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        {person.userid ? (
          <Conversation
            setShow={setShow}
            setMessage={setMessage}
            person={person}
            showPerson={showPerson}
            onSummaryRefresh={fetchSummaries}
          />
        ) : (
          <EmptyChat />
        )}
      </div>
    </div>
  );
}

export default Chat;

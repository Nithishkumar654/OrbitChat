import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { OverlayTrigger, Popover, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { AiOutlineSend } from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";
import { AiOutlinePaperClip } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import socket from "../socket";

function Footer({ person, onMessageSent }) {
  const { handleSubmit } = useForm();
  const [host, setHost] = useState("");
  const [value, setValue] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [file, setFile] = useState(null);
  const [spin, setSpin] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    setHost(localStorage.getItem("user"));
  }, []);

  // Auto-resize textarea as content grows
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const maxH = 150;
    el.style.height = Math.min(el.scrollHeight, maxH) + "px";
    el.style.overflowY = el.scrollHeight > maxH ? "auto" : "hidden";
  }, [value]);

  useEffect(() => {
    const socketObj = { senderId: host, receiverId: person.userid };
    if (value.length > 0) socket.emit("typing", socketObj);
    else socket.emit("not-typing", socketObj);
  }, [value]);

  function submitMessage() {
    const trimmed = value.trimStart();
    if (!trimmed.length) {
      setValue("");
      return;
    }
    setSpin(true);
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    axios
      .post(
        "https://orbitchat-zawb.onrender.com/conversation-api/send-message",
        {
          message: trimmed,
          senderId: host,
          receiverId: person.userid,
          time,
        },
      )
      .then(() => {
        setValue("");
        setSpin(false);
        socket.emit("message-sent", {
          senderId: host,
          receiverId: person.userid,
        });
        onMessageSent();
      })
      .catch((err) => {
        console.log(err.message);
        setSpin(false);
      });
  }

  function submitFile() {
    setSpin(true);
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const fd = new FormData();
    fd.append(
      "details",
      JSON.stringify({
        senderId: host,
        receiverId: person.userid,
        time,
        fileName: file.name,
      }),
    );
    fd.append("file", file);
    axios
      .post(
        "https://orbitchat-zawb.onrender.com/conversation-api/send-file",
        fd,
      )
      .then(() => {
        setValue("");
        setSpin(false);
        setDisabled(false);
        setFile(null);
        socket.emit("message-sent", {
          senderId: host,
          receiverId: person.userid,
        });
        onMessageSent();
      })
      .catch((err) => {
        console.log(err.message);
        setSpin(false);
      });
  }

  function handleFile(event) {
    const f = event.target.files[0];
    if (!f) return;
    setFile(f);
    setValue(f.name);
    setDisabled(true);
  }

  function cancelFile() {
    setValue("");
    setDisabled(false);
    setFile(null);
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !disabled) {
      e.preventDefault();
      submitMessage();
    }
  };

  return (
    <form
      className="chat-footer"
      onSubmit={handleSubmit(disabled ? submitFile : submitMessage)}
    >
      {/* Emoji picker */}
      <OverlayTrigger
        trigger="click"
        placement="top"
        rootClose
        overlay={
          <Popover
            style={{
              background: "transparent",
              border: "none",
              boxShadow: "none",
            }}
          >
            <EmojiPicker
              onEmojiClick={(emoji) => setValue((v) => v + emoji.emoji)}
              theme="dark"
              skinTonesDisabled
              searchDisabled={false}
              lazyLoadEmojis
              style={{ borderRadius: 16 }}
            />
          </Popover>
        }
      >
        <button type="button" className="icon-btn" title="Emoji">
          <BsEmojiSmile style={{ fontSize: 20 }} />
        </button>
      </OverlayTrigger>

      {/* File attach */}
      <OverlayTrigger
        trigger="click"
        placement="top-start"
        rootClose
        overlay={
          <Popover
            style={{
              background: "rgba(10,10,24,0.97)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 14,
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            }}
          >
            <Popover.Body style={{ padding: "14px 16px" }}>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--color-text-muted)",
                  marginBottom: 8,
                }}
              >
                Choose a file to send
              </div>
              <input
                type="file"
                onInput={handleFile}
                style={{
                  color: "var(--color-text)",
                  fontSize: 12,
                  fontFamily: "Inter, sans-serif",
                }}
              />
            </Popover.Body>
          </Popover>
        }
      >
        <button type="button" className="icon-btn" title="Attach file">
          <AiOutlinePaperClip style={{ fontSize: 20, color: "#a78bfa" }} />
        </button>
      </OverlayTrigger>

      {/* Input field */}
      <div style={{ flex: 1, position: "relative" }}>
        {disabled && (
          <div
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 11,
              color: "#a78bfa",
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: 50,
              padding: "2px 8px",
              pointerEvents: "none",
              whiteSpace: "nowrap",
              maxWidth: "70%",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            📎 {value}
          </div>
        )}
        <textarea
          ref={textareaRef}
          rows={1}
          className="msg-input"
          placeholder={disabled ? "" : "Type a message..."}
          value={disabled ? "" : value}
          disabled={disabled}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          style={disabled ? { opacity: 1, paddingLeft: 14 } : {}}
        />
      </div>

      {/* Cancel file (when file selected) */}
      {disabled && (
        <button
          type="button"
          className="icon-btn"
          onClick={cancelFile}
          title="Cancel"
          style={{ color: "#f87171" }}
        >
          <MdOutlineCancel style={{ fontSize: 22 }} />
        </button>
      )}

      {/* Send button */}
      <button
        type="button"
        className="send-btn"
        disabled={spin}
        onClick={disabled ? submitFile : submitMessage}
        title="Send"
      >
        {spin ? (
          <Spinner
            animation="border"
            size="sm"
            style={{ color: "white", width: 16, height: 16, borderWidth: 2 }}
          />
        ) : (
          <AiOutlineSend style={{ fontSize: 16 }} />
        )}
      </button>
    </form>
  );
}

export default Footer;

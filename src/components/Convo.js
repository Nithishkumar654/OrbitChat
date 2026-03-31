import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import {
  AiFillFileExcel,
  AiFillFileImage,
  AiFillFilePdf,
  AiFillFilePpt,
  AiFillFileText,
  AiFillFileUnknown,
  AiFillFileWord,
  AiFillFileZip,
} from "react-icons/ai";
import { IoMdDownload } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";
import { BsChevronDoubleDown } from "react-icons/bs";
import socket from "../socket";

function getDateFromId(id) {
  try {
    return new Date(parseInt(id.substring(0, 8), 16) * 1000);
  } catch {
    return new Date();
  }
}

function formatDateLabel(date) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (d.getTime() === today.getTime()) return "Today";
  if (d.getTime() === yesterday.getTime()) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    ...(date.getFullYear() !== now.getFullYear() && { year: "numeric" }),
  });
}

function getFileIcon(fileType) {
  const s = { fontSize: 42, flexShrink: 0 };
  if (fileType === "application/pdf")
    return <AiFillFilePdf style={{ ...s, color: "#f87171" }} />;
  if (fileType?.includes("image"))
    return <AiFillFileImage style={{ ...s, color: "#60a5fa" }} />;
  if (fileType?.includes("application/vnd"))
    return <AiFillFileExcel style={{ ...s, color: "#4ade80" }} />;
  if (fileType?.includes("zip"))
    return <AiFillFileZip style={{ ...s, color: "#fbbf24" }} />;
  if (fileType?.includes("text/plain"))
    return <AiFillFileText style={{ ...s, color: "#94a3b8" }} />;
  if (fileType?.includes("application/powerpoint"))
    return <AiFillFilePpt style={{ ...s, color: "#fb923c" }} />;
  if (fileType?.includes("application/msword"))
    return <AiFillFileWord style={{ ...s, color: "#60a5fa" }} />;
  return <AiFillFileUnknown style={{ ...s, color: "#94a3b8" }} />;
}

function Convo({ person, setShow, setMessage, search, refreshKey }) {
  const [messages, setMessages] = useState([]);
  const [host, setHost] = useState("");
  const [isLoaded, setIsLoaded] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteObject, setDeleteObject] = useState({});
  const [state, setState] = useState(true);
  const [scroll, setScroll] = useState(false);
  const scrollRef = useRef(null);

  function scrollDown() {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }

  useEffect(() => {
    setHost(localStorage.getItem("user"));
    const hosting = localStorage.getItem("user");
    axios
      .post(
        "https://orbitchat-zawb.onrender.com/conversation-api/get-messages",
        {
          host: hosting,
          person: person.userid,
        },
      )
      .then((response) => {
        setMessages(
          response.data.chat.filter(
            (obj) =>
              obj.message?.toLowerCase().includes(search.toLowerCase()) ||
              obj.fileName?.toLowerCase().includes(search.toLowerCase()),
          ),
        );
        setShow(false);
        setMessage("");
        setIsLoaded(false);
        setScroll((s) => !s);
      })
      .catch((err) => console.log(err.message));
  }, [person, search, state, refreshKey]);

  // Register socket listeners inside useEffect so they are cleaned up on
  // every re-render instead of accumulating. Without cleanup, two listeners
  // both fire and toggle `state` back to its original value — net zero change
  // — so the fetch useEffect never re-runs and new messages don't appear.
  useEffect(() => {
    const onMessage = (data) => {
      const currentHost = localStorage.getItem("user");
      if (data.senderId === currentHost || data.receiverId === currentHost)
        setState((s) => !s);
    };
    socket.on("delete-message", onMessage);
    return () => {
      socket.off("delete-message", onMessage);
    };
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, [person]);
  useEffect(() => {
    scrollDown();
  }, [scroll]);

  const handleDownload = async (obj) => {
    try {
      const response = await axios.post(
        "https://orbitchat-zawb.onrender.com/conversation-api/download-file",
        obj,
        { responseType: "blob" },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", obj.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShow(true);
      setMessage("File downloaded successfully");
    } catch {
      setShow(true);
      setMessage("Error downloading file");
    }
  };

  function handleDelete() {
    setShowModal(false);
    axios
      .post(
        "https://orbitchat-zawb.onrender.com/conversation-api/delete-message",
        deleteObject,
      )
      .then((res) => {
        setMessage(res.data.message);
        socket.emit("delete-message", {
          senderId: host,
          receiverId: person.userid,
        });
        setState((s) => !s);
      })
      .catch((err) => setMessage(err.message));
    setDeleteObject({});
  }

  if (isLoaded) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-primary)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Spinner
            animation="border"
            style={{ color: "#7c3aed", width: 36, height: 36 }}
          />
          <div
            style={{
              color: "var(--color-text-muted)",
              fontSize: 13,
              marginTop: 12,
            }}
          >
            Loading messages...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Messages */}
      <div className="messages-area" ref={scrollRef}>
        {messages.length === 0 ? (
          <div
            style={{
              margin: "auto",
              textAlign: "center",
              color: "var(--color-text-muted)",
              fontSize: 14,
              padding: 40,
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
            <div style={{ fontWeight: 600, color: "var(--color-text-subtle)" }}>
              No messages yet
            </div>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              Send a message to start the conversation
            </div>
          </div>
        ) : (
          messages.map((obj, idx) => {
            const isSent = obj.senderId === host;
            const msgDate = getDateFromId(obj._id);
            const prevDate =
              idx > 0 ? getDateFromId(messages[idx - 1]._id) : null;
            const showSeparator =
              !prevDate || msgDate.toDateString() !== prevDate.toDateString();
            return (
              <React.Fragment key={obj._id || idx}>
                {showSeparator && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      margin: "12px 16px 4px",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: 1,
                        background: "rgba(255,255,255,0.08)",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--color-text-muted)",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 50,
                        padding: "3px 12px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDateLabel(msgDate)}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: 1,
                        background: "rgba(255,255,255,0.08)",
                      }}
                    />
                  </div>
                )}
                <div className={isSent ? "msg-row-sent" : "msg-row-recv"}>
                  {!isSent && (
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 800,
                        color: "white",
                        flexShrink: 0,
                        alignSelf: "flex-end",
                        marginRight: 6,
                      }}
                    >
                      {obj.senderId?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div
                    className={
                      "msg-bubble " +
                      (isSent ? "msg-bubble-sent" : "msg-bubble-recv")
                    }
                  >
                    {obj.message ? (
                      <>
                        <span
                          style={{
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {obj.message}
                        </span>
                        <span className="msg-time">{obj.time}</span>
                      </>
                    ) : (
                      <div className="file-msg">
                        <div className="file-icon-wrap">
                          {getFileIcon(obj.fileType)}
                          <button
                            className="dl-btn"
                            onClick={() => handleDownload(obj)}
                            title="Download"
                          >
                            <IoMdDownload style={{ fontSize: 11 }} />
                          </button>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: isSent
                                ? "rgba(255,255,255,0.9)"
                                : "var(--color-text)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: 140,
                            }}
                          >
                            {obj.fileName}
                          </div>
                          <div
                            style={{
                              fontSize: 10,
                              color: isSent
                                ? "rgba(255,255,255,0.5)"
                                : "var(--color-text-muted)",
                              marginTop: 2,
                            }}
                          >
                            {obj.time}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Delete dropdown */}
                    {isSent && (
                      <div
                        className="dropstart"
                        style={{ position: "absolute", top: 4, right: 4 }}
                      >
                        <button
                          className="msg-dropdown-btn dropdown-toggle"
                          data-bs-toggle="dropdown"
                          style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            cursor: "pointer",
                            color: "rgba(255,255,255,0.6)",
                            fontSize: 16,
                            lineHeight: 1,
                          }}
                        >
                          <RiArrowDropDownLine />
                        </button>
                        <ul
                          className="dropdown-menu p-0"
                          style={{
                            background: "rgba(10,10,24,0.97)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 10,
                            minWidth: 110,
                            overflow: "hidden",
                          }}
                        >
                          <li>
                            <button
                              className="dropdown-item"
                              style={{
                                color: "#f87171",
                                background: "none",
                                border: "none",
                                width: "100%",
                                textAlign: "left",
                                padding: "10px 14px",
                                fontSize: 13,
                                fontWeight: 500,
                                cursor: "pointer",
                                fontFamily: "Inter, sans-serif",
                              }}
                              onClick={() => {
                                setShowModal(true);
                                setDeleteObject(obj);
                              }}
                            >
                              🗑 Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>

      {/* Scroll to bottom */}
      <button
        className="scroll-down-btn"
        onClick={() => setScroll((s) => !s)}
        title="Scroll to bottom"
      >
        <BsChevronDoubleDown style={{ fontSize: 13 }} />
      </button>

      {/* Delete confirmation modal */}
      <Modal
        centered
        size="sm"
        show={showModal}
        onHide={() => setShowModal(false)}
        className="modal-dark"
      >
        <Modal.Header
          closeButton
          closeVariant="white"
          style={{ border: "none", paddingBottom: 8 }}
        >
          <Modal.Title
            style={{ fontSize: 16, fontWeight: 700, color: "white" }}
          >
            Delete Message?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            color: "var(--color-text-muted)",
            fontSize: 14,
            paddingTop: 4,
          }}
        >
          {deleteObject.message
            ? `"${deleteObject.message.substring(0, 60)}${deleteObject.message.length > 60 ? "..." : ""}"`
            : deleteObject.fileName}
          <br />
          <span
            style={{
              fontSize: 12,
              color: "var(--color-text-muted)",
              marginTop: 4,
              display: "block",
            }}
          >
            This action cannot be undone.
          </span>
        </Modal.Body>
        <Modal.Footer style={{ border: "none", gap: 8 }}>
          <button
            className="btn-success-glass"
            onClick={handleDelete}
            style={{
              padding: "8px 20px",
              borderRadius: 50,
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Delete
          </button>
          <button
            onClick={() => setShowModal(false)}
            style={{
              padding: "8px 20px",
              borderRadius: 50,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--color-text)",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Convo;

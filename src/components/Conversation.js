import React, { useCallback, useEffect, useState } from "react";
import Convo from "./Convo";
import Footer from "./Footer";
import Header from "./Header";
import socket from "../socket";

function Conversation({ setShow, setMessage, person, showPerson, onSummaryRefresh }) {
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const onMessageSent = useCallback(() => {
    setRefreshKey((k) => k + 1);
    onSummaryRefresh();
  }, [onSummaryRefresh]);

  useEffect(() => {
    const handler = () => {
      onMessageSent();
    };
    socket.on("message-sent", handler);
    return () => socket.off("message-sent", handler);
  }, [onMessageSent]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Header person={person} showPerson={showPerson} setSearch={setSearch} />
      <Convo
        person={person}
        setShow={setShow}
        setMessage={setMessage}
        search={search}
        refreshKey={refreshKey}
      />
      <Footer person={person} onMessageSent={onMessageSent} />
    </div>
  );
}

export default Conversation;

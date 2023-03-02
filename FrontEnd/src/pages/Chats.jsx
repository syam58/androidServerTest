import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import "./Chats.css";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:5000");

function Chats() {
  const location = useLocation();
  const { room, name } = location.state;

  const fileRef = useRef();
  const scroll = useRef(null);

  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    socket.emit("join-room", { room });
  }, []);

  useEffect(() => {
    socket.on("receive-message", (data) => {
      setChat((prev) => [
        ...prev,
        { name: data.name, message: data.message, received: true },
      ]);
    });

    socket.on("receive-upload", (data) => {
      setChat((prev) => [
        ...prev,
        {
          name: data.name,
          message: data.message,
          type: "image",
          received: true,
        },
      ]);
    });
  }, []);

  useEffect(() => {
    scroll.current.scrollIntoView({ behaviour: "smooth" });
  }, [chat]);

  const handleSend = (e) => {
    e.preventDefault();
    socket.emit("send-message", { name, room, message: msg });
    setChat((prev) => [...prev, { name, message: msg, received: false }]);
    setMsg("");
  };

  const selectFile = () => {
    fileRef.current.click();
  };
  const selectedFile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const data = reader.result;
      const imageData = data.toString("base64");

      socket.emit("upload", { name, room, message: imageData, type: "image" });

      setChat((prev) => [
        ...prev,
        { name, message: imageData, type: "image", received: false },
      ]);
    };
  };

  return (
    <div className="container">
      <div className="chats">
        {chat.map((data) => {
          return (
            <div
             
              className={data.received ? "chat left" : "chat right"}
            >
              <p className="name">{data.name}</p>
              {data.type == "image" ? (
                <img src={data.message} alt="test-image" />
              ) : (
                <p>{data.message}</p>
              )}
            </div>
          );
        })}
        <div ref={scroll} />
      </div>
      <div className="input">
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className="text-input"
        />
        <input
          type="file"
          ref={fileRef}
          onChange={selectedFile}
          className="file-input"
        />
        <button onClick={selectFile} className="btn">
          U
        </button>

        <button onClick={handleSend} className="btn">
          Send
        </button>
      </div>
    </div>
  );
}

export default Chats;

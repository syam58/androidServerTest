import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import "./Chats.css";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:5000");

function Chats() {
  const location = useLocation();
  const { room, name } = location.state;

  const fileRef = React.useRef();
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
    
    socket.on("receive-upload",(data)=>{
      setChat((prev) => [
        ...prev,
        { name: data.name, message: data.message, received: true },
      ]);
      
    });
    
    
  }, [socket]);

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
      const data =reader.result;
      const imageMsg=data.toString("base64");

      socket.emit("upload",{name,room,message:imageMsg,type:"image"})
      setChat((prev) => [...prev, { name, message:imageMsg, received: false }]);
    };
  };

  return (
    <div className="container">
      <div className="chats">
        {chat.map((data) => {
          return (
            <div className={ chat. received ? "chat left" : "chat right"}>
            <p className="name">{chat.name}</p>
            {chat.type=='image' ? ( <img src={chat.message} alt="test-image" />
            ) : ( <p>{chat.message}</p> ) }
          </div>
          );
        })}
      </div>
      <div className="input">
        <input type="text" value={msg}
          onChange={(e) => setMsg(e.target.value)} className="text-input" />
        <input type="file" onChange={selectedFile} ref={fileRef} className="file-input" />
        <button onClick={selectFile} className="btn">
          U
        </button>

        <button onClick={handleSend} className="btn">Send</button>
      </div>
    </div>
  );
}

export default Chats;


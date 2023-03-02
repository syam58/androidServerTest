import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

//const socket = io.connect('http://localhost:5000')

function Home() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (name !== "" || room !== "") {
      navigate("/chats", { state: { name, room } });
    }
  };
  return (
    <div className="App">
      <div className="card">
        <h2>Chat App</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <input
          type="number"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Enter room"
        />
        <button onClick={handleClick}>Send</button>
      </div>
    </div>
  );
}

export default Home;

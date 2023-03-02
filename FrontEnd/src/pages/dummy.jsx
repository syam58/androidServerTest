import { useState,useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import io from 'socket.io-client'
import './Chats.css'



//const socket=io.connect("http://localhost:5000");

function Chats() {
 const location=useLocation();
 const {room,name}=location.state;
 
 //const fileRef = React.useRef();
 //const [chat,setChat]=useState([]);
 
/*useEffect(() => {
  socket.emit("join-room",room)
 }, [])*/
 
 /*delete start */
 
 const data = [
    { name: "John doe", message: "hello", received: true },
    { name: "Fred", message: "Fine thanks", received: false },
    { name: "Tom", message: piano, received: false, type: "image" },
    { name: "Gregory", message: "hellllo", received: true },
    { name: "Robert", message: "Nice to meet you", received: true },
    { name: "Fred", message: "hai to", received: false },
    { name: "Frog", message: demo, received: true, type: "image" },
    { name: "Fred", message: "nice to meet", received: false },
    { name: "Fred", message:fav, received: false,type:"image"},
  ];
 /* delete ends*/
 
 
  function selectFile() {
    fileRef.current.click();

    console.log("first");
  }
  
  
  return (
    <div className="container">
      <div className="chats">
        { data.map((chat)=>{
          return <div className={ chat. received ? "chat left" : "chat right"}>
            <p className="name">{chat.name}</p>
            {chat.type=='image' ? ( <img src={chat.message} alt="test-image" />
            ) : ( <p>{chat.message}</p> ) }
            
          </div>
        }) }
      </div>

      <div className="input">
        <input type="text" className="text-input" />
        <input type="file" ref={fileRef} className="file-input" />
        <button className="btn" onClick={selectFile}>
          U
        </button>

        <button  className="btn">Send</button>
      </div>
    </div>
  );
};

export default Chats

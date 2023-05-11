import React, { useEffect, useRef, useState } from "react";


import { io } from "socket.io-client";
//import SimplePeer from "simple-peer";
import "./peerCss.css";

const socket = io.connect("http://192.168.195.87:5000");
//const socket = io.connect("http://localhost:5000");
function App() {
  const [stream, setStream] = useState();
  const [idToCall, setIdToCall] = useState("");
  const [me, setMe] = useState("");

 const [ caller, setCaller ] =useState("")
	const [ callerSignal, setCallerSignal ] = useState()
	const [ offer, setOffer ] = useState("")
	const [ users, setUsers ] = useState([])

  /*const [ name, setName ] = useState("")*/
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef= useRef()

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      });

    socket.on("me", (id) => {
      setMe(id);
      socket.emit("joinRoom","10")
    });
    
    socket.on("allUsers",(users)=>{
      setUsers(users)
    })
    
    socket.on("callUser", (data) => {
			console.log(data.signal);
			setCaller(data.from)
			setCallerSignal(data.signal)
		})
    
  }, []);

  
  const callUser = (id)=>{
    const peer = new SimplePeer({
			initiator: true,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
		  setOffer(data)
			socket.emit("callUser", {
				userToCall: id,
				signalData: data,
				from: me
			})
		})
		peer.on("stream", (stream) => {
			
				userVideo.current.srcObject = stream
			
		})
		socket.on("callAccepted", (signal) => {
			peer.signal(signal)
		})

		connectionRef.current = peer
  }
  const answerCall = ()=>{
    const peer = new SimplePeer({
			initiator: false,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.emit("answerCall", { signal: data, to: caller })
		})
		peer.on("stream", (stream) => {
			userVideo.current.srcObject = stream
		})

		peer.signal(callerSignal)
		connectionRef.current = peer
  }
  

  return (
    <div>
      <div className="video">
        <video playsInline muted ref={myVideo} autoPlay />
        <div className="userVideoDiv">
          <video playsInline muted ref={userVideo} autoPlay />
        </div>

      </div>
              <div className="input">
          <input
            type="text"
            value={idToCall}
            onChange={(e) => setIdToCall(e.target.value)}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              callUser(idToCall);
            }}
          >
            Call
          </button>

          <button onClick={answerCall}>Answer</button>
        </div>
        
        <p>{me}</p>
        <p>hai</p>
        
        { users.filter((user)=>{
          return user !== me
        }).map((user)=>{
          return <p>{user}</p>
        }) }
    </div>
  );
}

export default App;

const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
let users=[]

const io = require("socket.io")(server, {
	cors: {
		origin: ["http://192.168.195.87:5173","http://localhost:5173"],
		methods: [ "GET", "POST" ]
	}
})

io.on("connection", (socket) => {
  console.log("new client connected")
  
	socket.emit("me", socket.id)
  users.push(socket.id)
  console.log('socket entered ' + socket.id)
  socket.on("joinRoom",(room)=>{
    socket.join(room)
    io.emit("allUsers",users)
  })
  
	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from })
	})

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})
	
	socket.on("send-message",(data)=>{
	  console.log("server received");
	  socket.broadcast.emit("receive-message",data)
	})
	
})

server.listen(5000, () => console.log("server is running on port 5000"))
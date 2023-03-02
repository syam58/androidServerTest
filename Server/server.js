const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
const io = require("socket.io")(server, {
	cors: {
		origin: ["http://192.168.152.250:5173","http://localhost:5173"],
		methods: [ "GET", "POST" ]
	}
})

io.on("connection", (socket) => {
	  console.log("connection established");
	
	socket.on("join-room", (data) => {
	  console.log(data);
	  
		socket.join(data.room);
	})

	socket.on("send-message", (data) => {
		console.log(data);
		
		socket.to(data.room).emit("receive-message", {name:data.name,message:data.message})
	})
	socket.on("upload", (data) => {
		socket.to(data.room).emit("receive-upload", {name:data.name,message:data.message,type:data.type})
	})
	

	socket.on("disconnect", () => {
		//socket.broadcast.emit("callEnded")
	})
	
})

server.listen(5000, () => console.log("server is running on port 5000"))
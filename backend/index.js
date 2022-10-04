const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User is Connected: ${socket.id}`);

  socket.on("join", (data) => {
    socket.join(data.room);
    console.log(`${data.userName} Joined: ${data.room}`);
  });

  socket.on("sendMessage", (data) => {
    console.log(data);
    socket.to(data.room).emit("receiveMessage", data);

  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Server is Running...");
});

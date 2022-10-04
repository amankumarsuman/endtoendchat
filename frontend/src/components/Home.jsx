import React, { useState } from "react";
import io from "socket.io-client";
import { Chat } from "./Chat";
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Grid } from "@mui/material";

const socket = io.connect("http://localhost:3001");

export const Home = () => {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (userName !== "" && room !== "") {
      socket.emit("join", { userName, room });
      setShowChat(true);
    }
  };

  return (
    <Paper  elevation={3} sx={{width:"50%",margin:"auto",paddingBottom:"20px"}}>
      {!showChat ? (
        <>
          <Paper elevation={3} sx={{backgroundColor:"blue",color:"white",textAlign:"center",padding:"10px",marginBottom:"10px"}}>Talk Time</Paper>
          <Grid sx={{margin:"auto",width:"50%"}} container spacing={2}>
            <Grid item xs={12}>
            <TextField
            type="text"
            label="Name"

            onChange={(e) => setUserName(e.target.value)}
          />
            </Grid>
            <Grid  item xs={12}>
            <TextField
            type="text"
            label="Room ID"
            onChange={(e) => setRoom(e.target.value)}
          />
            </Grid>
            <Grid item xs={12}>

          <Button variant="contained" onClick={joinRoom}>Join</Button>
            </Grid>
          </Grid>
         
         
          
        </>
      ) : (
        <Chat socket={socket} userName={userName} room={room} />
      )}
    </Paper>
  );
};

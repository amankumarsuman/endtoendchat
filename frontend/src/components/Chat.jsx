import React, { useEffect, useRef, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Grid } from "@mui/material";
import { Stack } from "@mui/system";
import { styled } from '@mui/material/styles';
const CryptoJS = require("crypto-js");

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


export const Chat = ({ socket, userName, room }) => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  
const effectRan=useRef(false)
  const handleSendMessage = async () => {
    if (message !== "") {
      const payload = {
        room: room,
        author: userName,
        message: CryptoJS.AES.encrypt(
          message,
          "amankumarwebdeveloper",
        ).toString(),
        timestamp:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      
      await socket.emit("sendMessage", payload);
      setMessageList((prev) => [...prev, payload]);
      setMessage("");
    }
  };

  useEffect(() => {
    
    if(effectRan.current===false){
    socket.on("receiveMessage", (data) => {
      console.log(data);
      setMessageList((prev) => [...prev, data]);
    });
    return ()=>{
      effectRan.current=true
    }
  }
  }, [messageList]);

  return (
    <Paper >
      
        <Paper sx={{marginBottom:"20px",backgroundColor:"green",color:"white",marginTop:"10px"}}>
          <h1 style={{marginLeft:"20px"}}> {userName}</h1>
          <p style={{marginLeft:"15px",paddingBottom:"5px"}}>online</p>
         
          </Paper>
   
      <Paper  elevation={3} sx={{height:"400px"}} >
        <ScrollToBottom className="message-container">
          {messageList.map((msg, index) => {
            return (
              <div
                key={index}
                className="message"
                id={userName === msg.author ? "you" : "other"}
              >
                <Paper elevation={3} className="message-content">
                  <p style={{margin:"auto"}}>
                    {CryptoJS.AES.decrypt(
                      msg.message,
                      "amankumarwebdeveloper",
                    ).toString(CryptoJS.enc.Utf8)}
                  </p>
                </Paper>
                <Stack >
                  <Item> <span style={{color:"red"}}>{msg.author}</span><br/>
                  {msg.timestamp}
                  </Item>
                 
                  
                </Stack>
              </div>
            );
          })}
        </ScrollToBottom>
      </Paper>
      <Paper elevation={3} >
        <Grid container spacing={2}>
<Grid item xs={10}>
<TextField
fullWidth
          type="text"
          lable="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            e.key === "Enter" && handleSendMessage();
          }}
        />
</Grid>
<Grid item xs={2}>
<Button variant="contained"  sx={{width:"100px",padding:"15px"}} onClick={handleSendMessage}>
          send
        </Button>
</Grid>
        </Grid>
     

       
      </Paper >
    </Paper>
  );
};

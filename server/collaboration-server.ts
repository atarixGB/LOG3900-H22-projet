const express = require('express'); 
const socket = require('socket.io');
const path = require('path')
const fs = require('fs');
const app = express();
var COLLAB_PORT = process.env.PORT || 3002;
const server = app.listen(COLLAB_PORT); 
const io = socket(server);

app.use(express.static('public')); 

console.log('Server is running');

io.on('connection', (socket) => {

    console.log("New socket connection in collab : " + socket.id)

    socket.on('broadcastStroke', (strokeData) => {
      console.log("Broadcasting stroke : " , strokeData);
      io.emit('receiveStroke', strokeData);
    })

    socket.on('broadcastSelection', (selectionData) => {
      console.log("Broadcasting selection : ", selectionData);
      io.emit('receiveSelection', selectionData);
    })
})
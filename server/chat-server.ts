const express = require('express'); 
const socket = require('socket.io');
const path = require('path')
const fs = require('fs');
const app = express();
var CHAT_PORT = process.env.PORT || 3001;
const server = app.listen(CHAT_PORT); 
const io = socket(server);

app.use(express.static('public')); 

console.log('Server is running');

let message = '';
let users = new Set();

io.on('connection', (socket) => {

    console.log("New socket connection: " + socket.id)

    socket.on('newUser', (userName) => {

        console.log(userName);
        if (!users.has(userName))
        {
            users.add(userName);
            io.emit('newUser', userName);
        }
    })

    socket.on('message', (msg) => {
        console.log(msg)
        io.emit('message', msg);
    })

    socket.on('disconnectUser', (userName) => {
        users.delete(userName);
    })
})
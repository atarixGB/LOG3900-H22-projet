const express = require('express'); 
const socket = require('socket.io');
const path = require('path')
const fs = require('fs');
const app = express();
var PORT = process.env.PORT || 3000;
const server = app.listen(PORT); 

app.use(express.static('public')); 


console.log('Server is running');

const io = socket(server);

let message = '';
let users = new Set();
let room = "Canal Principal"

io.on('connection', (socket) => {

    var userName = '';
    socket.join(room)

    console.log("New socket connection: " + socket.id)

    socket.on('newUser', (userName) => {

        if (!users.has(userName))
        {
            console.log('welcom', userName);
            users.add(userName);
            io.emit('newUser', userName);
        }
    })

    socket.on('createRoom', (room_data) => {
        console.log('creation trigged');
        const userName = room_data.userName;
        const roomName = room_data.room;
        // let usersList = Array<String>(room_data.usersList);
        // //usersList = Object.assign({}, room_data.usersList)
        const usersList = room_data.usersList;

        console.log(userName,' has created ', roomName, 'contains', usersList);
        io.emit('newRoomCreated', room_data);

    })

    socket.on('joinRoom', (room_data) => {
        console.log('Joined trigged');
        const userName = room_data.userName;
        const roomName = room_data.room;

        room = roomName;
        console.log(userName, ' has joined ', roomName);
    })

    socket.on('newUserToChatRoom', (room_data) => {
        console.log('Joined trigged');
        const userName = room_data.userName;
        const roomName = room_data.room;

        room = roomName;
        console.log(userName, ' has joined 1st time', roomName);
        socket.broadcast.to(roomName).emit('newUserToChatRoom', room_data);
    })

    socket.on('leaveRoom', (room_data) => {
        console.log('leave trigged');
        const userName = room_data.userName;
        const roomName = room_data.room;

        console.log(userName, ' has left ', roomName);
        socket.broadcast.to(roomName).emit('userLeftChatRoom', room_data);
        socket.leave(roomName);
    })

    socket.on('message', (msg) => {
        console.log(msg)
        const roomName = msg.room;
        io.to(roomName).emit('message', msg);
    })

    socket.on('disconnectUser', (userName) => {
        users.delete(userName);
    })
})

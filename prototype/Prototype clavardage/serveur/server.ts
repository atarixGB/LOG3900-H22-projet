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

io.on('connection', (socket) => {

    console.log("New socket connection: " + socket.id)

    socket.on('newUser', (userName) => {

        console.log(userName);
        if (!users.has(userName))
        {
            console.log(userName);
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
/*
const express = require('express');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});

let userList = new Map();

io.on('connection', (socket) => {
    console.log("New socket connection: " + socket.id)

    socket.emit('connection-success', true);

    socket.on('new-user', (user) => {
        console.log("server: ", user);
    })

    socket.on('message', (msg) => {
        console.log(msg.userName, msg.message)
        io.emit('message', {message: msg.message, userName: msg.userName, time : msg.time }); // io.emit send to all users instead of socket.emit
    })

    socket.on('disconnect', (userName) => {
        removeUser(userName, socket.id);
    })
});

function addUser(userName, id) {
    if (!userList.has(userName)) {
        userList.set(userName, new Set(id));
    } else {
        userList.get(userName).add(id);
    }
}

function removeUser(userName, id) {
    if (userList.has(userName)) {
        let userIds = userList.get(userName);
        if (userIds.size == 0) {
            userList.delete(userName);
        }
    }
}

http.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});*/
const express = require('express'); 
const socket = require('socket.io');
const path = require('path')
const fs = require('fs');
const app = express();
const mongoose = require("mongoose");
const mongodb = require("mongodb");
var PORT = process.env.PORT || 3000;
const server = app.listen(PORT); 

const DATABASE_URL = "mongodb+srv://equipe203:Log3900-H22@polygramcluster.arebt.mongodb.net/PolyGramDB?retryWrites=true&w=majority";

let mongoClient = mongodb.MongoClient;

mongoClient.connect(DATABASE_URL, { useNewUrlParser: true }, function (err, client) {

    const DB = client.db("PolyGramDB");
  
    if (err) {
      console.log("unable to connect to the mongoDB server error", err);
    } else {
        console.log("connected to db");
        console.log('Server is running');

        const io = socket(server);

        let message = '';
        let users = new Set();
        let room = "default-public-room"
        let chatSchema = mongoose.Schema({
            username : String,
            msg: String,
            created : {type : Date, default : Date.now}
        });

        let Chat = mongoose.model('Message', chatSchema);

        io.on('connection', (socket) => {

            var userName = '';
            socket.join(room)
            
            console.log("New socket connection: " + socket.id, "\nRoom: " + room)

            socket.on('newUser', (data) => {

                if (!users.has(data.userName))
                {
                    console.log('Welcome', data.userName);
                    users.add(data.userName);
                    io.emit('newUser', data.userName);
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
                socket.join(roomName); 
                console.log(userName, ' has joined ', room);
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

            socket.on('deleteRoom', (room_data) => {
                console.log('delete trigged');
                const userName = room_data.userName;
                const roomName = room_data.room;
-
                console.log(userName, ' has deleted ', roomName);
                io.to(roomName).emit('userDeletedChatRoom', room_data);
                //socket.delete(roomName);
                //socket.leave(roomName);
            })

            socket.on('message', (msg) => {
                console.log(msg)
                io.to(msg.room).emit('message', msg);

                var message = {
                    userName: msg.userName,
                    message:msg.message,
                    time: msg.time,
                  };
            })

            socket.on('disconnectUser', (userName) => {
                users.delete(userName);
            })

            socket.on('onMessageReceivedOffline', (message) =>{
                console.log(message)
                io.emit("messageOffline", message)
            })
        })
    }
})

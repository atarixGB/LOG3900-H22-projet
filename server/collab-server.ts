const express = require('express'); 
const socket = require('socket.io');
const path = require('path')
const fs = require('fs');
const app = express();
var COLLAB_PORT = process.env.PORT || 3002;
const server = app.listen(COLLAB_PORT); 
const ioCollab = socket(server);

app.use(express.static('public')); 

console.log('Server is running');

/*
  key: roomName (drawingId)
  roomData:  {
            members -> array of socket.Ids
            strokes -> array of strokes
          }
*/// vvvvvvvvvvvvvv
let infoOnActiveRooms = new Map();

ioCollab.on('connection', (socket) => {

      // COLLAB ROOM EVENTS
      // This event is to make sure the other collaborator's selections are pasted before a new member joins
      socket.on('prepForJoin', (data) => {
        const roomName = data.room; // Note: The room name is the drawingID
        const userJoining = data.username;
        console.log("Prepping for join " , roomName);

        if (infoOnActiveRooms.has(roomName)) {
          socket.broadcast.to(roomName).emit('prepForNewMember', userJoining);   
          const randomRoomMember = infoOnActiveRooms.get(roomName).members[0]; 
          ioCollab.to(randomRoomMember).emit('fetchStrokes'); 
        } 

        socket.emit('readyToJoin', roomName);
      })

      socket.on('joinCollab', (roomName) => {
        console.log("Joining drawing: " , roomName);

        // Updating collabRoom info by either creating initial room data or adding the member to the room
        let roomData = {
          members: [socket.id],
          strokes: [],
        };
        if (infoOnActiveRooms.has(roomName)) {
          roomData = infoOnActiveRooms.get(roomName);
          roomData.members.push(socket.id);
        }
        infoOnActiveRooms.set(roomName, roomData);

        // Joining
        socket.join(roomName);
        ioCollab.in(roomName).emit('memberNbUpdate', roomData.members.length);
        socket.emit('joinSuccessful', infoOnActiveRooms.get(roomName));

        // Utile pour voir l'état des rooms
        console.log(infoOnActiveRooms); 
      })

      socket.on('leaveCollab', (data) => {
        const roomName = data.room; // Note: The room name is the drawingID
        const userLeaving = data.username;
        console.log("Leaving drawing: " , roomName);

        // Updating collabRoom info by removing room member
        let roomData = infoOnActiveRooms.get(roomName);
        roomData.members.splice(roomData.members.indexOf(socket.id), 1);
        ioCollab.in(roomName).emit('memberNbUpdate', roomData.members.length);
        roomData.members.length == 0 ? infoOnActiveRooms.delete(roomName) : infoOnActiveRooms.set(roomName, roomData);

        // Leaving
        socket.leave(roomName);
        socket.broadcast.to(roomName).emit('memberLeft', userLeaving);

        // Utile pour voir l'état des rooms
        console.log(infoOnActiveRooms); 
      })

      socket.on('updateCollabInfo', (collabData) => {
        console.log('updateCollabInfo');
        
        let roomData = infoOnActiveRooms.get(collabData.collabDrawingId);
        roomData.strokes = collabData.strokes;
        infoOnActiveRooms.set(collabData.collabDrawingId, roomData);
      })

      // DRAWING EVENTS
      socket.on('broadcastStroke', (data) => {
        console.log('broadcastStroke');
        const roomName = data.room;
        const stroke = data.data
        socket.broadcast.to(roomName).emit('receiveStroke', stroke);
      })

      socket.on('broadcastSelection', (data) => {
        console.log('broadcastSelection');
        const roomName = data.room;
        const selection = data.data
        socket.broadcast.to(roomName).emit('receiveSelection', selection);
         
      })
  
      socket.on('broadcastSelectionPos', (data) => {
        console.log('broadcastSelectionPos');
        const roomName = data.room;
        const pos = data.data
        socket.broadcast.to(roomName).emit('receiveSelectionPos', pos);
         
      })
  
      socket.on('broadcastSelectionSize', (data) => {
        console.log('broadcastSelectionSize');
        const roomName = data.room;
        const size = data.data
        socket.broadcast.to(roomName).emit('receiveSelectionSize', size);
         
      })
  
      socket.on('broadcastPasteRequest', (data) => {
        console.log('broadcastPasteRequest');
        const roomName = data.room;
        const pasteReq = data.data
        socket.broadcast.to(roomName).emit('receivePasteRequest', pasteReq);
         

        socket.emit('fetchStrokes');
      })
  
      socket.on('broadcastDeleteRequest', (data) => {
        console.log('broadcastDeleteRequest');
        const roomName = data.room;
        const delReq = data.data
        socket.broadcast.to(roomName).emit('receiveDeleteRequest', delReq);
         
      })
  
      socket.on('broadcastNewStrokeWidth', (data) => {
        console.log('broadcastNewStrokeWidth');
        const roomName = data.room;
        const width = data.data
        socket.broadcast.to(roomName).emit('receiveStrokeWidth', width);
         
      })

      socket.on('broadcastNewPrimaryColor', (data) => {
        console.log('broadcastNewPrimaryColor');
        const roomName = data.room;
        const primeColor = data.data
        socket.broadcast.to(roomName).emit('receiveNewPrimaryColor', primeColor);
         
      })

      socket.on('broadcastNewSecondaryColor', (data) => {
        console.log('broadcastNewSecondaryColor');
        const roomName = data.room;
        const secondColor = data.data
        socket.broadcast.to(roomName).emit('receiveNewSecondaryColor', secondColor);
         
      })
})
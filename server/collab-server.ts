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
  value:  {
            nbMembers
            strokes
          }
*/// vvvvvvvvvvvvvv
let infoOnActiveRooms = new Map();

ioCollab.on('connection', (socket) => {

      // COLLAB ROOM EVENTS
      // This event is to make sure the other collaborator's selections are pasted before a new member joins
      socket.on('prepForJoin', (data) => {
        const room = data.room; // Note: The room name is the drawingID
        const userJoining = data.username;
        console.log("Prepping for join " , room);
        if (infoOnActiveRooms.has(room)) {
          socket.broadcast.to(room).emit('prepForNewMember', userJoining);   
          const randomRoomMember = infoOnActiveRooms.get(room).members[0]; 
          ioCollab.to(randomRoomMember).emit('fetchStrokes'); 
        } 
        socket.emit('readyToJoin', room);
      })

      socket.on('joinCollab', (room) => { // Note: The room name is the drawingID
        console.log("Trying to join drawing: " , room);

        // Updating collabRoom info
        let value = {
          nbMembers: 1,
          strokes: [],
          members: [socket.id],
        };
        if (infoOnActiveRooms.has(room)) {
          value = infoOnActiveRooms.get(room);
          value.nbMembers = value.nbMembers + 1;
          value.members.push(socket.id);
        }
        infoOnActiveRooms.set(room, value);

        // Joining
        socket.join(room);
        ioCollab.in(room).emit('memberNbUpdate', value.nbMembers);
        socket.emit('joinSuccessful', infoOnActiveRooms.get(room));
      })

      socket.on('leaveCollab', (data) => {
        const room = data.room; // Note: The room name is the drawingID
        const userLeaving = data.username;
        console.log("Trying to leave drawing: " , room);

        // Updating collabRoom info
        let value = infoOnActiveRooms.get(room);
        value.nbMembers = value.nbMembers - 1;
        value.nbMembers == 0 ? infoOnActiveRooms.delete(room) : infoOnActiveRooms.set(room, value);

        // Leaving
        socket.leave(room);
        ioCollab.in(room).emit('memberNbUpdate', value.nbMembers);
        socket.broadcast.to(room).emit('memberLeft', userLeaving);
      })

      socket.on('updateCollabInfo', (collabData) => {
        console.log('updateCollabInfo');
        
        let value = infoOnActiveRooms.get(collabData.collabDrawingId);
        value.strokes = collabData.strokes;
        infoOnActiveRooms.set(collabData.collabDrawingId, value);
      })

      // DRAWING EVENTS
      socket.on('broadcastStroke', (data) => {
        console.log('broadcastStroke');
        const room = data.room;
        const stroke = data.data
        socket.broadcast.to(room).emit('receiveStroke', stroke);
      })

      socket.on('broadcastSelection', (data) => {
        console.log('broadcastSelection');
        const room = data.room;
        const selection = data.data
        socket.broadcast.to(room).emit('receiveSelection', selection);
         
      })
  
      socket.on('broadcastSelectionPos', (data) => {
        console.log('broadcastSelectionPos');
        const room = data.room;
        const pos = data.data
        socket.broadcast.to(room).emit('receiveSelectionPos', pos);
         
      })
  
      socket.on('broadcastSelectionSize', (data) => {
        console.log('broadcastSelectionSize');
        const room = data.room;
        const size = data.data
        socket.broadcast.to(room).emit('receiveSelectionSize', size);
         
      })
  
      socket.on('broadcastPasteRequest', (data) => {
        console.log('broadcastPasteRequest');
        const room = data.room;
        const pasteReq = data.data
        socket.broadcast.to(room).emit('receivePasteRequest', pasteReq);
         

        socket.emit('fetchStrokes');
      })
  
      socket.on('broadcastDeleteRequest', (data) => {
        console.log('broadcastDeleteRequest');
        const room = data.room;
        const delReq = data.data
        socket.broadcast.to(room).emit('receiveDeleteRequest', delReq);
         
      })
  
      socket.on('broadcastNewStrokeWidth', (data) => {
        console.log('broadcastNewStrokeWidth');
        const room = data.room;
        const width = data.data
        socket.broadcast.to(room).emit('receiveStrokeWidth', width);
         
      })

      socket.on('broadcastNewPrimaryColor', (data) => {
        console.log('broadcastNewPrimaryColor');
        const room = data.room;
        const primeColor = data.data
        socket.broadcast.to(room).emit('receiveNewPrimaryColor', primeColor);
         
      })

      socket.on('broadcastNewSecondaryColor', (data) => {
        console.log('broadcastNewSecondaryColor');
        const room = data.room;
        const secondColor = data.data
        socket.broadcast.to(room).emit('receiveNewSecondaryColor', secondColor);
         
      })
})
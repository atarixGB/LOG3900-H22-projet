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
  key: collabRoom (drawingId)
  value:  {
            nbMembers
            strokes
          }
*/// vvvvvvvvvvvvvv
let infoOnActiveRooms = new Map();

ioCollab.on('connection', (socket) => {

      // COLLAB ROOM EVENTS
      socket.on('joinCollab', (collabDrawingId) => {
        console.log("Trying to join drawing: " , collabDrawingId);

        // Updating collabRoom info
        if (!infoOnActiveRooms.has(collabDrawingId)) {
           const value = {
            nbMembers: 1,
            strokes: [],
          }
          infoOnActiveRooms.set(collabDrawingId, value);
          // Joining
          socket.join(collabDrawingId);
          ioCollab.in(collabDrawingId).emit('memberNbUpdate', value.nbMembers);
          socket.emit('joinSuccessful', infoOnActiveRooms.get(collabDrawingId));
          socket.emit('joinSuccessfulwithID', collabDrawingId);

        } else if (infoOnActiveRooms.get(collabDrawingId).nbMembers < 4) {
          let value = infoOnActiveRooms.get(collabDrawingId);
          value.nbMembers = value.nbMembers + 1;
          infoOnActiveRooms.set(collabDrawingId, value);
          // Joining
          socket.join(collabDrawingId);
          ioCollab.in(collabDrawingId).emit('memberNbUpdate', value.nbMembers);
          socket.emit('joinSuccessful', infoOnActiveRooms.get(collabDrawingId));
          socket.emit('joinSuccessfulwithID', collabDrawingId);

        } else {
          socket.emit('joinFailure');
        }
      })

      socket.on('leaveCollab', (collabDrawingId) => {
        console.log("Trying to leave drawing: " , collabDrawingId);

        // Updating collabRoom info
        let value = infoOnActiveRooms.get(collabDrawingId);
        value.nbMembers = value.nbMembers - 1;
        value.nbMembers == 0 ? infoOnActiveRooms.delete(collabDrawingId) : infoOnActiveRooms.set(collabDrawingId, value);

        // Leaving
        ioCollab.in(collabDrawingId).emit('memberNbUpdate', value.nbMembers);
        socket.leave(collabDrawingId);
      })

      socket.on('updateCollabInfo', (collabData) => {
        let value = infoOnActiveRooms.get(collabData.collabDrawingId);
        value.strokes = collabData.strokes;
        infoOnActiveRooms.set(collabData.collabDrawingId, value);
      })

      // DRAWING EVENTS
      socket.on('broadcastStroke', (data) => {
        const room = data.room;
        const stroke = data.data
        socket.broadcast.to(room).emit('receiveStroke', stroke);
      })

      socket.on('broadcastSelection', (data) => {
        const room = data.room;
        const selection = data.data
        socket.broadcast.to(room).emit('receiveSelection', selection);
      })
  
      socket.on('broadcastSelectionPos', (data) => {
        const room = data.room;
        const pos = data.data
        socket.broadcast.to(room).emit('receiveSelectionPos', pos);
      })
  
      socket.on('broadcastSelectionSize', (data) => {
        const room = data.room;
        const size = data.data
        socket.broadcast.to(room).emit('receiveSelectionSize', size);
      })
  
      socket.on('broadcastPasteRequest', (data) => {
        const room = data.room;
        const pasteReq = data.data
        socket.broadcast.to(room).emit('receivePasteRequest', pasteReq);
      })
  
      socket.on('broadcastDeleteRequest', (data) => {
        const room = data.room;
        const delReq = data.data
        socket.broadcast.to(room).emit('receiveDeleteRequest', delReq);
      })
  
      socket.on('broadcastNewStrokeWidth', (data) => {
        const room = data.room;
        const width = data.data
        socket.broadcast.to(room).emit('receiveStrokeWidth', width);
      })

      socket.on('broadcastNewPrimaryColor', (data) => {
        const room = data.room;
        const primeColor = data.data
        socket.broadcast.to(room).emit('receiveNewPrimaryColor', primeColor);
      })

      socket.on('broadcastNewSecondaryColor', (data) => {
        const room = data.room;
        const secondColor = data.data
        socket.broadcast.to(room).emit('receiveNewSecondaryColor', secondColor);
      })
})
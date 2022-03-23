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

ioCollab.on('connection', (socket) => {
      socket.on('broadcastStroke', (strokeData) => {
        console.log("StrokeData : " , strokeData);
        ioCollab.emit('receiveStroke', strokeData);
      })

      socket.on('broadcastSelection', (selectionData) => {
        console.log("Broadcasting selection : ", selectionData);
        ioCollab.emit('receiveSelection', selectionData);
      })
  
      socket.on('broadcastSelectionPos', (posData) => {
        console.log("Broadcasting new selection position : ", posData);
        ioCollab.emit('receiveSelectionPos', posData);
      })
  
      socket.on('broadcastSelectionSize', (sizeData) => {
        console.log("Broadcasting new selection size : ", sizeData);
        ioCollab.emit('receiveSelectionSize', sizeData);
      })
  
      socket.on('broadcastPasteRequest', (pasteReqData) => {
        console.log("Broadcasting paste request from :", pasteReqData);
        ioCollab.emit('receivePasteRequest', pasteReqData);
      })
  
      socket.on('broadcastDeleteRequest', (delReqData) => {
        console.log("Broadcasting delete request from :", delReqData);
        ioCollab.emit('receiveDeleteRequest', delReqData);
      })
  
      socket.on('broadcastNewStrokeWidth', (widthData) => {
        console.log("Broadcasting new stroke width :", widthData);
        ioCollab.emit('receiveStrokeWidth', widthData);
      })

      socket.on('broadcastNewPrimaryColor', (colorData) => {
        console.log("Broadcasting NewPrimaryColor :", colorData);
        ioCollab.emit('receiveNewPrimaryColor', colorData);
      })

      socket.on('broadcastNewSecondaryColor', (colorData) => {
        console.log("Broadcasting NewSecondaryColor :", colorData);
        ioCollab.emit('receiveNewSecondaryColor', colorData);
      })
})
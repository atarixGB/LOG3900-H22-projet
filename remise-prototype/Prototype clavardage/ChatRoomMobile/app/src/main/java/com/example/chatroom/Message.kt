package com.example.chatroom

 class Message {
     var msgText: String ? = null
     var user: String ? = null
     var time: String ? = null

     constructor(){}

     constructor(message:String?, senderId : String?, sendTime : String?){
         this.msgText = message
         this.user = senderId
         this.time = sendTime
     }
 }

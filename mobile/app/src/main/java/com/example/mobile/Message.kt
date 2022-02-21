package com.example.mobile

class Message {
    var msgText: String ? = null
    var user: String ? = null
    var time: String ? = null
    var room: String ? = null

    constructor(){}

    constructor(message:String?, senderId : String?, sendTime : String?, roomName: String?){
        this.msgText = message
        this.user = senderId
        this.time = sendTime
        this.room = roomName
    }
}

package com.example.mobile

class Message {
    var msgText: String ? = null
    var user: String ? = null
    var time: String ? = null
    var room: String ? = null
    var isNotif: Boolean? = null

    constructor(){}

    constructor(message:String?, senderId : String?, sendTime : String?, roomName: String?, isNotif: Boolean?){
        this.msgText = message
        this.user = senderId
        this.time = sendTime
        this.room = roomName
        this.isNotif = isNotif
    }
}

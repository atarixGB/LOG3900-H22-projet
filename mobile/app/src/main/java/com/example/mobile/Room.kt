package com.example.mobile

class Room {
    var roomName: String ? = null
    var users: String ? = null

    constructor(){}

    constructor(roomName:String?, senderId : String?){
        this.roomName = roomName
        this.users = senderId
    }
}
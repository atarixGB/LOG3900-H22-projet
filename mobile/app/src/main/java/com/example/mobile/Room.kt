package com.example.mobile

data class RoomList (val data: List<Room>?)
data class Room(val id:String?, val identifier:String?, val roomName: String, val usersList: ArrayList<String>)
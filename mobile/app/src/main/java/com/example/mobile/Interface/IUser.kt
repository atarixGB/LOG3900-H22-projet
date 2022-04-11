package com.example.mobile.Interface

data class IUser(
    val id:String?,
    val identifier:String?,
    val password : String?,
    val avatar : String?,
    val email: String?,
    val description:String?,
    val collaborationCount:Int?,
    val totalCollaborationTime:Int?)

data class myUser(
    val identifier:String?,
    val password : String?,
    val avatar : String?,
    val email: String?,
    val description:String?,
    val collaborationCount:Int?,
    val totalCollaborationTime:Int?)


package com.example.mobile.Interface

data class User(val id:String?, val username:String?, val password : String?,val avatar : String?,val email: String?)
data class UserList (val data: List<User>)

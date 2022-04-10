package com.example.mobile.viewModel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class NotificationModel : ViewModel() {
    private var _roomName = MutableLiveData<String>("")
    val roomName: LiveData<String> = _roomName

    fun updateRoom(room : String){
        _roomName .value= room
    }
}
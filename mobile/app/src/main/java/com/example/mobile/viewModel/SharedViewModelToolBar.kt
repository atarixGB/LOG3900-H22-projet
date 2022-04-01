package com.example.mobile.viewModel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class SharedViewModelToolBar: ViewModel() {
    private val _user = MutableLiveData<String>()
    val user: LiveData<String> = _user

    private val _visitorUser = MutableLiveData<String>()
    val visitorUser: LiveData<String> = _visitorUser

    private val _drawingId = MutableLiveData<String>()
    val drawingId: LiveData<String> = _drawingId

    fun setUser(newUser: String) {
        _user.value = newUser
    }

    fun setVisitorUser(visitorUser:String){
        _visitorUser.value=visitorUser
    }

    fun setDrawingId(newId: String) {
        _drawingId.value = newId
    }
}
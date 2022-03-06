package com.example.mobile

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class SharedViewModelToolBar: ViewModel() {
    private val _user = MutableLiveData<String>()
    val user: LiveData<String> = _user

    fun setUser(newUser: String) {
        _user.value = newUser
    }
}
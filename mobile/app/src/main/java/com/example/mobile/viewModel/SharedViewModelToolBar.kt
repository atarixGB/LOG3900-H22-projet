package com.example.mobile.viewModel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class SharedViewModelToolBar: ViewModel() {
    private val _user = MutableLiveData<String>()
    val user: LiveData<String> = _user

    private val _drawingId = MutableLiveData<String>()
    val drawingId: LiveData<String> = _drawingId

    private val _collabDrawingId = MutableLiveData<String>()
    val collabDrawingId: LiveData<String> = _collabDrawingId

    fun setUser(newUser: String) {
        _user.value = newUser
    }

    fun setDrawingId(newId: String) {
        _drawingId.value = newId
    }

    fun setCollabDrawingId(newId: String) {
        _collabDrawingId.value = newId
    }
}
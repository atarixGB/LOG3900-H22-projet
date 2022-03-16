package com.example.mobile

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class SharedViewModelCreateDrawingPopUp: ViewModel() {
    private val _albumName = MutableLiveData<String>()
    val albumName: LiveData<String> = _albumName

    fun setAlbum(newAlbumSelected: String) {
        _albumName.value = newAlbumSelected
    }
}
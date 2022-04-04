package com.example.mobile.viewModel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class SharedViewModelCreateDrawingPopUp: ViewModel() {
    private val _albumName = MutableLiveData<String>()
    private val _albumID= MutableLiveData<String>()
    val albumName: LiveData<String> = _albumName
    val albumID:LiveData<String> = _albumID

    fun setAlbum(newAlbumSelected: String,albumID: String) {
        _albumName.value = newAlbumSelected
        _albumID.value=albumID
    }
}
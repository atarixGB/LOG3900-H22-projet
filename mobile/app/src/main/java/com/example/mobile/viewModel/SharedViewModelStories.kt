package com.example.mobile.viewModel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.mobile.Interface.IStory

class SharedViewModelStories : ViewModel() {
    private val _stories = MutableLiveData<ArrayList<IStory>>()
    val stories: LiveData<ArrayList<IStory>> = _stories

    fun setStories(newStories: ArrayList<IStory>) {
        _stories.value = newStories
    }
}
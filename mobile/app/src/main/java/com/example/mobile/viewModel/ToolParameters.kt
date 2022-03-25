package com.example.mobile.viewModel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class ToolParameters: ViewModel(){
    private var _weight = MutableLiveData<Float>(1f)
    val weight: LiveData<Float> = _weight
    private var _color = MutableLiveData<Int>(0)
    val color: LiveData<Int> = _color

    private var _deleteSelection = MutableLiveData<Boolean>(false)
    val deleteSelection: LiveData<Boolean> = _deleteSelection

    fun changeColor(newColor: Int){
        _color.value = newColor
    }

    fun changeWeight(newWeight: Float){
        _weight.value = newWeight
    }

    fun deleteSelection(clicked: Boolean) {
        _deleteSelection.value = clicked
    }
}
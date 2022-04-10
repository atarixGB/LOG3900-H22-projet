package com.example.mobile.viewModel

import android.graphics.Color
import androidx.lifecycle.*

class ToolParameters: ViewModel(){
    private var _weight = MutableLiveData<Float>(1f)
    val weight: LiveData<Float> = _weight

    private var _color = MutableLiveData<Int>( -16777216) // black color equivalent
    val color: LiveData<Int> = _color

    private var _isStroke = MutableLiveData<Boolean>(true)
    val isStroke: LiveData<Boolean> = _isStroke

    private var _deleteSelection = MutableLiveData<Boolean>(false)
    val deleteSelection: LiveData<Boolean> = _deleteSelection

    private var _pasteSelection = MutableLiveData<Boolean>(false)
    val pasteSelection: LiveData<Boolean> = _pasteSelection


    fun changeStroke(isStroke : Boolean){
        _isStroke.value = isStroke
    }

    fun changeColor(newColor: Int){
        _color.value = newColor
    }

    fun changeWeight(newWeight: Float){
        _weight.value = newWeight
    }

    fun deleteSelection(clicked: Boolean) {
        _deleteSelection.value = clicked
    }

    fun pasteSelection(clicked: Boolean) {
        _pasteSelection.value = clicked
    }
}
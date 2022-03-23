package com.example.mobile.viewModel

import android.graphics.Bitmap
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.mobile.activity.drawing.ToolbarFragment

class ToolModel : ViewModel(){
    private var _tool = MutableLiveData<ToolbarFragment.MenuItem>(ToolbarFragment.MenuItem.PENCIL)
    val tool: LiveData<ToolbarFragment.MenuItem> = _tool

    private val _img = MutableLiveData<Bitmap>()
    var img: LiveData<Bitmap> = _img

    private val _onClick = MutableLiveData<Boolean>(false)
    var onClick: LiveData<Boolean> = _onClick

    fun changeTool(newTool: ToolbarFragment.MenuItem){
        _tool.value = newTool
    }

    fun changeImg(newImg: Bitmap) {
        _img.value = newImg
    }

    fun onClick() {
        _onClick.value = true
    }


}
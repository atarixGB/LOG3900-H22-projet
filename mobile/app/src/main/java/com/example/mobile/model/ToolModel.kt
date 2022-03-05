package com.example.mobile.model

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.mobile.ToolbarFragment

class ToolModel : ViewModel(){
    private var _tool = MutableLiveData<ToolbarFragment.MenuItem>(ToolbarFragment.MenuItem.PENCIL)
    val tool: LiveData<ToolbarFragment.MenuItem> = _tool

    fun changeTool(newTool: ToolbarFragment.MenuItem){
        _tool.value = newTool
    }
}
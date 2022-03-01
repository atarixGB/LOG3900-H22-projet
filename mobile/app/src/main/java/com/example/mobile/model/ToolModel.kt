package com.example.mobile.model

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class ToolModel : ViewModel(){
    private var _tool = MutableLiveData<String>("pencil")
    val tool: LiveData<String> = _tool

    fun changeTool(newTool: String){
        _tool.value = newTool
    }
}
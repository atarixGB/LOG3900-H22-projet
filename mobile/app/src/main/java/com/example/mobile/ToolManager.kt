package com.example.mobile

import android.content.Context
import android.graphics.Canvas

class ToolManager {
    var currentTool : Tool
    private var canvas: Canvas
    private var context: Context
    private lateinit var pencil: Pencil
    private lateinit var eraser: Eraser

    constructor(context: Context, canvas : Canvas){
        this.canvas = canvas
        this.context = context
        initialiseTools()
        this.currentTool = pencil
    }

    private fun initialiseTools(){
        this.pencil = Pencil(context,canvas)
        this.eraser = Eraser(context, canvas)
    }

    fun changeTool(tool:String){
        if(tool == "pencil"){
            this.currentTool = pencil
        }else if (tool == "eraser")
            this.currentTool = eraser
    }
}
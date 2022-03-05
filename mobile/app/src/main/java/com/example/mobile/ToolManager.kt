package com.example.mobile

import android.content.Context
import android.graphics.Canvas

class ToolManager {
    var currentTool : Tool
    private var baseCanvas: Canvas
    private var context: Context
    private lateinit var pencil: Pencil
    private lateinit var eraser: Eraser
    private lateinit var rectangle: Rectangle

    constructor(context: Context, baseCanvas : Canvas){
        this.baseCanvas = baseCanvas
        this.context = context
        initialiseTools()
        this.currentTool = pencil
    }

    private fun initialiseTools(){
        this.pencil = Pencil(context,baseCanvas)
        this.eraser = Eraser(context, baseCanvas)
        this.rectangle = Rectangle(context, baseCanvas)
    }

    fun changeTool(tool:String) {
        if (tool == "pencil") this.currentTool = pencil
        else if (tool == "eraser") this.currentTool = eraser
        else if (tool == "rectangle") this.currentTool = rectangle
    }
}
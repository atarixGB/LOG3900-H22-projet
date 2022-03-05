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
    private lateinit var ellipse: Ellipse

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
        this.ellipse = Ellipse(context, baseCanvas)
    }

    fun changeTool(tool: ToolbarFragment.MenuItem) {
        if (tool == ToolbarFragment.MenuItem.PENCIL) this.currentTool = pencil
        else if (tool == ToolbarFragment.MenuItem.ERASER) this.currentTool = eraser
        else if (tool == ToolbarFragment.MenuItem.RECTANGLE) this.currentTool = rectangle
        else if (tool == ToolbarFragment.MenuItem.OVAL) this.currentTool = ellipse
    }
}
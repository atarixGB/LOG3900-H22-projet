package com.example.mobile.Tools

import android.content.Context
import android.graphics.Canvas
import com.example.mobile.activity.drawing.DrawingCollaboration

class ToolManager {
    var currentTool : Tool
    private var baseCanvas: Canvas
    private var context: Context
    lateinit var pencil: Pencil
    lateinit var eraser: Eraser
    lateinit var rectangle: Rectangle
    lateinit var ellipse: Ellipse
    private var socket: DrawingCollaboration

    constructor(context: Context, baseCanvas : Canvas, socket : DrawingCollaboration){
        this.socket = socket
        this.baseCanvas = baseCanvas
        this.context = context
        initialiseTools()
        this.currentTool = pencil
    }

    private fun initialiseTools(){
        this.pencil = Pencil(context,baseCanvas,socket )
        this.eraser = Eraser(context, baseCanvas, socket)
        this.rectangle = Rectangle(context, baseCanvas, socket)
        this.ellipse = Ellipse(context, baseCanvas, socket)
    }

    fun isCurrentToolEraser(): Boolean {
        return this.currentTool == eraser
    }

    fun changeTool(tool: ToolbarFragment.MenuItem) {
        if (tool == ToolbarFragment.MenuItem.PENCIL) this.currentTool = pencil
        else if (tool == ToolbarFragment.MenuItem.ERASER) this.currentTool = eraser
        else if (tool == ToolbarFragment.MenuItem.RECTANGLE) this.currentTool = rectangle
        else if (tool == ToolbarFragment.MenuItem.OVAL) this.currentTool = ellipse
    }
}
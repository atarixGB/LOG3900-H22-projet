package com.example.mobile.Tools

import android.content.Context
import android.graphics.Canvas
import com.example.mobile.DrawingCollaboration

class ToolManager {
    var currentTool : Tool
    private var baseCanvas: Canvas
    private var context: Context
    lateinit var pencil: Pencil
    lateinit var eraser: Eraser
    lateinit var rectangle: Rectangle
    lateinit var ellipse: Ellipse
    lateinit var selection:Selection
    private var socket: DrawingCollaboration

    constructor(context: Context, baseCanvas : Canvas, socket :DrawingCollaboration){
        this.socket = socket
        this.baseCanvas = baseCanvas
        this.context = context
        initialiseTools()
        this.currentTool = pencil
    }

    private fun initialiseTools(){
        this.selection= Selection(context,baseCanvas,socket)
        this.pencil = Pencil(context,baseCanvas,socket, selection )
        this.eraser = Eraser(context, baseCanvas, socket)
        this.rectangle = Rectangle(context, baseCanvas, socket)
        this.ellipse = Ellipse(context, baseCanvas, socket)
//        this.selection= Selection(context,baseCanvas,socket)
    }

    fun isCurrentToolEraser(): Boolean {
        return this.currentTool == eraser
    }

    fun isCurrentToolSelection(): Boolean {
        return this.currentTool == selection
    }

    fun changeTool(tool: ToolbarFragment.MenuItem) {
        if (tool == ToolbarFragment.MenuItem.PENCIL) this.currentTool = pencil
        else if (tool == ToolbarFragment.MenuItem.ERASER) this.currentTool = eraser
        else if (tool == ToolbarFragment.MenuItem.RECTANGLE) this.currentTool = rectangle
        else if (tool == ToolbarFragment.MenuItem.OVAL) this.currentTool = ellipse
        else if (tool == ToolbarFragment.MenuItem.SELECTION) this.currentTool = selection
    }
}
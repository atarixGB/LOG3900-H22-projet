package com.example.mobile.Tools

import android.content.Context
import android.graphics.Canvas
import com.example.mobile.activity.drawing.DrawingSocket
import com.example.mobile.activity.drawing.ToolbarFragment

class ToolManager {
    var currentTool : Tool
    private var baseCanvas: Canvas
    private var context: Context
    lateinit var pencil: Pencil
    lateinit var rectangle: Rectangle
    lateinit var ellipse: Ellipse
    lateinit var selection:Selection
    private var socket: DrawingSocket
    lateinit var drawingId: String

    constructor(context: Context, baseCanvas : Canvas, socket : DrawingSocket, drawingId: String){
        this.socket = socket
        this.drawingId = drawingId
        this.baseCanvas = baseCanvas
        this.context = context
        initialiseTools()
        this.currentTool = pencil
    }

    private fun initialiseTools(){
        this.selection= Selection(context,baseCanvas,socket, drawingId)
        this.pencil = Pencil(context,baseCanvas,socket, selection, drawingId )
        this.rectangle = Rectangle(context, baseCanvas, socket, selection, drawingId)
        this.ellipse = Ellipse(context, baseCanvas, socket, selection, drawingId)
    }


    fun isCurrentToolSelection(): Boolean {
        return this.currentTool == selection
    }

    fun changeTool(tool: ToolbarFragment.MenuItem) {
        if (tool == ToolbarFragment.MenuItem.PENCIL) this.currentTool = pencil
        else if (tool == ToolbarFragment.MenuItem.RECTANGLE) this.currentTool = rectangle
        else if (tool == ToolbarFragment.MenuItem.OVAL) this.currentTool = ellipse
        else if (tool == ToolbarFragment.MenuItem.SELECTION) this.currentTool = selection
    }
}
package com.example.mobile

import android.content.Context
import android.graphics.Canvas

class ToolManager {
    var currentTool : Tool
    private var canvas: Canvas
    private var context: Context
    private lateinit var pencil: Pencil

    constructor(context: Context, canvas : Canvas){
        this.canvas = canvas
        this.context = context
        initialiseTools()
        this.currentTool = pencil
    }

    private fun initialiseTools(){
        this.pencil = Pencil(context,canvas)
    }
}
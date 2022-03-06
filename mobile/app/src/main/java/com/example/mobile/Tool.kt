package com.example.mobile

import android.content.Context
import android.graphics.*
import android.view.ViewConfiguration
import androidx.core.content.res.ResourcesCompat

abstract class Tool(context: Context, baseCanvas: Canvas) {
    var baseCanvas: Canvas = baseCanvas
    var context: Context = context
    var mStartX = 0f
    var mStartY = 0f
    var mx = 0f
    var my = 0f
    var path = Path()
    val TOUCH_TOLERANCE = 4f
    protected val drawColor = ResourcesCompat.getColor(context.resources, R.color.black, null)
    protected val backgroundColor = ResourcesCompat.getColor(context.resources, R.color.white, null)

    protected val paint = Paint().apply {
        color = drawColor
        // Smooths out edges of what is drawn without affecting shape.
        isAntiAlias = true
        // Dithering affects how colors with higher-precision than the device are down-sampled.
        isDither = true
        style = Paint.Style.STROKE // default: FILL
        strokeJoin = Paint.Join.ROUND // default: MITER
        strokeCap = Paint.Cap.ROUND // default: BUTT
        strokeWidth = 1f // default: Hairline-width (really thin)
    }

    abstract fun touchStart()

    abstract fun touchMove()

    abstract fun touchUp()

    fun changeWeight(width : Float){
        this.paint.strokeWidth = width
    }

    fun changeColor(color:Int){
        this.paint.color = color
    }

    abstract fun onDraw(canvas: Canvas)
}
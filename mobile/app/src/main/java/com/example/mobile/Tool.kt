package com.example.mobile

import android.content.Context
import android.graphics.*
import android.view.View
import android.view.ViewConfiguration
import androidx.core.content.res.ResourcesCompat

abstract class Tool(context: Context,extraCanvas: Canvas) {
    var extraCanvas: Canvas = extraCanvas
    var context: Context = context
    var currentX = 0f
    var currentY = 0f
    var motionTouchEventX = 0f
    var motionTouchEventY = 0f
    private val drawColor = ResourcesCompat.getColor(context.resources, R.color.black, null)
    private val backgroundColor = ResourcesCompat.getColor(context.resources, R.color.white, null)
    protected val touchTolerance = ViewConfiguration.get(context).scaledTouchSlop
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
    protected var path = Path()

    abstract fun touchMove()

    fun touchstart(){
        path.reset()
        path.moveTo(motionTouchEventX, motionTouchEventY)
        currentX = motionTouchEventX
        currentY = motionTouchEventY
    }

     fun touchUp(){
         path.reset()
     }

    fun changeWeight(width : Float){
        this.paint.strokeWidth = width
    }
}
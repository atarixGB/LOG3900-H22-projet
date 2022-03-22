package com.example.mobile.Interface

import android.graphics.Canvas
import android.graphics.Paint
import com.example.mobile.activity.drawing.ToolbarFragment

data class IRectangleStroke(
    override var boundingPoints: ArrayList<IVec2>,
    override var currentStrokeColor: Int,
    val secondaryColor : Int,
    override var currentStrokeWidth: Float,
    override var isSelected: Boolean,
    val width: Float,
    val height: Float,
    var topLeftCorner: IVec2):Stroke(boundingPoints,currentStrokeColor,currentStrokeWidth, isSelected,
    ToolbarFragment.MenuItem.RECTANGLE) {

    override fun drawStroke(canvas: Canvas) {
        val upcomingPaint = Paint().apply {
            color = currentStrokeColor
            strokeWidth = currentStrokeWidth
            isAntiAlias = true
            // Dithering affects how colors with higher-precision than the device are down-sampled.
            isDither = true
            style = Paint.Style.STROKE // default: FILL
            strokeJoin = Paint.Join.ROUND // default: MITER
            strokeCap = Paint.Cap.ROUND // default: BUTT
        }
        canvas!!.drawRect(topLeftCorner.x,
            topLeftCorner.y,
            topLeftCorner.x + width,
            topLeftCorner.y + height,
            upcomingPaint!!)
    }

    override fun prepForSelection() {
        topLeftCorner = IVec2(0F, 0F)
    }

    override fun prepForBaseCanvas() {
        topLeftCorner = IVec2(boundingPoints[0].x, boundingPoints[0].y)
    }
}

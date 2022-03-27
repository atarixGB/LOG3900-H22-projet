package com.example.mobile.Interface

import android.graphics.Canvas
import android.graphics.Paint
import com.example.mobile.activity.drawing.ToolbarFragment

data class IEllipseStroke (
    override var boundingPoints: ArrayList<IVec2>,
    override var currentStrokeColor: Int,
    val secondaryColor : Int,
    override var currentStrokeWidth: Float,
    override var isSelected: Boolean,
    var center: IVec2,
    val radius: IVec2):Stroke(boundingPoints,currentStrokeColor,currentStrokeWidth, isSelected,
    ToolbarFragment.MenuItem.OVAL) {

    override fun drawStroke(canvas: Canvas) {
        val upcomingPaint = Paint().apply {
            color = currentStrokeColor
            strokeWidth = currentStrokeWidth
            isAntiAlias = true
            // Dithering affects how colors with higher-precision than the device are down-sampled.
            isDither = true
            style = Paint.Style.STROKE // default: FILL
            strokeJoin = Paint.Join.MITER // default: MITER
            strokeCap = Paint.Cap.SQUARE // default: BUTT
        }
        canvas!!.drawOval(center.x-radius.x,
            center.y-radius.y,
            center.x+radius.x,
            center.y+radius.y,
            upcomingPaint!!)
    }

    override fun prepForSelection() {
        center = IVec2(center.x - boundingPoints[0].x, center.y - boundingPoints[0].y)
    }

    override fun prepForBaseCanvas() {
        center = IVec2(center.x + boundingPoints[0].x, center.y + boundingPoints[0].y)
    }

    override fun updateMove(pos: IVec2) {
        center = IVec2(center.x + pos.x, center.y +pos.y)
    }
//
//    override fun moveStroke(newPosition: IVec2) {
//        TODO("Not yet implemented")
//    }

}

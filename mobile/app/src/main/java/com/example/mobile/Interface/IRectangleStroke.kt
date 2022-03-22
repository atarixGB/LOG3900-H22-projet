package com.example.mobile.Interface

import android.graphics.Canvas
import android.graphics.Paint
import com.example.mobile.Tools.ToolbarFragment

data class IRectangleStroke(
    override var boundingPoints: ArrayList<IVec2>,
    override var currentStrokeColor: Int,
    val secondaryColor : Int,
    override var currentStrokeWidth: Float,
    val width: Float,
    val height: Float,
    val topLeftCorner: IVec2):Stroke(boundingPoints,currentStrokeColor,currentStrokeWidth,
    ToolbarFragment.MenuItem.PENCIL) {

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
//        for (i in 0 until points.size) {
//            points[i].x = points[i].x - boundingPoints[0].x
//            points[i].y = points[i].y - boundingPoints[0].y
//        }
    }
    //
    override fun prepForBaseCanvas(selectionTopLeftCorner: IVec2, selectionSize: IVec2){
//        for ( i in 0 until points.size) {
//            this.points[i].x = this.points[i].x + selectionTopLeftCorner.x
//            this.points[i].y = this.points[i].y + selectionTopLeftCorner.y
//        }
//        val bottomRightCorner=IVec2(x=selectionTopLeftCorner.x + selectionSize.x,y=selectionTopLeftCorner.y + selectionSize.y)
//        this.boundingPoints = arrayListOf(selectionTopLeftCorner,bottomRightCorner)
    }
}

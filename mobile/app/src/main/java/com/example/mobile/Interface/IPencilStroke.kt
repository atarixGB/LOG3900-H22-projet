package com.example.mobile.Interface

import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.Path
import com.example.mobile.Tools.ToolbarFragment

data class IPencilStroke (
    override var boundingPoints: ArrayList<IVec2>,
    override var currentStrokeColor: Int,
    override var currentStrokeWidth: Float,
    override var isSelected: Boolean,
    val points: ArrayList<IVec2>,
    ):Stroke(boundingPoints,currentStrokeColor,currentStrokeWidth,isSelected, ToolbarFragment.MenuItem.PENCIL) {

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
        var path = Path()
        path.reset()
        var startX = points.get(0).x
        var startY = points.get(0).y
        path.moveTo(startX, startY)
        for(points in points){
            path.quadTo(
                startX,
                startY,
                points.x,
                points.y
            )
            startX = points.x
            startY = points.y
        }
        path!!.lineTo(startX, startY)
        canvas!!.drawPath(path!!, upcomingPaint!!)
        path!!.reset()
    }

    override fun prepForSelection() {
        for (i in 0 until points.size) {
            points[i].x = points[i].x - boundingPoints[0].x
            points[i].y = points[i].y - boundingPoints[0].y
        }
    }

    override fun prepForBaseCanvas() {
        for (i in 0 until points.size) {
            points[i].x = points[i].x + boundingPoints[0].x
            points[i].y = points[i].y + boundingPoints[0].y
        }
//        val bottomRightCorner = IVec2(
//            x = selectionTopLeftCorner.x + selectionSize.x,
//            y = selectionTopLeftCorner.y + selectionSize.y
//        )
//        boundingPoints.add(selectionTopLeftCorner)
//        boundingPoints.add(bottomRightCorner)
    }


    //code Leon
//    override fun prepForSelection() {
//        for (i in 0 until points.size) {
//            points[i].x = points[i].x - boundingPoints[0].x
//            points[i].y = points[i].y - boundingPoints[0].y
//        }
//    }
////
//    override fun prepForBaseCanvas(selectionTopLeftCorner: IVec2, selectionSize: IVec2){
//        for ( i in 0 until points.size) {
//            this.points[i].x = this.points[i].x + selectionTopLeftCorner.x
//            this.points[i].y = this.points[i].y + selectionTopLeftCorner.y
//        }
//        val bottomRightCorner=IVec2(x=selectionTopLeftCorner.x + selectionSize.x,y=selectionTopLeftCorner.y + selectionSize.y)
//        this.boundingPoints = arrayListOf(selectionTopLeftCorner,bottomRightCorner)
//    }
}

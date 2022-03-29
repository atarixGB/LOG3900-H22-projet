package com.example.mobile.Interface

import android.graphics.Canvas
import com.example.mobile.Tools.Tool
import com.example.mobile.activity.drawing.ToolbarFragment


abstract class Stroke(open var boundingPoints: ArrayList<IVec2>,
                      open var currentStrokeColor: Int,
                      open var currentStrokeWidth: Float,
                      open var isSelected: Boolean,
                      val toolType: ToolbarFragment.MenuItem) {

    abstract fun drawStroke(canvas: Canvas)
    abstract fun prepForSelection()
    abstract fun prepForBaseCanvas()
    fun moveStroke(newPosition: IVec2) {
        boundingPoints[0] =
            IVec2(boundingPoints[0].x + newPosition.x, boundingPoints[0].y + newPosition.y)
        boundingPoints[1] =
            IVec2(boundingPoints[1].x + newPosition.x, boundingPoints[1].y + newPosition.y)
    }

    abstract fun updateMove(pos: IVec2)
    abstract fun rescale(scale: IVec2)
}
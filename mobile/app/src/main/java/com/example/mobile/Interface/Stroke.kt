package com.example.mobile.Interface

import android.graphics.Canvas
import com.example.mobile.Tools.Tool
import com.example.mobile.activity.drawing.ToolbarFragment


abstract class Stroke(open val  boundingPoints: ArrayList<IVec2>,
                      open var currentStrokeColor: Int,
                      open var currentStrokeWidth: Float,
                      open var isSelected: Boolean,
                      val toolType: ToolbarFragment.MenuItem)  {

    abstract fun drawStroke(canvas: Canvas)
    abstract fun prepForSelection()
    abstract fun prepForBaseCanvas()
}
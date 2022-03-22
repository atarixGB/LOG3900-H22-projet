package com.example.mobile.Interface

import android.graphics.Canvas
import com.example.mobile.Tools.Tool
import com.example.mobile.Tools.ToolbarFragment


abstract class Stroke(open val  boundingPoints: ArrayList<IVec2>,
                      open var currentStrokeColor: Int,
                      open var currentStrokeWidth: Float,
                      val toolType:ToolbarFragment.MenuItem)  {

    abstract fun drawStroke(canvas: Canvas)


    //code Leon
    abstract fun prepForSelection()
    abstract fun prepForBaseCanvas(selectionTopLeftCorner:IVec2,selectionSize:IVec2)
//
//    abstract fun drawStroke(ctx: Canvas)

}
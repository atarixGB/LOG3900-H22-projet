package com.example.mobile.Interface

import android.graphics.Canvas
import android.graphics.Paint
import com.example.mobile.Tools.ToolbarFragment

//class IEllipseStroke (override var boundingPoints: ArrayList<IVec2>,
//                      override var currentStrokeColor: Int,
//                      override var currentStrokeWidth: Float,
//                      var center: IVec2,
//                      var radius: IVec2
//):Stroke(boundingPoints,currentStrokeColor,currentStrokeWidth, ToolbarFragment.MenuItem.OVAL) {
//
//    override fun drawStroke(canvas: Canvas) {
//        val upcomingPaint = Paint().apply {
//            color = currentStrokeColor
//            strokeWidth = currentStrokeWidth
//            isAntiAlias = true
//            // Dithering affects how colors with higher-precision than the device are down-sampled.
//            isDither = true
//            style = Paint.Style.STROKE // default: FILL
//            strokeJoin = Paint.Join.ROUND // default: MITER
//            strokeCap = Paint.Cap.ROUND // default: BUTT
//        }
//        canvas!!.drawOval(left, top, right, bottom, upcomingPaint!!)
//    }
//
//}
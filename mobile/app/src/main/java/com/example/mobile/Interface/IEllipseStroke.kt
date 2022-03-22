package com.example.mobile.Interface

import android.graphics.Canvas
import android.graphics.Paint
import com.example.mobile.Tools.ToolbarFragment

data class IEllipseStroke (val boundingPoints: ArrayList<IVec2>,
                           val primaryColor: Int,
                           val secondaryColor : Int,
                           val strokeWidth: Float,
                           val center: IVec2,
                           val radius: IVec2)

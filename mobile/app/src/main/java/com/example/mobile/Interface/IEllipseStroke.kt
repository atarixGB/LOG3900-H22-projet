package com.example.mobile.Interface

data class IEllipseStroke (val boundingPoints: ArrayList<IVec2>,
                           val primaryColor: Int,
                           val secondaryColor : Int,
                           val strokeWidth: Float,
                           val center: IVec2,
                           val radius: IVec2)
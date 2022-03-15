package com.example.mobile.Interface

data class IRectangleStroke(val boundingPoints: ArrayList<IVec2>,
                            val color: Int,
                            val secondaryColor : Int,
                            val strokeWidth: Float,
                            val width: Float,
                            val height: Float,
                            val topLeftCorner: IVec2)

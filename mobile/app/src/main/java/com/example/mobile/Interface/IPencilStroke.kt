package com.example.mobile.Interface

data class IPencilStroke (val boundingPoints: ArrayList<IVec2>,
                          val color: Int,
                          val strokeWidth: Float,
                          val points: ArrayList<IVec2>) {}
package com.example.mobile.Interface

import android.graphics.Point

data class IPencilStroke (val boundingPoints: ArrayList<Point>, val color: Int, val stroke: Float, val points: ArrayList<Point>) {
}
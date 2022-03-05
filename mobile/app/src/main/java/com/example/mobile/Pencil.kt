package com.example.mobile

import android.content.ContentValues
import android.content.Context
import android.graphics.*
import android.util.Log
import kotlin.math.abs

class Pencil(context: Context, baseCanvas: Canvas) : Tool(context, baseCanvas) {
    override fun touchStart() {
        mStartX = mx
        mStartY = my
        path!!.reset()
        path!!.moveTo(mx, my)
    }

    override fun touchMove() {
        val dx = abs(mx - mStartX)
        val dy = abs(my - mStartY)
        if (dx >= TOUCH_TOLERANCE || dy >= TOUCH_TOLERANCE) {
            path!!.quadTo(mStartX, mStartY, (mx + mStartX) / 2, (my + mStartY) / 2)
            mStartX = mx
            mStartY = my
        }
        baseCanvas!!.drawPath(path!!, paint!!)
    }

    override fun touchUp() {
        path!!.lineTo(mStartX, mStartY)
        baseCanvas!!.drawPath(path!!, paint!!)
        path!!.reset()
    }

    override fun onDraw(canvas: Canvas) {

    }
}
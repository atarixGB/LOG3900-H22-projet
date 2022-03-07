package com.example.mobile

import android.content.ContentValues
import android.content.ContentValues.TAG
import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Path
import android.util.Log

class Rectangle (context: Context, baseCanvas: Canvas) : Tool(context, baseCanvas) {

    override fun touchStart(){
        mStartX = mx
        mStartY = my
    }

    override fun touchMove() {

    }


    override fun touchUp(){
        onDraw(baseCanvas)
    }

    override fun onDraw(canvas: Canvas) {
        val right = if (mStartX > mx) mStartX else mx
        val left = if (mStartX > mx) mx else mStartX
        val bottom = if (mStartY > my) mStartY else my
        val top = if (mStartY > my) my else mStartY
        canvas!!.drawRect(left, top, right, bottom, paint!!)
    }
}
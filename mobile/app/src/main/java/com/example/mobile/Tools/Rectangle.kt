package com.example.mobile.Tools

import android.content.Context
import android.graphics.Canvas
import com.example.mobile.DrawingCollaboration
import com.example.mobile.Interface.IPencilStroke
import java.util.*

class Rectangle (context: Context, baseCanvas: Canvas, socket : DrawingCollaboration) : Tool(context, baseCanvas, socket) {

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

    override fun onStrokeReceive(stroke: IPencilStroke) {
        TODO("Not yet implemented")
    }

}
package com.example.mobile.Tools

import android.content.Context
import android.graphics.Canvas
import android.graphics.Paint
import com.example.mobile.DrawingCollaboration
import com.example.mobile.Interface.IPencilStroke
import com.example.mobile.Interface.IRectangleStroke
import com.example.mobile.Interface.IVec2
import org.json.JSONArray
import org.json.JSONObject
import java.util.*

class Rectangle (context: Context, baseCanvas: Canvas, val socket : DrawingCollaboration) : Tool(context, baseCanvas, socket) {

    override fun touchStart(){
        points.clear()
        mStartX = mx
        mStartY = my
        points.add(IVec2(mx,my))
    }

    override fun touchMove() {}


    override fun touchUp(){
        onDraw(baseCanvas)
    }

    override fun onStrokeReceived(stroke: JSONObject) {
        TODO("Not yet implemented")
    }

    override fun onDraw(canvas: Canvas) {
        val right = if (mStartX > mx) mStartX else mx
        val left = if (mStartX > mx) mx else mStartX
        val bottom = if (mStartY > my) mStartY else my
        val top = if (mStartY > my) my else mStartY
        canvas!!.drawRect(left, top, right, bottom, paint!!)
        points.add(IVec2(mx,my))
        this.sendRectangleStroke()
    }

    fun sendRectangleStroke(){
        var bounding = JSONArray()
        for(pts in this.getBoundingPoints()){
            var arr = JSONObject()
            arr.put("x",pts.x)
            arr.put("y",pts.y)
            bounding.put(arr)
        }
        var startingCoord = JSONObject()
        startingCoord.put("x", points.get(0).x)
        startingCoord.put("x",points.get(0).y)

        var jo = JSONObject()
        jo.put("boundingPoints", bounding)
        jo.put("toolType", 0)
        jo.put("primaryColor", this.paint.color)
        jo.put("strokeWidth", this.paint.strokeWidth)
        jo.put("topLeftCorner", startingCoord)
        jo.put("width", startingCoord)
        jo.put("height", startingCoord)
        jo.put("sender", socket.socket.id())
    }
    fun onStrokeReceive(stroke: IRectangleStroke) {
        val upcomingPaint = Paint().apply {
            color = stroke.color
            strokeWidth = stroke.strokeWidth
            isAntiAlias = true
            // Dithering affects how colors with higher-precision than the device are down-sampled.
            isDither = true
            style = Paint.Style.STROKE // default: FILL
            strokeJoin = Paint.Join.ROUND // default: MITER
            strokeCap = Paint.Cap.ROUND // default: BUTT
        }
        //TODO
    }

    private fun getBoundingPoints():ArrayList<IVec2>{
//        val topLeftPoint = IVec2(1, 1)
//        val bottomRightPoint = IVec2(this.rightestCoord, this.lowestCoord)
        val points = ArrayList<IVec2>()
//        points.add(topLeftPoint)
//        points.add(bottomRightPoint)
        return points
    }

}
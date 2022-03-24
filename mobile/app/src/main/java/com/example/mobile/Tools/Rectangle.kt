package com.example.mobile.Tools

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import com.example.mobile.activity.drawing.DrawingCollaboration
import com.example.mobile.Interface.IRectangleStroke
import com.example.mobile.Interface.IVec2
import org.json.JSONArray
import org.json.JSONObject
import java.util.*
import kotlin.math.abs

class Rectangle (context: Context, baseCanvas: Canvas, val socket : DrawingCollaboration) : Tool(context, baseCanvas, socket) {
    var top = 0F
    var right = 0F
    var bottom = 0F
    var left = 0F

    override fun touchStart(){
        mStartX = mx
        mStartY = my
    }

    override fun touchMove() {}


    override fun touchUp(){
        onDraw(baseCanvas)
        this.sendRectangleStroke(left, top, right, bottom)
    }

    override fun onDraw(canvas: Canvas) {
        right = if (mStartX > mx) mStartX else mx
        left = if (mStartX > mx) mx else mStartX
        bottom = if (mStartY > my) mStartY else my
        top = if (mStartY > my) my else mStartY
        canvas!!.drawRect(left, top, right, bottom, paint!!)
    }

    override fun onStrokeReceived(stroke: JSONObject) {
        var boundingPoints = ArrayList<IVec2>()
        val boundingPointsData = stroke["boundingPoints"]  as JSONArray
        val topCornerData = stroke.get("topLeftCorner") as JSONObject
        var topLeftCorner = IVec2(topCornerData.getDouble("x").toFloat(), topCornerData.getDouble("y").toFloat())
        val iRectangleStroke = IRectangleStroke(boundingPoints,
            toIntColor(stroke.getString("primaryColor")),
            Color.WHITE, //to change
            stroke.getDouble("strokeWidth").toFloat(),
            stroke.getDouble("width").toFloat(),
            stroke.getDouble("height").toFloat(),
            topLeftCorner)
        draw(iRectangleStroke)
    }

    private fun sendRectangleStroke(left : Float, top: Float, right: Float, bottom: Float){
        var bounding = JSONArray()
        var topLeftCorner = JSONObject()
        topLeftCorner.put("x", left)
        topLeftCorner.put("y",top)

        var jo = JSONObject()
        jo.put("boundingPoints", bounding) //TODO
        jo.put("toolType", 1)
        jo.put("primaryColor", toRBGColor(paint.color))
        //TODO secondary color
        jo.put("strokeWidth", this.paint.strokeWidth)
        jo.put("topLeftCorner", topLeftCorner)
        jo.put("width", abs(left-right))
        jo.put("height", abs(top-bottom))
        jo.put("sender", socket.socket.id())
        socket.socket.emit("broadcastStroke", jo )
    }

    private fun draw(stroke: IRectangleStroke) {
        val upcomingPaint = Paint().apply {
            color = stroke.primaryColor
            strokeWidth = stroke.strokeWidth
            isAntiAlias = true
            // Dithering affects how colors with higher-precision than the device are down-sampled.
            isDither = true
            style = Paint.Style.STROKE // default: FILL
            strokeJoin = Paint.Join.MITER // default: MITER
            strokeCap = Paint.Cap.SQUARE
        }
        baseCanvas!!.drawRect(stroke.topLeftCorner.x,
            stroke.topLeftCorner.y,
            stroke.topLeftCorner.x + stroke.width,
            stroke.topLeftCorner.y + stroke.height,
            upcomingPaint!!)
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
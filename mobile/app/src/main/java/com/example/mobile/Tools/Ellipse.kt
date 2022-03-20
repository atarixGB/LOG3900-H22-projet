package com.example.mobile.Tools

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import com.example.mobile.Interface.IRectangleStroke
import com.example.mobile.Interface.IVec2
import com.example.mobile.activity.drawing.DrawingCollaboration
import org.json.JSONArray
import org.json.JSONObject
import java.util.ArrayList
import kotlin.math.abs

class  Ellipse(context: Context, baseCanvas: Canvas, val socket : DrawingCollaboration) : Tool(context, baseCanvas, socket) {
    var top = 0F
    var right = 0F
    var bottom = 0F
    var left = 0F

    override fun touchStart() {
        mStartX = mx
        mStartY = my
    }

    override fun touchMove() {}

    override fun touchUp() {
        onDraw(baseCanvas)
        this.sendEllipseStroke(left, top, right, bottom)
    }

    override fun onStrokeReceived(stroke: JSONObject) {
        var boundingPoints = ArrayList<IVec2>()
        val boundingPointsData = stroke["boundingPoints"]  as JSONArray
        val topCornerData = stroke.get("topLeftCorner") as JSONObject
        var topLeftCorner = IVec2(topCornerData.getDouble("x").toFloat(), topCornerData.getDouble("y").toFloat())
        val iRectangleStroke = IRectangleStroke(boundingPoints,
            stroke.getInt("primaryColor"),
            Color.WHITE, //to change
            stroke.getDouble("strokeWidth").toFloat(),
            stroke.getDouble("width").toFloat(),
            stroke.getDouble("height").toFloat(),
            topLeftCorner)
        draw(iRectangleStroke)
    }

    override fun onDraw(canvas: Canvas) {
        right = if (mStartX > mx) mStartX else mx
        left = if (mStartX > mx) mx else mStartX
        bottom = if (mStartY > my) mStartY else my
        top = if (mStartY > my) my else mStartY
        canvas!!.drawOval(left, top, right, bottom, paint!!)
    }
    private fun sendEllipseStroke(left : Float, top: Float, right: Float, bottom: Float){
        var bounding = JSONArray()
        var topLeftCorner = JSONObject()
        topLeftCorner.put("x", left)
        topLeftCorner.put("y",top)

        var jo = JSONObject()
        jo.put("boundingPoints", bounding) //TODO
        jo.put("toolType", 2) //number of the ellipse
        jo.put("primaryColor", this.paint.color)
        jo.put("strokeWidth", this.paint.strokeWidth)
        jo.put("topLeftCorner", topLeftCorner)
        jo.put("width", abs(left-right))
        jo.put("height", abs(top-bottom))
        jo.put("sender", socket.socket.id())
        socket.socket.emit("broadcastStroke", jo )
    }

    private fun draw(stroke: IRectangleStroke) {
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
        baseCanvas!!.drawRect(stroke.topLeftCorner.x,
            stroke.topLeftCorner.y,
            stroke.topLeftCorner.x + stroke.width,
            stroke.topLeftCorner.y + stroke.height,
            upcomingPaint!!)
    }

}
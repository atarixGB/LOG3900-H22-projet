package com.example.mobile.Tools

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import com.example.mobile.Interface.IEllipseStroke
import com.example.mobile.Interface.IVec2
import com.example.mobile.activity.drawing.DrawingCollaboration
import org.json.JSONArray
import org.json.JSONObject
import java.util.ArrayList
import kotlin.math.abs

class  Ellipse(context: Context, baseCanvas: Canvas, val socket : DrawingCollaboration) : Tool(
    context,
    baseCanvas,
    socket,
) {
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
        val center = stroke.getJSONObject("center")
        val radius = stroke.getJSONObject("radius")
        val iEllipseStroke = IEllipseStroke(boundingPoints,
            toIntColor(stroke.getString("primaryColor")),
            toIntColor(stroke.getString("secondaryColor")),
            stroke.getDouble("strokeWidth").toFloat(),
            IVec2(center.getDouble("x").toFloat(), center.getDouble("y").toFloat()),
            IVec2(radius.getDouble("x").toFloat(), radius.getDouble("y").toFloat()),

        )
        draw(iEllipseStroke)
    }

    override fun onDraw(canvas: Canvas) {
        right = if (mStartX > mx) mStartX else mx
        left = if (mStartX > mx) mx else mStartX
        bottom = if (mStartY > my) mStartY else my
        top = if (mStartY > my) my else mStartY
        canvas!!.drawOval(left, top, right, bottom, strokePaint!!)

        canvas.drawOval(left, top, right, bottom, fillPaint!!)
        canvas!!.drawOval(left, top, right, bottom, strokePaint!!)
    }
    private fun sendEllipseStroke(left : Float, top: Float, right: Float, bottom: Float){
        var bounding = JSONArray()
        var jo = JSONObject()
        jo.put("boundingPoints", bounding) //TODO
        jo.put("toolType", 2) //number of the ellipse
        jo.put("primaryColor", toRBGColor(strokePaint.color))
        jo.put("secondaryColor", toRBGColor(fillPaint.color))
        jo.put("strokeWidth", this.strokePaint.strokeWidth)

        var center = JSONObject()
        center.put("x", left+ abs(left-right)/2)
        center.put("y", top+abs(top-bottom)/2)
        jo.put("center", center)

        var radius = JSONObject()
        radius.put("x", abs(left-right)/2)
        radius.put("y", abs(top-bottom)/2)
        jo.put("radius", radius)

        jo.put("sender", socket.socket.id())
        socket.socket.emit("broadcastStroke", jo )
    }

    private fun draw(stroke: IEllipseStroke) {
        val upcomingPaintStroke = Paint().apply {
            color = stroke.primaryColor
            strokeWidth = stroke.strokeWidth
            isAntiAlias = true
            isDither = true
            style = Paint.Style.STROKE
            strokeJoin = Paint.Join.MITER
            strokeCap = Paint.Cap.SQUARE
        }

        val upcomingPaintFill = Paint().apply {
            color = stroke.secondaryColor
            strokeWidth = stroke.strokeWidth
            isAntiAlias = true
            isDither = true
            style = Paint.Style.FILL
            strokeJoin = Paint.Join.MITER
            strokeCap = Paint.Cap.SQUARE
        }
        baseCanvas!!.drawOval(stroke.center.x-stroke.radius.x,
            stroke.center.y-stroke.radius.y,
            stroke.center.x+stroke.radius.x,
            stroke.center.y+stroke.radius.y,
            upcomingPaintStroke!!)

        baseCanvas!!.drawOval(stroke.center.x-stroke.radius.x,
            stroke.center.y-stroke.radius.y,
            stroke.center.x+stroke.radius.x,
            stroke.center.y+stroke.radius.y,
            upcomingPaintFill!!)
    }



}

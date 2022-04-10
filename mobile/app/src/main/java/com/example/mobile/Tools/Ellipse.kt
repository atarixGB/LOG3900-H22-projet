package com.example.mobile.Tools

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import com.example.mobile.Interface.IEllipseStroke
import com.example.mobile.Interface.IVec2
import com.example.mobile.activity.drawing.DrawingSocket
import com.example.mobile.activity.drawing.ToolbarFragment
import org.json.JSONArray
import org.json.JSONObject
import java.util.ArrayList
import kotlin.math.abs

class  Ellipse(context: Context, baseCanvas: Canvas, val socket : DrawingSocket, val selection: Selection, val drawingId: String) : Tool(context, baseCanvas, socket) {
    var top = 0F
    var right = 0F
    var bottom = 0F
    var left = 0F

    override var nextTool: ToolbarFragment.MenuItem = ToolbarFragment.MenuItem.OVAL

    override fun touchStart() {
        mStartX = mx
        mStartY = my

    }

    override fun touchMove() {}

    override fun touchUp() {
        if (mStartX != mx || mStartY != my) {
            onDraw(baseCanvas)
            this.sendEllipseStroke(left, top, right, bottom)

            //ajout a l'array list des strokes
            val iEllipseStroke = IEllipseStroke(
                getBoundingPoints(),
                getPaintParameters().color,
                Color.WHITE, //to change
                getPaintParameters().strokeWidth,
                false,
                getCenter(),
                getRadius()
            )
            selection.addStroke(iEllipseStroke)

            //selectionner ce stroke
            selection.selectStroke(iEllipseStroke)

            //changer le tool a selection
            selection.isToolSelection = false
            selection.oldTool = ToolbarFragment.MenuItem.OVAL
            nextTool = ToolbarFragment.MenuItem.SELECTION
        }
    }

    private fun getCenter(): IVec2{
        var center = IVec2(left+ abs(left-right)/2, top+abs(top-bottom)/2)
        return center
    }

    private fun getRadius(): IVec2{
        var radius = IVec2(abs(left-right)/2, abs(top-bottom)/2)
        return radius
    }

    private fun getPaintParameters(): Paint {
        val paint = Paint()
        paint.color = this.strokePaint.color
        paint.strokeWidth = this.strokePaint.strokeWidth
        return paint
    }

    override fun onStrokeReceived(stroke: JSONObject) {
        var boundingPoints = ArrayList<IVec2>()
        val boundingPointsData = stroke["boundingPoints"]  as JSONArray
        for (i in 0 until boundingPointsData.length()) {
            val obj = boundingPointsData[i] as JSONObject
            boundingPoints.add( IVec2(obj.getDouble("x").toFloat(), obj.getDouble("y").toFloat()) )
        }
        val center = stroke.getJSONObject("center")
        val radius = stroke.getJSONObject("radius")
        val iEllipseStroke = IEllipseStroke(boundingPoints,
            toIntColor(stroke.getString("primaryColor")),
            toIntColor(stroke.getString("secondaryColor")),
            stroke.getDouble("strokeWidth").toFloat(),
            false,
            IVec2(center.getDouble("x").toFloat(), center.getDouble("y").toFloat()),
            IVec2(radius.getDouble("x").toFloat(), radius.getDouble("y").toFloat()),

        )
        draw(iEllipseStroke)

        selection.addStroke(iEllipseStroke)
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
        for(pts in this.getBoundingPoints()){
            var arr = JSONObject()
            arr.put("x",pts.x)
            arr.put("y",pts.y)
            bounding.put(arr)
        }

        var jo = JSONObject()
        jo.put("boundingPoints", bounding)
        jo.put("toolType", 2) //number of the ellipse
        jo.put("primaryColor", toRBGColor(strokePaint.color))
        jo.put("secondaryColor", toRGBAColor(fillPaint.color))
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

        var data = JSONObject()
        data.put("room", drawingId)
        data.put("data", jo)

        socket.socket.emit("broadcastStroke", data )
    }

    private fun draw(stroke: IEllipseStroke) {
        val upcomingPaintStroke = Paint().apply {
            color = stroke.currentStrokeColor
            strokeWidth = stroke.currentStrokeWidth
            isAntiAlias = true
            isDither = true
            style = Paint.Style.STROKE
            strokeJoin = Paint.Join.MITER
            strokeCap = Paint.Cap.SQUARE
        }

        val upcomingPaintFill = Paint().apply {
            color = stroke.secondaryColor
            strokeWidth = stroke.currentStrokeWidth
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
            upcomingPaintFill!!)

        baseCanvas!!.drawOval(stroke.center.x-stroke.radius.x,
            stroke.center.y-stroke.radius.y,
            stroke.center.x+stroke.radius.x,
            stroke.center.y+stroke.radius.y,
            upcomingPaintStroke!!)


    }

    private fun getBoundingPoints():ArrayList<IVec2>{
        val points = ArrayList<IVec2>()
        val topLeftPoint = IVec2(left, top)
        val bottomRightPoint = IVec2(right, bottom)
        points.add(topLeftPoint)
        points.add(bottomRightPoint)
        return points
    }

}

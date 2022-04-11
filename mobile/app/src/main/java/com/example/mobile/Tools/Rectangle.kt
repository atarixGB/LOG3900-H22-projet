package com.example.mobile.Tools

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import com.example.mobile.activity.drawing.DrawingSocket
import com.example.mobile.Interface.IRectangleStroke
import com.example.mobile.Interface.IVec2
import com.example.mobile.activity.drawing.ToolbarFragment
import org.json.JSONArray
import org.json.JSONObject
import java.util.*
import kotlin.math.abs

class Rectangle (context: Context, baseCanvas: Canvas, val socket : DrawingSocket, val selection: Selection, val drawingId: String) : Tool(context, baseCanvas, socket) {

    var top = 0F
    var right = 0F
    var bottom = 0F
    var left = 0F

    override var nextTool: ToolbarFragment.MenuItem = ToolbarFragment.MenuItem.RECTANGLE

    override fun touchStart(){
        mStartX = mx
        mStartY = my
    }

    override fun touchMove() {}


    override fun touchUp(){
        if (mStartX != mx || mStartY != my) {
            onDraw(baseCanvas)
            this.sendRectangleStroke(left, top, right, bottom)

            //ajout a l'array list des strokes
            val iRectangleStroke = IRectangleStroke(
                getBoundingPoints(),
                getPaintParameters().color,
                getFillColor().color, //to change
                getPaintParameters().strokeWidth,
                false,
                getRectWidthAndHeight().x,
                getRectWidthAndHeight().y,
                getTopLeftCorner()
            )
            selection.addStroke(iRectangleStroke)

            //selectionner ce stroke
            selection.selectStroke(iRectangleStroke)

            //changer le tool a selection
            selection.isToolSelection = false
            selection.oldTool = ToolbarFragment.MenuItem.RECTANGLE
            nextTool = ToolbarFragment.MenuItem.SELECTION
        }
    }

    private fun getRectWidthAndHeight(): IVec2{
        val point = IVec2(abs(left-right), abs(top-bottom))
        return point
    }

    private fun getFillColor(): Paint {
        val paint = Paint()
        paint.color = this.fillPaint.color
        return paint
    }

    private fun getTopLeftCorner(): IVec2{
        val point = IVec2(left, top)
        return point
    }

    private fun getPaintParameters(): Paint {
        val paint = Paint()
        paint.color = this.strokePaint.color
        paint.strokeWidth = this.strokePaint.strokeWidth
        return paint
    }

    override fun onDraw(canvas: Canvas) {
        right = if (mStartX > mx) mStartX else mx
        left = if (mStartX > mx) mx else mStartX
        bottom = if (mStartY > my) mStartY else my
        top = if (mStartY > my) my else mStartY

        canvas.drawRect(left, top, right, bottom, fillPaint);
        canvas!!.drawRect(left, top, right, bottom, strokePaint!!)
    }

    override fun onStrokeReceived(stroke: JSONObject) {
        var boundingPoints = ArrayList<IVec2>()
        val boundingPointsData = stroke["boundingPoints"]  as JSONArray
        for (i in 0 until boundingPointsData.length()) {
            val obj = boundingPointsData[i] as JSONObject
            boundingPoints.add( IVec2(obj.getDouble("x").toFloat(), obj.getDouble("y").toFloat()) )
        }
        val topCornerData = stroke.get("topLeftCorner") as JSONObject
        var topLeftCorner = IVec2(topCornerData.getDouble("x").toFloat(), topCornerData.getDouble("y").toFloat())
        val iRectangleStroke = IRectangleStroke(boundingPoints,
            toIntColor(stroke.getString("primaryColor")),
            toIntColor(stroke.getString("secondaryColor")),
            stroke.getDouble("strokeWidth").toFloat(),
            false,
            stroke.getDouble("width").toFloat(),
            stroke.getDouble("height").toFloat(),
            topLeftCorner)
        draw(iRectangleStroke)

        selection.addStroke(iRectangleStroke)
    }

    private fun sendRectangleStroke(left : Float, top: Float, right: Float, bottom: Float){
        var bounding = JSONArray()
        for(pts in this.getBoundingPoints()){
            var arr = JSONObject()
            arr.put("x",pts.x)
            arr.put("y",pts.y)
            bounding.put(arr)
        }

        var topLeftCorner = JSONObject()
        topLeftCorner.put("x", left)
        topLeftCorner.put("y",top)

        var jo = JSONObject()
        jo.put("boundingPoints", bounding) //TODO
        jo.put("toolType", 1)
        jo.put("primaryColor", toRBGColor(strokePaint.color))
        jo.put("secondaryColor", toRGBAColor(fillPaint.color))
        jo.put("strokeWidth", this.strokePaint.strokeWidth)
        jo.put("topLeftCorner", topLeftCorner)
        jo.put("width", abs(left-right))
        jo.put("height", abs(top-bottom))
        jo.put("sender", socket.socket.id())

        var data = JSONObject()
        data.put("room", drawingId)
        data.put("data", jo)

        socket.socket.emit("broadcastStroke", data )
    }

    private fun draw(stroke: IRectangleStroke) {
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
            isAntiAlias = true
            isDither = true
            style = Paint.Style.FILL
            strokeJoin = Paint.Join.MITER
            strokeCap = Paint.Cap.SQUARE
            strokeWidth = 1f
        }
        baseCanvas!!.drawRect(stroke.topLeftCorner.x,
            stroke.topLeftCorner.y,
            stroke.topLeftCorner.x + stroke.width,
            stroke.topLeftCorner.y + stroke.height,
            upcomingPaintFill!!)
        baseCanvas!!.drawRect(stroke.topLeftCorner.x,
            stroke.topLeftCorner.y,
            stroke.topLeftCorner.x + stroke.width,
            stroke.topLeftCorner.y + stroke.height,
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

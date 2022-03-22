package com.example.mobile.Tools

import android.content.Context
import android.graphics.*
import android.util.Log
import com.example.mobile.Interface.IPencilStroke
import com.example.mobile.Interface.IVec2
import com.example.mobile.activity.drawing.DrawingCollaboration
import org.json.JSONArray
import org.json.JSONObject
import java.util.*
import kotlin.math.abs

class Pencil(context: Context, baseCanvas: Canvas, val socket : DrawingCollaboration, val selection: Selection) : Tool(context, baseCanvas, socket){
    var leftestCoord: Float = 0F;
    var rightestCoord: Float = 0F;
    var lowestCoord: Float = 0F;
    var highestCoord: Float = 0F;

    override fun touchStart() {
        points.clear()
        mStartX = mx
        mStartY = my
        path!!.reset()
        path!!.moveTo(mx, my)
        points.add(IVec2(mx,my))

        //a verifier
        leftestCoord = baseCanvas.width.toFloat()
        highestCoord = baseCanvas.height.toFloat()
        rightestCoord = 0F;
        lowestCoord = 0F;
    }

    override fun touchMove() {
        val dx = abs(mx - mStartX)
        val dy = abs(my - mStartY)
        if (dx >= TOUCH_TOLERANCE || dy >= TOUCH_TOLERANCE) {
            path!!.quadTo(mStartX, mStartY, (mx + mStartX) / 2, (my + mStartY) / 2)
            mStartX = mx
            mStartY = my
        }
        this.checkEdgeCoords(IVec2(mx, my))
        points.add(IVec2(mx, my))
        baseCanvas!!.drawPath(path!!, paint!!)
    }

    override fun touchUp() {
        path!!.lineTo(mStartX, mStartY)
        points.add(IVec2(mStartX, mStartY))
        this.sendPencilStroke()
        paint.strokeJoin = Paint.Join.ROUND // default: MITER
        paint.strokeCap = Paint.Cap.ROUND
        baseCanvas!!.drawPath(path!!, paint!!)
        path!!.reset()

        val iPencilStroke = IPencilStroke(getBoundingPoints(),
            getPaintParameters().color,
            getPaintParameters().strokeWidth,
            false,
            getPointsList())
        selection.addStroke(iPencilStroke)
    }

    private fun getPointsList():ArrayList<IVec2> {
        val points = ArrayList<IVec2>()
        points.addAll(this.points)
        return points
    }

    private fun getPaintParameters(): Paint {
        val paint = Paint()
        paint.color = this.paint.color
        paint.strokeWidth = this.paint.strokeWidth
        return paint
    }

    override fun onStrokeReceived(stroke: JSONObject) {
        var boundingPoints = ArrayList<IVec2>()
        val boundingPointsData = stroke["boundingPoints"]  as JSONArray
        for (i in 0 until boundingPointsData.length()) {
            val obj = boundingPointsData[i] as JSONObject
            boundingPoints.add( IVec2(obj.getDouble("x").toFloat(), obj.getDouble("y").toFloat()) )
        }

        var points = ArrayList<IVec2>()
        val pointsData = stroke["points"] as JSONArray
        for (i in 0 until pointsData.length() ) {
            val obj = pointsData[i] as JSONObject
            points.add(IVec2(obj.getDouble("x").toFloat(), obj.getDouble("y").toFloat()))
        }
        val iPencilStroke = IPencilStroke(boundingPoints,
            toIntColor(stroke.getString("primaryColor")),
            stroke.getString("strokeWidth").toFloat(),
            false,
            points)
        draw(iPencilStroke)

    }

    override fun onDraw(canvas: Canvas) {}

    fun draw(stroke: IPencilStroke) {
        val upcomingPaint = Paint().apply {
            color = stroke.currentStrokeColor
            strokeWidth = stroke.currentStrokeWidth
            isAntiAlias = true
            // Dithering affects how colors with higher-precision than the device are down-sampled.
            isDither = true
            style = Paint.Style.STROKE // default: FILL
            strokeJoin = Paint.Join.ROUND // default: MITER
            strokeCap = Paint.Cap.ROUND // default: BUTT
        }
        path.reset()
        var startX = stroke.points.get(0).x
        var startY = stroke.points.get(0).y
        path.moveTo(startX, startY)
        for(points in stroke.points){
            path.quadTo(
                startX,
                startY,
                (points.x + startX) / 2,
                (points.y+ startY)/ 2
            )
            startX = points.x
            startY = points.y
        }
        path!!.lineTo(startX, startY)
        baseCanvas!!.drawPath(path!!, upcomingPaint!!)
        path!!.reset()
    }

    private fun sendPencilStroke(){
        //convert into the right json format
        var bounding = JSONArray()
        var pointsStr = JSONArray()
        for(pts in this.getBoundingPoints()){
            var arr = JSONObject()
            arr.put("x",pts.x)
            arr.put("y",pts.y)
            bounding.put(arr)
        }
        for(pts in points){
            var arr = JSONObject()
            arr.put("x",pts.x)
            arr.put("y",pts.y)
            pointsStr.put(arr)
        }

        var jo = JSONObject()
        jo.put("boundingPoints", bounding)
        jo.put("toolType", 0)
        jo.put("primaryColor", toRBGColor(paint.color))
        jo.put("strokeWidth", this.paint.strokeWidth)
        jo.put("points", pointsStr)
        jo.put("sender", socket.socket.id())
        socket.socket.emit("broadcastStroke", jo )
    }

    private fun getBoundingPoints():ArrayList<IVec2>{
        val topLeftPoint = IVec2(this.leftestCoord, this.highestCoord)
        val bottomRightPoint = IVec2(this.rightestCoord, this.lowestCoord)
        val points = ArrayList<IVec2>()
        points.add(topLeftPoint)
        points.add(bottomRightPoint)
        return points
    }

    private fun checkEdgeCoords(currentPos: IVec2) {
        if (currentPos.x < this.leftestCoord) {
            this.leftestCoord = currentPos.x;
        }
        if (currentPos.x > this.rightestCoord) {
            this.rightestCoord = currentPos.x;
        }
        if (currentPos.y > this.lowestCoord) {
            this.lowestCoord = currentPos.y;
        }
        if (currentPos.y < this.highestCoord) {
            this.highestCoord = currentPos.y;
        }
    }


}
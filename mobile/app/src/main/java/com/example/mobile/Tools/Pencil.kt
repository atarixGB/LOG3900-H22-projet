package com.example.mobile.Tools

import android.content.Context
import android.graphics.*
import android.util.Log
import com.example.mobile.DrawingCollaboration
import com.example.mobile.Interface.IPencilStroke
import com.google.gson.Gson
import org.json.JSONArray
import org.json.JSONObject
import java.util.*
import kotlin.math.abs

class Pencil(context: Context, baseCanvas: Canvas, val socket : DrawingCollaboration) : Tool(context, baseCanvas, socket){
    var leftestCoord: Int = 0;
    var rightestCoord: Int = 0;
    var lowestCoord: Int = 0;
    var highestCoord: Int = 0;

    override fun touchStart() {
        mStartX = mx
        mStartY = my
        path!!.reset()
        path!!.moveTo(mx, my)
        points.add(Point(mx.toInt(), my.toInt()) )
    }

    override fun touchMove() {
        val dx = abs(mx - mStartX)
        val dy = abs(my - mStartY)
        if (dx >= TOUCH_TOLERANCE || dy >= TOUCH_TOLERANCE) {
            path!!.quadTo(mStartX, mStartY, (mx + mStartX) / 2, (my + mStartY) / 2)
            mStartX = mx
            mStartY = my
        }
        this.checkEdgeCoords(Point(my.toInt(), my.toInt()))
        points.add(Point(mx.toInt(), my.toInt()))
        baseCanvas!!.drawPath(path!!, paint!!)
    }

    override fun touchUp() {
        path!!.lineTo(mStartX, mStartY)
        this.sendPencilStroke()
        baseCanvas!!.drawPath(path!!, paint!!)
        path!!.reset()
    }

    override fun onDraw(canvas: Canvas) {}

    override fun onStrokeReceive(stroke: IPencilStroke) {
        path.reset()
        Log.d("message", "my point" + (stroke.points.get(0).x.toFloat()))
        path.moveTo(stroke.points.get(0).x.toFloat(), stroke.points.get(0).x.toFloat() )
        for(points in stroke.points){
            path.quadTo(
                points.x.toFloat(),
                points.y.toFloat(),
                (stroke.points.get(0).x.toFloat() + points.x.toFloat()) / 2,
                (stroke.points.get(0).y.toFloat() + points.y.toFloat())/ 2
            )
        }
        path!!.lineTo(stroke.points.get(0).x.toFloat(), stroke.points.get(0).x.toFloat())
        baseCanvas!!.drawPath(path!!, paint!!)
        path!!.reset()
    }

    private fun sendPencilStroke(){
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

        var jo : JSONObject = JSONObject()
        jo.put("boundingPoints", bounding)
        jo.put("toolType", 0)
        jo.put("primaryColor", this.paint.color)
        jo.put("strokeWidth", this.paint.strokeWidth)
        jo.put("points", pointsStr)
        jo.put("sender", socket.socket.id())
        socket.socket.emit("broadcastStroke", jo )
    }

    private fun getBoundingPoints():ArrayList<Point>{
        val topLeftPoint = Point(this.leftestCoord, this.highestCoord)
        val bottomRightPoint = Point(this.rightestCoord, this.lowestCoord)
        val points = ArrayList<Point>()
        points.add(topLeftPoint)
        points.add(bottomRightPoint)
        return points
    }

    private fun checkEdgeCoords(currentPos: Point) {
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
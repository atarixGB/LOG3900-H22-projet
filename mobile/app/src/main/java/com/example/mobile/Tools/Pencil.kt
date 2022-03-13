package com.example.mobile.Tools

import android.content.Context
import android.graphics.*
import com.example.mobile.DrawingCollaboration
import com.example.mobile.Interface.IPencilStroke
import org.json.JSONArray
import org.json.JSONObject
import java.util.*
import kotlin.math.abs

class Pencil(context: Context, baseCanvas: Canvas, socket : DrawingCollaboration) : Tool(context, baseCanvas, socket){
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
    override fun onStrokeReceive() {
        TODO("Not yet implemented")
    }

    private fun sendPencilStroke(){
        val pencilStroke = IPencilStroke(this.getBoundingPoints(), this.paint.color,  this.paint.strokeWidth, points)
        var bounding = JSONArray()
        var pointsStr = JSONArray()
        for(pts in this.getBoundingPoints()){
            var arr = JSONArray()
            arr.put(pts.x)
            arr.put(pts.y)
            bounding.put(arr)
        }
        for(pts in points){
            var arr = JSONArray()
            arr.put(pts.x)
            arr.put(pts.y)
            pointsStr.put(arr)
        }
        var jo : JSONObject = JSONObject()
        jo.put("boundingPoints", bounding)
        jo.put("color", this.paint.color)
        jo.put("stroke", this.paint.strokeWidth)
        jo.put("points", pointsStr)
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
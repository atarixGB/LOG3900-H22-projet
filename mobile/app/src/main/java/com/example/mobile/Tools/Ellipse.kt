package com.example.mobile.Tools

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import com.example.mobile.Interface.IEllipseStroke
import com.example.mobile.Interface.IRectangleStroke
import com.example.mobile.Interface.IVec2
import com.example.mobile.activity.drawing.DrawingCollaboration
import com.example.mobile.activity.drawing.ToolbarFragment
import org.json.JSONArray
import org.json.JSONObject
import java.util.ArrayList
import kotlin.math.abs

class  Ellipse(context: Context, baseCanvas: Canvas, val socket : DrawingCollaboration, val selection: Selection) : Tool(context, baseCanvas, socket) {
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
        onDraw(baseCanvas)
        this.sendEllipseStroke(left, top, right, bottom)

        //ajout a l'array list des strokes
        val iEllipseStroke = IEllipseStroke(getBoundingPoints(),
            getPaintParameters().color,
            Color.WHITE, //to change
            getPaintParameters().strokeWidth,
            false,
            getCenter(),
            getRadius())
        selection.addStroke(iEllipseStroke)

        //selectionner ce stroke
        selection.selectStroke(iEllipseStroke)

        //changer le tool a selection
        selection.isToolSelection = false
        selection.oldTool = ToolbarFragment.MenuItem.OVAL
        nextTool = ToolbarFragment.MenuItem.SELECTION
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
        val center = stroke.getJSONObject("center")
        val radius = stroke.getJSONObject("radius")
        val iEllipseStroke = IEllipseStroke(boundingPoints,
            toIntColor(stroke.getString("primaryColor")),
            Color.WHITE, //to change
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
        canvas!!.drawOval(left, top, right, bottom, paint!!)
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
        jo.put("boundingPoints", bounding) //TODO
        jo.put("toolType", 2) //number of the ellipse
        jo.put("primaryColor", toRBGColor(paint.color))
        //TODO secondary color
        jo.put("secondaryColor", toRBGColor(Color.WHITE))
        jo.put("strokeWidth", this.paint.strokeWidth)

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
        val upcomingPaint = Paint().apply {
            color = stroke.currentStrokeColor
            strokeWidth = stroke.currentStrokeWidth
            isAntiAlias = true
            // Dithering affects how colors with higher-precision than the device are down-sampled.
            isDither = true
            style = Paint.Style.STROKE // default: FILL
            strokeJoin = Paint.Join.MITER // default: MITER
            strokeCap = Paint.Cap.SQUARE // default: BUTT
        }
        baseCanvas!!.drawOval(stroke.center.x-stroke.radius.x,
            stroke.center.y-stroke.radius.y,
            stroke.center.x+stroke.radius.x,
            stroke.center.y+stroke.radius.y,
            upcomingPaint!!)
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

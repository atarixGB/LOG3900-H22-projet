package com.example.mobile.Interface

import android.graphics.Canvas
import android.graphics.Paint
import com.example.mobile.activity.drawing.ToolbarFragment
import org.json.JSONArray
import org.json.JSONObject
import kotlin.math.abs

data class IEllipseStroke (
    override var boundingPoints: ArrayList<IVec2>,
    override var currentStrokeColor: Int,
    val secondaryColor : Int,
    override var currentStrokeWidth: Float,
    override var isSelected: Boolean,
    var center: IVec2,
    var radius: IVec2):Stroke(boundingPoints,currentStrokeColor,currentStrokeWidth, isSelected,
    ToolbarFragment.MenuItem.OVAL) {

    override fun drawStroke(canvas: Canvas) {
        val upcomingPaint = Paint().apply {
            color = currentStrokeColor
            strokeWidth = currentStrokeWidth
            isAntiAlias = true
            // Dithering affects how colors with higher-precision than the device are down-sampled.
            isDither = true
            style = Paint.Style.STROKE // default: FILL
            strokeJoin = Paint.Join.MITER // default: MITER
            strokeCap = Paint.Cap.SQUARE // default: BUTT
        }
        canvas!!.drawOval(center.x-radius.x,
            center.y-radius.y,
            center.x+radius.x,
            center.y+radius.y,
            upcomingPaint!!)
    }

    override fun prepForSelection() {
        center = IVec2(center.x - boundingPoints[0].x, center.y - boundingPoints[0].y)
    }

    override fun prepForBaseCanvas() {
        center = IVec2(center.x + boundingPoints[0].x, center.y + boundingPoints[0].y)
    }

    override fun updateMove(pos: IVec2) {
        center = IVec2(center.x + pos.x - boundingPoints[0].x, center.y + pos.y - boundingPoints[0].y)
    }

    override fun rescale(scale: IVec2) {
        center = IVec2( center.x * scale.x, center.y * scale.y )
        radius = IVec2( radius.x * scale.x, radius.y * scale.y )
    }

    override fun convertToObject(): JSONObject {
        var bounding = JSONArray()
        for(pts in this.boundingPoints){
            var arr = JSONObject()
            arr.put("x",pts.x)
            arr.put("y",pts.y)
            bounding.put(arr)
        }

        var jo = JSONObject()
        jo.put("boundingPoints", bounding) //TODO
        jo.put("toolType", 2) //number of the ellipse
        jo.put("primaryColor", toRBGColor(currentStrokeColor))
        jo.put("secondaryColor", toRBGColor(secondaryColor))
        jo.put("strokeWidth", currentStrokeWidth)

        var center = JSONObject()
        center.put("x", this.center.x)
        center.put("y", this.center.y)
        jo.put("center", center)

        var radius = JSONObject()
        radius.put("x", this.radius.x)
        radius.put("y", this.radius.y)
        jo.put("radius", radius)

        return jo
    }
}

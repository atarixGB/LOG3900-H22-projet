package com.example.mobile.Tools

import android.content.Context
import android.graphics.*
import androidx.core.content.res.ResourcesCompat
import com.example.mobile.activity.drawing.DrawingCollaboration
import com.example.mobile.Interface.IVec2
import com.example.mobile.R
import org.json.JSONObject
import kotlin.collections.ArrayList

abstract class Tool(
    context: Context,
    baseCanvas: Canvas,
    socket: DrawingCollaboration,
) {
    var baseCanvas: Canvas = baseCanvas
    var context: Context = context
    var mStartX = 0f
    var mStartY = 0f
    var mx = 0f
    var my = 0f
    var path = Path()
    val TOUCH_TOLERANCE = 4f
    protected val drawColor = ResourcesCompat.getColor(context.resources, R.color.black, null)
    protected val backgroundColor = ResourcesCompat.getColor(context.resources, R.color.white, null)
    var points : ArrayList<IVec2> = ArrayList<IVec2>()
    var strokeColor : Int ? = R.color.black
    var fillColor : Int ? = R.color.white
    var isStrokeSelected : Boolean ? = true

    protected val strokePaint = Paint().apply {
        color = drawColor
        // Smooths out edges of what is drawn without affecting shape.
        isAntiAlias = true
        // Dithering affects how colors with higher-precision than the device are down-sampled.
        isDither = true
        style = Paint.Style.STROKE // default: FILL
        strokeJoin = Paint.Join.MITER // default: MITER
        strokeCap = Paint.Cap.SQUARE
        strokeWidth = 1f // default: Hairline-width (really thin)
    }

    protected val fillPaint = Paint().apply {
        color = Color.TRANSPARENT
        // Smooths out edges of what is drawn without affecting shape.
        isAntiAlias = true
        // Dithering affects how colors with higher-precision than the device are down-sampled.
        isDither = true
        style = Paint.Style.FILL // default: FILL
        strokeJoin = Paint.Join.MITER // default: MITER
        strokeCap = Paint.Cap.SQUARE
        strokeWidth = 1f // default: Hairline-width (really thin)
    }

    abstract fun touchStart()

    abstract fun touchMove()

    abstract fun touchUp()

    fun changeWeight(width : Float){
        this.strokePaint.strokeWidth = width
    }

    fun changeColor(color:Int){
        if(isStrokeSelected!!){
            this.strokePaint.color = color
        }else{
            this.fillPaint.color = color
        }
    }

    abstract fun onStrokeReceived(stroke : JSONObject)

    abstract fun onDraw(canvas: Canvas)

    fun toRBGColor(color : Int) : String{
        val red = Color.red(color)
        val green = Color.green(color)
        val blue = Color.blue(color)
        return "rgb($red,$green,$blue)"
    }

    fun toRGBAColor(color : Int) : String {
        val red = Color.red(color)
        val green = Color.green(color)
        val blue = Color.blue(color)
        val alpha = Color.alpha(color)
        return "rgba($red,$green,$blue,$alpha)"
    }


    fun toIntColor(color : String): Int{
        var colorBuffer = color.substringAfter("(");//get only the numbers
        colorBuffer = colorBuffer.substringBefore(")")
        val splitColor = colorBuffer.split(",")
        var buffer = arrayListOf<Int>()
        // remove unecessary whitespace
        for (item in splitColor)
            buffer.add(item.replace(" ", "").toInt())
        if(splitColor.size == 3) { // RGB color
            return Color.rgb(buffer[0],buffer[1], buffer[2])
        }else{
            return Color.argb(buffer[3],buffer[0],buffer[1], buffer[2])
        }

    }
}
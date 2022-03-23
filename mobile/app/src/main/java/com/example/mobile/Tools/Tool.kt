package com.example.mobile.Tools

import android.content.Context
import android.graphics.*
import androidx.core.content.res.ResourcesCompat
import androidx.fragment.app.activityViewModels
import com.example.mobile.Interface.IPencilStroke
import com.example.mobile.activity.drawing.DrawingCollaboration
import com.example.mobile.Interface.IVec2
import com.example.mobile.Interface.Stroke
import com.example.mobile.R
import com.example.mobile.activity.drawing.ToolbarFragment
import com.example.mobile.viewModel.ToolParameters
import org.json.JSONObject
import kotlin.collections.ArrayList

abstract class Tool(context: Context, baseCanvas: Canvas, socket: DrawingCollaboration) {
    var baseCanvas: Canvas = baseCanvas
    var context: Context = context
    var mStartX = 0f
    var mStartY = 0f
    var mx = 0f
    var my = 0f
    var path = Path()
    val TOUCH_TOLERANCE = 4f
    lateinit var nextTool: ToolbarFragment.MenuItem
    protected val drawColor = ResourcesCompat.getColor(context.resources, R.color.black, null)
    protected val backgroundColor = ResourcesCompat.getColor(context.resources, R.color.white, null)
    var points : ArrayList<IVec2> = ArrayList<IVec2>()

    protected val paint = Paint().apply {
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

    abstract fun touchStart()

    abstract fun touchMove()

    abstract fun touchUp()

    fun changeWeight(width : Float){
        this.paint.strokeWidth = width
    }

    fun changeColor(color:Int){
        this.paint.color = color
    }

    fun changeTool(nextTool: ToolbarFragment.MenuItem) {
        this.nextTool = nextTool
    }

    abstract fun onStrokeReceived(stroke : JSONObject)


    abstract fun onDraw(canvas: Canvas)

    fun toRBGColor(color : Int) : String{
        val red = Color.red(color)
        val green = Color.green(color)
        val blue = Color.blue(color)
        return "rgb($red,$green,$blue)"
    }

    fun toIntColor(color : String): Int{
        var colorBuffer = color.substring(4)
        colorBuffer = colorBuffer.substring(0, colorBuffer.length - 1);//get only the numbers
        val splitColor = colorBuffer.split(",")
        return Color.rgb(splitColor[0].toInt(),splitColor[1].toInt(), splitColor[2].toInt())
    }
}
package com.example.mobile.Tools

import android.content.Context
import android.graphics.*
import androidx.core.content.res.ResourcesCompat
import androidx.fragment.app.activityViewModels
import com.example.mobile.Interface.IPencilStroke
import com.example.mobile.Interface.IVec2
import com.example.mobile.Interface.Stroke
import com.example.mobile.R
import com.example.mobile.activity.drawing.DrawingCollaboration
import com.example.mobile.activity.drawing.ToolbarFragment
import com.example.mobile.viewModel.ToolParameters
import org.json.JSONArray
import org.json.JSONObject
import java.util.*

class  Selection(context: Context, baseCanvas: Canvas, val socket : DrawingCollaboration) : Tool(context, baseCanvas, socket) {
    var strokes= ArrayList<Stroke>()
    private var currentStroke : Stroke? = null
    private var selectionCanvas: Canvas? = null
    private var selectionBitmap: Bitmap? = null
    private var selectedIndex:Int=0
    var isToolSelection: Boolean? = null
    var oldTool: ToolbarFragment.MenuItem? = null

    override var nextTool: ToolbarFragment.MenuItem = ToolbarFragment.MenuItem.SELECTION

    override fun touchStart() {
        mStartX = mx
        mStartY = my
        if (currentStroke != null) {
            currentStroke!!.prepForBaseCanvas()
            currentStroke!!.isSelected = false

            if (selectionCanvas != null) {
                selectionCanvas!!.drawColor(
                    Color.TRANSPARENT,
                    PorterDuff.Mode.CLEAR
                ) //clear le canvas de selection
            }
            baseCanvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR) //clear le base canvas
            strokes.forEach { element ->
                element.drawStroke(baseCanvas) //redessiner toutes les formes sur le base canvas
            }

            var jo = JSONObject()
            jo.put("strokeIndex", selectedIndex)
            jo.put("sender", socket.socket.id())
            socket.socket.emit("broadcastPasteRequest", jo )

            if (!isInBounds(currentStroke!!.boundingPoints, IVec2(mx, my)) && !isToolSelection!!) {
                nextTool = oldTool!!
            } else {
                nextTool = ToolbarFragment.MenuItem.SELECTION
            }
            currentStroke = null



            //if nzelna en dehors de la selection badel tool a l'ancien tool qui a ete selectionner
        }
    }

    fun resetSelection () {
        if (currentStroke != null) {
            currentStroke!!.prepForBaseCanvas()
            currentStroke!!.isSelected = false

            if (selectionCanvas != null) {
                selectionCanvas!!.drawColor(
                    Color.TRANSPARENT,
                    PorterDuff.Mode.CLEAR
                ) //clear le canvas de selection
            }
            baseCanvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR) //clear le base canvas
            strokes.forEach { element ->
                element.drawStroke(baseCanvas) //redessiner toutes les formes sur le base canvas
            }

            var jo = JSONObject()
            jo.put("strokeIndex", selectedIndex)
            jo.put("sender", socket.socket.id())
            socket.socket.emit("broadcastPasteRequest", jo )

            currentStroke = null
            nextTool = ToolbarFragment.MenuItem.SELECTION
        }
    }


    override fun touchMove() {}

    override fun touchUp() {
        if(isStrokeFound(IVec2(mStartX, mStartY))) {
            currentStroke = strokes[selectedIndex]
            selectStroke(currentStroke!!)
        }
        nextTool = ToolbarFragment.MenuItem.SELECTION
    }

    private fun createSelectionCanvas(stroke: Stroke) {
        val width = (stroke.boundingPoints[1].x - stroke.boundingPoints[0].x).toInt()
        val height = (stroke.boundingPoints[1].y - stroke.boundingPoints[0].y).toInt()
        selectionBitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        selectionCanvas = Canvas(selectionBitmap!!)
        val borderPaint = Paint().apply {
            color = ResourcesCompat.getColor(context.resources, R.color.red, null)
            isAntiAlias = true
            isDither = true
            style = Paint.Style.STROKE
            strokeJoin = Paint.Join.MITER
            strokeCap = Paint.Cap.SQUARE
            strokeWidth = 10f
        }
        selectionCanvas!!.drawRect(0f,0f, width.toFloat(), height.toFloat(),borderPaint)
    }

    private fun drawStrokeOnSelectionCanvas(stroke: Stroke) {
        stroke.prepForSelection()
        stroke.drawStroke(selectionCanvas!!)
    }

    private fun drawStrokesOnBaseCanvas(stroke: Stroke) {
        baseCanvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR) //clear le base canvas

        strokes.forEachIndexed {i, element ->
            if (i != selectedIndex) {
                element.drawStroke(baseCanvas) //redessiner les autres formes sauf la forme selectionner
            }
        }

        baseCanvas.drawBitmap(selectionBitmap!!, stroke.boundingPoints[0].x, stroke.boundingPoints[0].y, null) //dessiner la forme selectionner sur le base

        strokes[selectedIndex] = stroke
    }

    override fun onDraw(canvas: Canvas) { }

    private fun isStrokeFound(clickedPos: IVec2): Boolean {
        strokes.reversed().forEach {element->
            if (this.isInBounds(element.boundingPoints, clickedPos)) {
                this.selectedIndex = strokes.indexOf(element)
                return true;
            }
        }
        return false;
    }

    private fun isInBounds(bounds: ArrayList<IVec2>, pointToCheck: IVec2): Boolean {
        val topLeftBound = bounds[0];
        val bottomRightBound = bounds[1];
        return (
                pointToCheck.x >= topLeftBound.x &&
                        pointToCheck.x <= bottomRightBound.x &&
                        pointToCheck.y >= topLeftBound.y &&
                        pointToCheck.y <= bottomRightBound.y
                )
    }

    fun addStroke(stroke: Stroke){
        strokes.add(stroke)
    }

    fun selectStroke(stroke: Stroke) {
        stroke.isSelected = true
        currentStroke = stroke
        selectedIndex = strokes.indexOf(stroke)
        createSelectionCanvas(stroke)
        drawStrokeOnSelectionCanvas(stroke)
        drawStrokesOnBaseCanvas(stroke)
        sendSelectionStroke()
    }

    fun changeSelectionWeight(width : Float){
        if (currentStroke != null) {
            currentStroke!!.currentStrokeWidth = width
            createSelectionCanvas(currentStroke!!)
            currentStroke!!.drawStroke(selectionCanvas!!)
            drawStrokesOnBaseCanvas(currentStroke!!)

            //send
            var jo = JSONObject()
            jo.put("strokeIndex", selectedIndex)
            jo.put("value", width)
            jo.put("sender", socket.socket.id())
            socket.socket.emit("broadcastNewStrokeWidth", jo)
        }
    }

    fun changeSelectionColor(color:Int){
        if (currentStroke != null) {
            currentStroke!!.currentStrokeColor = color
            createSelectionCanvas(currentStroke!!)
            currentStroke!!.drawStroke(selectionCanvas!!)
            drawStrokesOnBaseCanvas(currentStroke!!)

            //send
            var jo = JSONObject()
            jo.put("strokeIndex", selectedIndex)
            jo.put("color", toRBGColor(color))
            jo.put("sender", socket.socket.id())
            socket.socket.emit("broadcastNewPrimaryColor", jo)
        }
    }

    override fun onStrokeReceived(stroke: JSONObject) {
//        var selectedIndex = stroke["selectedIndex"]
    }

    private fun sendSelectionStroke(){
        //convert into the right json format
        var jo = JSONObject()
        jo.put("strokeIndex", selectedIndex)
        jo.put("sender", socket.socket.id())
        socket.socket.emit("broadcastSelection", jo )
    }
}

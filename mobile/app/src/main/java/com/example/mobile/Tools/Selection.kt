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
import kotlin.collections.ArrayList

class  Selection(context: Context, baseCanvas: Canvas, val socket : DrawingCollaboration) : Tool(context, baseCanvas, socket) {
    var strokes= ArrayList<Stroke>()
    var strokesSelected = ArrayList<Stroke>()
    private var currentStroke : Stroke? = null
    private var selectionCanvas: Canvas? = null
    private var otherSelectionCanvas: Canvas? = null
    private var selectionBitmap: Bitmap? = null
    private var otherSelectionBitmap: Bitmap? = null
    private var selectedIndex:Int=0
    var isToolSelection: Boolean? = null
    var oldTool: ToolbarFragment.MenuItem? = null

    override var nextTool: ToolbarFragment.MenuItem = ToolbarFragment.MenuItem.SELECTION

    override fun touchStart() {
        mStartX = mx
        mStartY = my
        if (currentStroke != null) {
            if (!strokesSelected.contains(currentStroke)) {
                currentStroke!!.prepForBaseCanvas()
            }
            currentStroke!!.isSelected = false

            if (selectionCanvas != null) {
                selectionCanvas!!.drawColor(
                    Color.TRANSPARENT,
                    PorterDuff.Mode.CLEAR
                ) //clear le canvas de selection
            }
            baseCanvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR) //clear le base canvas
            strokes.forEach { element ->
                if (!strokesSelected.contains(element)) {
                    element.drawStroke(baseCanvas) //redessiner toutes les formes sur le base canvas
                }
            }

            strokesSelected.forEachIndexed {i, element ->
                createOtherSelectionCanvas(element)
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
            if (!strokesSelected.contains(currentStroke)) {
                currentStroke!!.prepForBaseCanvas()
            }
            currentStroke!!.isSelected = false

            if (selectionCanvas != null) {
                selectionCanvas!!.drawColor(
                    Color.TRANSPARENT,
                    PorterDuff.Mode.CLEAR
                ) //clear le canvas de selection
            }
            baseCanvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR) //clear le base canvas
            strokes.forEach { element ->
                if (!strokesSelected.contains(element)) {
                    element.drawStroke(baseCanvas) //redessiner toutes les formes sur le base canvas
                }
            }

            strokesSelected.forEachIndexed {i, element ->
                createOtherSelectionCanvas(element)
            }

//            strokesSelected.forEach { element ->
//                createOtherSelectionCanvas(element)
//            }

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
            if (!strokesSelected.contains(currentStroke)) {
                selectStroke(currentStroke!!)
            }
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

    private fun drawStrokeOnSelectionCanvas(stroke: Stroke, canvas: Canvas) {
        stroke.prepForSelection()
        stroke.drawStroke(canvas)
    }

    private fun drawStrokesOnBaseCanvas(stroke: Stroke) {
        baseCanvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR) //clear le base canvas

        strokes.forEachIndexed {i, element ->
            if (i != selectedIndex && !strokesSelected.contains(element)) {
                element.drawStroke(baseCanvas) //redessiner les autres formes sauf la forme selectionner
            }
        }

        if (selectionBitmap != null) {
            baseCanvas.drawBitmap(
                selectionBitmap!!,
                stroke.boundingPoints[0].x,
                stroke.boundingPoints[0].y,
                null
            ) //dessiner la forme selectionner sur le base
        }

        strokesSelected.forEachIndexed {i, element ->
            createOtherSelectionCanvas(element)
        }

        strokes[selectedIndex] = stroke
    }

    private fun drawOtherSelectedStrokesOnBaseCanvas(stroke: Stroke, otherSelectionBitmap: Bitmap?) {
//        baseCanvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR) //clear le base canvas

        if (otherSelectionBitmap != null) {
            baseCanvas.drawBitmap(
                otherSelectionBitmap,
                stroke.boundingPoints[0].x,
                stroke.boundingPoints[0].y,
                null
            ) //dessiner la forme selectionner sur le base
        }
        stroke.prepForBaseCanvas()
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
        drawStrokeOnSelectionCanvas(stroke, selectionCanvas!!)
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

    fun changeReceivedWidth(width : Float, strokeIndex: Int){
        val currentStroke = strokes[strokeIndex]
        if (currentStroke != null) {
            currentStroke.currentStrokeWidth = width
            if (otherSelectionCanvas != null) {
                otherSelectionCanvas!!.drawColor(
                    Color.TRANSPARENT,
                    PorterDuff.Mode.CLEAR
                ) //clear le canvas de selection
            }
            //clear le canvas
            baseCanvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR) //clear le base canvas

            //redessiner les autres formes
            strokes.forEachIndexed {i, element ->
                if (i != selectedIndex && !strokesSelected.contains(element)) {
                    element.drawStroke(baseCanvas) //redessiner les autres formes sauf la forme selectionner
                }
            }

            //redessiner la forme selectionner
            //redessiner la forme selectionner
            if (selectionBitmap != null) {
                baseCanvas.drawBitmap(
                    selectionBitmap!!,
                    this.currentStroke!!.boundingPoints[0].x,
                    this.currentStroke!!.boundingPoints[0].y,
                    null
                ) //dessiner la forme selectionner sur le base
            }

            //redessiner les formes selectionner par les autres
            strokesSelected.forEachIndexed {i, element ->
                createOtherSelectionCanvas(element)
            }
        }
    }

    fun changeReceivedColor(color:Int, strokeIndex: Int){
        val currentStroke = strokes[strokeIndex]
        if (currentStroke != null) {
            currentStroke!!.currentStrokeColor = color
            if (otherSelectionCanvas != null) {
                otherSelectionCanvas!!.drawColor(
                    Color.TRANSPARENT,
                    PorterDuff.Mode.CLEAR
                ) //clear le canvas de selection
            }

            //clear le canvas
            baseCanvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR) //clear le base canvas

            //redessiner les autres formes
            strokes.forEachIndexed {i, element ->
                if (i != selectedIndex && !strokesSelected.contains(element)) {
                    element.drawStroke(baseCanvas) //redessiner les autres formes sauf la forme selectionner
                }
            }

            //redessiner la forme selectionner
            if (selectionBitmap != null) {
                baseCanvas.drawBitmap(
                    selectionBitmap!!,
                    this.currentStroke!!.boundingPoints[0].x,
                    this.currentStroke!!.boundingPoints[0].y,
                    null
                ) //dessiner la forme selectionner sur le base
            }

            //redessiner les formes selectionner par les autres
            strokesSelected.forEachIndexed {i, element ->
                createOtherSelectionCanvas(element)
            }
        }
    }

    override fun onStrokeReceived(stroke: JSONObject) {
        val sender = stroke.getString("sender")
        val strokeIndex = stroke.getInt("strokeIndex")

        strokesSelected.add(strokes[strokeIndex])
        displaySelection(sender, strokeIndex)
    }

    private fun sendSelectionStroke(){
        //convert into the right json format
        var jo = JSONObject()
        jo.put("strokeIndex", selectedIndex)
        jo.put("sender", socket.socket.id())
        socket.socket.emit("broadcastSelection", jo )
    }

    private fun displaySelection(sender: String, strokeIndex: Int) {
        val stroke = strokes[strokeIndex]
        createOtherSelectionCanvas(stroke)
    }

    private fun createOtherSelectionCanvas(stroke: Stroke) {
        val width = (stroke.boundingPoints[1].x - stroke.boundingPoints[0].x).toInt()
        val height = (stroke.boundingPoints[1].y - stroke.boundingPoints[0].y).toInt()
        otherSelectionBitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        otherSelectionCanvas = Canvas(otherSelectionBitmap!!)
        val borderPaint = Paint().apply {
            color = ResourcesCompat.getColor(context.resources, R.color.blue, null)
            isAntiAlias = true
            isDither = true
            style = Paint.Style.STROKE
            strokeJoin = Paint.Join.MITER
            strokeCap = Paint.Cap.SQUARE
            strokeWidth = 10f
        }
        otherSelectionCanvas!!.drawRect(0f,0f, width.toFloat(), height.toFloat(),borderPaint)

        drawStrokeOnSelectionCanvas(stroke, otherSelectionCanvas!!)
        drawOtherSelectedStrokesOnBaseCanvas(stroke, otherSelectionBitmap)
    }
}

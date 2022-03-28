package com.example.mobile.Tools

import android.content.Context
import android.graphics.*
import android.net.ipsec.ike.exceptions.InvalidMajorVersionException
import androidx.core.content.res.ResourcesCompat
import androidx.core.graphics.set
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
import kotlin.math.abs

class  Selection(context: Context, baseCanvas: Canvas, val socket : DrawingCollaboration) : Tool(context, baseCanvas, socket) {
    var strokes = ArrayList<Stroke>()
    var strokesSelected = ArrayList<Stroke>()
    var strokesSelectedBitmap: MutableMap<String, Bitmap> = mutableMapOf()
    private var currentStroke: Stroke? = null
    private var selectionCanvas: Canvas? = null
    private var otherSelectionCanvas: Canvas? = null
    private var selectionBitmap: Bitmap? = null
    private var otherSelectionBitmap: Bitmap? = null
    private var selectedIndex: Int? = null
    var isToolSelection: Boolean? = null
    var oldTool: ToolbarFragment.MenuItem? = null
    var oldMousePosition: IVec2 = IVec2(0F, 0F)
    var isMoving: Boolean = false
    var isResizing: Boolean = false

    override var nextTool: ToolbarFragment.MenuItem = ToolbarFragment.MenuItem.SELECTION

    override fun touchStart() {
        mStartX = mx
        mStartY = my
        oldMousePosition = IVec2(mStartX, mStartY)

        if (currentStroke != null && !strokesSelected.contains(currentStroke)) {
            if (!isInBounds(currentStroke!!.boundingPoints, IVec2(mx, my))) {

                sendPasteSelection()
                resetSelection()

//                var jo = JSONObject()
//                jo.put("strokeIndex", selectedIndex)
//                jo.put("sender", socket.socket.id())
//                socket.socket.emit("broadcastPasteRequest", jo)

                if (isToolSelection == false) {
                    nextTool = oldTool!!
                }

            } else if (isInBounds(
                    currentStroke!!.boundingPoints,
                    IVec2(mx, my)
                ) || isToolSelection == true
            ) {
                nextTool = ToolbarFragment.MenuItem.SELECTION
            }
        }
    }

    fun resetSelection() {
        if (currentStroke != null && !strokesSelected.contains(currentStroke)) {
//            if (!strokesSelected.contains(currentStroke)) {
                currentStroke!!.prepForBaseCanvas()
//            }
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

//            strokesSelected.forEachIndexed { i, element ->
//                createOtherSelectionCanvas(null, element)
//            }
            var i = 0
            strokesSelectedBitmap.forEach {
                baseCanvas.drawBitmap(
                    it.value, //hereeeeeeeeeeeeeeeeeeeeeeeeeeeee
                    strokesSelected[i].boundingPoints[0].x,
                    strokesSelected[i].boundingPoints[0].y,
                    null
                )
                i++
            }

            currentStroke = null
            selectedIndex = null
            nextTool = ToolbarFragment.MenuItem.SELECTION
        }
    }


    override fun touchMove() {
        if (currentStroke != null) {
            currentStroke!!.moveStroke(IVec2(mx - oldMousePosition.x, my - oldMousePosition.y))
            drawStrokesOnBaseCanvas(currentStroke!!)
            oldMousePosition = IVec2(mx, my)
            isMoving = true
        }
    }

    override fun touchUp() {
        if (isMoving) {
            //send
            var pos = JSONObject()
            pos.put("x", currentStroke!!.boundingPoints[0].x)
            pos.put("y", currentStroke!!.boundingPoints[0].y)
            var jo = JSONObject()
            jo.put("pos", pos)
            jo.put("sender", socket.socket.id())
            socket.socket.emit("broadcastSelectionPos", jo)
            isMoving = false
        }
        var isInStrokesSelected = false
        strokesSelected.forEach {
            if (isInBounds(it.boundingPoints, IVec2(mStartX, mStartY))) {
                isInStrokesSelected = true
            }
        }

        if ((isStrokeFound(
                IVec2(
                    mStartX,
                    mStartY
                )
            )) && !strokesSelected.contains(strokes[selectedIndex!!]) && currentStroke == null && !isInStrokesSelected
        ) {
            currentStroke = strokes[selectedIndex!!]
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
        selectionCanvas!!.drawRect(0f, 0f, width.toFloat(), height.toFloat(), borderPaint)
    }

    private fun drawStrokeOnSelectionCanvas(stroke: Stroke, canvas: Canvas) {
        if (!isMoving) {
            stroke.prepForSelection()
        }
        stroke.drawStroke(canvas)
    }

    private fun drawStrokeOnOtherSelectionCanvas(stroke: Stroke, canvas: Canvas) {
        stroke.prepForSelection()
        stroke.drawStroke(canvas)
    }

    private fun drawStrokesOnBaseCanvas(stroke: Stroke) {
        baseCanvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR) //clear le base canvas

        strokes.forEachIndexed { i, element ->
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
            strokes[selectedIndex!!] = stroke
        }

//        strokesSelected.forEachIndexed { i, element ->
//            createOtherSelectionCanvas(null, element)
//        }
        var i = 0
        strokesSelectedBitmap.forEach {
            baseCanvas.drawBitmap(
                it.value, //hereeeeeeeeeeeeeeeeeeeeeeeeeeeee
                strokesSelected[i].boundingPoints[0].x,
                strokesSelected[i].boundingPoints[0].y,
                null
            )
            i++
        }


    }

    private fun drawOtherSelectedStrokesOnBaseCanvas(
        stroke: Stroke,
        otherSelectionBitmap: Bitmap?
    ) {
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

    override fun onDraw(canvas: Canvas) {}

    private fun isStrokeFound(clickedPos: IVec2): Boolean {
        strokes.reversed().forEach { element ->
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

    fun addStroke(stroke: Stroke) {
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

    fun changeSelectionWeight(width: Float) {
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

    fun changeSelectionColor(color: Int) {
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

    fun changeReceivedWidth(sender: String, width: Float, strokeIndex: Int) {
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
            strokes.forEachIndexed { i, element ->
                if (i != selectedIndex && !strokesSelected.contains(element)) {
                    element.drawStroke(baseCanvas) //redessiner les autres formes sauf la forme selectionner
                }
            }

            //redessiner la forme selectionner
            if (selectionBitmap != null && this.currentStroke != null) {
                baseCanvas.drawBitmap(
                    selectionBitmap!!,
                    this.currentStroke!!.boundingPoints[0].x,
                    this.currentStroke!!.boundingPoints[0].y,
                    null
                ) //dessiner la forme selectionner sur le base
            }

            //redessiner les formes selectionner par les autres
//            strokesSelected.forEachIndexed { i, element ->
//                createOtherSelectionCanvas(null, element)
//            }
            var i = 0
            strokesSelectedBitmap.forEach {
                if (it.key != sender) {
                    baseCanvas.drawBitmap(
                        it.value, //hereeeeeeeeeeeeeeeeeeeeeeeeeeeee
                        strokesSelected[i].boundingPoints[0].x,
                        strokesSelected[i].boundingPoints[0].y,
                        null
                    )
                    i++
                } else {
                    strokesSelectedBitmap.remove(sender)
                    strokesSelected[i] = currentStroke
                    createOtherSelectionCanvas(sender, currentStroke)
                }
            }
        }
    }

    fun changeReceivedColor(sender: String, color: Int, strokeIndex: Int) {
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
            strokes.forEachIndexed { i, element ->
                if (i != selectedIndex && !strokesSelected.contains(element)) {
                    element.drawStroke(baseCanvas) //redessiner les autres formes sauf la forme selectionner
                }
            }

            //redessiner la forme selectionner
            if (selectionBitmap != null && this.currentStroke != null) {
                baseCanvas.drawBitmap(
                    selectionBitmap!!,
                    this.currentStroke!!.boundingPoints[0].x,
                    this.currentStroke!!.boundingPoints[0].y,
                    null
                ) //dessiner la forme selectionner sur le base
            }

            //redessiner les formes selectionner par les autres
//            strokesSelected.forEachIndexed { i, element ->
//                createOtherSelectionCanvas(null, element)
//            }
            var i = 0
            strokesSelectedBitmap.forEach {
                if (it.key != sender) {
                    baseCanvas.drawBitmap(
                        it.value, //hereeeeeeeeeeeeeeeeeeeeeeeeeeeee
                        strokesSelected[i].boundingPoints[0].x,
                        strokesSelected[i].boundingPoints[0].y,
                        null
                    )
                    i++
                } else {
                    strokesSelectedBitmap.remove(sender)
                    strokesSelected[i] = currentStroke
                    createOtherSelectionCanvas(sender, currentStroke)
                }
            }
        }
    }

    override fun onStrokeReceived(stroke: JSONObject) {
        val sender = stroke.getString("sender")
        val strokeIndex = stroke.getInt("strokeIndex")

        strokesSelected.add(strokes[strokeIndex])
        //strokesSelectedBitmap[sender] =
        displaySelection(sender, strokeIndex)
    }

    private fun sendSelectionStroke() {
        //convert into the right json format
        var jo = JSONObject()
        jo.put("strokeIndex", selectedIndex)
        jo.put("sender", socket.socket.id())
        socket.socket.emit("broadcastSelection", jo)
    }

    private fun displaySelection(sender: String, strokeIndex: Int) {
        val stroke = strokes[strokeIndex]
        createOtherSelectionCanvas(sender, stroke)
    }

    private fun createOtherSelectionCanvas(sender: String?, stroke: Stroke) {
        val width = (stroke.boundingPoints[1].x - stroke.boundingPoints[0].x).toInt()
        val height = (stroke.boundingPoints[1].y - stroke.boundingPoints[0].y).toInt()
        val otherSelectionBitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        val otherSelectionCanvas = Canvas(otherSelectionBitmap!!)
        val borderPaint = Paint().apply {
            color = ResourcesCompat.getColor(context.resources, R.color.blue, null)
            isAntiAlias = true
            isDither = true
            style = Paint.Style.STROKE
            strokeJoin = Paint.Join.MITER
            strokeCap = Paint.Cap.SQUARE
            strokeWidth = 10f
        }
        otherSelectionCanvas!!.drawRect(0f, 0f, width.toFloat(), height.toFloat(), borderPaint)

        drawStrokeOnOtherSelectionCanvas(stroke, otherSelectionCanvas!!)
        drawOtherSelectedStrokesOnBaseCanvas(stroke, otherSelectionBitmap)
        strokesSelectedBitmap.put(sender!!, otherSelectionBitmap)
    }

    fun onPasteRequest(sender: String, strokeIndex: Int) {
        val currentStroke = strokes[strokeIndex]
        if (currentStroke != null) {
            if (otherSelectionCanvas != null) {
                otherSelectionCanvas!!.drawColor(
                    Color.TRANSPARENT,
                    PorterDuff.Mode.CLEAR
                ) //clear le canvas de selection
            }
            //clear le canvas
            baseCanvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR) //clear le base canvas

            //redessiner les autres formes
            strokes.forEachIndexed { i, element ->
                if (i != selectedIndex) {
                    element.drawStroke(baseCanvas) //redessiner les autres formes sauf la forme selectionner
                }
            }

            //redessiner la forme selectionner
            if (selectionBitmap != null && this.currentStroke != null) {
                baseCanvas.drawBitmap(
                    selectionBitmap!!,
                    this.currentStroke!!.boundingPoints[0].x,
                    this.currentStroke!!.boundingPoints[0].y,
                    null
                ) //dessiner la forme selectionner sur le base
            }

            strokesSelected.remove(currentStroke)
            strokesSelectedBitmap.remove(sender)
            //redessiner les formes selectionner par les autres
            var i = 0
            strokesSelectedBitmap.forEach {
                baseCanvas.drawBitmap(
                    it.value, //hereeeeeeeeeeeeeeeeeeeeeeeeeeeee
                    strokesSelected[i].boundingPoints[0].x,
                    strokesSelected[i].boundingPoints[0].y,
                    null
                )
                i++
            }
        }
    }

    fun sendPasteSelection() {
        if (selectedIndex != null && currentStroke != null && !strokesSelected.contains(strokes[selectedIndex!!])) {
            var jo = JSONObject()
            jo.put("strokeIndex", selectedIndex)
            jo.put("sender", socket.socket.id())
            socket.socket.emit("broadcastPasteRequest", jo)
        }
    }

    fun deleteStroke() {
        if (selectedIndex != null && currentStroke != null && !strokesSelected.contains(strokes[selectedIndex!!])) {
            var jo = JSONObject()
            jo.put("strokeIndex", selectedIndex)
            jo.put("sender", socket.socket.id())
            socket.socket.emit("broadcastDeleteRequest", jo)

            strokes.removeAt(selectedIndex!!)
            strokesSelected.remove(currentStroke)
            strokesSelectedBitmap.remove(socket.socket.id())
//            sendPasteSelection()
            resetSelection()
            if (!isToolSelection!!) {
                nextTool = oldTool!!
            } else {
                isToolSelection = true
            }
        }
    }

    fun onDeleteRequest(sender: String, strokeIndex: Int) {
        val currentStroke = strokes[strokeIndex]
        strokes.remove(currentStroke)
        strokesSelected.remove(currentStroke)
        strokesSelectedBitmap.remove(sender)

        if (otherSelectionCanvas != null) {
            otherSelectionCanvas!!.drawColor(
                Color.TRANSPARENT,
                PorterDuff.Mode.CLEAR
            )
        }
        baseCanvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR) //clear le base canvas

        //redessiner les autres formes
        strokes.forEachIndexed { i, element ->
            if (i != selectedIndex) {
                element.drawStroke(baseCanvas) //redessiner les autres formes sauf la forme selectionner
            }
        }

        //redessiner la forme selectionner
        if (selectionBitmap != null && this.currentStroke != null) {
            baseCanvas.drawBitmap(
                selectionBitmap!!,
                this.currentStroke!!.boundingPoints[0].x,
                this.currentStroke!!.boundingPoints[0].y,
                null
            ) //dessiner la forme selectionner sur le base
        }

        //redessiner les formes selectionner par les autres
//        strokesSelected.forEachIndexed { i, element ->
//            createOtherSelectionCanvas(null, element)
//        }
        var i = 0
        strokesSelectedBitmap.forEach {
            baseCanvas.drawBitmap(
                it.value, //hereeeeeeeeeeeeeeeeeeeeeeeeeeeee
                strokesSelected[i].boundingPoints[0].x,
                strokesSelected[i].boundingPoints[0].y,
                null
            )
            i++
        }
    }

    fun onMoveRequest(sender: String, pos: IVec2) {
//        var index = strokes.indexOf(strokesSelected[0])

        var i = 0
        strokesSelectedBitmap.forEach {
            if (it.key != sender) {
                i++
            }
        }
        var index = strokes.indexOf(strokesSelected[i])

        strokes[index].updateMove(pos)

        strokes[index].boundingPoints[1] = IVec2(
            pos.x - strokesSelected[0].boundingPoints[0].x + strokesSelected[0].boundingPoints[1].x,
            pos.y - strokesSelected[0].boundingPoints[0].y + strokesSelected[0].boundingPoints[1].y
        )
        strokes[index].boundingPoints[0] = IVec2(pos.x, pos.y)

        strokesSelected[0] = strokes[index]



        baseCanvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR) //clear le base canvas

        strokes.forEachIndexed { i, element ->
            if (i != selectedIndex && !strokesSelected.contains(element)) {
                element.drawStroke(baseCanvas) //redessiner les autres formes sauf la forme selectionner
            }
        }

        if (selectionBitmap != null && currentStroke != null) {
            baseCanvas.drawBitmap(
                selectionBitmap!!,
                currentStroke!!.boundingPoints[0].x,
                currentStroke!!.boundingPoints[0].y,
                null
            ) //dessiner la forme selectionner sur le base
            strokes[selectedIndex!!] = currentStroke!!
        }

        baseCanvas.drawBitmap(
            strokesSelectedBitmap[sender]!!,
            pos.x,
            pos.y,
            null
        ) //dessiner la forme selectionner sur le base
    }
}


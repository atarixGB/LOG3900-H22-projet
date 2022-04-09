package com.example.mobile.Tools

import android.content.Context
import android.graphics.*
import androidx.core.content.res.ResourcesCompat
import com.example.mobile.Interface.IVec2
import com.example.mobile.Interface.Stroke
import com.example.mobile.R
import com.example.mobile.activity.drawing.DrawingSocket
import com.example.mobile.activity.drawing.ToolbarFragment
import org.json.JSONObject
import kotlin.collections.ArrayList

class  Selection(context: Context, baseCanvas: Canvas, val socket : DrawingSocket, val drawingId: String) : Tool(context, baseCanvas, socket) {
    var strokes = ArrayList<Stroke>()
    var strokesSelected = ArrayList<Stroke>()
    var strokesSelectedBitmap: MutableMap<String, Bitmap> = mutableMapOf()
    var currentCpIndex: Int = 5
    private var currentStroke: Stroke? = null
    private var selectionCanvas: Canvas? = null
    private var otherSelectionCanvas: Canvas? = null
    private var selectionBitmap: Bitmap? = null
    private var otherSelectionBitmap: Bitmap? = null
    private var selectedIndex: Int? = null
    private var dimensionsBeforeResize = IVec2(0F, 0F)
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

                if (isToolSelection == false) {
                    nextTool = oldTool!!
                }

            } else if (isInBounds(
                    currentStroke!!.boundingPoints,
                    IVec2(mx, my)
                ) || isToolSelection == true
            ) {
                nextTool = ToolbarFragment.MenuItem.SELECTION
                dimensionsBeforeResize = IVec2(selectionBitmap!!.width.toFloat(),selectionBitmap!!.height.toFloat())
            }
        }
    }

    override fun touchMove() {
        if (currentStroke != null) {
            if (isResizing) {
                var oldWidth = (currentStroke!!.boundingPoints[1].x - currentStroke!!.boundingPoints[0].x)
                var oldHeight = (currentStroke!!.boundingPoints[1].y - currentStroke!!.boundingPoints[0].y)

                var newWidth = oldWidth
                var newHeight = oldHeight

                when(currentCpIndex) {
                    0 -> {
                        if (currentStroke!!.boundingPoints[1].x - mx > 2F) {
                            newWidth = (currentStroke!!.boundingPoints[1].x - mx)
                            currentStroke!!.boundingPoints[0].x = mx
                        }
                        if (currentStroke!!.boundingPoints[1].y - my> 2F) {
                            newHeight = (currentStroke!!.boundingPoints[1].y - my)
                            currentStroke!!.boundingPoints[0].y = my
                        }
                    }
                    1 -> {
                        if (mx - currentStroke!!.boundingPoints[0].x > 2F) {
                            newWidth = (mx - currentStroke!!.boundingPoints[0].x)
                            currentStroke!!.boundingPoints[1].x = mx
                        }
                        if (currentStroke!!.boundingPoints[1].y - my > 2F) {
                            newHeight = (currentStroke!!.boundingPoints[1].y - my)
                            currentStroke!!.boundingPoints[0].y = my
                        }
                    }
                    2 -> {
                        if (currentStroke!!.boundingPoints[1].x - mx > 2F) {
                            newWidth = (currentStroke!!.boundingPoints[1].x - mx)
                            currentStroke!!.boundingPoints[0].x = mx
                        }

                        if(my - currentStroke!!.boundingPoints[0].y > 2F) {
                            newHeight = (my - currentStroke!!.boundingPoints[0].y)
                            currentStroke!!.boundingPoints[1].y = my
                        }

                    }
                    3 -> {
                        if (mx - currentStroke!!.boundingPoints[0].x > 2F) {
                            newWidth = (mx - currentStroke!!.boundingPoints[0].x)
                            currentStroke!!.boundingPoints[1].x = mx
                        }
                        if (my - currentStroke!!.boundingPoints[0].y > 2F) {
                            newHeight = (my - currentStroke!!.boundingPoints[0].y)
                            currentStroke!!.boundingPoints[1].y = my
                        }

                    }
                }

                var scale = IVec2(newWidth/oldWidth, newHeight/oldHeight)

                currentStroke!!.rescale(scale)
                selectionCanvas!!.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR)
                createSelectionCanvas(currentStroke!!)
                currentStroke!!.drawStroke(selectionCanvas!!)
                drawStrokesOnBaseCanvas(currentStroke!!)
                oldMousePosition = IVec2(mx, my)
            } else if (isInResizingPoints(currentStroke!!.boundingPoints, IVec2(mx, my)) && !isMoving) {
                var oldWidth = (currentStroke!!.boundingPoints[1].x - currentStroke!!.boundingPoints[0].x)
                var oldHeight = (currentStroke!!.boundingPoints[1].y - currentStroke!!.boundingPoints[0].y)

                var newWidth = oldWidth
                var newHeight = oldHeight

                when(currentCpIndex) {
                    0 -> {
                        if (currentStroke!!.boundingPoints[1].x - mx > 2F) {
                            newWidth = (currentStroke!!.boundingPoints[1].x - mx)
                            currentStroke!!.boundingPoints[0].x = mx
                        }
                        if (currentStroke!!.boundingPoints[1].y - my> 2F) {
                            newHeight = (currentStroke!!.boundingPoints[1].y - my)
                            currentStroke!!.boundingPoints[0].y = my
                        }
                    }
                    1 -> {
                        if (mx - currentStroke!!.boundingPoints[0].x > 2F) {
                            newWidth = (mx - currentStroke!!.boundingPoints[0].x)
                            currentStroke!!.boundingPoints[1].x = mx
                        }
                        if (currentStroke!!.boundingPoints[1].y - my > 2F) {
                            newHeight = (currentStroke!!.boundingPoints[1].y - my)
                            currentStroke!!.boundingPoints[0].y = my
                        }
                    }
                    2 -> {
                        if (currentStroke!!.boundingPoints[1].x - mx > 2F) {
                            newWidth = (currentStroke!!.boundingPoints[1].x - mx)
                            currentStroke!!.boundingPoints[0].x = mx
                        }

                        if(my - currentStroke!!.boundingPoints[0].y > 2F) {
                            newHeight = (my - currentStroke!!.boundingPoints[0].y)
                            currentStroke!!.boundingPoints[1].y = my
                        }

                    }
                    3 -> {
                        if (mx - currentStroke!!.boundingPoints[0].x > 2F) {
                            newWidth = (mx - currentStroke!!.boundingPoints[0].x)
                            currentStroke!!.boundingPoints[1].x = mx
                        }
                        if (my - currentStroke!!.boundingPoints[0].y > 2F) {
                            newHeight = (my - currentStroke!!.boundingPoints[0].y)
                            currentStroke!!.boundingPoints[1].y = my
                        }

                    }
                }

                var scale = IVec2(newWidth/oldWidth, newHeight/oldHeight)

                currentStroke!!.rescale(scale)
                selectionCanvas!!.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR)
                createSelectionCanvas(currentStroke!!)
                currentStroke!!.drawStroke(selectionCanvas!!)
                drawStrokesOnBaseCanvas(currentStroke!!)
                oldMousePosition = IVec2(mx, my)
                isResizing = true
            } else if (!isResizing){
                currentStroke!!.moveStroke(IVec2(mx - oldMousePosition.x, my - oldMousePosition.y))
                drawStrokesOnBaseCanvas(currentStroke!!)
                oldMousePosition = IVec2(mx, my)
                isMoving = true
            }
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

            var data = JSONObject()
            data.put("room", drawingId)
            data.put("data", jo)

            socket.socket.emit("broadcastSelectionPos", data)
            isMoving = false

        } else if (isResizing) {
            //send
            var newPos = JSONObject()
            newPos.put("x", currentStroke!!.boundingPoints[0].x)
            newPos.put("y", currentStroke!!.boundingPoints[0].y)

            var newDimensions = JSONObject()
            newDimensions.put("x", selectionBitmap!!.width)
            newDimensions.put("y", selectionBitmap!!.height)

            var scale = JSONObject()
            scale.put("x", selectionBitmap!!.width/dimensionsBeforeResize.x)
            scale.put("y", selectionBitmap!!.height/dimensionsBeforeResize.y)


            var jo = JSONObject()

            jo.put("strokeIndex", selectedIndex)
            jo.put("newPos", newPos)
            jo.put("newDimensions", newDimensions)
            jo.put("scale", scale)
            jo.put("sender", socket.socket.id())

            var data = JSONObject()
            data.put("room", drawingId)
            data.put("data", jo)

            socket.socket.emit("broadcastSelectionSize", data)
            isResizing = false
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
        selectionBitmap = Bitmap.createBitmap(width + 15, height + 15, Bitmap.Config.ARGB_8888)
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
        selectionCanvas!!.drawRect(15f, 15f, width.toFloat(), height.toFloat(), borderPaint)

        //bounding box :
        val boundingPointPaint = Paint().apply {
            color = ResourcesCompat.getColor(context.resources, R.color.red, null)
            isAntiAlias = true
            isDither = true
            style = Paint.Style.FILL
            strokeJoin = Paint.Join.MITER
            strokeCap = Paint.Cap.SQUARE
            strokeWidth = 1f
        }

        selectionCanvas!!.drawRect(0f, 0F, 30F, 30F, boundingPointPaint)
        selectionCanvas!!.drawRect(width.toFloat()-15F, height.toFloat()-15F, width.toFloat()+15F, height.toFloat() + 15F, boundingPointPaint)
        selectionCanvas!!.drawRect(0f, height.toFloat()-15F, 30F, height.toFloat() + 15F, boundingPointPaint)
        selectionCanvas!!.drawRect(width.toFloat()-15F, 0F, width.toFloat()+15F, 30F, boundingPointPaint)


    }

    private fun drawStrokeOnSelectionCanvas(stroke: Stroke, canvas: Canvas) {
        if (!isMoving && !isResizing) {
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
                return true
            }
        }
        return false
    }

    private fun isInBounds(bounds: ArrayList<IVec2>, pointToCheck: IVec2): Boolean {
        //j'ai enlever les egales des "<=" et ">="
        val topLeftBound = bounds[0];
        val bottomRightBound = bounds[1];
        return (
                pointToCheck.x > topLeftBound.x &&
                        pointToCheck.x < bottomRightBound.x &&
                        pointToCheck.y > topLeftBound.y &&
                        pointToCheck.y < bottomRightBound.y
                )
    }

    private fun isInResizingPoints(bounds: ArrayList<IVec2>, pointToCheck: IVec2): Boolean {
        val topLeftBound = bounds[0];
        val bottomRightBound = bounds[1];

        if ((pointToCheck.x >= topLeftBound.x - 50F) && (pointToCheck.x <= topLeftBound.x + 50F) &&
            (pointToCheck.y >= topLeftBound.y - 50F) && (pointToCheck.y <= topLeftBound.y + 50F)
        ) {
            if (!isResizing) {
                currentCpIndex = 0
            }
            return true
        } else if ((pointToCheck.x >= bottomRightBound.x - 50F) && (pointToCheck.x <= bottomRightBound.x + 50F) &&
            (pointToCheck.y >= topLeftBound.y - 50F) && (pointToCheck.y <= topLeftBound.y + 50F)
        ) {
            if (!isResizing) {
                currentCpIndex = 1
            }
            return true
        } else if ((pointToCheck.x >= topLeftBound.x - 50F) && (pointToCheck.x <= topLeftBound.x + 50F) &&
            (pointToCheck.y >= bottomRightBound.y - 50F) && (pointToCheck.y <= bottomRightBound.y + 50F)
        ) {
            if (!isResizing) {
                currentCpIndex = 2
            }
            return true

        } else if ((pointToCheck.x >= bottomRightBound.x - 50F) && (pointToCheck.x <= bottomRightBound.x + 50F) &&
            (pointToCheck.y >= bottomRightBound.y - 50F) && (pointToCheck.y <= bottomRightBound.y + 50F)
        ) {
            if (!isResizing) {
                currentCpIndex = 3
            }
            return true
        }
        return false
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

            var data = JSONObject()
            data.put("room", drawingId)
            data.put("data", jo)
            socket.socket.emit("broadcastNewStrokeWidth", data)
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

            var data = JSONObject()
            data.put("room", drawingId)
            data.put("data", jo)

            socket.socket.emit("broadcastNewPrimaryColor", data)
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

        var data = JSONObject()
        data.put("room", drawingId)
        data.put("data", jo)
        socket.socket.emit("broadcastSelection", data)
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

            var data = JSONObject()
            data.put("room", drawingId)
            data.put("data", jo)
            socket.socket.emit("broadcastPasteRequest", data)
        }
    }

    fun deleteStroke() {
        if (selectedIndex != null && currentStroke != null && !strokesSelected.contains(strokes[selectedIndex!!])) {
            var jo = JSONObject()
            jo.put("strokeIndex", selectedIndex)
            jo.put("sender", socket.socket.id())

            var data = JSONObject()
            data.put("room", drawingId)
            data.put("data", jo)
            socket.socket.emit("broadcastDeleteRequest", data)

            strokes.removeAt(selectedIndex!!)
            strokesSelected.remove(currentStroke)
            strokesSelectedBitmap.remove(socket.socket.id())
//            sendPasteSelection()
//            resetSelection()
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

            if (!isToolSelection!!) {
                nextTool = oldTool!!
            } else {
                nextTool = ToolbarFragment.MenuItem.SELECTION
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
//            if (i != selectedIndex) {
            if (this.currentStroke != null) {
                if (element != this.currentStroke) {
                    element.drawStroke(baseCanvas) //redessiner les autres formes sauf la forme selectionner
                }
            } else {
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

    fun onResizeRequest(sender: String, strokeIndex: Int, newPos: IVec2, newDimensions: IVec2, scale: IVec2) {
        strokes[strokeIndex].rescale(scale)
        strokes[strokeIndex].boundingPoints[0] = newPos
        strokes[strokeIndex].boundingPoints[1] = IVec2(newDimensions.x + newPos.x, newDimensions.y + newPos.y)

        if (otherSelectionCanvas != null) {
            otherSelectionCanvas!!.drawColor(
                Color.TRANSPARENT,
                PorterDuff.Mode.CLEAR
            ) //clear le canvas de selection des autres
        }

        baseCanvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR) //clear le base canvas

        strokes.forEachIndexed { i, element ->
            if (i != selectedIndex && i!=strokeIndex) {
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
                strokesSelected[i] = strokes[strokeIndex]
                createOtherSelectionCanvas(sender, strokes[strokeIndex])
            }
        }

    }


    fun onMoveRequest(sender: String, pos: IVec2) {

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

        strokesSelected[0] = strokes[index] //TODO de i au lieu de 0?



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
}


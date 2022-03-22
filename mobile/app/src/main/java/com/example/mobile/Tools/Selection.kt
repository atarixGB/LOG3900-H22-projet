package com.example.mobile.Tools

import android.content.Context
import android.graphics.*
import androidx.core.content.res.ResourcesCompat
import androidx.fragment.app.activityViewModels
import com.example.mobile.DrawingCollaboration
import com.example.mobile.DrawingZoneFragment
import com.example.mobile.Interface.IPencilStroke
import com.example.mobile.Interface.IVec2
import com.example.mobile.Interface.Stroke
import com.example.mobile.R
import com.example.mobile.viewModel.ToolParameters
import org.json.JSONObject
import java.util.*

class  Selection(context: Context, baseCanvas: Canvas, socket : DrawingCollaboration) : Tool(context, baseCanvas, socket) {
    var strokes= ArrayList<Stroke>()
    private var currentStroke : Stroke? = null
    private var selectionCanvas: Canvas? = null
    private var selectionBitmap: Bitmap? = null
    private var selectedIndex:Int=0

    override fun touchStart() {
        mStartX = mx
        mStartY = my
        if (currentStroke!= null) {
            currentStroke!!.prepForBaseCanvas()
            currentStroke!!.isSelected = false
        }
    }


    override fun touchMove() {}

    override fun touchUp() {
        if(isStrokeFound(IVec2(mStartX, mStartY))) {
            currentStroke = strokes[selectedIndex]
            currentStroke!!.isSelected = true
            if (selectionCanvas!= null) {
                selectionCanvas!!.drawColor(
                    Color.TRANSPARENT,
                    PorterDuff.Mode.CLEAR
                ) //clear le canvas de selection
            }
            createSelectionCanvas(currentStroke!!)
            drawStrokeOnSelectionCanvas(currentStroke!!)
            drawStrokesOnBaseCanvas(currentStroke!!)
        }
    }

    override fun onStrokeReceived(stroke: JSONObject) {
        TODO("Not yet implemented")
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
            strokeJoin = Paint.Join.ROUND
            strokeCap = Paint.Cap.ROUND
            strokeWidth = 10f
        }
        selectionCanvas!!.drawRect(0f,0f, width.toFloat(), height.toFloat(),borderPaint)
    }

    private fun drawStrokeOnSelectionCanvas(stroke: Stroke) {
        stroke.prepForSelection()
        stroke.drawStroke(selectionCanvas!!)
//        selectionCanvas!!.setBitmap(selectionBitmap)
    }

    private fun drawStrokesOnBaseCanvas(stroke: Stroke) {
        baseCanvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR) //clear le base canvas

        strokes.forEachIndexed {i, element ->
            if (i != selectedIndex) {
                element.drawStroke(baseCanvas) //redessiner les autres formes sauf la forme selectionner
            }
        }

        baseCanvas.drawBitmap(selectionBitmap!!, stroke.boundingPoints[0].x, stroke.boundingPoints[0].y, null) //dessiner la forme selectionner sur le base

        strokes[selectedIndex] = currentStroke!!
    }

    override fun onDraw(canvas: Canvas) {
//        path.reset()
//        path.moveTo(mStartX, mStartY)
//        path.quadTo(
//            mStartX,
//            mStartY,
//            (5F + mStartX) ,
//            (5F + mStartY)
//        )
//        path!!.lineTo(5F, 5F)
//        canvas!!.drawPath(path!!, paint!!)
//        path!!.reset()
    }

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

    fun changeSelectionWeight(width : Float){
        currentStroke!!.currentStrokeWidth = width
        createSelectionCanvas(currentStroke!!)
        currentStroke!!.drawStroke(selectionCanvas!!)
        drawStrokesOnBaseCanvas(currentStroke!!)
    }

    fun changeSelectionColor(color:Int){
        currentStroke!!.currentStrokeColor = color
        createSelectionCanvas(currentStroke!!)
        currentStroke!!.drawStroke(selectionCanvas!!)
        drawStrokesOnBaseCanvas(currentStroke!!)
    }

    //code Leon :
//    private fun pasteStrokeOnSelectionCanvas(stroke: Stroke, selectionCtx: Canvas) {
//        stroke.prepForSelection()
//        stroke.drawStroke(selectionCtx)
//    }
//
//    private fun selectStroke(stroke: Stroke) {
//        isActiveSelection = true
////        selectedStroke = stroke
//        previewSelection(stroke);
//        val index = strokes.indexOf(stroke);
//        redrawAllStrokesExceptSelected(stroke);
//    }
//
//    private fun previewSelection(stroke: Stroke) {
//        selectionCnv = createSelectionCanvas(stroke)
//        val pos = IVec2( stroke.boundingPoints[0].x, stroke.boundingPoints[0].y )
////        this.positionSelectionCanvas(pos, this.selectionCnv);
//        pasteStrokeOnSelectionCanvas(stroke, selectionCnv as Canvas);
////        this.adjustCpsToSelection();
//
//    }
//
//    private fun redrawAllStrokesExceptSelected(stroke: Stroke) {
//        if (this.strokes.contains(stroke)) {
//            this.strokes.remove(stroke);
//        }
//
//
//        baseCanvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR)
//
//        strokes.forEach { stroke ->
//            stroke.drawStroke(baseCanvas);
//        }
//    }
//
//    private fun createSelectionCanvas(stroke: Stroke): Canvas {
//        val width = (stroke.boundingPoints[1].x - stroke.boundingPoints[0].x).toInt()
//        val height = (stroke.boundingPoints[1].y - stroke.boundingPoints[0].y).toInt()
//        var mBitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
//        canvasSelection = Canvas(mBitmap)
//        val borderPaint = Paint().apply {
//            color = ResourcesCompat.getColor(context.resources, R.color.red, null)
//            isAntiAlias = true
//            isDither = true
//            style = Paint.Style.STROKE
//            strokeJoin = Paint.Join.ROUND
//            strokeCap = Paint.Cap.ROUND
//            strokeWidth = 5f
//        }
//        val upcomingPaint = Paint().apply {
//            color = stroke.color
//            strokeWidth = stroke.strokeWidth
//            isAntiAlias = true
//            // Dithering affects how colors with higher-precision than the device are down-sampled.
//            isDither = true
//            style = Paint.Style.STROKE // default: FILL
//            strokeJoin = Paint.Join.ROUND // default: MITER
//            strokeCap = Paint.Cap.ROUND // default: BUTT
//        }
//        canvasSelection!!.drawRect(0f,0f, width.toFloat(), height.toFloat(),borderPaint )
//        path!!.lineTo(5F, 5F)
//        canvasSelection!!.drawPath(path!!, upcomingPaint!!)
//        path!!.reset()
//        return canvasSelection as Canvas
//    }

}

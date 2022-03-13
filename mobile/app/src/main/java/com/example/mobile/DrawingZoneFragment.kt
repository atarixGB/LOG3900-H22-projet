package com.example.mobile

import android.content.Context
import android.graphics.*
import android.os.Bundle
import android.util.AttributeSet
import android.util.Log
import android.view.*
import android.widget.LinearLayout
import androidx.core.content.res.ResourcesCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Observer
import com.example.mobile.Interface.IPencilStroke
import com.example.mobile.Tools.ToolManager
import com.example.mobile.Tools.ToolbarFragment
import com.example.mobile.model.ToolModel
import com.example.mobile.model.ToolParameters
import io.socket.emitter.Emitter
import org.json.JSONArray
import org.json.JSONObject

class DrawingZoneFragment : Fragment() {
    private lateinit var mDrawingView: DrawingView
    private val viewModel: ToolParameters by activityViewModels()
    private val toolModel: ToolModel by activityViewModels()
    var socket = DrawingCollaboration()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_drawing_zone, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        mDrawingView = DrawingView(requireContext(),this.socket)
        socket.init()
        socket.socket.on("receiveStroke", onReceiveStroke)
        viewModel.weight.observe(viewLifecycleOwner, Observer { weight ->
            mDrawingView.changeWeight(weight)
        })
        viewModel.color.observe(viewLifecycleOwner, Observer { color ->
            mDrawingView.changeColor(color)
        })
        toolModel.tool.observe(viewLifecycleOwner, Observer { tool ->
            mDrawingView.changeTool(tool)
        })

        view.findViewById<LinearLayout>(R.id.drawingView).addView(mDrawingView)
    }
    private var onReceiveStroke = Emitter.Listener {
        val drawEvent = it[0] as JSONObject

        var boundingPoints = ArrayList<Point>()
        val boundingPointsData = drawEvent["boundingPoints"] as JSONArray
        for (i in 0 until boundingPointsData.length()) {
            val obj = boundingPointsData[i] as JSONObject
            boundingPoints.add(Point(obj["x"] as Int, obj["x"] as Int))
        }

        var points = ArrayList<Point>()
        val pointsData = drawEvent["points"] as JSONArray
        for (i in 0 until pointsData.length() ) {
            val obj = pointsData[i] as JSONObject
            points.add(Point(obj["x"] as Int, obj["x"] as Int))
        }
        val stroke = IPencilStroke(boundingPoints,1, 1f,points   )
        mDrawingView!!.onStrokeReceive(stroke)
    }

    class DrawingView (context: Context, val socket: DrawingCollaboration) : View(context){
        private lateinit var toolManager: ToolManager
        private var mPaint: Paint? = null
        private var mBitmap: Bitmap? = null
        private var mCanvas: Canvas? = null
        private var isDrawing = false

        fun onStrokeReceive(stroke: IPencilStroke){
            toolManager.currentTool.onStrokeReceive(stroke)
            invalidate()
        }

        override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
            super.onSizeChanged(w, h, oldw, oldh)
            mBitmap = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888)
            mCanvas = Canvas(mBitmap!!)
            val borderPaint = Paint().apply {
                color = ResourcesCompat.getColor(context.resources, R.color.black, null)
                isAntiAlias = true
                isDither = true
                style = Paint.Style.STROKE
                strokeJoin = Paint.Join.ROUND
                strokeCap = Paint.Cap.ROUND
                strokeWidth = 1f
            }
            mCanvas!!.drawRect(0f,0f, w.toFloat(), h.toFloat(),borderPaint )
            toolManager = ToolManager(context, mCanvas!!, this.socket)
        }

        override fun onDraw(canvas: Canvas) {
            super.onDraw(canvas)
            canvas.drawBitmap(mBitmap!!, 0f, 0f, mPaint)
            if (isDrawing) {
                toolManager.currentTool.onDraw(canvas)
            }
        }

        private fun resetPath() {
            toolManager.currentTool.path = Path()

        }

        override fun onTouchEvent(event: MotionEvent): Boolean {
            toolManager.currentTool.mx = event.x
            toolManager.currentTool.my = event.y

            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    isDrawing = true
                    toolManager.currentTool.touchStart()
                    invalidate()
                }
                MotionEvent.ACTION_MOVE ->{
                    toolManager.currentTool.touchMove()
                    invalidate()
                }
                MotionEvent.ACTION_UP -> {
                    isDrawing = false
                    toolManager.currentTool.touchUp()
                    invalidate()
                }
            }
            return true
        }
        fun changeWeight(width : Float){
            if(this::toolManager.isInitialized) toolManager.currentTool.changeWeight(width)
        }
        fun changeColor(color : Int){
            if(this::toolManager.isInitialized) {
                if(!toolManager.isCurrentToolEraser()){
                    toolManager.currentTool.changeColor(color)
                }
            }
        }

        fun changeTool(tool: ToolbarFragment.MenuItem){
            if(this::toolManager.isInitialized) {
                this.toolManager.changeTool(tool)
                resetPath()
            }
        }
    }
}
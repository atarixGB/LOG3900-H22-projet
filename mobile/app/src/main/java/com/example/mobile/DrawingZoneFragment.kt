package com.example.mobile

import android.content.Context
import android.graphics.*
import android.os.Bundle
import android.util.AttributeSet
import android.view.*
import androidx.core.content.res.ResourcesCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Observer
import com.example.mobile.model.ToolModel
import com.example.mobile.model.ToolWeight

class DrawingZoneFragment : Fragment() {
    private var mDrawingView: DrawingView? = null
    private val viewModel: ToolWeight by activityViewModels()
    private val toolModel: ToolModel by activityViewModels()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_drawing_zone, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val mDrawingView = view.findViewById<View>(R.id.drawingView) as DrawingView
        viewModel.weight.observe(viewLifecycleOwner, Observer { weight ->
            mDrawingView.changeWeight(weight)
        })
        toolModel.tool.observe(viewLifecycleOwner, Observer { tool ->
            mDrawingView.changeTool(tool)
        })
    }
    class DrawingView @JvmOverloads constructor(
        context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
    ) : View(context, attrs, defStyleAttr) {
        private lateinit var toolManager: ToolManager

        private var mPaint: Paint? = null
        private var mBitmap: Bitmap? = null
        private var mCanvas: Canvas? = null
        private var isDrawing = false


        override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
            super.onSizeChanged(w, h, oldw, oldh)
            mBitmap = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888)
            mCanvas = Canvas(mBitmap!!)
            toolManager = ToolManager(context, mCanvas!!)
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

        fun changeTool(tool: ToolbarFragment.MenuItem){
            if(this::toolManager.isInitialized) {
                this.toolManager.changeTool(tool)
                resetPath()
            }
        }
    }
}
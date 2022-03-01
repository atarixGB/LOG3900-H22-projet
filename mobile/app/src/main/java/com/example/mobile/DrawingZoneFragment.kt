package com.example.mobile

import android.content.Context
import android.graphics.*
import android.os.Bundle
import android.view.*
import androidx.fragment.app.Fragment
import android.widget.LinearLayout
import androidx.core.content.res.ResourcesCompat
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Observer
import com.example.mobile.model.ToolModel
import com.example.mobile.model.ToolWeight

class DrawingZoneFragment : Fragment() {
    lateinit var canvasView: MyCanvasView
    private val viewModel: ToolWeight by activityViewModels()
    private val toolModel: ToolModel by activityViewModels()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_drawing_zone, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        canvasView = MyCanvasView(requireContext())
        view.findViewById<LinearLayout>(R.id.canvas).addView(canvasView)
        viewModel.weight.observe(viewLifecycleOwner, Observer { weight ->
            canvasView.changeWeight(weight)
        })
        toolModel.tool.observe(viewLifecycleOwner, Observer { tool ->
            canvasView.changeTool(tool)
        })
    }


    /**
     * Custom view that follows touch events to draw on a canvas.
     * This code was inspired by Google Developers Training team. https://developer.android.com/codelabs/advanced-android-kotlin-training-canvas#0
     */
    class MyCanvasView(context: Context) : View(context) {

        // Holds the path you are currently drawing.
        private val drawColor = ResourcesCompat.getColor(resources, R.color.black, null)
        private val backgroundColor = ResourcesCompat.getColor(resources, R.color.white, null)
        private lateinit var extraCanvas: Canvas
        private lateinit var extraBitmap: Bitmap
        private lateinit var frame: Rect
        private lateinit var toolManager: ToolManager
        // Set up the paint with which to draw.
        private val paint = Paint().apply {
            color = drawColor
            // Smooths out edges of what is drawn without affecting shape.
            isAntiAlias = true
            // Dithering affects how colors with higher-precision than the device are down-sampled.
            isDither = true
            style = Paint.Style.STROKE // default: FILL
            strokeJoin = Paint.Join.ROUND // default: MITER
            strokeCap = Paint.Cap.ROUND // default: BUTT
            strokeWidth = 1f // default: Hairline-width (really thin)
        }

        /**
         * Don't draw every single pixel.
         * If the finger has has moved less than this distance, don't draw. scaledTouchSlop, returns
         * the distance in pixels a touch can wander before we think the user is scrolling.
         */
        /**
         * Called whenever the view changes size.
         * Since the view starts out with no size, this is also called after
         * the view has been inflated and has a valid size.
         */
        override fun onSizeChanged(width: Int, height: Int, oldWidth: Int, oldHeight: Int) {
            super.onSizeChanged(width, height, oldWidth, oldHeight)

            if (::extraBitmap.isInitialized) extraBitmap.recycle()
            extraBitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
            extraCanvas = Canvas(extraBitmap)
            extraCanvas.drawColor(backgroundColor)
            toolManager = ToolManager(context, extraCanvas)

            // Calculate a rectangular frame around the picture.
            val inset = 1
            frame = Rect(inset, inset, width - inset, height - inset)

            // Draw a frame around the canva
            val paintBorder = Paint().apply {
                color = drawColor
                // Smooths out edges of what is drawn without affecting shape.
                isAntiAlias = true
                // Dithering affects how colors with higher-precision than the device are down-sampled.
                isDither = true
                style = Paint.Style.STROKE // default: FILL
                strokeJoin = Paint.Join.ROUND // default: MITER
                strokeCap = Paint.Cap.ROUND // default: BUTT
                strokeWidth = 1f // default: Hairline-width (really thin)
            }
            extraCanvas.drawRect(frame, paintBorder)
        }

        override fun onDraw(canvas: Canvas) {
            // Draw the bitmap that has the saved path.
            canvas.drawBitmap(extraBitmap, 0f, 0f, null)
        }

        /**
         * No need to call and implement MyCanvasView#performClick, because MyCanvasView custom view
         * does not handle click actions.
         */
        override fun onTouchEvent(event: MotionEvent): Boolean {
            this.toolManager.currentTool.motionTouchEventX = event.x
            this.toolManager.currentTool.motionTouchEventY = event.y

            when (event.action) {
                MotionEvent.ACTION_DOWN -> touchStart()
                MotionEvent.ACTION_MOVE -> touchMove()
                MotionEvent.ACTION_UP -> touchUp()
            }
            return true
        }

        /**
         * The following methods factor out what happens for different touch events,
         * as determined by the onTouchEvent() when statement.
         * This keeps the when conditional block
         * concise and makes it easier to change what happens for each event.
         * No need to call invalidate because we are not drawing anything.
         */
        private fun touchStart() {
            this.toolManager.currentTool.touchstart()
        }

        private fun touchMove() {
            this.toolManager.currentTool.touchMove()
            invalidate()
        }



        private fun touchUp() {
            this.toolManager.currentTool.touchUp()
        }

        fun changeWeight(width : Float){
            if(this::toolManager.isInitialized) toolManager.currentTool.changeWeight(width)
        }

        fun changeTool(tool : String){
            if(this::toolManager.isInitialized) this.toolManager.changeTool(tool)
        }
    }
}
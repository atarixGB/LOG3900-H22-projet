package com.example.mobile.activity.drawing

import android.content.Context
import android.graphics.*
import android.media.MediaPlayer
import android.os.Bundle
import android.util.Log
import android.view.*
import android.widget.LinearLayout
import android.widget.Toast
import androidx.core.content.res.ResourcesCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Observer
import com.example.mobile.Interface.IDrawing
import com.example.mobile.Interface.IVec2
import com.example.mobile.R
import com.example.mobile.Tools.ToolManager
import io.socket.emitter.Emitter
import org.json.JSONObject
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.adapter.DrawingAdapter
import com.example.mobile.bitmapDecoder
import com.example.mobile.convertBitmapToByteArray
import com.example.mobile.viewModel.ToolModel
import com.example.mobile.viewModel.ToolParameters
import com.example.mobile.viewModel.SharedViewModelToolBar
import io.reactivex.disposables.CompositeDisposable
import okhttp3.*
import retrofit2.Call
import retrofit2.Response
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileOutputStream

class DrawingZoneFragment : Fragment() {
    private lateinit var mDrawingView: DrawingView
    private val toolParameters: ToolParameters by activityViewModels()
    private val toolModel: ToolModel by activityViewModels()
    var socket = DrawingCollaboration()
    private val sharedViewModelToolBar: SharedViewModelToolBar by activityViewModels()

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
        socket.socket.on("receiveSelection", onReceiveSelection)
        socket.socket.on("receiveStrokeWidth", onReceiveStrokeWidth)
        socket.socket.on("receiveNewPrimaryColor", onReceiveNewPrimaryColor)
        socket.socket.on("receivePasteRequest", onPasteRequest)
        socket.socket.on("receiveDeleteRequest", onDeleteRequest)
        socket.socket.on("receiveSelectionPos", onMoveRequest)

        toolParameters.weight.observe(viewLifecycleOwner, Observer { weight ->
            mDrawingView.changeWeight(weight)
        })
        toolParameters.color.observe(viewLifecycleOwner, Observer { color ->
            mDrawingView.changeColor(color)
        })
        toolParameters.isStroke.observe(viewLifecycleOwner, Observer { isStroke ->
            mDrawingView.changeStroke(isStroke)
        })

        toolParameters.deleteSelection.observe(viewLifecycleOwner, Observer { deleteSelection ->
            mDrawingView.deleteSelection(deleteSelection)
        })
        toolModel.tool.observe(viewLifecycleOwner, Observer { tool ->
            mDrawingView.changeTool(tool)
        })

        sharedViewModelToolBar.drawingId.observe(viewLifecycleOwner, Observer { drawingId ->
            mDrawingView.setDrawingId(drawingId)
        })

        sharedViewModelToolBar.collabDrawingId.observe(viewLifecycleOwner, Observer { collabDrawingId ->
            mDrawingView.setDrawingId(collabDrawingId)
            mDrawingView.displayDrawingCollab(collabDrawingId)
        })

        toolModel.onClick.observe(viewLifecycleOwner, Observer { onClick ->
            mDrawingView.saveImg()
        })

        view.findViewById<LinearLayout>(R.id.drawingView).addView(mDrawingView)
    }

    private var onReceiveStroke = Emitter.Listener {
        val drawEvent = it[0] as JSONObject
        if(drawEvent.getString("sender") != this.socket.socket.id()){
            mDrawingView.onStrokeReceive(drawEvent)
        }

    }

    private var onReceiveSelection = Emitter.Listener {
        val drawEvent = it[0] as JSONObject
        mDrawingView.onSelectionReceive(drawEvent)
    }

    private var onReceiveStrokeWidth = Emitter.Listener {
        val drawEvent = it[0] as JSONObject
        mDrawingView.onSelectionReceiveWidth(drawEvent)
    }

    private var onReceiveNewPrimaryColor = Emitter.Listener {
        val drawEvent = it[0] as JSONObject
        mDrawingView.onSelectionReceivePrimaryColor (drawEvent)
    }

    private var onPasteRequest = Emitter.Listener {
        val drawEvent = it[0] as JSONObject
        mDrawingView.onPasteRequest (drawEvent)
    }

    private var onDeleteRequest = Emitter.Listener {
        val drawEvent = it[0] as JSONObject
        mDrawingView.onDeleteRequest (drawEvent)
    }

    private var onMoveRequest = Emitter.Listener {
        val drawEvent = it[0] as JSONObject
        mDrawingView.onMoveRequest (drawEvent)
    }

    class DrawingView (context: Context, val socket: DrawingCollaboration) : View(context){
        private lateinit var toolManager: ToolManager
        private var mPaint: Paint? = null
        private var mBitmap: Bitmap? = null
        private var mCanvas: Canvas? = null
        private var isDrawing = false
        private var drawingId: String = ""
        private var currentDrawingBitmap: Bitmap? = null
        internal var compositeDisposable = CompositeDisposable()

        fun onStrokeReceive(stroke: JSONObject){
            if (socket.socket.id() != stroke.getString("sender")) {
                if (stroke.getInt("toolType") == 0) {
                    toolManager.pencil.onStrokeReceived(stroke)
                } else if (stroke.getInt("toolType") == 1) {
                    toolManager.rectangle.onStrokeReceived(stroke)
                } else if (stroke.getInt("toolType") == 2) {
                    toolManager.ellipse.onStrokeReceived(stroke)
                }
                invalidate()
            }
        }

        fun onSelectionReceive(stroke: JSONObject){
            if (socket.socket.id() != stroke.getString("sender")) {
                toolManager.selection.onStrokeReceived(stroke)
                invalidate()
            }
        }

        fun onSelectionReceiveWidth(newWidth: JSONObject){
            if (socket.socket.id() != newWidth.getString("sender")) {
                val width = newWidth.getInt("value").toFloat()
                val strokeIndex = newWidth.getInt("strokeIndex")
                toolManager.selection.changeReceivedWidth(newWidth.getString("sender"), width, strokeIndex)
                invalidate()
            }
        }

        fun onSelectionReceivePrimaryColor(newColor: JSONObject){
            if (socket.socket.id() != newColor.getString("sender")) {
                val color = toolManager.currentTool.toIntColor(newColor.getString("color"))
                val strokeIndex = newColor.getInt("strokeIndex")
                toolManager.selection.changeReceivedColor(newColor.getString("sender"), color, strokeIndex)
                invalidate()
            }
        }

        fun onPasteRequest(stroke: JSONObject){
            if (socket.socket.id() != stroke.getString("sender")) {
                val strokeIndex = stroke.getInt("strokeIndex")
                toolManager.selection.onPasteRequest(stroke.getString("sender"), strokeIndex)
                invalidate()
            }
        }

        fun onDeleteRequest(stroke: JSONObject){
            if (socket.socket.id() != stroke.getString("sender")) {
                val strokeIndex = stroke.getInt("strokeIndex")
                toolManager.selection.onDeleteRequest(stroke.getString("sender"),strokeIndex)
                invalidate()
            }
        }

        fun onMoveRequest(stroke: JSONObject){
            if (socket.socket.id() != stroke.getString("sender")) {
                var obj = stroke["pos"] as JSONObject
                val pos = IVec2(obj.getDouble("x").toFloat(), obj.getDouble("y").toFloat())
                toolManager.selection.onMoveRequest(stroke.getString("sender"), pos)
                invalidate()
            }
        }

        override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
            super.onSizeChanged(w, h, oldw, oldh)
            mBitmap = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888)
            //if the size of the canva fragment is 750dpx500dp, onsizechanged w= 1125px x 735
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
            toolManager = ToolManager(context, mCanvas!!, this.socket, drawingId)
        }

        override fun onDraw(canvas: Canvas) {
            super.onDraw(canvas)
            canvas.drawBitmap(mBitmap!!, 0f, 0f, mPaint)
            //var mediaPlayerDrawing: MediaPlayer = MediaPlayer.create(context,R.raw.draw)

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
                    if (toolManager.currentTool.nextTool != ToolbarFragment.MenuItem.SELECTION) {
                        this.toolManager.changeTool(toolManager.currentTool.nextTool)
                        resetPath()
                        toolManager.currentTool.mx = event.x
                        toolManager.currentTool.my = event.y
                        toolManager.currentTool.touchStart()
                    }
                    if (currentDrawingBitmap != null) {
                        mCanvas!!.drawBitmap(currentDrawingBitmap!!, 0F, 0F, null)
                    }
                    invalidate()


                }
                MotionEvent.ACTION_MOVE -> {
                    toolManager.currentTool.touchMove()
                    if (currentDrawingBitmap != null) {
                        mCanvas!!.drawBitmap(currentDrawingBitmap!!, 0F, 0F, null)
                    }
                    invalidate()
//                    mediaPlayerDrawing.stop()
                }
                MotionEvent.ACTION_UP -> {
                    isDrawing = false
                    toolManager.currentTool.touchUp()
                    this.toolManager.changeTool(toolManager.currentTool.nextTool)
                    resetPath()
                    if (currentDrawingBitmap != null) {
                        mCanvas!!.drawBitmap(currentDrawingBitmap!!, 0F, 0F, null)
                    }
                    invalidate()
//                    mediaPlayerDrawing.stop()
                }
            }
            return true
        }

        fun changeWeight(width: Float) {
            if (this::toolManager.isInitialized) {
                toolManager.currentTool.changeWeight(width)

                if(toolManager.isCurrentToolSelection()) {
                    toolManager.selection.changeSelectionWeight(width)
                }
            }
            if (currentDrawingBitmap != null) {
                mCanvas!!.drawBitmap(currentDrawingBitmap!!, 0F, 0F, null)
            }
        }

        fun changeColor(color: Int) {
            if (this::toolManager.isInitialized) {
                toolManager.currentTool.changeColor(color)
                if(toolManager.isCurrentToolSelection()) {
                    toolManager.selection.changeSelectionColor(color)
                }
            }
            if (currentDrawingBitmap != null) {
                mCanvas!!.drawBitmap(currentDrawingBitmap!!, 0F, 0F, null)
            }
        }

        fun changeTool(tool: ToolbarFragment.MenuItem) {
            if (this::toolManager.isInitialized) {
                this.toolManager.changeTool(tool)
                resetPath()
                toolManager.selection.sendPasteSelection()
                toolManager.selection.resetSelection()
                if (tool == ToolbarFragment.MenuItem.SELECTION) {
                    toolManager.selection.isToolSelection = true
                }
            }
            if (currentDrawingBitmap != null) {
                mCanvas!!.drawBitmap(currentDrawingBitmap!!, 0F, 0F, null)
            }
        }

        fun deleteSelection (delete: Boolean) {
            if (this::toolManager.isInitialized && delete) {
                toolManager.selection.deleteStroke()
            }
            if (currentDrawingBitmap != null) {
                mCanvas!!.drawBitmap(currentDrawingBitmap!!, 0F, 0F, null)
            }
        }

        fun setDrawingId(drawingId: String) {
            this.drawingId = drawingId
        }

        fun saveImg() {

            if (mBitmap != null) {
                val retrofit = RetrofitClient.getInstance()
                val myService = retrofit.create(IMyService::class.java)

                var filesDir: File = context.filesDir;
                var file = File(filesDir, "image" + ".png")

                var bos: ByteArrayOutputStream = ByteArrayOutputStream();
                mBitmap!!.compress(Bitmap.CompressFormat.PNG, 0, bos);
                var bitmapdata: ByteArray = convertBitmapToByteArray(mBitmap!!)

                var fos: FileOutputStream = FileOutputStream(file);
                fos.write(bitmapdata);
                fos.flush();
                fos.close();

                var reqFile: RequestBody = RequestBody.create(MediaType.parse("image/*"), file)
                var body: MultipartBody.Part =
                    MultipartBody.Part.createFormData("upload", file.name, reqFile)

                var name: RequestBody = RequestBody.create(MediaType.parse("text/plain"), "upload");

                var call = myService.saveDrawing(drawingId, body, name)
                call.enqueue(object : retrofit2.Callback<ResponseBody> {
                    override fun onResponse(
                        call: Call<ResponseBody>,
                        response: Response<ResponseBody>
                    ) {
                        Toast.makeText(context, "image sauvegardée", Toast.LENGTH_SHORT).show();
                    }

                    override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                        Toast.makeText(context, "erreur", Toast.LENGTH_SHORT).show()
                    }
                })
            }
        }

        fun displayDrawingCollab(drawingId: String) {
            val retrofit = RetrofitClient.getInstance()
            val myService = retrofit.create(IMyService::class.java)

            var call: Call<IDrawing> = myService.getDrawingData(drawingId)
            call.enqueue(object : retrofit2.Callback<IDrawing> {

                override fun onResponse(call: Call<IDrawing>, response: Response<IDrawing>) {
                    if (response.body() != null) {
                        currentDrawingBitmap = bitmapDecoder(response.body()!!.data)
                        //mBitmap = bitmapDecoder(currentDrawing!!.data)
                        mCanvas!!.drawBitmap(currentDrawingBitmap!!, 0F, 0F, null)
                    }
                }

                override fun onFailure(call: Call<IDrawing>, t: Throwable) {
                    Log.d("Albums", "onFailure" + t.message)
                }
            })
        }

        fun changeStroke(stroke: Boolean) {
            if (this::toolManager.isInitialized) {
                toolManager.currentTool.isStrokeSelected= stroke
            }
        }
    }
}
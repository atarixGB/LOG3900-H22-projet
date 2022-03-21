package com.example.mobile

import android.content.Context
import android.graphics.*
import android.os.Bundle
import android.util.Log
import android.view.*
import android.widget.LinearLayout
import android.widget.Toast
import androidx.core.content.res.ResourcesCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Observer
import com.example.mobile.Tools.ToolManager
import com.example.mobile.Tools.ToolbarFragment
import io.socket.emitter.Emitter
import org.json.JSONObject
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
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
    private val viewModel: ToolParameters by activityViewModels()
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
        viewModel.weight.observe(viewLifecycleOwner, Observer { weight ->
            mDrawingView.changeWeight(weight)
        })
        viewModel.color.observe(viewLifecycleOwner, Observer { color ->
            mDrawingView.changeColor(color)
        })
        toolModel.tool.observe(viewLifecycleOwner, Observer { tool ->
            mDrawingView.changeTool(tool)
        })

        sharedViewModelToolBar.drawingId.observe(viewLifecycleOwner, Observer { drawingId ->
            mDrawingView.setDrawingId(drawingId)
        })

        toolModel.onClick.observe(viewLifecycleOwner, Observer { onClick ->
            mDrawingView.saveImg()
        })

        view.findViewById<LinearLayout>(R.id.drawingView).addView(mDrawingView)
    }
    private var onReceiveStroke = Emitter.Listener {
        val drawEvent = it[0] as JSONObject
        mDrawingView.onStrokeReceive(drawEvent)
    }

    class DrawingView (context: Context, val socket: DrawingCollaboration) : View(context){
        private lateinit var toolManager: ToolManager
        private var mPaint: Paint? = null
        private var mBitmap: Bitmap? = null
        private var mCanvas: Canvas? = null
        private var isDrawing = false
        private lateinit var drawingId: String


        private lateinit var iMyService: IMyService
        internal var compositeDisposable = CompositeDisposable()
        private var filePath: String = ""

        fun onStrokeReceive(stroke: JSONObject){
            Log.d("ici", "allo")
            if(stroke.getInt("toolType") == 0){
                toolManager.pencil.onStrokeReceived(stroke)
            }else if(stroke.getInt("toolType") == 1){
                toolManager.rectangle.onStrokeReceived(stroke)
            }
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
                MotionEvent.ACTION_MOVE -> {
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

        fun changeWeight(width: Float) {
            if (this::toolManager.isInitialized) {
                toolManager.currentTool.changeWeight(width)

                if(toolManager.isCurrentToolSelection()) {
                    toolManager.selection.changeSelectionWeight(width)
                }
            }
        }

        fun changeColor(color: Int) {
            if (this::toolManager.isInitialized) {
                if (!toolManager.isCurrentToolEraser()) {
                    toolManager.currentTool.changeColor(color)
                }
                if(toolManager.isCurrentToolSelection()) {
                    toolManager.selection.changeSelectionColor(color)
                }
            }
        }

        fun changeTool(tool: ToolbarFragment.MenuItem) {
            if (this::toolManager.isInitialized) {
                this.toolManager.changeTool(tool)
                resetPath()
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
    }
}
package com.example.mobile

import android.content.Context
import android.graphics.*
import android.os.Bundle
import android.os.Environment
import android.util.AttributeSet
import android.util.Base64
import android.view.*
import android.widget.Toast
import androidx.activity.viewModels
import androidx.core.content.res.ResourcesCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Observer
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.model.ToolModel
import com.example.mobile.model.ToolParameters
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import okhttp3.*
import retrofit2.Call
import retrofit2.Response
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileOutputStream

class DrawingZoneFragment : Fragment() {
    private var mDrawingView: DrawingView? = null
    private val viewModel: ToolParameters by activityViewModels()
    private val toolModel: ToolModel by activityViewModels()
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
        val mDrawingView = view.findViewById<View>(R.id.drawingView) as DrawingView
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

    }

    class DrawingView @JvmOverloads constructor(
        context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
    ) : View(context, attrs, defStyleAttr) {
        private lateinit var toolManager: ToolManager

        private var mPaint: Paint? = null
        private var mBitmap: Bitmap? = null
        private var mCanvas: Canvas? = null
        private var isDrawing = false
        private lateinit var drawingId : String


        private lateinit var iMyService: IMyService
        internal var compositeDisposable = CompositeDisposable()
        private var filePath: String = ""


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

        fun setDrawingId(drawingId: String){
            this.drawingId = drawingId
        }

        fun saveImg() {
//            val retrofit = RetrofitClient.getInstance()
//            iMyService = retrofit.create(IMyService::class.java)

//            if (mBitmap != null) {
//                var drawingByteArray: ByteArray = convertToByteArray(mBitmap!!)
//                var drawing_str: String = Base64.encodeToString(drawingByteArray, 0)
//                compositeDisposable.add(iMyService.saveDrawing(drawingId, drawing_str)
//                    .subscribeOn(Schedulers.io())
//                    .observeOn(AndroidSchedulers.mainThread())
//                    .subscribe { result ->
//                        if (result == "201") {
//                            Toast.makeText(context, "l'image a ete sauvegarder", Toast.LENGTH_SHORT).show()
//                        } else {
//                            Toast.makeText(context, "erreur", Toast.LENGTH_SHORT).show()
//                        }
//                    })
//            }

            //tuto :
            if (mBitmap != null) {
                //create a file to write bitmap data
//                var file: File? = null
//                file = File(
//                    Environment.getExternalStorageDirectory().toString() + File.separator + filePath
//                )
//                file.createNewFile()
//
//                var drawingByteArray: ByteArray = convertToByteArray(mBitmap!!)
//                var drawing_str: String = Base64.encodeToString(drawingByteArray, 0)
//
//                //write the bytes in file
//                val fos = FileOutputStream(file)
//                fos.write(drawingByteArray)
//                fos.flush()
//                fos.close()
//                file

                //var file = File(filePath)
                //file.writeBytes(drawingByteArray)
//                var requestBody: RequestBody = RequestBody.create(MediaType.parse("image/*"), file)
//                var parts: MultipartBody.Part =
//                    MultipartBody.Part.createFormData("newimage", file.name, requestBody)


                val retrofit = RetrofitClient.getInstance()
                val myService = retrofit.create(IMyService::class.java)

                //another tuto
                    var filesDir: File = context.filesDir;
                    var file = File(filesDir, "image" + ".png")

                    var bos: ByteArrayOutputStream = ByteArrayOutputStream();
                    mBitmap!!.compress(Bitmap.CompressFormat.PNG, 0, bos);
                    var bitmapdata: ByteArray = convertToByteArray(mBitmap!!)


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

        fun convertToByteArray(bitmap: Bitmap): ByteArray {
            val stream = ByteArrayOutputStream()
            bitmap.compress(Bitmap.CompressFormat.PNG, 90, stream)
            return stream.toByteArray()
        }
    }
}
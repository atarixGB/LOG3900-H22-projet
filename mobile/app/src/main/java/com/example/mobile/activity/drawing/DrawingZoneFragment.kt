package com.example.mobile.activity.drawing

import android.content.Context
import android.graphics.*
import android.os.Bundle
import android.util.Log
import android.view.*
import android.widget.Button
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.Toast
import androidx.core.content.res.ResourcesCompat
import androidx.core.view.isVisible
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Observer
import com.example.mobile.ISDRAFT
import com.example.mobile.Interface.IDrawing
import com.example.mobile.Interface.IVec2
import com.example.mobile.R
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.Tools.ToolManager
import com.example.mobile.bitmapDecoder
import com.example.mobile.convertBitmapToByteArray
import com.example.mobile.popup.PrepForMemberLeavingPopUp
import com.example.mobile.popup.PrepForNewMemberPopUp
import com.example.mobile.viewModel.ToolModel
import com.example.mobile.viewModel.ToolParameters

import kotlinx.android.synthetic.main.activity_drawings_collection.view.*
import kotlinx.android.synthetic.main.fragment_custom_tool.view.*


import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import com.google.gson.Gson
import io.socket.emitter.Emitter
import com.example.mobile.viewModel.SharedViewModelToolBar
import okhttp3.*
import org.json.JSONArray
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Response
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileOutputStream

class DrawingZoneFragment : Fragment() {
    private lateinit var mDrawingView: DrawingView
    private val toolParameters: ToolParameters by activityViewModels()
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

        mDrawingView = DrawingView(requireContext(), DrawingSocket)
        DrawingSocket.socket.on("receiveStroke", onReceiveStroke)
        DrawingSocket.socket.on("receiveSelection", onReceiveSelection)
        DrawingSocket.socket.on("receiveStrokeWidth", onReceiveStrokeWidth)
        DrawingSocket.socket.on("receiveNewPrimaryColor", onReceiveNewPrimaryColor)
        DrawingSocket.socket.on("receivePasteRequest", onPasteRequest)
        DrawingSocket.socket.on("receiveDeleteRequest", onDeleteRequest)
        DrawingSocket.socket.on("receiveSelectionPos", onMoveRequest)
        DrawingSocket.socket.on("receiveSelectionSize", onResizeRequest)

        DrawingSocket.socket.on("prepForNewMember", onPrepForNewMember)
        DrawingSocket.socket.on("fetchStrokes", onFetchStrokes)

//        DrawingSocket.socket.on("joinSuccessful", onLoadCurrentSessionData)

        DrawingSocket.socket.on("memberLeft", onMemberLeaving)


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

        toolParameters.pasteSelection.observe(viewLifecycleOwner, Observer { pasteSelection ->
            mDrawingView.pasteSelection(pasteSelection)
        })

        toolModel.tool.observe(viewLifecycleOwner, Observer { tool ->
            mDrawingView.changeTool(tool)
        })

        sharedViewModelToolBar.drawingId.observe(viewLifecycleOwner, Observer { drawingId ->
            mDrawingView.setDrawingId(drawingId)
        })

        sharedViewModelToolBar.collabDrawingId.observe(
            viewLifecycleOwner,
            Observer { collabDrawingId ->
                mDrawingView.setDrawingId(collabDrawingId)
                mDrawingView.displayDrawingCollab(collabDrawingId)
            })

        sharedViewModelToolBar.jsonString.observe(viewLifecycleOwner, Observer { jsonString ->
            mDrawingView.onLoadCurrentStrokeData(jsonString)
        })

        toolModel.onClick.observe(viewLifecycleOwner, Observer { onClick ->
            mDrawingView.saveImg()
        })

        toolModel.onStory.observe(viewLifecycleOwner, Observer { onStory ->
            mDrawingView.putToStory()
        })

        toolModel.img.observe(viewLifecycleOwner, Observer { img ->
            mDrawingView.putPictureCameraOnCanvas(img)
        })

        view.findViewById<LinearLayout>(R.id.drawingView).addView(mDrawingView)
    }

    private var onReceiveStroke = Emitter.Listener {
        val drawEvent = it[0] as JSONObject
        if(drawEvent.getString("sender") != DrawingSocket.socket.id()){
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

    private var onResizeRequest = Emitter.Listener {
        val drawEvent = it[0] as JSONObject
        mDrawingView.onResizeRequest (drawEvent)
    }

    private var onPrepForNewMember = Emitter.Listener {
        val userJoined = it[0] as String
        //Open Popup Window
        val fragment = (context as FragmentActivity).supportFragmentManager
        var dialog = PrepForNewMemberPopUp(userJoined)
        try {
            dialog.show(fragment, "customDialog")
        } catch (ignored: IllegalStateException ) {}
        mDrawingView.onPrepForNewMember()
    }

    private var onFetchStrokes = Emitter.Listener {
        if (!ISDRAFT) {
            mDrawingView.updateCollabInfos()
        }
    }

//    private var onLoadCurrentSessionData= Emitter.Listener {
//        /* let roomData = {
//          members: [socket.id],
//          strokes: [],
//        };*/
//        val joinEvent = it[0] as JSONObject
//        val jsonStrokes = joinEvent["strokes"] as JSONArray
//        for (i in 0 until jsonStrokes.length()) {
//            val obj = jsonStrokes[i] as JSONObject
//            mDrawingView.onStrokeReceive(obj)
//        }
//    }

    private var onMemberLeaving = Emitter.Listener {
        val userLeft = it[0] as String
        //Open Popup Window
        val fragment = (context as FragmentActivity).supportFragmentManager
        var dialog = PrepForMemberLeavingPopUp(userLeft)
        try {
            dialog.show(fragment, "customDialog")
        } catch (ignored: IllegalStateException ) {}
        mDrawingView.onPrepForNewMember()
    }


    class DrawingView (context: Context, val socket: DrawingSocket) : View(context){
        private lateinit var toolManager: ToolManager
        private var mPaint: Paint? = null
        private var mBitmap: Bitmap? = null
        private var mCanvas: Canvas? = null
        private var isDrawing = false
        private var drawingId: String = ""
        private var jsonObjects= ArrayList<JSONObject>()
        private var currentDrawingBitmap: Bitmap? = null
        internal var compositeDisposable = CompositeDisposable()

        val retrofit = RetrofitClient.getInstance()
        val myService = retrofit.create(IMyService::class.java)

        fun onStrokeReceive(stroke: JSONObject) {
            if (this::toolManager.isInitialized) {
                if (stroke.getInt("toolType") == 0) {
                    toolManager.pencil.onStrokeReceived(stroke)
                } else if (stroke.getInt("toolType") == 1) {
                    toolManager.rectangle.onStrokeReceived(stroke)
                } else if (stroke.getInt("toolType") == 2) {
                    toolManager.ellipse.onStrokeReceived(stroke)
                }
                if (currentDrawingBitmap != null) {
                    mCanvas!!.drawBitmap(currentDrawingBitmap!!, 0F, 0F, null)
                }
                invalidate()
            }
        }

        fun onLoadCurrentStrokeData(jsonString: ArrayList<String>) {

            jsonString.forEachIndexed{ i, it ->
                var obj = JSONObject(jsonString[i])
                jsonObjects.add(obj)

//                this.onStrokeReceive(obj)
            }

//            for (i in 0 until jsonStrokes.length()) {
//                val obj = jsonStrokes[0.toString()]
////                val obj2 = gson.toJsonTree(obj)
//                val b =false
////                this.onStrokeReceive(obj2)
//            }
        }

        fun onSelectionReceive(stroke: JSONObject){
            if (socket.socket.id() != stroke.getString("sender")) {
                toolManager.selection.onStrokeReceived(stroke)
                if (currentDrawingBitmap != null) {
                    mCanvas!!.drawBitmap(currentDrawingBitmap!!, 0F, 0F, null)
                }
                invalidate()
            }
        }

        fun onSelectionReceiveWidth(newWidth: JSONObject){
            if (socket.socket.id() != newWidth.getString("sender")) {
                val width = newWidth.getInt("value").toFloat()
                val strokeIndex = newWidth.getInt("strokeIndex")
                toolManager.selection.changeReceivedWidth(newWidth.getString("sender"), width, strokeIndex)
                if (currentDrawingBitmap != null) {
                    mCanvas!!.drawBitmap(currentDrawingBitmap!!, 0F, 0F, null)
                }
                invalidate()
            }
        }

        fun onSelectionReceivePrimaryColor(newColor: JSONObject){
            if (socket.socket.id() != newColor.getString("sender")) {
                val color = toolManager.currentTool.toIntColor(newColor.getString("color"))
                val strokeIndex = newColor.getInt("strokeIndex")
                toolManager.selection.changeReceivedColor(newColor.getString("sender"), color, strokeIndex)
                if (currentDrawingBitmap != null) {
                    mCanvas!!.drawBitmap(currentDrawingBitmap!!, 0F, 0F, null)
                }
                invalidate()
            }
        }

        fun onPasteRequest(stroke: JSONObject){
            if (socket.socket.id() != stroke.getString("sender")) {
                val strokeIndex = stroke.getInt("strokeIndex")
                toolManager.selection.onPasteRequest(stroke.getString("sender"), strokeIndex)
                if (currentDrawingBitmap != null) {
                    mCanvas!!.drawBitmap(currentDrawingBitmap!!, 0F, 0F, null)
                }
                invalidate()
            }
        }

        fun onDeleteRequest(stroke: JSONObject){
            if (socket.socket.id() != stroke.getString("sender")) {
                val strokeIndex = stroke.getInt("strokeIndex")
                toolManager.selection.onDeleteRequest(stroke.getString("sender"),strokeIndex)
                if (currentDrawingBitmap != null) {
                    mCanvas!!.drawBitmap(currentDrawingBitmap!!, 0F, 0F, null)
                }
                invalidate()
            }
        }

        fun onMoveRequest(stroke: JSONObject){
            if (socket.socket.id() != stroke.getString("sender")) {
                var obj = stroke["pos"] as JSONObject
                val pos = IVec2(obj.getDouble("x").toFloat(), obj.getDouble("y").toFloat())
                toolManager.selection.onMoveRequest(stroke.getString("sender"), pos)
                if (currentDrawingBitmap != null) {
                    mCanvas!!.drawBitmap(currentDrawingBitmap!!, 0F, 0F, null)
                }
                invalidate()
            }
        }

        fun onResizeRequest(stroke: JSONObject) {
            val sender = stroke["sender"] as String
            val strokeIndex = stroke["strokeIndex"] as Int
            val newPosObj = stroke["newPos"] as JSONObject
            val newDimensionsObj = stroke["newDimensions"] as JSONObject
            val scaleObj = stroke["scale"] as JSONObject

            var newPos = IVec2(newPosObj.getDouble("x").toFloat(), newPosObj.getDouble("y").toFloat())
            var newDimensions = IVec2(newDimensionsObj.getDouble("x").toFloat(), newDimensionsObj.getDouble("y").toFloat())
            var scale = IVec2(scaleObj.getDouble("x").toFloat(), scaleObj.getDouble("y").toFloat())

            toolManager.selection.onResizeRequest(sender, strokeIndex, newPos, newDimensions, scale)
            if (currentDrawingBitmap != null) {
                mCanvas!!.drawBitmap(currentDrawingBitmap!!, 0F, 0F, null)
            }
            invalidate()
        }

        fun onPrepForNewMember(){
            if (this::toolManager.isInitialized) {
                resetPath()
//                toolManager.selection.sendPasteSelection()
                toolManager.selection.resetSelection()
                if (currentDrawingBitmap != null) {
                    mCanvas!!.drawBitmap(currentDrawingBitmap!!, 0F, 0F, null)
                }
                if (toolManager.selection.oldTool != null) {
                    toolManager.changeTool(toolManager.selection.oldTool!!)
                }
            }
        }

        fun updateCollabInfos() {
            var data = JSONObject()
            data.put("collabDrawingId", drawingId)
            var strokes = JSONArray()
            toolManager.selection.strokes.forEach {
                strokes.put(it.convertToObject())
            }
            data.put("strokes", strokes)

            DrawingSocket.socket.emit("updateCollabInfo", data )
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
            if (!jsonObjects.isNullOrEmpty()) {
                jsonObjects.forEachIndexed { i, it ->
                    onStrokeReceive(it)
                }
            }
        }


        override fun onDraw(canvas: Canvas) {
            super.onDraw(canvas)
            canvas.drawBitmap(mBitmap!!, 0f, 0f, mPaint)

            //selection bounding box button
//            val button1 = Button(context)
//            button1.layoutParams = LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT)
//
//            button1.setBackgroundColor(Color.RED)
//            button1.setText("hiiii")
//
//            val lay = findViewById<LinearLayout>(R.id.drawingView)
//            lay.addView(button1)


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
                if (tool == ToolbarFragment.MenuItem.SELECTION) {
                    toolManager.selection.isToolSelection = true
                }
                toolManager.selection.sendPasteSelection()
                toolManager.selection.resetSelection()
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

        fun pasteSelection (paste: Boolean) {
            if (this::toolManager.isInitialized && paste) {
                toolManager.selection.sendPasteSelection()
                toolManager.selection.resetSelection()
            }
            if (currentDrawingBitmap != null) {
                mCanvas!!.drawBitmap(currentDrawingBitmap!!, 0F, 0F, null)
            }
        }

        fun setDrawingId(drawingId: String) {
            this.drawingId = drawingId
            if (this::toolManager.isInitialized) {
                this.toolManager.drawingId = drawingId
                toolManager.pencil.drawingId = drawingId
                toolManager.ellipse.drawingId = drawingId
                toolManager.rectangle.drawingId = drawingId
            }
        }

        fun putToStory() {
            if (!this.drawingId.isNullOrEmpty() && mBitmap != null) {
                compositeDisposable.add(myService.addDrawingToStory(drawingId!!)
                    .subscribeOn(Schedulers.io())
                    .observeOn(AndroidSchedulers.mainThread())
                    .subscribe { result ->
                        if (result == "201") {
                            Toast.makeText(
                                context,
                                "Story ajoute avec succes",
                                Toast.LENGTH_SHORT
                            ).show()
                        } else {
                            Toast.makeText(context, "erreur", Toast.LENGTH_SHORT).show()
                        }
                    })
            }
        }

        fun putPictureCameraOnCanvas(img:Bitmap){
//            currentDrawingBitmap = img.copy(Bitmap.Config.ARGB_8888, true)
            currentDrawingBitmap = img

            mCanvas!!.drawBitmap(currentDrawingBitmap!!,0F,0F,null)

        }

        fun saveImg() {

            if (mBitmap != null) {
                if (this::toolManager.isInitialized) {
                    resetPath()
                    toolManager.selection.sendPasteSelection()
                    toolManager.selection.resetSelection()
                }

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

                var call = myService.saveDrawing(drawingId!!, body, name)
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

            // fetch the drawing for the db
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
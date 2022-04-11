package com.example.mobile.activity.drawing

import android.app.Activity
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.icu.text.SimpleDateFormat
import android.net.Uri
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.view.*
import android.widget.*
import androidx.core.content.FileProvider
import androidx.core.view.isVisible
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import com.example.mobile.ISDRAFT
import com.example.mobile.R
import com.example.mobile.REQUEST_IMAGE_CAMERA
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.Tools.ToolAdapter
import com.example.mobile.Tools.ToolItem
import com.example.mobile.activity.Dashboard
import com.example.mobile.activity.albums.Albums
import com.example.mobile.viewModel.SharedViewModelToolBar
import com.example.mobile.viewModel.ToolModel
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import kotlinx.android.synthetic.main.activity_profile.*
import kotlinx.android.synthetic.main.activity_registration.*
import kotlinx.android.synthetic.main.fragment_toolbar.*
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Response
import java.io.File
import java.io.IOException
import java.util.*
import kotlin.collections.ArrayList


class ToolbarFragment : Fragment(), AdapterView.OnItemClickListener {

    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()
    private var collabStartTime:Long =0
    private var gridView: GridView? = null
    private var arrayList:ArrayList<ToolItem> ? = null
    private var toolAdapter: ToolAdapter? = null
//    private var cameraPictureBitmap:Bitmap? = null
    private lateinit var user: String
    private var drawingId: String = ""
    private lateinit var saveDrawingBtn : Button
    private lateinit var addToStoryBtn : Button
    private lateinit var takePictureBtn : Button
    private lateinit var addToStoryText :TextView
    private lateinit var backBtn : Button
    private lateinit var _img: Bitmap
    private var totalCollabDuration:Long=0
//    var photoFile: File? = createImageFile()
    lateinit var currentPhotoPath: String
    private val toolChange: ToolModel by activityViewModels()
    private val sharedViewModel: SharedViewModelToolBar by activityViewModels()

    enum class MenuItem(val position: Int) {
        PENCIL(0),
        RECTANGLE(1),
        OVAL(2),

        SELECTION(3)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val rootView = inflater.inflate(R.layout.fragment_toolbar, container, false)
        saveDrawingBtn = rootView.findViewById(R.id.saveDrawingBtn)
        addToStoryBtn = rootView.findViewById(R.id.addToStoryBtn)
        addToStoryText=rootView.findViewById(R.id.addToStoryText)
        takePictureBtn=rootView.findViewById(R.id.takePictureBtn)
        backBtn = rootView.findViewById(R.id.backBtn)
        gridView = rootView.findViewById(R.id.weight_view)
        arrayList = ArrayList()
        arrayList  = setDataList()
        toolAdapter = ToolAdapter(activity?.baseContext!!, arrayList!!)
        gridView?.adapter = toolAdapter
        gridView?.onItemClickListener = this


        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        sharedViewModel.drawingId.observe(viewLifecycleOwner) {
            drawingId = it
        }

        sharedViewModel.collabDrawingId.observe(viewLifecycleOwner) {
            drawingId = it
        }
        sharedViewModel.user.observe(viewLifecycleOwner) {
            user = it
        }
        sharedViewModel.collabStartTime.observe(viewLifecycleOwner) {
            collabStartTime= it
        }

        if (!ISDRAFT){
            takePictureBtn.isVisible=false
            saveDrawingBtn.setOnClickListener {
                toolChange.onClick()
            }

            addToStoryBtn.setOnClickListener {
                toolChange.onStory()
            }

            backBtn.setOnClickListener {
                //enregistrer avant de quitter
                //tell server we leavin
                var roomData = JSONObject()
                roomData.put("room", drawingId)
                roomData.put("username", user)
                DrawingSocket.socket.emit("leaveCollab", roomData)

                //time when we are leaving the collab
                var leavingTime=Date().time

                toolChange.onClick()
                val intent = Intent(activity, Albums::class.java)
                intent.putExtra("userName", user)
                startActivity(intent)

                updateCollabStat(user,leavingTime)
                updateCollabCountStat(user)
            }
        }
        else{
            saveDrawingBtn.isVisible=false
            addToStoryBtn.isVisible=false
            addToStoryText.isVisible=false

            backBtn.setOnClickListener {
                val intent = Intent(activity, Dashboard::class.java)
                intent.putExtra("userName", user)
                startActivity(intent)
                ISDRAFT=false
            }

            takePictureBtn.setOnClickListener{
                val cInt = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
//                if(photoFile!=null){
//                    cInt.putExtra(MediaStore.EXTRA_OUTPUT, Uri.fromFile(photoFile))

                startActivityForResult(cInt, REQUEST_IMAGE_CAMERA)
//                }
//                dispatchTakePictureIntent()

            }

        }
        return rootView
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == REQUEST_IMAGE_CAMERA && resultCode == Activity.RESULT_OK && data != null) {

//           var filePath= photoFile?.path
//            var bitmap=BitmapFactory.decodeFile(filePath)
//            _img=bitmap
            _img=data.extras?.get("data") as Bitmap
            toolChange.changeImg(_img)
        } else if(resultCode==Activity.RESULT_CANCELED){
            Toast.makeText(activity, "Erreur capture", Toast.LENGTH_SHORT).show()
        }
    }

//    private fun dispatchTakePictureIntent() {
//        Intent(MediaStore.ACTION_IMAGE_CAPTURE).also { takePictureIntent ->
//            // Ensure that there's a camera activity to handle the intent
//            takePictureIntent.resolveActivity(requireActivity().packageManager).also {
//                // Create the File where the photo should go
//                val photoFile: File? = try {
//                    createImageFile()
//                } catch (ex: IOException) {
//                    // Error occurred while creating the File
//                    null
//                }
//                // Continue only if the File was successfully created
//                photoFile?.also {
//                    val photoURI: Uri = FileProvider.getUriForFile(
//                        requireContext(),
//                        "com.example.mobile.fileprovider",
//                        it
//                    )
//                    takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, photoURI)
//                    startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAMERA)
//                }
//            }
//        }
//    }

//    @Throws(IOException::class)
//    private fun createImageFile(): File {
//        // Create an image file name
//        val timeStamp: String = SimpleDateFormat("yyyyMMdd_HHmmss").format(Date())
//        val storageDir: File? = context?.getExternalFilesDir(Environment.DIRECTORY_PICTURES)
//        return File.createTempFile(
//            "JPEG_${timeStamp}_", /* prefix */
//            ".jpg", /* suffix */
//            storageDir /* directory */
//        ).apply {
//            // Save a file: path for use with ACTION_VIEW intents
//            currentPhotoPath = absolutePath
//        }
//    }
    private fun setDataList():ArrayList<ToolItem>{
        val arrayList:ArrayList<ToolItem> = ArrayList()
        arrayList.add(ToolItem(R.drawable.pencil_clicked))
        arrayList.add(ToolItem(R.drawable.rectangle))
        arrayList.add(ToolItem(R.drawable.circle))
        arrayList.add(ToolItem(R.drawable.select))
        return arrayList
    }

    override fun onItemClick(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
        arrayList!!.set(MenuItem.PENCIL.position, ToolItem(R.drawable.pencil))
        arrayList!!.set(MenuItem.RECTANGLE.position, ToolItem(R.drawable.rectangle))
        arrayList!!.set(MenuItem.OVAL.position, ToolItem(R.drawable.circle))
        arrayList!!.set(MenuItem.SELECTION.position, ToolItem(R.drawable.select))
        if(position == MenuItem.PENCIL.position){
            arrayList!!.set(MenuItem.PENCIL.position, ToolItem(R.drawable.pencil_clicked))
            toolChange.changeTool(MenuItem.PENCIL)
        }else if(position== MenuItem.RECTANGLE.position){
            arrayList!!.set(MenuItem.RECTANGLE.position, ToolItem(R.drawable.rectangle_clicked))
            toolChange.changeTool(MenuItem.RECTANGLE)

        } else if(position== MenuItem.OVAL.position){
            arrayList!!.set(MenuItem.OVAL.position, ToolItem(R.drawable.circle_clicked))
            toolChange.changeTool(MenuItem.OVAL)

        }
        else if(position== MenuItem.SELECTION.position){
            arrayList!!.set(MenuItem.SELECTION.position, ToolItem(R.drawable.select_clicked))
            toolChange.changeTool(MenuItem.SELECTION)

        }
        toolAdapter!!.notifyDataSetChanged()
    }

    fun updateCollabStat(username:String, leavingTime:Long){
        var secondsSpentInCollab = Math.round(((leavingTime-collabStartTime)/1000).toDouble())
//        getTotalDurationCollabUnformated(user)
        totalCollabDuration+=secondsSpentInCollab
        compositeDisposable.add(iMyService.updateCollabDurationStat(username, totalCollabDuration)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe { result ->
                if (result == "201") {
                    Toast.makeText(
                        context,
                        "les données 1 de collaboration ont été mis à jour avec succès",
                        Toast.LENGTH_SHORT
                    ).show()
                } else {
                    Toast.makeText(context, "erreur màj durée de collaboration", Toast.LENGTH_SHORT).show()
                }
            })
    }

    private fun updateCollabCountStat(username:String){

        compositeDisposable.add(iMyService.updateCollabCountStat(username)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe { result ->
                if (result == "201") {
                    Toast.makeText(
                        context,
                        "les données de collaboration ont été mis à jour avec succès",
                        Toast.LENGTH_SHORT
                    ).show()
                } else {
                    Toast.makeText(context, "erreur màj nombre de collaboration", Toast.LENGTH_SHORT).show()
                }
            })
    }

//    private fun getTotalDurationCollabUnformated(username:String){
//        var call: Call<Any> = iMyService.getTotalDurationCollabUnformated(username)
//
//        call.enqueue(object: retrofit2.Callback<Any> {
//            override fun onResponse(call: Call<Any>, response: Response<Any>) {
//
//                if(response.body()!=null){
//                    totalCollabDuration= response.body() as Long
//
//
//                }
//                else {
//                    totalCollabDuration=0
//                }
//            }
//            override fun onFailure(call: Call<Any>, t: Throwable) {
//                Toast.makeText(context, "erreur duree total introuvable", Toast.LENGTH_SHORT).show()
//            }
//        })
//    }


}
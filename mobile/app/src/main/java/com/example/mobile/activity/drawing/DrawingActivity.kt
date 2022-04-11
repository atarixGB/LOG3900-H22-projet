package com.example.mobile.activity.drawing

import android.app.AlertDialog
import android.app.Dialog
import android.content.DialogInterface
import android.content.Intent
import android.content.pm.PackageManager
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.TextView
import android.provider.MediaStore
import androidx.activity.viewModels
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.example.mobile.ISDRAFT
import androidx.fragment.app.DialogFragment
import com.example.mobile.Interface.IDrawing
import com.example.mobile.R
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.adapter.AlbumAdapter
import com.example.mobile.adapter.DrawingAdapter
import com.example.mobile.popup.CreateDrawingPopUp
import com.example.mobile.popup.PrepForMemberLeavingPopUp
import com.example.mobile.popup.PrepForNewMemberPopUp
import com.example.mobile.viewModel.SharedViewModelCreateDrawingPopUp
import com.example.mobile.viewModel.SharedViewModelToolBar
import io.reactivex.disposables.CompositeDisposable
import io.socket.emitter.Emitter
import kotlinx.android.synthetic.main.activity_drawing.*
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Response

class DrawingActivity : AppCompatActivity(), CreateDrawingPopUp.DialogListener, AlbumAdapter.AlbumAdapterListener {
    private lateinit var user: String
    private lateinit var collabDrawingId: String
    private var collabStartTime: Long = 0
    private lateinit var jsonString: ArrayList<String>
    private var isAlbumAlreadySelected: Boolean = false
    private lateinit var albumName: String
    private lateinit var albumID: String
    private lateinit var drawingName: String
    private lateinit var location: TextView
    private val sharedViewModelToolBar: SharedViewModelToolBar by viewModels()
    private val sharedViewModelCreateDrawingPopUp: SharedViewModelCreateDrawingPopUp by viewModels()

    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_drawing)

        user = intent.getStringExtra("userName").toString()
        isAlbumAlreadySelected = intent.getBooleanExtra("albumAlreadySelected", false)

        //check album
        if (isAlbumAlreadySelected) {
            albumName = intent.getStringExtra("albumName").toString()
            albumID = intent.getStringExtra("albumID").toString()
            sharedViewModelCreateDrawingPopUp.setAlbum(albumName, albumID)
        }
        sharedViewModelToolBar.setUser(user)
        location = findViewById(R.id.locationText)


        //collaboration
        collabDrawingId = intent.getStringExtra("drawingCollabId").toString()
        collabStartTime = intent.getLongExtra("collabStartTime", collabStartTime)

        //location of drawing
        locationText.text = intent.getStringExtra("drawingLocation").toString()
//        locationText.text="rien a dire"


//        jsonString = intent.getStringArrayExtra("jsonString").toString()

        sharedViewModelToolBar.setUser(user)
        sharedViewModelToolBar.setCollabStartTime(collabStartTime)


        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)


        if(!ISDRAFT){
            if (collabDrawingId == "null") {
                //Open Popup Window
                var dialog = CreateDrawingPopUp(user, isAlbumAlreadySelected)
                dialog.show(supportFragmentManager, "customDialog")
            } else {//room already exists
                DrawingSocket.socket.emit("joinCollabChat", collabDrawingId)
                sharedViewModelToolBar.setCollabDrawingId(collabDrawingId)
                getDrawingLocation(collabDrawingId)
                val bundle = intent.extras
                jsonString = bundle!!.getStringArrayList("jsonString") as ArrayList<String>
                sharedViewModelToolBar.setJsonString(jsonString)
            }
        } else {
            val builder = androidx.appcompat.app.AlertDialog.Builder(this)
            builder.setTitle("Bienvenue dans le mode brouillon!")
            builder.setMessage("Dans ce mode, rien n'est sauvegardé et il n'y a pas de collaboration.")
            builder.setNegativeButton("Continuer") { dialog, which ->
                dialog.dismiss()
            }
            val dialog: androidx.appcompat.app.AlertDialog = builder.create()
            dialog.show()
        }
    }

    override fun albumAdapterListener(albumName: String, albumID: String) {
        this.albumName = albumName
        sharedViewModelCreateDrawingPopUp.setAlbum(albumName, albumID)
    }

    override fun popUpListener(albumName: String, drawingName: String, drawingId: String, location: String) {
        this.albumName = albumName
        this.drawingName = drawingName
        this.location.text = location
    }

    override fun drawingIdPopUpListener(drawingId: String) {
        sharedViewModelToolBar.setDrawingId(drawingId)
        var jo = JSONObject()
        jo.put("room", drawingId)
        jo.put("username", user)
        DrawingSocket.socket.emit("joinCollab", jo)
    }

    private fun getDrawingLocation(drawingId: String) {
        var call: Call<IDrawing> = iMyService.getDrawingData(drawingId)
        call.enqueue(object: retrofit2.Callback<IDrawing> {

            override fun onResponse(call: Call<IDrawing>, response: Response<IDrawing>) {
                val currentDrawing = response.body()
                if(currentDrawing!!.location != "")
                    locationText.text = currentDrawing!!.location
                else
                    locationText.text = "Localisation non disponible"
            }

            override fun onFailure(call: Call<IDrawing>, t: Throwable) {
                Log.d("Albums", "onFailure" +t.message )
            }
        })
    }
}
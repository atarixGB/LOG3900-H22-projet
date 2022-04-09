package com.example.mobile.activity.drawing

import android.app.AlertDialog
import android.app.Dialog
import android.content.DialogInterface
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.activity.viewModels
import androidx.fragment.app.DialogFragment
import com.example.mobile.R
import com.example.mobile.adapter.AlbumAdapter
import com.example.mobile.popup.CreateDrawingPopUp
import com.example.mobile.popup.PrepForMemberLeavingPopUp
import com.example.mobile.popup.PrepForNewMemberPopUp
import com.example.mobile.viewModel.SharedViewModelCreateDrawingPopUp
import com.example.mobile.viewModel.SharedViewModelToolBar
import io.socket.emitter.Emitter
import org.json.JSONObject

class DrawingActivity : AppCompatActivity(), CreateDrawingPopUp.DialogListener, AlbumAdapter.AlbumAdapterListener {
    private lateinit var user: String
    private lateinit var collabDrawingId: String
    private lateinit var jsonString: ArrayList<String>
    private var isAlbumAlreadySelected: Boolean = false
    private lateinit var albumName: String
    private lateinit var albumID: String
    private lateinit var drawingName: String
    private val sharedViewModelToolBar: SharedViewModelToolBar by viewModels()
    private val sharedViewModelCreateDrawingPopUp: SharedViewModelCreateDrawingPopUp by viewModels()

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

        //collaboration
        collabDrawingId = intent.getStringExtra("drawingCollabId").toString()
//        sharedViewModelToolBar.setDrawingId(collabDrawingId)
        sharedViewModelToolBar.setUser(user)

        if (collabDrawingId == "null") {
            //Open Popup Window
            var dialog = CreateDrawingPopUp(user, isAlbumAlreadySelected)
            dialog.show(supportFragmentManager, "customDialog")
        } else {
            // drawing already exists
            sharedViewModelToolBar.setCollabDrawingId(collabDrawingId)
            val bundle = intent.extras
            jsonString = bundle!!.getStringArrayList("jsonString") as ArrayList<String>
            sharedViewModelToolBar.setJsonString(jsonString)
        }
    }

    override fun albumAdapterListener(albumName: String, albumID: String) {
        this.albumName = albumName
        sharedViewModelCreateDrawingPopUp.setAlbum(albumName, albumID)
    }

    override fun popUpListener(albumName: String, drawingName: String, drawingId: String) {
        this.albumName = albumName
        this.drawingName = drawingName
    }

    override fun drawingIdPopUpListener(drawingId: String) {
        sharedViewModelToolBar.setDrawingId(drawingId)
        var jo = JSONObject()
        jo.put("room", drawingId)
        jo.put("username", user)
        DrawingSocket.socket.emit("joinCollab", jo)
    }
}
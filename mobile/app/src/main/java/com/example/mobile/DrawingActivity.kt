package com.example.mobile

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.activity.viewModels
import java.util.ArrayList

class DrawingActivity : AppCompatActivity(), CreateDrawingPopUp.DialogListener, AlbumAdapter.AlbumAdapterListener {
    private lateinit var user: String
    private lateinit var albumName: String
    private lateinit var drawingName: String
    private val sharedViewModelToolBar: SharedViewModelToolBar by viewModels()
    private val sharedViewModelCreateDrawingPopUp: SharedViewModelCreateDrawingPopUp by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_drawing)

        user = intent.getStringExtra("userName").toString()
        sharedViewModelToolBar.setUser(user)

        //Open Popup Window
        var dialog = CreateDrawingPopUp(user)
        dialog.show(supportFragmentManager, "customDialog")
    }

    override fun albumAdapterListener(
        albumName: String,
        albumsMembers: ArrayList<String>,
        albumOwner: String
    ) {
        this.albumName = albumName
        sharedViewModelCreateDrawingPopUp.setAlbum(albumName)
    }

    override fun popUpListener(albumName: String, drawingName: String) {
        this.albumName = albumName
        this.drawingName = drawingName
    }
}
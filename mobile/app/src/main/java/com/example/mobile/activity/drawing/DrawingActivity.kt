package com.example.mobile.activity.drawing

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.activity.viewModels
import com.example.mobile.R
import com.example.mobile.adapter.AlbumAdapter
import com.example.mobile.popup.CreateDrawingPopUp
import com.example.mobile.viewModel.SharedViewModelCreateDrawingPopUp
import com.example.mobile.viewModel.SharedViewModelToolBar

class DrawingActivity : AppCompatActivity(), CreateDrawingPopUp.DialogListener, AlbumAdapter.AlbumAdapterListener {
    private lateinit var user: String
    private var isAlbumAlreadySelected: Boolean = false
    private lateinit var albumName: String
    private lateinit var drawingName: String
    private val sharedViewModelToolBar: SharedViewModelToolBar by viewModels()
    private val sharedViewModelCreateDrawingPopUp: SharedViewModelCreateDrawingPopUp by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_drawing)

        user = intent.getStringExtra("userName").toString()
        isAlbumAlreadySelected = intent.getBooleanExtra("albumAlreadySelected", false)
        if (isAlbumAlreadySelected) {
            albumName = intent.getStringExtra("albumName").toString()
            sharedViewModelCreateDrawingPopUp.setAlbum(albumName)
        }
        sharedViewModelToolBar.setUser(user)

        //Open Popup Window
        var dialog = CreateDrawingPopUp(user, isAlbumAlreadySelected)
        dialog.show(supportFragmentManager, "customDialog")
    }

    override fun albumAdapterListener(albumName: String) {
        this.albumName = albumName
        sharedViewModelCreateDrawingPopUp.setAlbum(albumName)
    }

    override fun popUpListener(albumName: String, drawingName: String, drawingId: String) {
        this.albumName = albumName
        this.drawingName = drawingName
    }

    override fun drawingIdPopUpListener(drawingId: String) {
        sharedViewModelToolBar.setDrawingId(drawingId)
    }
}
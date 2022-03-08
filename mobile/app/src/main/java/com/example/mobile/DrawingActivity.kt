package com.example.mobile

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle

class DrawingActivity : AppCompatActivity(), CreateDrawingPopUp.DialogListener, AlbumAdapter.AlbumAdapterListener {
    private lateinit var user: String
    private lateinit var albumName: String
    private lateinit var drawingName: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_drawing)

        user = intent.getStringExtra("userName").toString()

        //Open Popup Window
        var dialog = CreateDrawingPopUp(user)
        dialog.show(supportFragmentManager, "customDialog")
    }

    override fun albumAdapterListener(albumName: String) {
        this.albumName = albumName
    }

    override fun popUpListener(albumName: String, drawingName: String) {
        this.albumName = albumName
        this.drawingName = drawingName
    }
}
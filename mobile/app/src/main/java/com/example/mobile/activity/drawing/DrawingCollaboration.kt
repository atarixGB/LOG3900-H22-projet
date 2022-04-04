package com.example.mobile.activity.drawing

import android.provider.SyncStateContract
import io.socket.client.IO

class DrawingCollaboration {
    val port = "http://10.0.2.2:3002/"
//    val port = "https://polygram-app.herokuapp.com/"
    var socket = IO.socket(port)

    fun init() {
        socket.connect()
    }
}
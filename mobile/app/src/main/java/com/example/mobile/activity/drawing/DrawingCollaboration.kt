package com.example.mobile.activity.drawing

import android.provider.SyncStateContract
import io.socket.client.IO

class DrawingCollaboration {
    val port = "http://10.0.2.2:3001/"
    var socket = IO.socket(port)

    fun init() {
        socket.connect()
    }
}
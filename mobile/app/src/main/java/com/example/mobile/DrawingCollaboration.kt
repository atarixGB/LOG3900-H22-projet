package com.example.mobile

import android.provider.SyncStateContract
import io.socket.client.IO

class DrawingCollaboration {

    var socket = IO.socket("http://10.0.2.2:3002/")

    fun init() {
        socket.connect()
    }
}
package com.example.mobile.activity.drawing

import android.provider.SyncStateContract
import io.socket.client.IO
import org.json.JSONObject

object DrawingSocket {
    //    val port = "http://10.0.2.2:3002/"
    val port = "https://polygram-app.herokuapp.com/"
    var socket = IO.socket(port)

    init {
        socket.connect()
    }

    fun prepForJoin(drawingId: String, username: String) {
        var data = JSONObject()
        data.put("room", drawingId)
        data.put("username", username)
        socket.emit("prepForJoin", data)
    }
}
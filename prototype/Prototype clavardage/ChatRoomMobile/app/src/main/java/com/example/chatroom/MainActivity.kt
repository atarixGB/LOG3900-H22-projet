package com.example.chatroom

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.util.Log
import org.json.JSONObject

class MainActivity : AppCompatActivity()  {

    private lateinit var identifiant: EditText
    private lateinit var loginBtn: Button
    private var isChatOpen: Boolean = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        identifiant = findViewById(R.id.edt_identifiant)
        loginBtn = findViewById(R.id.connect_btn)

        //Connect to the Server

        SocketHandler.setSocket()
        val socket = SocketHandler.getSocket()
        socket.connect()

        loginBtn.setOnClickListener {
            if (identifiant.text.toString().length > 0){
                if(!identifiant.text.toString().isNullOrBlank()){
                    socket.emit("newUser", identifiant.text.toString())
                }
            }

            //openChat()
        }
        socket.on("newUser"){ args ->

            if(args[0] != null && !isChatOpen && identifiant.text.toString().length > 0){
                openChat()
            }
        }
    }

    fun openChat(){
        isChatOpen = true
        val intent = Intent(this, ChatPage::class.java)
        intent.putExtra("userName",identifiant.text.toString())
        startActivity(intent)
    }
}
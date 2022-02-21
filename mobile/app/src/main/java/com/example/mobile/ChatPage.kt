package com.example.mobile

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import io.socket.client.Socket
import org.json.JSONObject
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

class ChatPage : AppCompatActivity() {
    private lateinit var rvOutputMsgs: RecyclerView
    private lateinit var  btnSend : Button
    private lateinit var leaveChatBtn: ImageButton
    private lateinit var  messageText : EditText
    private lateinit var msgAdapter: MessageAdapter
    private lateinit var messages : ArrayList<Message>
    private lateinit var user: String
    private lateinit var socket: Socket

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_chat_page)

        rvOutputMsgs = findViewById(R.id.rvOutputMsgs)
        btnSend = findViewById<Button>(R.id.btnSend)
        leaveChatBtn = findViewById<ImageButton>(R.id.leaveChat)
        messageText = findViewById<EditText>(R.id.msgText)
        user=intent.getStringExtra("userName").toString()
        messages = ArrayList()
        msgAdapter = MessageAdapter(this, messages, user)

        rvOutputMsgs.adapter = msgAdapter
        rvOutputMsgs.layoutManager = LinearLayoutManager(this)


        //Connect to the Server
        SocketHandler.setSocket()
        socket = SocketHandler.getSocket()
        socket.connect()
        var jo :JSONObject = JSONObject()

        btnSend.setOnClickListener{
            if(messageText.text.length > 0) {
                if(!messageText.text.isNullOrBlank() ) {
                    jo.put("userName", user)
                    jo.put("message", messageText.text.toString())
                    val current = LocalDateTime.now()
                    val formatter = DateTimeFormatter.ofPattern("HH:mm:ss")
                    val formatted = current.format(formatter)
                    jo.put("time", formatted)
                    socket.emit("message", jo)
                }
            }
        }

        leaveChatBtn.setOnClickListener {
            leaveChat()
        }

        socket.on("message"){ args ->

            if(args[0] != null){

                jo = args[0] as JSONObject
                val message = jo.get("message") as String
                val user = jo.get("userName") as String
                val time = jo.get("time") as String
                runOnUiThread{
                    val msg = Message(message, user, time)
                    msgAdapter.addMsg(msg)
                    msgAdapter.notifyItemInserted((rvOutputMsgs.adapter as MessageAdapter).itemCount)
                    rvOutputMsgs.scrollToPosition((rvOutputMsgs.adapter as MessageAdapter).itemCount-1)
                    messageText.text.clear()
                }
            }
        }
    }

    fun leaveChat(){
        val intent = Intent(this, MainActivity::class.java)
        socket.emit("disconnectUser", user.toString())
        SocketHandler.closeConnection()
        startActivity(intent)
    }

    override fun onStop() {
        super.onStop()
        leaveChat()
    }
}


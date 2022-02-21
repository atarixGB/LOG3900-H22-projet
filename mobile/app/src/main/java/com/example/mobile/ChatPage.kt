package com.example.mobile

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.PopupMenu
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
    private lateinit var roomNameView : TextView
    private lateinit var chatViewOptions: ImageButton
    private lateinit var roomName : String


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_chat_page)

        chatViewOptions = findViewById<ImageButton>(R.id.chatViewOptions)
        roomName = intent.getStringExtra("roomName").toString()
        roomNameView = findViewById(R.id.roomName)
        roomNameView.text = roomName.toString()

        rvOutputMsgs = findViewById(R.id.rvOutputMsgs)
        btnSend = findViewById<Button>(R.id.btnSend)
        leaveChatBtn = findViewById<ImageButton>(R.id.leaveChatBtn)
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
                    var messageData : JSONObject = JSONObject()
                    messageData.put("userName", user)
                    messageData.put("message", messageText.text.toString())
                    val current = LocalDateTime.now()
                    val formatter = DateTimeFormatter.ofPattern("HH:mm:ss")
                    val formatted = current.format(formatter)
                    messageData.put("time", formatted)
                    messageData.put("room", roomName)
                    socket.emit("message", messageData)
                }
            }
        }


        leaveChatBtn.setOnClickListener {
            leaveChat()
        }

        socket.on("message"){ args ->

            if(args[0] != null){
                var messageData : JSONObject = JSONObject()
                messageData = args[0] as JSONObject
                val message = messageData.get("message") as String
                val user = messageData.get("userName") as String
                val time = messageData.get("time") as String
                val room = messageData.get("room") as String
                runOnUiThread{
                    val msg = Message(message, user, time, room)
                    msgAdapter.addMsg(msg)
                    msgAdapter.notifyItemInserted((rvOutputMsgs.adapter as MessageAdapter).itemCount)
                    rvOutputMsgs.scrollToPosition((rvOutputMsgs.adapter as MessageAdapter).itemCount-1)
                    messageText.text.clear()
                }
            }
        }

        socket.on("newUserToChatRoom"){ args ->
            if(args[0] != null){
                var messageData : JSONObject = JSONObject()
                messageData = args[0] as JSONObject
                val user = messageData.get("userName") as String
                val room = messageData.get("room") as String
                runOnUiThread{
                    val msg = Message(null, user, null, room)
                    msgAdapter.addMsg(msg)
                    msgAdapter.notifyItemInserted((rvOutputMsgs.adapter as MessageAdapter).itemCount)
                    rvOutputMsgs.scrollToPosition((rvOutputMsgs.adapter as MessageAdapter).itemCount-1)
                    messageText.text.clear()
                }
            }
        }

        //handle popup menu options
        chatViewOptions.setOnClickListener {
            val popupMenu = PopupMenu(
                this,
                chatViewOptions
            )
            popupMenu.setOnMenuItemClickListener { menuItem ->
                //get id of the item clicked and handle clicks
                when (menuItem.itemId) {
                    R.id.menu_members -> {
                        Toast.makeText(this, "Membres", Toast.LENGTH_LONG).show()
                        true
                    }
                    R.id.menu_leaveChat -> {
                        userLeftChat()
                        Toast.makeText(this, "Quitter", Toast.LENGTH_LONG).show()
                        true
                    }
                    R.id.menu_deleteChat -> {
                        Toast.makeText(this, "Supprimer", Toast.LENGTH_LONG).show()
                        true
                    }
                    else -> false
                }
            }
            popupMenu.inflate(R.menu.chatpage_options_menu)

            //to show icons for menu
            try {
                val fieldMPopup = PopupMenu::class.java.getDeclaredField("mPopup")
                fieldMPopup.isAccessible = true
                val mPopup = fieldMPopup.get(popupMenu)
                mPopup.javaClass.getDeclaredMethod("setForceShowIcon", Boolean::class.java).invoke(mPopup, true)
            } catch (e: Exception) {
                Log.e("ChatPage", "Error showing menu icons", e)
            } finally {
                popupMenu.show()
            }
        }
    }

    fun leaveChat(){
        val intent = Intent(this, ChatRooms::class.java)
        startActivity(intent)
    }

    /*override fun onStop() {
        super.onStop()
        leaveChat()
    }*/
    fun userLeftChat () {
        var roomData : JSONObject = JSONObject()
        roomData.put("userName", user)
        roomData.put("room", roomName)
        socket.emit("leaveRoom", roomData)
        leaveChat()
    }

}


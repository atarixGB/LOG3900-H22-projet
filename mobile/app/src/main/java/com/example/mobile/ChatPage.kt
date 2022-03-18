package com.example.mobile

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.PopupMenu
import androidx.core.view.isVisible
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.Room
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import io.socket.client.Socket
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

class ChatPage : AppCompatActivity(), UserAdapter.UserAdapterListener {
    private lateinit var rvOutputMsgs: RecyclerView
    private lateinit var  btnSend : Button
    private lateinit var leaveChatBtn: ImageButton
    private lateinit var drawButton: ImageButton
    private lateinit var  messageText : EditText
    private lateinit var msgAdapter: MessageAdapter
    private lateinit var messages : ArrayList<Message>
    private lateinit var user: String
    private lateinit var socket: Socket
    private lateinit var roomNameView : TextView
    private lateinit var chatViewOptions: ImageButton
    private lateinit var roomName : String
    private lateinit var room: Room

    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_chat_page)

        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        chatViewOptions = findViewById<ImageButton>(R.id.chatViewOptions)
        roomName = intent.getStringExtra("roomName").toString()
        roomNameView = findViewById(R.id.roomName)
        roomNameView.text = roomName.toString()

        if (roomName == "default-public-room") {
            chatViewOptions.isVisible = false
            roomNameView.text = "Canal Principal"
        } else {
            getRoomParameters()
        }

        rvOutputMsgs = findViewById(R.id.rvOutputMsgs)
        btnSend = findViewById<Button>(R.id.btnSend)
        leaveChatBtn = findViewById<ImageButton>(R.id.leaveChatBtn)
        drawButton = findViewById<ImageButton>(R.id.drawButton)
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
            if(messageText.text.isNotEmpty()) {
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

        drawButton.setOnClickListener {
            //A implementer: elle nous ramene a l'editeur du dessin
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
                    val msg = Message(message, user, time, room, false)
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
                   val msg = Message("$user has joined $room", user, null, room, true)
                    msgAdapter.addMsg(msg)
                    msgAdapter.notifyItemInserted((rvOutputMsgs.adapter as MessageAdapter).itemCount)
                    rvOutputMsgs.scrollToPosition((rvOutputMsgs.adapter as MessageAdapter).itemCount-1)
                    messageText.text.clear()
                }
            }
        }

        socket.on("userLeftChatRoom"){ args ->
            if(args[0] != null){
                var messageData : JSONObject = JSONObject()
                messageData = args[0] as JSONObject
                val user = messageData.get("userName") as String
                val room = messageData.get("room") as String
                runOnUiThread{
                    val msg = Message("$user has left $room", user, null, room, true)
                    msgAdapter.addMsg(msg)
                    msgAdapter.notifyItemInserted((rvOutputMsgs.adapter as MessageAdapter).itemCount)
                    rvOutputMsgs.scrollToPosition((rvOutputMsgs.adapter as MessageAdapter).itemCount-1)
                    messageText.text.clear()
                }
            }
        }

        socket.on("userDeletedChatRoom"){ args ->
            if(args[0] != null){
                val intent = Intent(this, ChatRooms::class.java)
                intent.putExtra("userName", user)
                startActivity(intent)
            }
        }

        //handle popup menu options
        chatViewOptions.setOnClickListener {
            if (roomName != "default-public-room") {
                getRoomParameters()
            }

            val popupMenu = PopupMenu(
                this,
                chatViewOptions
            )

            popupMenu.setOnMenuItemClickListener { menuItem ->
                //get id of the item clicked and handle clicks
                when (menuItem.itemId) {
                    R.id.menu_members -> {
                        //ouvrir le popup window des utilisateurs
                        var dialog = UsersListPopUp(room.roomName, room.usersList)
                        dialog.show(supportFragmentManager, "customDialog")
                        true
                    }
                    R.id.menu_leaveChat -> {
                        userLeftChat()
                        Toast.makeText(this, "Quitter", Toast.LENGTH_LONG).show()
                        true
                    }
                    R.id.menu_deleteChat -> {
                        deleteChatDB()
                        Toast.makeText(this, "Supprimer", Toast.LENGTH_LONG).show()
                        true
                    }
                    else -> false
                }
            }

            popupMenu.inflate(R.menu.chatpage_options_menu)

            if (user != room.identifier) {
                popupMenu.menu.findItem(R.id.menu_deleteChat).isVisible = false
            } else if (user == room.identifier){
                popupMenu.menu.findItem(R.id.menu_leaveChat).isVisible = false
            }

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
        intent.putExtra("userName", user)
        startActivity(intent)
    }

    fun userLeftChat () {
        var roomData : JSONObject = JSONObject()
        roomData.put("userName", user)
        roomData.put("room", roomName)
        socket.emit("leaveRoom", roomData)
        updateRooms(user, roomName)
        leaveChat()
    }

    private fun updateRooms(user: String, roomName: String) {
        compositeDisposable.add(iMyService.quitRoom(user, roomName)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe { result ->
                if (result == "201") {
                    Toast.makeText(this, "bye", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(this, "erreur", Toast.LENGTH_SHORT).show()
                }
            })
    }

    private fun deleteChat() {
        var roomData : JSONObject = JSONObject()
        roomData.put("userName", user)
        roomData.put("room", roomName)
        socket.emit("deleteRoom", roomData)
    }

    private fun deleteChatDB() {
        compositeDisposable.add(iMyService.deleteRoom(roomName)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe { result ->
                if (result == "201") {
                    Toast.makeText(this, "bye", Toast.LENGTH_SHORT).show()
                    deleteChat()
                } else {
                    Toast.makeText(this, "erreur", Toast.LENGTH_SHORT).show()
                }
            })
    }

    private fun getRoomParameters () {
        var call: Call<Room> = iMyService.getRoomParameters(roomName)
        call.enqueue(object: Callback<Room> {
            override fun onResponse(call: Call<Room>, response: Response<Room>) {
                room = response.body()!!
            }

            override fun onFailure(call: Call<Room>, t: Throwable) {
                Log.d("ChatPage", "onFailure" +t.message )
            }

        })
    }

    override fun userAdapterListener(userName: String) {
        TODO("Not yet implemented")
    }

}


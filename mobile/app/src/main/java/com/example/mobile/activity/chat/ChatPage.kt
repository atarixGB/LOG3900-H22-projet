package com.example.mobile.activity.chat

import android.content.Context
import android.content.Intent
import android.media.MediaPlayer
import android.os.Bundle
import android.util.Log
import android.view.KeyEvent
import android.widget.*
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.PopupMenu
import androidx.core.view.isVisible
import androidx.fragment.app.activityViewModels
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.IRoom
import com.example.mobile.Interface.IMessage
import com.example.mobile.R
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.SOUND_EFFECT
import com.example.mobile.SocketHandler
import com.example.mobile.adapter.MessageAdapter
import com.example.mobile.adapter.UserAdapter
import com.example.mobile.popup.UsersListPopUp
import com.example.mobile.viewModel.NotificationModel
import com.example.mobile.viewModel.SharedViewModelToolBar
import com.google.gson.Gson
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import io.socket.client.Socket
import kotlinx.android.synthetic.main.activity_profile.*
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.io.BufferedReader
import java.io.File
import java.io.FileInputStream
import java.io.InputStreamReader
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

class ChatPage : AppCompatActivity(), UserAdapter.UserAdapterListener {
    private lateinit var rvOutputMsgs: RecyclerView
    private lateinit var btnSend : Button
    private lateinit var leaveChatBtn: ImageButton
    private lateinit var drawButton: ImageButton
    private lateinit var messageText : EditText
    private lateinit var msgAdapter: MessageAdapter
    private lateinit var IMessages : ArrayList<IMessage>
    private lateinit var user: String
    private lateinit var socket: Socket
    private lateinit var roomNameView : TextView
    private lateinit var chatViewOptions: ImageButton
    private lateinit var roomName : String
    private lateinit var IRoom: IRoom

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

        messageText = findViewById<EditText>(R.id.msgText)
        user=intent.getStringExtra("userName").toString()
        IMessages = ArrayList()
        msgAdapter = MessageAdapter(this, IMessages, user)

        rvOutputMsgs.adapter = msgAdapter
        rvOutputMsgs.layoutManager = LinearLayoutManager(this)

        if(checkFileExist("$roomName.txt") && !checkIfFileEmpty("$roomName.txt")){
            readAllMessagesFromFile("$roomName.txt")
        }
        var mediaPlayerReceiveSuccess: MediaPlayer = MediaPlayer.create(baseContext,R.raw.receive)

        //Connect to the Server
        SocketHandler.setSocket()
        socket = SocketHandler.getSocket()
        socket.connect()

        var mediaPlayerHello:MediaPlayer = MediaPlayer.create(this,R.raw.hello)
        btnSend.setOnClickListener{
            sendTextMessage()
        }


        leaveChatBtn.setOnClickListener {
            leaveChat()
        }

        socket.on("message"){ args ->

            if(args[0] != null){
                var messageData = JSONObject()
                messageData = args[0] as JSONObject
                val message = messageData.get("message") as String
                val user = messageData.get("userName") as String
                val time = messageData.get("time") as String
                val room = messageData.get("room") as String
                val msg = IMessage(message, user, time, room, false)
                mediaPlayerReceiveSuccess.start()
                saveInFile(msg)
                printMessagesOnUI(msg)
            }
        }

        socket.on("newUserToChatRoom"){ args ->
            if(args[0] != null){
                var messageData : JSONObject = JSONObject()
                messageData = args[0] as JSONObject
                val user = messageData.get("userName") as String
                val room = messageData.get("room") as String
                runOnUiThread{
                   val msg = IMessage("$user has joined $room", user, "", room, true)
                    msgAdapter.addMsg(msg)
                    msgAdapter.notifyItemInserted((rvOutputMsgs.adapter as MessageAdapter).itemCount)
                    rvOutputMsgs.scrollToPosition((rvOutputMsgs.adapter as MessageAdapter).itemCount-1)
                    messageText.text.clear()
                    if(SOUND_EFFECT){
                        mediaPlayerHello.start()
                    }

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
                    val msg = IMessage("$user has left $room", user, "", room, true)
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
                        var dialog = UsersListPopUp(IRoom.roomName, IRoom.usersList, user)
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

            if (user != IRoom.identifier) {
                popupMenu.menu.findItem(R.id.menu_deleteChat).isVisible = false
            } else if (user == IRoom.identifier){
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

    private fun printMessagesOnUI(msg: IMessage) {
        runOnUiThread {
            msgAdapter.addMsg(msg)
            msgAdapter.notifyItemInserted((rvOutputMsgs.adapter as MessageAdapter).itemCount)
            rvOutputMsgs.scrollToPosition((rvOutputMsgs.adapter as MessageAdapter).itemCount - 1)
            messageText.text.clear()
        }
    }

    private fun checkFileExist(fileName: String): Boolean{
        val path = baseContext.getFilesDir().getParentFile().toString()+"/files/"+fileName
        var fileDisk = File(path)
        return fileDisk.exists()
    }
    private fun checkIfFileEmpty(fileName: String): Boolean{
        val fis: FileInputStream = baseContext.openFileInput(fileName)
        val isr = InputStreamReader(fis)
        val bufferedReader = BufferedReader(isr)
        var line: String?
        bufferedReader.readLine().also {
            line = it
            return line == ""
        }
    }

    private fun readAllMessagesFromFile(fileName : String) {
        val fis: FileInputStream = baseContext.openFileInput(fileName)
        val isr = InputStreamReader(fis)
        val bufferedReader = BufferedReader(isr)
        val sb = StringBuilder()
        var line: String?
        while (bufferedReader.readLine().also { line = it } != null) {
            sb.append(line)
        }
        val file = sb.toString()
        val split = file.split("//")
        for (message in split) {
            if (message.toString() != "") {
                val gson = Gson()
                var message = gson.fromJson(message, IMessage::class.java)
                Log.i("ChatPage", message.msgText)
                printMessagesOnUI(message)
            }
        }

    }

    private fun saveInFile(msg: IMessage) {
        try{
            var gson = Gson()
            var jsonString = gson.toJson(msg)
            baseContext.openFileOutput("$roomName.txt", Context.MODE_APPEND).use {
                it.write(jsonString.toByteArray())
                it.write(("//").toByteArray())
            }
        }catch (e:Exception){
            Log.d("ChatPage", "Erreur dans l'ecriture du fichier")
        }
    }

    private fun sendTextMessage() {
        if (messageText.text.isNotEmpty()) {
            if (!messageText.text.isNullOrBlank()) {
                var messageData: JSONObject = JSONObject()
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

    fun leaveChat(){
        socket.emit("userLeftChatPage", roomName)
        socket.disconnect()
        onBackPressed()
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
        var call: Call<IRoom> = iMyService.getRoomParameters(roomName)
        call.enqueue(object: Callback<IRoom> {
            override fun onResponse(call: Call<IRoom>, response: Response<IRoom>) {
                IRoom = response.body()!!
            }

            override fun onFailure(call: Call<IRoom>, t: Throwable) {
                Log.d("ChatPage", "onFailure" +t.message )
            }

        })
    }

    override fun userAdapterListener(userName: String) {
        TODO("Not yet implemented")
    }

    override fun onKeyUp(keyCode: Int, event: KeyEvent): Boolean {
        return when (keyCode) {
            KeyEvent.KEYCODE_ENTER -> {
                sendTextMessage()
                true
            }
            else -> super.onKeyUp(keyCode, event)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.i("tag", "destroy")
    }
}


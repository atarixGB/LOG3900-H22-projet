package com.example.mobile.activity.chat

import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.media.MediaPlayer
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.activity.viewModels
import androidx.core.view.get
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.IRoom
import com.example.mobile.Interface.IMessage
import com.example.mobile.R
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.SocketHandler
import com.example.mobile.adapter.MessageAdapter
import com.example.mobile.adapter.RoomAdapter
import com.example.mobile.popup.CreateRoomPopUp
import com.example.mobile.viewModel.NotificationModel
import com.example.mobile.viewModel.SharedViewModelToolBar
import com.google.gson.Gson
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import io.socket.client.Socket
import kotlinx.android.synthetic.main.fragment_custom_tool.view.*
import org.json.JSONArray
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Response
import java.util.ArrayList

class ChatRooms : AppCompatActivity(), CreateRoomPopUp.DialogListener, RoomAdapter.RoomAdapterListener {

    private lateinit var create_room_btn: Button
    private lateinit var join_room_btn: Button
    private lateinit var principal_room_btn: TextView
    private lateinit var rvOutputRooms: RecyclerView
    private lateinit var roomAdapter: RoomAdapter
    private lateinit var IRooms : ArrayList<IRoom>
    private lateinit var socket: Socket
    private lateinit var user: String
    private lateinit var roomName: String

    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()

    private val sharedViewModel: SharedViewModelToolBar by viewModels()
    private var openedChatPageName = ""



    override fun onStop() {
        compositeDisposable.clear()
        super.onStop()
    }


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_chat_rooms)

        create_room_btn = findViewById(R.id.create_room_btn)
        join_room_btn = findViewById(R.id.join_room_btn)
        principal_room_btn = findViewById(R.id.principal_room_btn)
        rvOutputRooms = findViewById(R.id.rvOutputRooms)

        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        IRooms = ArrayList()
        user = intent.getStringExtra("userName").toString()
        sharedViewModel.setUser(user)

        roomAdapter = RoomAdapter(this, IRooms, user)

        //Recycler View of rooms
        rvOutputRooms.adapter = roomAdapter
        rvOutputRooms.layoutManager = GridLayoutManager(this, 2)

        //Connect to the Server
        SocketHandler.setSocket()
        socket = SocketHandler.getSocket()
        socket.connect()

        getRooms()

        var mediaPlayerReceiveSuccess: MediaPlayer = MediaPlayer.create(baseContext,R.raw.receive)

        // TODO: ici tu dois parcourir la liste des rooms et trouver celle qui a le roomName qui est retournée par le observable
        // et mettre le isNotified à true

        create_room_btn.setOnClickListener {
            //Open Popup Window
            var dialog = CreateRoomPopUp()
            dialog.show(supportFragmentManager, "customDialog")
        }

        join_room_btn.setOnClickListener {
            joinRoom()
        }

        principal_room_btn.setOnClickListener {
            this.roomName = "default-public-room"
            var roomData: JSONObject = JSONObject()
            roomData.put("userName", user)
            roomData.put("room", this.roomName)
            socket.emit("joinRoom", roomData)
            openChat()
        }

        socket.on("newRoomCreated") { args ->
            if (args[0] != null) {
                var roomData: JSONObject = JSONObject()
                roomData = args[0] as JSONObject
                val roomName = roomData.get("room") as String
                val user = roomData.get("userName") as String
                val usersJsonArray = roomData.get("usersList") as JSONArray
                val usersList = ArrayList<String>()
                for (i: Int in 0 until usersJsonArray.length()) {
                    usersList.add(usersJsonArray.get(i).toString())
                }
                val room = IRoom("1", user, roomName, usersList, false)

                if (this.user == user) {
                    runOnUiThread {
                        roomAdapter.addRoom(room)
                        roomAdapter.notifyItemInserted((rvOutputRooms.adapter as RoomAdapter).itemCount)
                    }
                }
            }
        }

        socket.on("message") { args ->
            if (args[0] != null) {
                var messageData = JSONObject()
                messageData = args[0] as JSONObject
                val message = messageData.get("message") as String
                val user = messageData.get("userName") as String
                val time = messageData.get("time") as String
                val room = messageData.get("room") as String
                val msg = IMessage(message, user, time, room, false)
                if (room != openedChatPageName) {
                    mediaPlayerReceiveSuccess.start()
                    saveInFile(msg)
                    colorMessageRoom(messageData, user)
                }
            }
        }

        socket.on("userLeftChatPage") { args ->
            if (args[0] != null) {
                openedChatPageName = ""
            }
        }
    }

    private fun saveInFile(msg: IMessage) {
        try{
            var gson = Gson()
            var jsonString = gson.toJson(msg)
            baseContext.openFileOutput("${msg.room}.txt", Context.MODE_APPEND).use {
                it.write(jsonString.toByteArray())
                it.write(("//").toByteArray())
            }
        }catch (e:Exception){
            Log.d("ChatPage", "Erreur dans l'ecriture du fichier")
        }
    }

    fun openChat(){
        openedChatPageName = this.roomName
        val intent = Intent(this, ChatPage::class.java)
        intent.putExtra("userName",user)
        intent.putExtra("roomName", this.roomName)
        startActivity(intent)
    }

    fun joinRoom(){
        val intent = Intent(this, joinRoom::class.java)
        intent.putExtra("userName",user)
        startActivity(intent)
    }

    override fun popUpListener(roomName: String) {
        this.roomName = roomName
        var usersList = ArrayList<String>()
        usersList.add(user)
        createRoom(user,this.roomName, usersList)
    }

    override fun roomAdapterListener(roomName: String) {
        this.roomName = roomName
        var roomData : JSONObject = JSONObject()
        roomData.put("userName", user)
        roomData.put("room", roomName)
        socket.emit("joinRoom", roomData)
        openChat()
    }

    private fun createRoom(identifier: String, roomName: String, usersList: ArrayList<String>) {
        compositeDisposable.add(iMyService.createRoom(identifier, roomName, usersList)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe { result->
                if(result == "201"){
                    Toast.makeText(this,"creation faite avec succès", Toast.LENGTH_SHORT).show()
                    var usersJsonArray = JSONArray(Gson().toJson(usersList))
                    var roomData : JSONObject = JSONObject()
                    roomData.put("userName", user)
                    roomData.put("room", roomName)
                    roomData.put("usersList", usersJsonArray)
                    socket.emit("createRoom", roomData)
                }else{
                    Toast.makeText(this,"room déjà existante", Toast.LENGTH_SHORT).show()
                }
            })
    }

    private fun getRooms() {
        var call: Call<List<IRoom>> = iMyService.getAllRooms()
        call.enqueue(object: retrofit2.Callback<List<IRoom>> {

            override fun onResponse(call: Call<List<IRoom>>, response: Response<List<IRoom>>) {
                for (room in response.body()!!) {
                    if (room.usersList.contains(user)) {
                        roomAdapter.addRoom(room)
                        roomAdapter.notifyItemInserted((rvOutputRooms.adapter as RoomAdapter).itemCount)
                    }
                }
            }

            override fun onFailure(call: Call<List<IRoom>>, t: Throwable) {
                Log.d("ChatRooms", "onFailure" +t.message )
            }

        })

    }
    private fun colorMessageRoom(obj : JSONObject, user : String){
        var room = obj.getString("room")
        var inComingUser = obj.getString("userName")
        //only the one connected on this device receive the message
        if(inComingUser == user){
            for(r in IRooms){
                if(r.roomName == room){
                    r.isNotified = true
                    runOnUiThread {
                        roomAdapter.notifyDataSetChanged()
                    }
                }
            }
        }
    }



}


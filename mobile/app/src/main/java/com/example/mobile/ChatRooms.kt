package com.example.mobile

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.Toast
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.google.gson.Gson
import com.google.gson.JsonArray
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import io.socket.client.Socket
import org.json.JSONArray
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Response
import java.util.ArrayList

class ChatRooms : AppCompatActivity(), CreateRoomPopUp.DialogListener, RoomAdapter.RoomAdapterListener {

    private lateinit var create_room_btn: Button
    private lateinit var join_room_btn: Button
    private lateinit var principal_room_btn: Button
    private lateinit var rvOutputRooms: RecyclerView
    private lateinit var roomAdapter: RoomAdapter
    private lateinit var rooms : ArrayList<Room>
    private lateinit var socket: Socket
    private lateinit var user: String
    private lateinit var roomName: String

    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()

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

        rooms = ArrayList()
        user = intent.getStringExtra("userName").toString()

        roomAdapter = RoomAdapter(this, rooms, user)

        //Recycler View of rooms
        rvOutputRooms.adapter = roomAdapter
        rvOutputRooms.layoutManager = LinearLayoutManager(this)


        //Connect to the Server
        SocketHandler.setSocket()
        socket = SocketHandler.getSocket()
        socket.connect()

        getRooms()


        create_room_btn.setOnClickListener {
            //Open Popup Window
            var dialog = CreateRoomPopUp()
            dialog.show(supportFragmentManager, "customDialog")
        }

        join_room_btn.setOnClickListener {
            joinRoom()
        }

        principal_room_btn.setOnClickListener {
            this.roomName = principal_room_btn.text.toString()
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
                val room = Room("1", user, roomName, usersList)

                if (this.user == user) {
                    runOnUiThread {
                        roomAdapter.addRoom(room)
                        roomAdapter.notifyItemInserted((rvOutputRooms.adapter as RoomAdapter).itemCount)
                    }
                }
            }
        }
    }

    fun openChat(){
        //isChatOpen = true
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
        usersList.add("prob")
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
        var call: Call<List<Room>> = iMyService.getAllRooms()
        call.enqueue(object: retrofit2.Callback<List<Room>> {

            override fun onResponse(call: Call<List<Room>>, response: Response<List<Room>>) {
                for (room in response.body()!!) {
                    if (room.usersList.contains(user)) {
                        roomAdapter.addRoom(room)
                        roomAdapter.notifyItemInserted((rvOutputRooms.adapter as RoomAdapter).itemCount)
                    }
                }
            }

            override fun onFailure(call: Call<List<Room>>, t: Throwable) {
                Log.d("ChatRooms", "onFailure" +t.message )
            }

        })


    }
}


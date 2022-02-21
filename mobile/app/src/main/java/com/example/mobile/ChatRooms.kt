package com.example.mobile

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import io.socket.client.Socket
import org.json.JSONObject
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

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_chat_rooms)

        create_room_btn = findViewById(R.id.create_room_btn)
        join_room_btn = findViewById(R.id.join_room_btn)
        principal_room_btn = findViewById(R.id.principal_room_btn)
        rvOutputRooms = findViewById(R.id.rvOutputRooms)

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
            var roomData : JSONObject = JSONObject()
            roomData.put("userName", user)
            roomData.put("room", this.roomName)
            socket.emit("joinRoom", roomData)
            openChat()
        }

        socket.on("newRoomCreated"){ args ->
            if(args[0] != null) {
                var roomData: JSONObject = JSONObject()
                roomData = args[0] as JSONObject
                val roomName = roomData.get("room") as String
                val user = roomData.get("userName") as String
                val room = Room(roomName, user)

                //if (this.user.equals(user)) {
                    runOnUiThread {
                        roomAdapter.addRoom(room)
                        roomAdapter.notifyItemInserted((rvOutputRooms.adapter as RoomAdapter).itemCount)
                    }
               // } else {

               // }
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
        var roomData : JSONObject = JSONObject()
        roomData.put("userName", user)
        roomData.put("room", roomName)
        socket.emit("createRoom", roomData)
    }

    override fun roomAdapterListener(roomName: String) {
        this.roomName = roomName
        var roomData : JSONObject = JSONObject()
        roomData.put("userName", user)
        roomData.put("room", roomName)
        socket.emit("joinRoom", roomData)
        openChat()
    }

}
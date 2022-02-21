package com.example.mobile

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.Menu
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import android.widget.SearchView
import io.socket.client.Socket
import org.json.JSONObject
import java.util.*

class joinRoom : AppCompatActivity(), RoomAdapter.RoomAdapterListener{
    private lateinit var user: String
    private lateinit var searchView: SearchView
    private lateinit var rvOutputRooms: RecyclerView
    private lateinit var roomAdapter: RoomAdapter
    private lateinit var rooms : ArrayList<Room>
    private lateinit var searchArrayList: ArrayList<Room>
    private lateinit var socket: Socket

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_join_room)

        searchView = findViewById<SearchView>(R.id.newRoomsSearchView)
        searchView.queryHint = "cherchez une conversation"
        user = intent.getStringExtra("userName").toString()


        rvOutputRooms = findViewById(R.id.rvOutputRooms)
        rooms = ArrayList()
        searchArrayList = ArrayList()

        roomAdapter = RoomAdapter(this, rooms, user)


        //Recycler View of rooms
        rvOutputRooms.adapter = roomAdapter
        rvOutputRooms.layoutManager = LinearLayoutManager(this)

       /* roomAdapter.addRoom(Room("brrr", user))
        roomAdapter.notifyItemInserted((rvOutputRooms.adapter as RoomAdapter).itemCount)
        roomAdapter.addRoom(Room("waww", user))
        roomAdapter.notifyItemInserted((rvOutputRooms.adapter as RoomAdapter).itemCount)*/

        //Connect to the Server
        SocketHandler.setSocket()
        socket = SocketHandler.getSocket()
        socket.connect()

        socket.on("newRoomCreated"){ args ->
            if(args[0] != null){
                var roomData : JSONObject = JSONObject()
                roomData = args[0] as JSONObject
                val roomName = roomData.get("room") as String
                val user = roomData.get("userName") as String

                runOnUiThread{
                    val room = Room(roomName, user)
                    roomAdapter.addRoom(room)
                    roomAdapter.notifyItemInserted((rvOutputRooms.adapter as RoomAdapter).itemCount)
                }
            }
        }

        searchView.setOnQueryTextListener(object: SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean {
                return false
            }

            override fun onQueryTextChange(newText: String?): Boolean {
                filter(newText)
                return false
            }

        })
    }

    private fun filter(newText: String?) {
        searchArrayList.clear()
        val searchText = newText!!.lowercase(Locale.getDefault())
        if (!searchText.isEmpty()) {
            rooms.forEach {
                if (it.roomName!!.lowercase(Locale.getDefault()).contains(searchText)) {
                    searchArrayList.add(it)
                }
            }
            roomAdapter.searchArrayList(searchArrayList)
        } else {
            searchArrayList.clear()
            searchArrayList.addAll(rooms)
            roomAdapter.notifyDataSetChanged()
        }
    }


    override fun roomAdapterListener(roomName: String) {
        TODO("Not yet implemented")
    }
}
package com.example.mobile.activity.chat

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.ImageButton
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import android.widget.SearchView
import android.widget.Toast
import androidx.activity.viewModels
import androidx.recyclerview.widget.GridLayoutManager
import com.example.mobile.IRoom
import com.example.mobile.R
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.SocketHandler
import com.example.mobile.adapter.RoomAdapter
import com.example.mobile.viewModel.SharedViewModelToolBar
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import io.socket.client.Socket
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Response
import java.util.*
import kotlin.collections.ArrayList

class joinRoom : AppCompatActivity(), RoomAdapter.RoomAdapterListener{
    private lateinit var user: String
    private lateinit var searchView: SearchView
    private lateinit var rvOutputRooms: RecyclerView
    private lateinit var roomAdapter: RoomAdapter
    private lateinit var IRooms : ArrayList<IRoom>
    private lateinit var roomName: String
    private lateinit var leaveChatBtn: ImageButton
    private lateinit var searchArrayList: ArrayList<IRoom>
    private lateinit var socket: Socket
    private val sharedViewModel: SharedViewModelToolBar by viewModels()

    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_join_room)

        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        leaveChatBtn = findViewById<ImageButton>(R.id.leaveChatBtn)

        searchView = findViewById<SearchView>(R.id.newRoomsSearchView)
        searchView.queryHint = "cherchez une conversation"
        user = intent.getStringExtra("userName").toString()

        sharedViewModel.setUser(user)
        rvOutputRooms = findViewById(R.id.rvOutputRooms)
        IRooms = ArrayList()
        searchArrayList = ArrayList()

        roomAdapter = RoomAdapter(this, IRooms, user)


        //Recycler View of rooms
        rvOutputRooms.adapter = roomAdapter
        rvOutputRooms.layoutManager = GridLayoutManager(this,2)

        getRooms()

        //Connect to the Server
        SocketHandler.setSocket()
        socket = SocketHandler.getSocket()
        socket.connect()
//
//        socket.on("newRoomCreated"){ args ->
//            if(args[0] != null){
//                var roomData : JSONObject = JSONObject()
//                roomData = args[0] as JSONObject
//                val roomName = roomData.get("room") as String
//                val user = roomData.get("userName") as String
//                val usersList = roomData.get("usersList") as ArrayList<String>
//
//                runOnUiThread{
//                    val room = Room("1", roomName, user, usersList)
//                    roomAdapter.addRoom(room)
//                    roomAdapter.notifyItemInserted((rvOutputRooms.adapter as RoomAdapter).itemCount)
//                }
//            }
//        }

        searchView.setOnQueryTextListener(object: SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean {
                return false
            }

            override fun onQueryTextChange(newText: String?): Boolean {
                filter(newText)
                return false
            }

        })

        leaveChatBtn.setOnClickListener {
            leaveChat()
        }


    }


    private fun filter(newText: String?) {
        searchArrayList.clear()
        val searchText = newText!!.lowercase(Locale.getDefault())
        if (!searchText.isEmpty()) {
            IRooms.forEach {
                if (it.roomName!!.lowercase(Locale.getDefault()).contains(searchText)) {
                    searchArrayList.add(it)
                }
            }
            roomAdapter.searchArrayList(searchArrayList)
        } else {
            searchArrayList.clear()
            searchArrayList.addAll(IRooms)
            roomAdapter.notifyDataSetChanged()
        }
    }


    override fun roomAdapterListener(roomName: String) {
        updateRooms(user, roomName)
        this.roomName = roomName
        var roomData : JSONObject = JSONObject()
        roomData.put("userName", user)
        roomData.put("room", roomName)
        socket.emit("newUserToChatRoom", roomData)
        openChat()
    }

    fun leaveChat(){
        val intent = Intent(this, ChatRooms::class.java)
        intent.putExtra("userName", user)
        startActivity(intent)
    }

    fun openChat(){
        //isChatOpen = true
        val intent = Intent(this, ChatPage::class.java)
        intent.putExtra("userName",user)
        intent.putExtra("roomName", this.roomName)
        startActivity(intent)
    }


    private fun getRooms() {
        var call: Call<List<IRoom>> = iMyService.getAllRooms()
        call.enqueue(object: retrofit2.Callback<List<IRoom>> {

            override fun onResponse(call: Call<List<IRoom>>, response: Response<List<IRoom>>) {
                for (room in response.body()!!) {
                    if (!room.usersList?.contains(user)!!) {
                        roomAdapter.addRoom(room)
                        roomAdapter.notifyItemInserted((rvOutputRooms.adapter as RoomAdapter).itemCount)
                    }
                }
            }

            override fun onFailure(call: Call<List<IRoom>>, t: Throwable) {
                Log.d("joinRoom", "onFailure" +t.message )
            }

        })

    }

    private fun updateRooms(user: String, roomName: String) {
        compositeDisposable.add(iMyService.joinRoom(user, roomName)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe { result ->
                if (result == "201") {
                    Toast.makeText(this, "bienvenue", Toast.LENGTH_SHORT).show()
//                    var roomData: JSONObject = JSONObject()
//                    roomData.put("userName", user)
//                    roomData.put("room", roomName)
//                    socket.emit("createRoom", roomData)
                } else {
                    Toast.makeText(this, "erreur", Toast.LENGTH_SHORT).show()
                }
            })
    }
}
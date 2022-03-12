package com.example.mobile

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import kotlinx.android.synthetic.main.item_room.view.*
import java.util.ArrayList

class RoomAdapter (val context : Context, var rooms: ArrayList<Room>, val owner: String) : RecyclerView.Adapter<RoomAdapter.RoomViewHolder>() {

    private var listener: RoomAdapterListener = context as RoomAdapterListener

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RoomViewHolder {
        return RoomAdapter.RoomViewHolder(
            LayoutInflater.from(parent.context).inflate(
                R.layout.item_room,
                parent,
                false
            )
        )
    }

    override fun onBindViewHolder(holder: RoomViewHolder, position: Int) {
        val currentRoom = rooms[position]

        holder.itemView.apply {
            item_room_name.text = currentRoom.roomName
            item_room_name.setOnClickListener {
                listener.roomAdapterListener(item_room_name.text.toString())
            }
        }
    }

    fun addRoom (room: Room) {
        rooms.add(room)
    }

    fun searchArrayList (list: ArrayList<Room>) {
        rooms = list
        notifyDataSetChanged()
    }

    override fun getItemCount(): Int {
        return rooms.size
    }

    public interface RoomAdapterListener {
        fun roomAdapterListener(roomName: String)
    }

    class RoomViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView)
}
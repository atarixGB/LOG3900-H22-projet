package com.example.mobile.adapter

import android.content.Context
import android.graphics.Color
import android.graphics.Typeface
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.IRoom
import com.example.mobile.R
import kotlinx.android.synthetic.main.item_room.view.*
import java.util.ArrayList

class RoomAdapter (val context : Context, var IRooms: ArrayList<IRoom>, val owner: String) : RecyclerView.Adapter<RoomAdapter.RoomViewHolder>() {

    private var listener: RoomAdapterListener = context as RoomAdapterListener

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RoomViewHolder {
        return RoomViewHolder(
            LayoutInflater.from(parent.context).inflate(
                R.layout.item_room,
                parent,
                false
            )
        )
    }

    override fun onBindViewHolder(holder: RoomViewHolder, position: Int) {
        val currentRoom = IRooms[position]

        holder.itemView.apply {
            item_room_name.text = currentRoom.roomName
            if(currentRoom.isNotified){
                item_room_name.setTextColor(Color.BLUE)
            }else{
                item_room_name.setTextColor(Color.BLACK)
            }
            item_room_name.setOnClickListener {
                // when we click on room notified, we mark is on not notified anymore
                if(currentRoom.isNotified){
                    currentRoom.isNotified = false
                    notifyDataSetChanged()
                }
                listener.roomAdapterListener(item_room_name.text.toString())

            }
        }
    }

    fun addRoom (IRoom: IRoom) {
        IRooms.add(IRoom)
    }

    fun searchArrayList (list: ArrayList<IRoom>) {
        IRooms = list
        notifyDataSetChanged()
    }

    override fun getItemCount(): Int {
        return IRooms.size
    }

    public interface RoomAdapterListener {
        fun roomAdapterListener(roomName: String)
    }

    class RoomViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView)
}
package com.example.mobile.adapter

import android.content.Context
import android.content.Intent
import android.media.MediaPlayer
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.Interface.IMessage
import com.example.mobile.R
import com.example.mobile.SOUND_EFFECT
import com.example.mobile.activity.profile.Profile
import com.example.mobile.activity.profile.visitingProfile
import java.util.*

class MessageAdapter(val context : Context, val msgs: ArrayList<IMessage>, var owner : String) : RecyclerView.Adapter<RecyclerView.ViewHolder>() {

    val ITEM_RECEIVE = 1
    val ITEM_SENT = 2
    var ITEM_JOINED = 3
    var mediaPlayerSendSuccess: MediaPlayer = MediaPlayer.create(context,R.raw.send)
    var mediaPlayerReceiveSuccess: MediaPlayer = MediaPlayer.create(context,R.raw.receive)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        if (viewType == 1) {
            if(SOUND_EFFECT){
                mediaPlayerReceiveSuccess.start()
            }

            return ReceiveMessageViewHolder(
                LayoutInflater.from(parent.context).inflate(
                    R.layout.receivemessage,
                    parent,
                    false
                )
            )
        } else if (viewType == 2) {
            if(SOUND_EFFECT){
                mediaPlayerSendSuccess.start()
            }

            return SentMessageViewHolder(
                LayoutInflater.from(parent.context).inflate(
                    R.layout.sentmessage,
                    parent,
                    false
                )
            )
        } else {
            return UserJoinedViewHolder(
                LayoutInflater.from(parent.context).inflate(
                    R.layout.userjoined,
                    parent,
                    false
                )
            )
        }
    }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        val currentMsg = msgs[position]

        if (holder.javaClass == SentMessageViewHolder::class.java) {
            val viewHolder = holder as SentMessageViewHolder
            holder.sentMessage.text = currentMsg.msgText
            holder.sentUser.text = currentMsg.user + " - " + currentMsg.time
            holder.sentUser.setOnClickListener{
                val intent = Intent(context, Profile::class.java)
                intent.putExtra("userName", owner)
                context.startActivity(intent)
            }

        } else if (holder.javaClass == ReceiveMessageViewHolder::class.java){
            val viewHolder = holder as ReceiveMessageViewHolder
            holder.receiveMessage.text = currentMsg.msgText
            holder.receiveUser.text = currentMsg.user + " - " + currentMsg.time
            holder.receiveUser.setOnClickListener{
                val intent = Intent(context, visitingProfile::class.java)
                intent.putExtra("user", owner)
                intent.putExtra("visitingUser", currentMsg.user)
                context.startActivity(intent)
            }
        } else {
            val viewHolder = holder as UserJoinedViewHolder
            holder.userJoined.text = currentMsg.msgText
        }


    }

    override fun getItemViewType(position: Int): Int {
        val currentMsg = msgs[position]

        if (currentMsg.isNotif == true) {
            return ITEM_JOINED
        } else if (currentMsg.user!!.compareTo(owner) == 0) {
            return ITEM_SENT
        } else {
            return ITEM_RECEIVE
        }
    }

    override fun getItemCount(): Int {
        return msgs.size
    }

    fun addMsg (msg: IMessage) {
        msgs.add(msg)
    }

    class SentMessageViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val sentMessage = itemView.findViewById<TextView>(R.id.txt_sent_message)
        val sentUser = itemView.findViewById<TextView>(R.id.user_sent_message)
    }

    class ReceiveMessageViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val receiveMessage = itemView.findViewById<TextView>(R.id.txt_receive_message)
        val receiveUser = itemView.findViewById<TextView>(R.id.user_receive_message)
    }

    class UserJoinedViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val userJoined = itemView.findViewById<TextView>(R.id.user_joined_chat)
    }
}

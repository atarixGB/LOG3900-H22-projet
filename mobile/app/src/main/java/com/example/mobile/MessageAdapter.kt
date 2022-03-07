package com.example.mobile

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.R
import java.util.*

class MessageAdapter(val context : Context, val msgs: ArrayList<Message>, val owner : String) : RecyclerView.Adapter<RecyclerView.ViewHolder>() {

    val ITEM_RECEIVE = 1
    val ITEM_SENT = 2
    var ITEM_JOINED = 3


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        if (viewType == 1) {
            return ReceiveMessageViewHolder(
                LayoutInflater.from(parent.context).inflate(
                    R.layout.receivemessage,
                    parent,
                    false
                )
            )
        } else if (viewType == 2) {
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
        } else if (holder.javaClass == ReceiveMessageViewHolder::class.java){
            val viewHolder = holder as ReceiveMessageViewHolder
            holder.receiveMessage.text = currentMsg.msgText
            holder.receiveUser.text = currentMsg.user + " - " + currentMsg.time
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

    fun addMsg (msg: Message) {
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

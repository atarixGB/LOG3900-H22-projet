package com.example.mobile

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import kotlinx.android.synthetic.main.item_room.view.*
import kotlinx.android.synthetic.main.item_user.view.*
import java.util.ArrayList

class UserAdapter (val context : Context, var users: ArrayList<String>) : RecyclerView.Adapter<UserAdapter.UserViewHolder>() {


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): UserViewHolder {
        return UserAdapter.UserViewHolder(
            LayoutInflater.from(parent.context).inflate(
                R.layout.item_user,
                parent,
                false
            )
        )
    }

    override fun onBindViewHolder(holder: UserViewHolder, position: Int) {
        val currentUser = users[position]

        holder.itemView.apply {
            item_user_name.text = currentUser.toString()
           /* item_user_name.setOnClickListener {
                //A implementer plus tard : Quand on clique sur un utilisateur, ca nous ramene a son profil
            }*/
        }
    }

    fun addUser (user: String) {
        users.add(user)
    }

    override fun getItemCount(): Int {
        return users.size
    }

    class UserViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView)
}
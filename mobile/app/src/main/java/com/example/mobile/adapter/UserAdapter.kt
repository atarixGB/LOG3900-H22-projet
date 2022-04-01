package com.example.mobile.adapter

import android.content.Context
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.content.ContextCompat.startActivity
import androidx.core.view.isVisible
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.R
import com.example.mobile.activity.profile.Profile
import com.example.mobile.activity.profile.TopDrawingDisplay
import kotlinx.android.synthetic.main.item_user.view.*
import java.util.ArrayList

class UserAdapter (val context : Context, var users: ArrayList<String>, var requests: Boolean) : RecyclerView.Adapter<UserAdapter.UserViewHolder>() {

    private var listener: UserAdapterListener = context as UserAdapterListener


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): UserViewHolder {
        return UserViewHolder(
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
            acceptButton.isVisible = requests
            item_user_name.text = currentUser.toString()
           /* item_user_name.setOnClickListener {
                //A implementer plus tard : Quand on clique sur un utilisateur, ca nous ramene a son profil
            }*/

            item_user_name.setOnClickListener{
                val intent = Intent(context, Profile::class.java)
                intent.putExtra("visitingUser",currentUser)
                context.startActivity(intent)
            }
            acceptButton.setOnClickListener {
                listener.userAdapterListener(users[position])
            }
        }
    }

    fun addUser (user: String) {
        users.add(user)
    }


    override fun getItemCount(): Int {
        return users.size
    }

    public interface UserAdapterListener {
        fun userAdapterListener(userName: String)
    }

    class UserViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView)
}
package com.example.mobile

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.widget.PopupMenu
import androidx.fragment.app.Fragment

class ToolbarNavigationFragment: Fragment() {
    private lateinit var dashbord: TextView
    private lateinit var chat: TextView
    private lateinit var draw: TextView
    private lateinit var albums: TextView
    private lateinit var profile: TextView
    private lateinit var user: String

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val rootView = inflater.inflate(R.layout.fragment_toolbar_navigation, container, false)

        dashbord = rootView.findViewById(R.id.dashbord)
        chat = rootView.findViewById(R.id.chat)
        draw = rootView.findViewById(R.id.draw)
        albums = rootView.findViewById(R.id.albums)
        profile = rootView.findViewById(R.id.profile)
        user = arguments?.get("userName").toString()
        //user = intent.getStringExtra("userName").toString()
        //user = "chaima"

        dashbord.setOnClickListener {
            Toast.makeText(context, "dashbord", Toast.LENGTH_SHORT).show()
            val intent = Intent(activity, Dashboard::class.java)
            intent.putExtra("userName",user)
            startActivity(intent)
        }

        chat.setOnClickListener {
            Toast.makeText(context, "chat", Toast.LENGTH_SHORT).show()
            val intent = Intent(activity, ChatRooms::class.java)
            intent.putExtra("userName",user)
            startActivity(intent)

        }

        draw.setOnClickListener {
            Toast.makeText(context, "draw", Toast.LENGTH_SHORT).show()
        }

        albums.setOnClickListener {
            Toast.makeText(context, "albums", Toast.LENGTH_SHORT).show()
        }

        profile.setOnClickListener {
            Toast.makeText(context, "profile", Toast.LENGTH_SHORT).show()
            val intent = Intent(activity, Profile::class.java)
            intent.putExtra("userName",user)
            startActivity(intent)
        }


        return rootView
        //return super.onCreateView(inflater, container, savedInstanceState)
    }
}
package com.example.mobile

import android.app.ActivityOptions
import android.content.Intent
import android.media.MediaPlayer
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import com.example.mobile.activity.Dashboard
import com.example.mobile.activity.MainActivity
import com.example.mobile.activity.drawing.DrawingActivity
import com.example.mobile.activity.albums.Albums
import com.example.mobile.activity.chat.ChatRooms
import com.example.mobile.activity.profile.Profile
import com.example.mobile.viewModel.SharedViewModelToolBar

class ToolbarNavigationFragment: Fragment() {
    private lateinit var dashbord: TextView
    private lateinit var chat: TextView
    private lateinit var draw: TextView
    private lateinit var albums: TextView
    private lateinit var profile: TextView
    private lateinit var logout: TextView
    private lateinit var user: String
    private val sharedViewModel: SharedViewModelToolBar by activityViewModels()
    private var mediaPlayerSong: MediaPlayer? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val rootView = inflater.inflate(R.layout.fragment_toolbar_navigation, container, false)

        sharedViewModel.user.observe(viewLifecycleOwner) {
            user = it
        }

        dashbord = rootView.findViewById(R.id.dashbord)
        chat = rootView.findViewById(R.id.chat)
        draw = rootView.findViewById(R.id.draw)
        albums = rootView.findViewById(R.id.albums)
        profile = rootView.findViewById(R.id.profile)
        logout = rootView.findViewById(R.id.logout)

        if (DEACTIVATED){
            mediaPlayerSong= MediaPlayer.create(context,R.raw.silence)
        }
        if(LOFI1){
            mediaPlayerSong= MediaPlayer.create(context,R.raw.lofi1)
        }
        else if (LOFI2){
            mediaPlayerSong= MediaPlayer.create(context,R.raw.lofi2)
        }
        else if (KAHOOT){
            mediaPlayerSong= MediaPlayer.create(context,R.raw.kahoot)
        }
        else if (MINECRAFT){
            mediaPlayerSong= MediaPlayer.create(context,R.raw.minecraft)
        }

        mediaPlayerSong!!.isLooping=true
        mediaPlayerSong!!.start()

        dashbord.setOnClickListener {
            dashbord.setBackgroundResource(R.color.greenOnClick)
            Toast.makeText(context, "dashbord", Toast.LENGTH_SHORT).show()
            val intent = Intent(activity, Dashboard::class.java)
            intent.putExtra("userName",user)
            startActivity(intent)
        }

        chat.setOnClickListener {
            chat.setBackgroundResource(R.color.greenOnClick)
            Toast.makeText(context, "chat", Toast.LENGTH_SHORT).show()
            val intent = Intent(activity, ChatRooms::class.java)
            intent.putExtra("userName",user)
            startActivity(intent)

        }

        draw.setOnClickListener {
            draw.setBackgroundResource(R.color.greenOnClick)
            Toast.makeText(context, "draw", Toast.LENGTH_SHORT).show()
            val intent = Intent(activity, DrawingActivity::class.java)
            intent.putExtra("userName",user)
            startActivity(intent)
        }

        albums.setOnClickListener {
            albums.setBackgroundResource(R.color.greenOnClick)
            Toast.makeText(context, "albums", Toast.LENGTH_SHORT).show()
            val intent = Intent(activity, Albums::class.java)
            intent.putExtra("userName",user)
            startActivity(intent)
        }

        profile.setOnClickListener {
            profile.setBackgroundResource(R.color.greenOnClick)
            Toast.makeText(context, "profile", Toast.LENGTH_SHORT).show()
            val intent = Intent(activity, Profile::class.java)
            intent.putExtra("userName",user)
            startActivity(intent)
        }

        logout.setOnClickListener{
            logout.setBackgroundResource(R.color.greenOnClick)
            Toast.makeText(context, "Déconnexion", Toast.LENGTH_SHORT).show()
            val intent = Intent(activity, MainActivity::class.java)
            startActivity(intent)
        }


        return rootView
    }

    override fun onResume() {
        super.onResume()
        mediaPlayerSong!!.start()
    }

    override fun onPause() {
        super.onPause()
        mediaPlayerSong!!.pause()
    }

    override fun onDestroy() {
        super.onDestroy()
        mediaPlayerSong!!.release()
    }
}
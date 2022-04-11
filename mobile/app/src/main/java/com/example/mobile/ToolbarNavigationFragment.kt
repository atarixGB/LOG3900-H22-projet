package com.example.mobile

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
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.activity.Dashboard
import com.example.mobile.activity.MainActivity
import com.example.mobile.activity.drawing.DrawingActivity
import com.example.mobile.activity.albums.Albums
import com.example.mobile.activity.chat.ChatRooms
import com.example.mobile.activity.profile.Profile
import com.example.mobile.viewModel.SharedViewModelToolBar
import io.reactivex.disposables.CompositeDisposable
import retrofit2.Call
import retrofit2.Response

class ToolbarNavigationFragment: Fragment() {
    private lateinit var dashbord: TextView
    private lateinit var chat: TextView
    private lateinit var draw: TextView
    private lateinit var albums: TextView
    private lateinit var profile: TextView
    private lateinit var draft: TextView
    private lateinit var logout: TextView
    private  lateinit var displayUser: TextView
    private lateinit var user: String
    private val sharedViewModel: SharedViewModelToolBar by activityViewModels()
    private var mediaPlayerSong: MediaPlayer? = null

    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()

    override fun onStop() {
        compositeDisposable.clear()
        super.onStop()
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val rootView = inflater.inflate(R.layout.fragment_toolbar_navigation, container, false)

        sharedViewModel.user.observe(viewLifecycleOwner) {
            user = it
            displayUser.text = user
        }

        dashbord = rootView.findViewById(R.id.dashbord)
        chat = rootView.findViewById(R.id.chat)
//        draw = rootView.findViewById(R.id.draw)
        albums = rootView.findViewById(R.id.albums)
        profile = rootView.findViewById(R.id.profile)
        draft=rootView.findViewById(R.id.draft)
        displayUser=rootView.findViewById(R.id.displayUser)


        //init api
        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)


        logout = rootView.findViewById(R.id.logout)

        if (MUSIC_TRACK==0){
            mediaPlayerSong= MediaPlayer.create(context,R.raw.silence)
        }
        if(MUSIC_TRACK==2){
            mediaPlayerSong= MediaPlayer.create(context,R.raw.lofi1)
        }
        else if (MUSIC_TRACK==3){
            mediaPlayerSong= MediaPlayer.create(context,R.raw.lofi2)
        }
        else if (MUSIC_TRACK==1){
            mediaPlayerSong= MediaPlayer.create(context,R.raw.kahoot)
        }
        else if (MUSIC_TRACK==4){
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

//        draw.setOnClickListener {
//            draw.setBackgroundResource(R.color.greenOnClick)
//            Toast.makeText(context, "draw", Toast.LENGTH_SHORT).show()
//            val intent = Intent(activity, DrawingActivity::class.java)
//            intent.putExtra("userName",user)
//            startActivity(intent)
//        }

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

        draft.setOnClickListener{
            draft.setBackgroundResource(R.color.greenOnClick)
            Toast.makeText(context, "draft", Toast.LENGTH_SHORT).show()
            val intent = Intent(activity, DrawingActivity::class.java)
            intent.putExtra("userName",user)
            ISDRAFT=true
            startActivity(intent)
        }
        logout.setOnClickListener{
            disconnectUser(user)
            logout.setBackgroundResource(R.color.greenOnClick)
            Toast.makeText(context, "Déconnexion", Toast.LENGTH_SHORT).show()
            val intent = Intent(activity, MainActivity::class.java)
            startActivity(intent)
        }


        return rootView
    }

    private fun disconnectUser(user:String) {
        var call: Call<Any> = iMyService.disconnectUser(user)

        call.enqueue(object: retrofit2.Callback<Any> {
            override fun onResponse(call: Call<Any>, response: Response<Any>) {

                if(response.body()==201){
                    Toast.makeText(context, "Déconnexion", Toast.LENGTH_SHORT).show()
                }
            }
            override fun onFailure(call: Call<Any>, t: Throwable) {
                Toast.makeText(context, "erreur", Toast.LENGTH_SHORT).show()
            }
        })
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
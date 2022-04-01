package com.example.mobile.activity.profile

import android.app.ActivityOptions
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.ImageButton
import android.widget.TextView
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.example.mobile.Interface.IDrawing
import com.example.mobile.Interface.User
import com.example.mobile.R
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.SocketHandler
import com.example.mobile.activity.MainActivity
import com.example.mobile.adapter.SimpleDrawingAdapter
import com.example.mobile.bitmapDecoder
import com.example.mobile.viewModel.SharedViewModelToolBar
import com.mikhaellopez.circularimageview.CircularImageView
import io.reactivex.disposables.CompositeDisposable
import io.socket.client.Socket
import kotlinx.android.synthetic.main.activity_profile.*
import retrofit2.Call
import retrofit2.Response


class Profile : AppCompatActivity() {
    private lateinit var leave: ImageButton
    private lateinit var modifyProfile: TextView
    private lateinit var avatar: CircularImageView
    private lateinit var user: String
    private var totalNbLikes:Int = 0

    //    private lateinit var email: String
    private lateinit var usernameDisplayed: TextView
    private lateinit var socket: Socket
    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()
    var userList = mutableListOf<User>()
    private val sharedViewModel: SharedViewModelToolBar by viewModels()


    //todo(NH): for the statistic portion we will use fragments i think its better to transmit the information
    //todo (suite): or we can use a viewModel to do the calculations and call them on this page

    override fun onStop() {
        compositeDisposable.clear()
        super.onStop()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profile)
        leave = findViewById(R.id.leave)
        usernameDisplayed= findViewById(R.id.username)
        avatar = findViewById(R.id.userAvatar)
        modifyProfile=findViewById(R.id.modify_label)
        user = intent.getStringExtra("userName").toString()
        sharedViewModel.setUser(user)


        //username and email sent from registration or login page displayed
        usernameDisplayed.setText(user)

        //init api
        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        //changing the avatar with what was stored in the db
        getUserFromDB(user)

        //Connect to the Server
        SocketHandler.setSocket()
        socket = SocketHandler.getSocket()
        socket.connect()

        leave.setOnClickListener() {
            val intent = Intent(this, MainActivity::class.java)
            socket.emit("disconnectUser", user.toString())
            SocketHandler.closeConnection()
            startActivity(intent)
        }

        showMostLiked.setOnClickListener(){
            val intent = Intent(this, TopDrawingDisplay::class.java)
            intent.putExtra("userName",user)
            startActivity(intent)
        }

        showFavorites.setOnClickListener(){
            val intent = Intent(this, FavoriteDrawingDisplay::class.java)
            intent.putExtra("userName",user)
            startActivity(intent)
        }


        modify_label.setOnClickListener(){
            val intent = Intent(this, Profile_modification::class.java)
            //to send the old username, we need it in the modification page
            intent.putExtra("userName",user)
            intent.putExtra("email",user_email.text.toString())
            intent.putExtra("description",description_field.text.toString())
            var bundle:Bundle = ActivityOptions.makeSceneTransitionAnimation(this).toBundle()
            startActivity(intent,bundle)
        }

        getNbLikes(user)

    }

    private fun getUserFromDB(user:String) {
        var call: Call<User> = iMyService.getUserFromDB(user)

        call.enqueue(object: retrofit2.Callback<User> {
            override fun onResponse(call: Call<User>, response: Response<User>) {
                Toast.makeText(this@Profile, "Bienvenu!", Toast.LENGTH_SHORT).show()
                userAvatar.setImageBitmap(bitmapDecoder(response.body()?.avatar))
//                username.setText(response.body()?.username)
                user_email.setText(response.body()?.email)
                description_field.setText(response.body()?.description)

            }

            override fun onFailure(call: Call<User>, t: Throwable) {
                Toast.makeText(this@Profile, "erreur", Toast.LENGTH_SHORT).show()
            }
        })

    }

    private fun getNbLikes(user: String) {
        var call: Call<List<IDrawing>> = iMyService.getTopDrawings(user)
        call.enqueue(object: retrofit2.Callback<List<IDrawing>> {

            override fun onResponse(call: Call<List<IDrawing>>, response: Response<List<IDrawing>>) {
                for(drawing in response.body()!!){
                    totalNbLikes += drawing.likes?.size!!
                    displayBadges(totalNbLikes)
                }
            }

            override fun onFailure(call: Call<List<IDrawing>>, t: Throwable) {
                Log.d("Top dessins", "onFailure" +t.message )
            }
        })
    }

    private fun displayBadges(totalNbLikes:Int){
        if (totalNbLikes in 0..5){
            badge.setImageResource(R.drawable.debutant)
        }
        else if(totalNbLikes in 5..25){
            badge.setImageResource(R.drawable.intermediaire)
        }
        else if (totalNbLikes in 25..50){
            badge.setImageResource(R.drawable.expert)
        }
        else if(totalNbLikes > 50){
            badge.setImageResource(R.drawable.artiste)
        }
    }



}
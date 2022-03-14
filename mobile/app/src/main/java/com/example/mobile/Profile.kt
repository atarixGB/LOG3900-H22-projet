package com.example.mobile

import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.Bundle
import android.util.Base64
import android.widget.ImageButton
import android.widget.TextView
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.example.mobile.Interface.User
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.mikhaellopez.circularimageview.CircularImageView
import io.reactivex.disposables.CompositeDisposable
import io.socket.client.Socket
import kotlinx.android.synthetic.main.activity_profile.*
import kotlinx.android.synthetic.main.activity_registration.*
import retrofit2.Call
import retrofit2.Response


class Profile : AppCompatActivity() {
    private lateinit var leave: ImageButton
    private lateinit var modifyProfile: TextView
    private lateinit var avatar: CircularImageView
    private lateinit var user: String
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

        modify_label.setOnClickListener(){
            val intent = Intent(this, Profile_modification::class.java)
            //to send the old username, we need it in the modification page
            intent.putExtra("userName",user)
            intent.putExtra("email",user_email.text.toString())
            intent.putExtra("description",description_field.text.toString())
            startActivity(intent)
        }

    }

    private fun getUserFromDB(user:String) {
        var call: Call<User> = iMyService.getUserFromDB(user)

        call.enqueue(object: retrofit2.Callback<User> {
            override fun onResponse(call: Call<User>, response: Response<User>) {
                Toast.makeText(this@Profile, "Bienvenu!", Toast.LENGTH_SHORT).show()
                userAvatar.setImageBitmap(avatarDecoder(response.body()?.avatar))
//                username.setText(response.body()?.username)
                user_email.setText(response.body()?.email)
                description_field.setText(response.body()?.description)

            }

            override fun onFailure(call: Call<User>, t: Throwable) {
                TODO("Not yet implemented")
            }
        })

    }

    private fun avatarDecoder(avatar_str:String?):Bitmap{
        val decodedString: ByteArray = Base64.decode(avatar_str, Base64.DEFAULT)
        return BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
    }




}
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
import com.example.mobile.Interface.IUser
import com.example.mobile.R
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.activity.MainActivity
import com.example.mobile.bitmapDecoder
import com.example.mobile.popup.BadgePopUp
import com.example.mobile.popup.CreateAlbumPopUp
import com.example.mobile.viewModel.SharedViewModelToolBar
import com.mikhaellopez.circularimageview.CircularImageView
import io.reactivex.disposables.CompositeDisposable
import kotlinx.android.synthetic.main.activity_profile.*
import retrofit2.Call
import retrofit2.Response


class Profile : AppCompatActivity() {

    private lateinit var modifyProfile: TextView

    private lateinit var avatar: CircularImageView
    private lateinit var user: String
    private var totalNbLikes:Int = 0
    private var totalNbDrawingCreated:Double = 0.0
    private var totalNbAlbumCreated :Double =0.0
    private var totalDurationCollab :Double =0.0
    private var avgDurationCollab :Double =0.0
    private var totalNbCollab :Double =0.0

    private lateinit var usernameDisplayed: TextView
    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()
    var userList = mutableListOf<IUser>()
    private val sharedViewModel: SharedViewModelToolBar by viewModels()




    override fun onStop() {
        compositeDisposable.clear()
        super.onStop()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profile)

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

        view_badges.setOnClickListener{
            var dialog= BadgePopUp()
            dialog.show(supportFragmentManager,"customDialog")
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
        getNbDrawings(user)
        getNbAlbumsCreated(user)
        getNbCollab(user)
        getAvgCollabDuration(user)
        getTotalDurationCollab(user)

    }

    private fun getUserFromDB(user:String) {
        var call: Call<IUser> = iMyService.getUserFromDB(user)

        call.enqueue(object: retrofit2.Callback<IUser> {
            override fun onResponse(call: Call<IUser>, response: Response<IUser>) {
                Toast.makeText(this@Profile, "Bienvenu!", Toast.LENGTH_SHORT).show()
                userAvatar.setImageBitmap(bitmapDecoder(response.body()?.avatar))
//                username.setText(response.body()?.username)
                user_email.setText(response.body()?.email)
                description_field.setText(response.body()?.description)

            }

            override fun onFailure(call: Call<IUser>, t: Throwable) {
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

    private fun getNbDrawings(user:String) {
        var call: Call<Any> = iMyService.getNbTotalDrawings(user)

        call.enqueue(object: retrofit2.Callback<Any> {
            override fun onResponse(call: Call<Any>, response: Response<Any>) {

                if(response.body()!=null){
                    totalNbDrawingCreated= response.body() as Double
                    nbCreatedDrawings.setText(totalNbDrawingCreated.toInt().toString())
                }
                else{
                    nbCreatedDrawings.setText("0")
                }
            }

            override fun onFailure(call: Call<Any>, t: Throwable) {
                Toast.makeText(this@Profile, "erreur statistique introuvable", Toast.LENGTH_SHORT).show()
            }
        })

    }

    private fun getNbAlbumsCreated(user:String) {
        var call: Call<Any> = iMyService.getNbAlbumsCreated(user)

        call.enqueue(object: retrofit2.Callback<Any> {
            override fun onResponse(call: Call<Any>, response: Response<Any>) {

                if(response.body()!=null){
                    totalNbAlbumCreated= response.body() as Double

                    nbPrivateAlbums.setText(totalNbAlbumCreated.toInt().toString())
                }
               else {
                    nbPrivateAlbums.setText("0")
               }
            }
            override fun onFailure(call: Call<Any>, t: Throwable) {
                Toast.makeText(this@Profile, "erreur statistique introuvable", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun getNbCollab(user:String) {
        var call: Call<Any> = iMyService.getNbCollab(user)

        call.enqueue(object: retrofit2.Callback<Any> {
            override fun onResponse(call: Call<Any>, response: Response<Any>) {

                if(response.body()!=null){
                    var totalNbCollab= response.body()

                    nbCollaboration.setText(totalNbCollab.toString())
                }
                else {
                    nbCollaboration.setText("0")
                }
            }
            override fun onFailure(call: Call<Any>, t: Throwable) {
                Toast.makeText(this@Profile, "erreur statistique introuvable", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun getAvgCollabDuration(user:String) {
        var call: Call<Any> = iMyService.getAvgCollabDuration(user)

        call.enqueue(object: retrofit2.Callback<Any> {
            override fun onResponse(call: Call<Any>, response: Response<Any>) {

                if(response.body()!=null){
                    var avgDurationCollab= response.body()

                    avgCollabTime.setText(avgDurationCollab.toString())
                }
                else {
                    avgCollabTime.setText("0")
                }
            }
            override fun onFailure(call: Call<Any>, t: Throwable) {
                Toast.makeText(this@Profile, "erreur statistique introuvable", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun getTotalDurationCollab(user:String) {
        var call: Call<Any> = iMyService.getTotalDurationCollab(user)

        call.enqueue(object: retrofit2.Callback<Any> {
            override fun onResponse(call: Call<Any>, response: Response<Any>) {

                if(response.body()!=null){
                    var totalDurationCollab= response.body()

                    totalCollabTime.setText(totalDurationCollab.toString())
                }
                else {
                    totalCollabTime.setText("0")
                }
            }
            override fun onFailure(call: Call<Any>, t: Throwable) {
                Toast.makeText(this@Profile, "erreur statistique introuvable", Toast.LENGTH_SHORT).show()
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
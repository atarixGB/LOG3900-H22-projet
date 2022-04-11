package com.example.mobile.activity.profile

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.ImageButton
import android.widget.TextView
import android.widget.Toast
import androidx.activity.viewModels
import com.example.mobile.Interface.IDrawing
import com.example.mobile.Interface.IUser
import com.example.mobile.R
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.bitmapDecoder
import com.example.mobile.viewModel.SharedViewModelToolBar
import com.mikhaellopez.circularimageview.CircularImageView
import io.reactivex.disposables.CompositeDisposable
import kotlinx.android.synthetic.main.activity_profile.*
import kotlinx.android.synthetic.main.activity_visiting_profile.*
import kotlinx.android.synthetic.main.activity_visiting_profile.badge
import kotlinx.android.synthetic.main.activity_visiting_profile.description_field
import kotlinx.android.synthetic.main.activity_visiting_profile.nbCreatedDrawings
import kotlinx.android.synthetic.main.activity_visiting_profile.nbPrivateAlbums
import kotlinx.android.synthetic.main.activity_visiting_profile.showFavorites
import kotlinx.android.synthetic.main.activity_visiting_profile.showMostLiked
import kotlinx.android.synthetic.main.activity_visiting_profile.userAvatar
import kotlinx.android.synthetic.main.activity_visiting_profile.user_email
import retrofit2.Call
import retrofit2.Response

class visitingProfile : AppCompatActivity() {

    private lateinit var leave: ImageButton
    private lateinit var modifyProfile: TextView
    private lateinit var avatar: CircularImageView
    private lateinit var user: String
    private lateinit var visitingUser: String
    private var totalNbLikes:Int = 0
    private var totalNbDrawingCreated:Double = 0.0
    private var totalNbAlbumCreated :Double =0.0
    //    private lateinit var email: String
    private lateinit var usernameDisplayed: TextView
    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()

    private val sharedViewModel: SharedViewModelToolBar by viewModels()


    override fun onStop() {
        compositeDisposable.clear()
        super.onStop()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_visiting_profile)
        leave = findViewById(R.id.leave)
        usernameDisplayed= findViewById(R.id.username)
        avatar = findViewById(R.id.userAvatar)

        visitingUser = intent.getStringExtra("visitingUser").toString()
        user = intent.getStringExtra("user").toString()

        sharedViewModel.setVisitorUser(visitingUser)
        sharedViewModel.setUser(user)
        //username and email sent from registration or login page displayed
        usernameDisplayed.setText(visitingUser)

        //init api
        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        //changing the avatar with what was stored in the db
        getUserFromDB(visitingUser)

        //display badge
        getNbLikes(visitingUser)

        showMostLiked.setOnClickListener(){
            val intent = Intent(this, TopDrawingDisplay::class.java)
            intent.putExtra("userName",visitingUser)
            startActivity(intent)
        }

        showFavorites.setOnClickListener(){
            val intent = Intent(this, FavoriteDrawingDisplay::class.java)
            intent.putExtra("userName",visitingUser)
            startActivity(intent)
        }

        getNbDrawings(user)
        getNbAlbumsCreated(user)


    }

    private fun getUserFromDB(visitingUser:String) {
        var call: Call<IUser> = iMyService.getUserFromDB(visitingUser)

        call.enqueue(object: retrofit2.Callback<IUser> {
            override fun onResponse(call: Call<IUser>, response: Response<IUser>) {
                Toast.makeText(this@visitingProfile, "Bienvenu sur le profil de $visitingUser!", Toast.LENGTH_SHORT).show()
                userAvatar.setImageBitmap(bitmapDecoder(response.body()?.avatar))
//                username.setText(response.body()?.username)
                user_email.setText(response.body()?.email)
                description_field.setText(response.body()?.description)

            }

            override fun onFailure(call: Call<IUser>, t: Throwable) {
                Toast.makeText(this@visitingProfile, "erreur", Toast.LENGTH_SHORT).show()
            }
        })

    }

    private fun getNbLikes(visitingUser: String) {
        var call: Call<List<IDrawing>> = iMyService.getTopDrawings(visitingUser)
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
                Toast.makeText(this@visitingProfile, "erreur statistique introuvable", Toast.LENGTH_SHORT).show()
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
                Toast.makeText(this@visitingProfile, "erreur statistique introuvable", Toast.LENGTH_SHORT).show()
            }
        })

    }
}
package com.example.mobile

import android.content.ClipDescription
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.Toast
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.google.gson.Gson
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import kotlinx.android.synthetic.main.activity_albums.*
import org.json.JSONArray
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Response
import retrofit2.http.Field
import java.util.ArrayList
import kotlin.properties.Delegates

class Albums : AppCompatActivity(), CreateAlbumPopUp.DialogListener ,AlbumAdapter.AlbumAdapterListener {
    private lateinit var user: String
    private lateinit var rvOutputAlbums: RecyclerView
    private lateinit var albumAdapter: AlbumAdapter
    private lateinit var albums : ArrayList<Album>
    private lateinit var displayAlbumsBtn: Button
    private lateinit var iMyService: IMyService
    private lateinit var albumName: String
    private lateinit var albumDescription: String
    private lateinit var owner:String
    internal var compositeDisposable = CompositeDisposable()

    override fun onStop() {
        compositeDisposable.clear()
        super.onStop()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_albums)

        rvOutputAlbums = findViewById(R.id.rvOutputAlbums)
        displayAlbumsBtn = findViewById(R.id.display_albums_btn)

        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        albums = ArrayList()
        user = intent.getStringExtra("userName").toString()

        albumAdapter = AlbumAdapter(this, albums)

        //Recycler View of rooms
        rvOutputAlbums.adapter = albumAdapter
        rvOutputAlbums.layoutManager = GridLayoutManager(this, 3)



        create_album_btn.setOnClickListener(){
            //open popup window
            var dialog=CreateAlbumPopUp()
            dialog.show(supportFragmentManager,"customDialog")
        }

        getUserAlbums()

        displayAlbumsBtn.setOnClickListener {
            val intent = Intent(this, DisplayPublicAlbums::class.java)
            intent.putExtra("userName",user)
            startActivity(intent)
        }

    }

    private fun getUserAlbums() {
        var call: Call<List<Album>> = iMyService.getUserAlbums(user)
        call.enqueue(object: retrofit2.Callback<List<Album>> {

            override fun onResponse(call: Call<List<Album>>, response: Response<List<Album>>) {
                for (album in response.body()!!) {
                    albumAdapter.addAlbum(album)
                    albumAdapter.notifyItemInserted((rvOutputAlbums.adapter as AlbumAdapter).itemCount)
                }
            }

            override fun onFailure(call: Call<List<Album>>, t: Throwable) {
                Log.d("Albums", "onFailure" +t.message )
            }

        })


    }

    override fun popUpListener(albumName: String,albumDescription:String,visibility: String) {
        //getting album information from popup
        this.albumName = albumName
        this.albumDescription=albumDescription
        var isPrivate:Boolean = visibility=="privé"
        this.owner=user
        //list of members
        var usersList = ArrayList<String>()
        usersList.add(user)
        usersList.add("prob")

        var drawingIDs = ArrayList<String>()
        drawingIDs.add("test drawing1")
        drawingIDs.add("test drawing2")

        createNewAlbum(this.albumName,this.owner,this.albumDescription,drawingIDs,usersList,isPrivate)
    }

    override fun albumAdapterListener(albumName: String) {
        this.albumName = albumName
    }

    private fun createNewAlbum(albumName:String,
                               ownerID:String,
                               description: String,
                               drawingIDs:ArrayList<String>,
                               usersList:ArrayList<String>,
                               isPrivate:Boolean) {
        compositeDisposable.add(iMyService.createNewAlbum(albumName,ownerID,description,drawingIDs,usersList,isPrivate)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe { result->
                if(result == "201"){
                    Toast.makeText(this,"Album crée avec succès", Toast.LENGTH_SHORT).show()

                }else{
                    Toast.makeText(this,"Échec de création", Toast.LENGTH_SHORT).show()
                }
            })
    }
}
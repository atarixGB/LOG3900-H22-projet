package com.example.mobile

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.Toast
import androidx.activity.viewModels
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import kotlinx.android.synthetic.main.activity_albums.*
import retrofit2.Call
import retrofit2.Response
import java.util.ArrayList

class Albums : AppCompatActivity(), CreateAlbumPopUp.DialogListener ,AlbumAdapter.AlbumAdapterListener {
    private lateinit var user: String
    private lateinit var rvOutputAlbums: RecyclerView
    private lateinit var albumAdapter: AlbumAdapter
    private lateinit var albums : ArrayList<IAlbum>
    private lateinit var displayAlbumsBtn: Button
    private lateinit var displayAllDrawingsBtn: Button
    private lateinit var iMyService: IMyService
    private lateinit var albumName: String
    private lateinit var publicGalleryBtn : Button
    private lateinit var albumDescription: String
    private lateinit var owner:String
    internal var compositeDisposable = CompositeDisposable()

    private val sharedViewModelToolBar: SharedViewModelToolBar by viewModels()

    override fun onStop() {
        compositeDisposable.clear()
        super.onStop()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_albums)

        rvOutputAlbums = findViewById(R.id.rvOutputAlbums)
        displayAlbumsBtn = findViewById(R.id.display_albums_btn)
        displayAllDrawingsBtn = findViewById(R.id.display_all_drawings_btn)
        publicGalleryBtn= findViewById(R.id.drawing_gallery_btn)

        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        albums = ArrayList()
        user = intent.getStringExtra("userName").toString()
        sharedViewModelToolBar.setUser(user)

        albumAdapter = AlbumAdapter(this, albums)

        //Recycler View of rooms
        rvOutputAlbums.adapter = albumAdapter
        rvOutputAlbums.layoutManager = GridLayoutManager(this, 3)



        create_album_btn.setOnClickListener(){
            //open popup window
            var dialog=CreateAlbumPopUp()
            dialog.show(supportFragmentManager,"customDialog")
        }

        getAllAvailableAlbums()

        displayAlbumsBtn.setOnClickListener {
            val intent = Intent(this, DisplayPublicAlbums::class.java)
            intent.putExtra("userName",user)
            startActivity(intent)
        }

        displayAllDrawingsBtn.setOnClickListener {
            val intent = Intent(this, DisplayAllDrawings::class.java)
            intent.putExtra("userName",user)
            startActivity(intent)
        }

        publicGalleryBtn.setOnClickListener{
            val intent = Intent(this, DrawingsCollection::class.java)
            intent.putExtra("albumName", "album public")
            intent.putExtra("userName", user)
            startActivity(intent)
        }


    }

    private fun getAllAvailableAlbums() {
        var call: Call<List<IAlbum>> = iMyService.getAllAvailableAlbums()
        call.enqueue(object: retrofit2.Callback<List<IAlbum>> {

            override fun onResponse(call: Call<List<IAlbum>>, response: Response<List<IAlbum>>) {
                for (album in response.body()!!) {
                    if (album._id != "622f77abc04d88938c916084") {
                        if (album.members.contains(user)!!) {
                            albumAdapter.addAlbum(album)
                            albumAdapter.notifyItemInserted((rvOutputAlbums.adapter as AlbumAdapter).itemCount)
                        }
                    }
                }
            }

            override fun onFailure(call: Call<List<IAlbum>>, t: Throwable) {
                Log.d("Albums", "onFailure" +t.message )
            }
        })
    }

    override fun popUpListener(albumName: String,albumDescription:String) {
        //getting album information from popup
        this.albumName = albumName
        this.albumDescription=albumDescription
        this.owner=user
        //list of members
        var usersList = ArrayList<String>()
        usersList.add(user)
        //usersList.add("prob")

        var drawingIDs = ArrayList<String>()


        var membershipRequests = ArrayList<String>()
//        membershipRequests.add("test request 1")
//        membershipRequests.add("test request2")

        val newAlbum =IAlbum(_id = null,this.albumName,this.owner,this.albumDescription,drawingIDs,usersList, membershipRequests)
        albumAdapter.addAlbum(newAlbum)
        albumAdapter.notifyItemInserted((rvOutputAlbums.adapter as AlbumAdapter).itemCount)

        createNewAlbum(this.albumName,this.owner,this.albumDescription,drawingIDs,usersList, membershipRequests)
    }

    override fun albumAdapterListener(albumName: String) {
        this.albumName = albumName
        val intent = Intent(this, DrawingsCollection::class.java)
        intent.putExtra("albumName", albumName)
        intent.putExtra("userName", user)
        startActivity(intent)
    }

    private fun createNewAlbum(albumName:String,
                               ownerID:String,
                               description: String,
                               drawingIDs:ArrayList<String>,
                               usersList:ArrayList<String>,
                               membershipRequests: ArrayList<String>) {
        compositeDisposable.add(iMyService.createNewAlbum(albumName,ownerID,description,drawingIDs,usersList, membershipRequests)
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
package com.example.mobile

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.ImageButton
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import io.reactivex.disposables.CompositeDisposable
import retrofit2.Call
import retrofit2.Response
import java.util.ArrayList

class DisplayPublicAlbums : AppCompatActivity(), AlbumAdapter.AlbumAdapterListener {

    private lateinit var user: String
    private lateinit var rvOutputAlbums: RecyclerView
    private lateinit var albumAdapter: AlbumAdapter
    private lateinit var albums : ArrayList<IAlbum>
    private lateinit var iMyService: IMyService
    private lateinit var albumName: String
    private lateinit var leaveBtn: ImageButton
    internal var compositeDisposable = CompositeDisposable()

    override fun onStop() {
        compositeDisposable.clear()
        super.onStop()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_display_public_albums)

        rvOutputAlbums = findViewById(R.id.rvOutputAlbums)
        leaveBtn = findViewById(R.id.leaveBtn)

        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        albums = ArrayList()
        user = intent.getStringExtra("userName").toString()

        albumAdapter = AlbumAdapter(this, albums)

        //Recycler View of rooms
        rvOutputAlbums.adapter = albumAdapter
        rvOutputAlbums.layoutManager = GridLayoutManager(this, 3)

        getAllAvailableAlbums()

        leaveBtn.setOnClickListener {
            val intent = Intent(this, Albums::class.java)
            intent.putExtra("userName", user)
            startActivity(intent)
        }
    }
    private fun getAllAvailableAlbums() {
        var call: Call<List<IAlbum>> = iMyService.getAllAvailableAlbums()
        call.enqueue(object: retrofit2.Callback<List<IAlbum>> {

            override fun onResponse(call: Call<List<IAlbum>>, response: Response<List<IAlbum>>) {
                for (album in response.body()!!) {
                    if (!album.members.contains(user)) {
                        albumAdapter.addAlbum(album)
                        albumAdapter.notifyItemInserted((rvOutputAlbums.adapter as AlbumAdapter).itemCount)
                    }
                }
            }

            override fun onFailure(call: Call<List<IAlbum>>, t: Throwable) {
                Log.d("PublicAlbums", "onFailure" +t.message )
            }

        })


    }

    override fun albumAdapterListener(
        albumName: String,
        albumsMembers: ArrayList<String>,
        albumOwner: String,
        albumMembershipRequests: ArrayList<String>
    ) {
        this.albumName = albumName
        //Open Popup Window
        var dialog = JoinAlbumPopUp(albumName, user)
        dialog.show(supportFragmentManager, "customDialog")
    }
}
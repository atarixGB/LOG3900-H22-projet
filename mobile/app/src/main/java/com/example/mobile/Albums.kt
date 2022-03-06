package com.example.mobile

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import io.reactivex.disposables.CompositeDisposable
import retrofit2.Call
import retrofit2.Response
import java.util.ArrayList

class Albums : AppCompatActivity(), AlbumAdapter.AlbumAdapterListener {
    private lateinit var user: String
    private lateinit var rvOutputAlbums: RecyclerView
    private lateinit var albumAdapter: AlbumAdapter
    private lateinit var albums : ArrayList<Album>
    private lateinit var displayAlbumsBtn: Button
    private lateinit var iMyService: IMyService
    private lateinit var albumName: String
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

    override fun albumAdapterListener(albumName: String) {
        this.albumName = albumName
    }
}
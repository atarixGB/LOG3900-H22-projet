package com.example.mobile.activity.albums

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.ImageButton
import android.widget.SearchView
import android.widget.Toast
import androidx.activity.viewModels
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.Interface.IAlbum
import com.example.mobile.Interface.IDrawing
import com.example.mobile.R
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.activity.drawing.DrawingActivity
import com.example.mobile.adapter.DrawingAdapter
import com.example.mobile.viewModel.SharedViewModelToolBar
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import retrofit2.Call
import retrofit2.Response
import java.util.*
import kotlin.collections.ArrayList

class DisplayAllDrawings : AppCompatActivity(), DrawingAdapter.DrawingAdapterListener {
    private lateinit var leaveActivityBtn: ImageButton
    private lateinit var user: String
    private lateinit var searchView: SearchView
    private lateinit var rvOutputDrawings: RecyclerView
    private lateinit var drawingAdapter: DrawingAdapter
    private lateinit var drawings: ArrayList<IDrawing>
    private lateinit var searchArrayList: ArrayList<IDrawing>
    private val sharedViewModelToolBar: SharedViewModelToolBar by viewModels()


    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()

    override fun onStop() {
        compositeDisposable.clear()
        super.onStop()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_display_all_drawings)

        leaveActivityBtn = findViewById(R.id.leaveActivityBtn)
        rvOutputDrawings = findViewById(R.id.rvOutputDrawings)

        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        searchView = findViewById<SearchView>(R.id.drawingsSearchView)
        searchView.queryHint = "cherchez un dessin"

        user = intent.getStringExtra("userName").toString()
        sharedViewModelToolBar.setUser(user)

        drawings = java.util.ArrayList()
        searchArrayList = ArrayList()

        drawingAdapter = DrawingAdapter(this, drawings, user, "")

        //Recycler View of rooms
        rvOutputDrawings.adapter = drawingAdapter
        rvOutputDrawings.layoutManager = GridLayoutManager(this, 3)

        getAllAvailableAlbums()


        leaveActivityBtn.setOnClickListener {
            val intent = Intent(this, Albums::class.java)
            intent.putExtra("userName", user)
            startActivity(intent)
        }

        searchView.setOnQueryTextListener(object: SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean {
                return false
            }

            override fun onQueryTextChange(newText: String?): Boolean {
                filter(newText)
                return false
            }
        })
    }

    private fun filter(newText: String?) {
        searchArrayList.clear()
        val searchText = newText!!.lowercase(Locale.getDefault())
        if (!searchText.isEmpty()) {
            drawings.forEach {
                if ((it.name!!.lowercase(Locale.getDefault()).contains(searchText)) ||
                    (it.owner!!.lowercase(Locale.getDefault()).contains(searchText))
                ){
                    searchArrayList.add(it)
                }
            }
            drawingAdapter.searchArrayList(searchArrayList)
        } else {
            searchArrayList.clear()
            searchArrayList.addAll(drawings)
            drawingAdapter.notifyDataSetChanged()
        }
    }

    private fun getAllAvailableAlbums() {
        var call: Call<List<IAlbum>> = iMyService.getAllAvailableAlbums()
        call.enqueue(object: retrofit2.Callback<List<IAlbum>> {

            override fun onResponse(call: Call<List<IAlbum>>, response: Response<List<IAlbum>>) {
                for (album in response.body()!!) {
                    if (album.members.contains(user)!!) {
                        if (!album.drawingIDs.isNullOrEmpty()) {
                            for (drawing in album.drawingIDs!!) {
                                displayDrawing(drawing)
                            }
                        }
                    }
                }
            }

            override fun onFailure(call: Call<List<IAlbum>>, t: Throwable) {
                Log.d("Albums", "onFailure" +t.message )
            }
        })
    }

    private fun displayDrawing(drawingId: String) {
        var call: Call<IDrawing> = iMyService.getDrawingData(drawingId)
        call.enqueue(object: retrofit2.Callback<IDrawing> {

            override fun onResponse(call: Call<IDrawing>, response: Response<IDrawing>) {
                val currentDrawing = response.body()

                drawingAdapter.addDrawing(currentDrawing!!)
                drawingAdapter.notifyItemInserted((rvOutputDrawings.adapter as DrawingAdapter).itemCount)
            }

            override fun onFailure(call: Call<IDrawing>, t: Throwable) {
                Log.d("Albums", "onFailure" +t.message )
            }
        })
    }

    override fun drawingAdapterListener(drawingName: String) {
        TODO("Not yet implemented")
    }

    override fun addLikeToDrawingAdapterListener(drawingId: String) {
        addLikeToDrawing(drawingId)
    }

    override fun emitJoinDrawingListener(drawingId: String) {
        TODO("Not yet implemented")
    }


    private fun addLikeToDrawing(drawingId: String) {
        compositeDisposable.add(iMyService.addLikeToDrawing(drawingId, user)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe { result ->
                if (result == "201") {
                    Toast.makeText(this, "liked", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(this, "erreur", Toast.LENGTH_SHORT).show()
                }
            })
    }


}
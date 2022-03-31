package com.example.mobile.activity.profile

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.ImageButton
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.Interface.IDrawing
import com.example.mobile.R
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.adapter.SimpleDrawingAdapter
import io.reactivex.disposables.CompositeDisposable
import retrofit2.Call
import retrofit2.Response

class FavoriteDrawingDisplay : AppCompatActivity(),SimpleDrawingAdapter.SimpleDrawingAdapterListener {
    private lateinit var drawingName: String
    private lateinit var drawings: ArrayList<IDrawing>
    private lateinit var leaveTopBtn: ImageButton
    private lateinit var user: String
    private lateinit var favoriteDrawingAdapter: SimpleDrawingAdapter
    private lateinit var rvOutputFavoriteDrawings: RecyclerView
    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()

    override fun onStop() {
        compositeDisposable.clear()
        super.onStop()
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_favorite_drawing_display)

        user = intent.getStringExtra("userName").toString()
        drawings = java.util.ArrayList()
        rvOutputFavoriteDrawings = findViewById(R.id.rvOutputFavoriteDrawings)
        leaveTopBtn = findViewById(R.id.leaveFavoriteBtn)

        favoriteDrawingAdapter = SimpleDrawingAdapter(this, drawings)

        //Recycler View of rooms
        rvOutputFavoriteDrawings.adapter = favoriteDrawingAdapter
        rvOutputFavoriteDrawings.layoutManager = GridLayoutManager(this, 3)

        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)


        leaveTopBtn.setOnClickListener {
            val intent = Intent(this, Profile::class.java)
            intent.putExtra("userName", user)
            startActivity(intent)
        }

        getFavoriteDrawings(user)
    }

    override fun SimpledrawingAdapterListener(drawingName: String) {
        this.drawingName=drawingName
    }

    private fun getFavoriteDrawings(user: String) {
        var call: Call<List<IDrawing>> = iMyService.getFavoriteDrawings(user)
        call.enqueue(object: retrofit2.Callback<List<IDrawing>> {

            override fun onResponse(call: Call<List<IDrawing>>, response: Response<List<IDrawing>>) {
                for(drawing in response.body()!!){
                    favoriteDrawingAdapter.addDrawing(drawing!!)
                    favoriteDrawingAdapter.notifyItemInserted((rvOutputFavoriteDrawings.adapter as SimpleDrawingAdapter).itemCount)
                }
            }

            override fun onFailure(call: Call<List<IDrawing>>, t: Throwable) {
                Log.d("favoris", "onFailure" +t.message )
            }
        })
    }
}
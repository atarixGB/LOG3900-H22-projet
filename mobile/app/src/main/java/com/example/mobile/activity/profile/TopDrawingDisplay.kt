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
import com.example.mobile.activity.albums.Albums
import com.example.mobile.adapter.DrawingAdapter
import com.example.mobile.adapter.TopDrawingAdapter
import io.reactivex.disposables.CompositeDisposable
import kotlinx.android.synthetic.main.item_drawing.*
import retrofit2.Call
import retrofit2.Response

class TopDrawingDisplay : AppCompatActivity(),TopDrawingAdapter.TopDrawingAdapterListener {
    private lateinit var drawingName: String
    private lateinit var drawings: ArrayList<IDrawing>
    private lateinit var leaveTopBtn: ImageButton
    private lateinit var user: String
    private lateinit var topDrawingAdapter: TopDrawingAdapter
    private lateinit var rvOutputTopDrawings: RecyclerView
    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()

    override fun onStop() {
        compositeDisposable.clear()
        super.onStop()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_top_dessin)
        user = intent.getStringExtra("userName").toString()
        drawings = java.util.ArrayList()
        rvOutputTopDrawings = findViewById(R.id.rvOutputTopDrawings)
        leaveTopBtn = findViewById(R.id.leaveTopBtn)

        leaveTopBtn.setOnClickListener {
            val intent = Intent(this, Profile::class.java)
            intent.putExtra("userName", user)
            startActivity(intent)
        }

        topDrawingAdapter = TopDrawingAdapter(this, drawings)

        //Recycler View of rooms
        rvOutputTopDrawings.adapter = topDrawingAdapter
        rvOutputTopDrawings.layoutManager = GridLayoutManager(this, 3)

        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        getTopDrawings(user)
    }

    override fun TopdrawingAdapterListener(drawingName: String) {
        this.drawingName=drawingName
    }

    private fun getTopDrawings(user: String) {
        var call: Call<IDrawing> = iMyService.getTopDrawings(user)
        call.enqueue(object: retrofit2.Callback<IDrawing> {

            override fun onResponse(call: Call<IDrawing>, response: Response<IDrawing>) {
                val currentDrawing = response.body()

                topDrawingAdapter.addDrawing(currentDrawing!!)
                topDrawingAdapter.notifyItemInserted((rvOutputTopDrawings.adapter as TopDrawingAdapter).itemCount)
            }

            override fun onFailure(call: Call<IDrawing>, t: Throwable) {
                Log.d("Albums", "onFailure" +t.message )
            }
        })
    }


}
package com.example.mobile.activity.profile

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.ImageButton
import androidx.activity.viewModels
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.Interface.IDrawing
import com.example.mobile.R
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.adapter.DrawingAdapter
import com.example.mobile.adapter.SimpleDrawingAdapter
import com.example.mobile.viewModel.SharedViewModelToolBar
import io.reactivex.disposables.CompositeDisposable

import retrofit2.Call
import retrofit2.Response

class TopDrawingDisplay : AppCompatActivity(),SimpleDrawingAdapter.SimpleDrawingAdapterListener {
    private lateinit var drawingName: String
    private lateinit var drawings: ArrayList<IDrawing>
    private lateinit var leaveTopBtn: ImageButton
    private lateinit var user: String
    private lateinit var simpleDrawingAdapter: SimpleDrawingAdapter
    private lateinit var rvOutputTopDrawings: RecyclerView
    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()
    private val sharedViewModel: SharedViewModelToolBar by viewModels()


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

        sharedViewModel.setUser(user)


        leaveTopBtn.setOnClickListener {
            val intent = Intent(this, Profile::class.java)
            intent.putExtra("userName", user)
            startActivity(intent)
        }

        simpleDrawingAdapter = SimpleDrawingAdapter(this, drawings,user)

        //Recycler View of rooms
        rvOutputTopDrawings.adapter = simpleDrawingAdapter
        rvOutputTopDrawings.layoutManager = GridLayoutManager(this, 3)

        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        getTopDrawings(user)
    }

    override fun SimpledrawingAdapterListener(drawingName: String) {
        this.drawingName=drawingName
    }

    private fun getTopDrawings(user: String) {
        var call: Call<List<IDrawing>> = iMyService.getTopDrawings(user)
        call.enqueue(object: retrofit2.Callback<List<IDrawing>> {

            override fun onResponse(call: Call<List<IDrawing>>, response: Response<List<IDrawing>>) {
                for(drawing in response.body()!!){
                    displayDrawing(drawing._id!!)
                }
            }

            override fun onFailure(call: Call<List<IDrawing>>, t: Throwable) {
                Log.d("Top dessins", "onFailure" +t.message )
            }
        })
    }

    private fun displayDrawing(drawingId: String) {
        var call: Call<IDrawing> = iMyService.getDrawingData(drawingId)
        call.enqueue(object: retrofit2.Callback<IDrawing> {

            override fun onResponse(call: Call<IDrawing>, response: Response<IDrawing>) {
                val drawing = response.body()

                simpleDrawingAdapter.addDrawing(drawing!!)
                simpleDrawingAdapter.notifyItemInserted((rvOutputTopDrawings.adapter as SimpleDrawingAdapter).itemCount)
            }

            override fun onFailure(call: Call<IDrawing>, t: Throwable) {
                Log.d("top dessins", "onFailure" +t.message )
            }
        })
    }


}
package com.example.mobile.activity.profile

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.ImageButton
import android.widget.Toast
import androidx.activity.viewModels
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.Interface.IDrawing
import com.example.mobile.MUSIC
import com.example.mobile.MUSIC_TRACK
import com.example.mobile.R
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.adapter.DrawingAdapter
import com.example.mobile.adapter.SimpleDrawingAdapter
import com.example.mobile.viewModel.SharedViewModelToolBar
import io.reactivex.disposables.CompositeDisposable
import kotlinx.android.synthetic.main.activity_profile_modification.*
import kotlinx.android.synthetic.main.activity_top_dessin.*

import retrofit2.Call
import retrofit2.Response

class TopDrawingDisplay : AppCompatActivity(),SimpleDrawingAdapter.SimpleDrawingAdapterListener {
    private lateinit var drawingName: String
    private lateinit var drawings: ArrayList<IDrawing>
    private lateinit var leaveTopBtn: ImageButton
    private lateinit var user: String
    private lateinit var simpleDrawingAdapter: SimpleDrawingAdapter
    private var displaySize:Int = 1
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
        rvOutputTopDrawings.layoutManager = GridLayoutManager(this,3)

        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)


        val topSelector:MutableList<String> = ArrayList()
        for (i in 1..10){
            topSelector.add("$i")
        }
        topSelector.add("tous")

        val adapter2 = ArrayAdapter(this, R.layout.support_simple_spinner_dropdown_item,topSelector)
        nbTopControl.adapter = adapter2
        nbTopControl.onItemSelectedListener = object: AdapterView.OnItemSelectedListener{
            override fun onItemSelected(
                parent: AdapterView<*>?,
                view: View?,
                position: Int,
                id: Long
            ) {
                val item = topSelector[position]
                Toast.makeText(this@TopDrawingDisplay,"$item selected", Toast.LENGTH_SHORT).show()

                when(item){
                    "1" -> displaySize=1
                    "2" -> displaySize=2
                    "3" -> displaySize=3
                    "4" -> displaySize=4
                    "5" -> displaySize=5
                    "6" -> displaySize=6
                    "7" -> displaySize=7
                    "8" -> displaySize=8
                    "9" -> displaySize=9
                    "10" -> displaySize=10
                    "tous"->displaySize=11
                }
                getTopDrawings(user)
            }

            override fun onNothingSelected(parent: AdapterView<*>?) {}
        }


    }

    override fun SimpledrawingAdapterListener(drawingName: String) {
        this.drawingName=drawingName
    }

    private fun getTopDrawings(user: String) {
        var call: Call<List<IDrawing>> = iMyService.getTopDrawings(user)
        call.enqueue(object: retrofit2.Callback<List<IDrawing>> {

            override fun onResponse(call: Call<List<IDrawing>>, response: Response<List<IDrawing>>) {
                if(displaySize==11){
                    drawings.clear()
                    simpleDrawingAdapter.notifyDataSetChanged()

                    for(drawing in response.body()!!){
                        displayDrawing(drawing._id!!)
                    }
                }
                else{
                    var i=0
                    drawings.clear()
                    simpleDrawingAdapter.notifyDataSetChanged()

                    for(drawing in response.body()!!){
                        if(i<displaySize){
                            displayDrawing(drawing._id!!)
                        }
                        i++
                    }
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
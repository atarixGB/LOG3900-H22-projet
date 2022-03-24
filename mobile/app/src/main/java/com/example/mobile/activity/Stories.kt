package com.example.mobile.activity

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import com.example.mobile.Interface.IDrawing
import com.example.mobile.R
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.adapter.DrawingAdapter
import com.example.mobile.bitmapDecoder
import com.squareup.picasso.Callback
import com.squareup.picasso.Picasso
import io.reactivex.disposables.CompositeDisposable
import jp.shts.android.storiesprogressview.StoriesProgressView
import kotlinx.android.synthetic.main.activity_stories.*
import kotlinx.android.synthetic.main.item_drawing.view.*
import retrofit2.Call
import retrofit2.Response
import java.lang.Exception

class Stories : AppCompatActivity() {

    private var counter = 0
//    lateinit var drawingsId: ArrayList<String>
    lateinit var drawingsData : ArrayList<String>

    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()

    override fun onStop() {
        compositeDisposable.clear()
        super.onStop()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_stories)

        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        drawingsData = intent.getStringArrayListExtra("drawingsData") as ArrayList<String>

        val bitmapTest = bitmapDecoder(drawingsData[0])
        stories.setStoriesCount(drawingsData.size)
        stories.setStoryDuration(1000L)

        //load first image
        Picasso.get().load(drawingsData[0]).into(image, object:Callback {
            override fun onSuccess() {
                //if first image is load - start stories
                stories.startStories()
            }

            override fun onError(e: Exception?) {
            }

        })

        stories.setStoriesListener(object:StoriesProgressView.StoriesListener{
            override fun onNext() {
                if (counter < drawingsData.size) {
                    counter++
                    Picasso.get().load(drawingsData[counter]).into(image)
                }
            }

            override fun onPrev() {
                if (counter>0) {
                    counter--
                    Picasso.get().load(drawingsData[counter]).into(image)
                }
            }

            override fun onComplete() {
                counter = 0 //reset
                Toast.makeText(this@Stories, "load done", Toast.LENGTH_SHORT).show()
            }

        })
    }
}
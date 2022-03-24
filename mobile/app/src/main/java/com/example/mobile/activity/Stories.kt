package com.example.mobile.activity

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.view.MotionEvent
import android.view.View.OnTouchListener
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.example.mobile.R
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.bitmapDecoder
import com.example.mobile.viewModel.SharedViewModelStories
import io.reactivex.disposables.CompositeDisposable
import jp.shts.android.storiesprogressview.StoriesProgressView
import kotlinx.android.synthetic.main.activity_stories.*


class Stories : AppCompatActivity() {

    private var counter = 0
    private lateinit var userName: String
    var owner = String()
    var drawingsData = ArrayList<String>()

    private val sharedViewModelStories: SharedViewModelStories by viewModels()

    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()

    override fun onStop() {
        compositeDisposable.clear()
        super.onStop()
    }

    @SuppressLint("ClickableViewAccessibility")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_stories)

        userName = intent.getStringExtra("userName").toString()
        owner = intent.getStringExtra("owner").toString()
        drawingsData = intent.getStringArrayListExtra("drawingsData") as ArrayList<String>

        storyOwner.text = owner

        stories.setStoriesCount(drawingsData.size)
        stories.setStoryDuration(5000L)

        //load first image
        image.setImageBitmap(bitmapDecoder(drawingsData[0]))
        stories.startStories()

        stories.setStoriesListener(object:StoriesProgressView.StoriesListener{
            override fun onNext() {
                if (counter < drawingsData.size) {
                    counter++
                    image.setImageBitmap(bitmapDecoder(drawingsData[counter]))
                }
            }

            override fun onPrev() {
                if (counter > 0) {
                    counter--
                    image.setImageBitmap(bitmapDecoder(drawingsData[counter]))
                }
            }

            override fun onComplete() {
                counter = 0 //reset
                //reviens au dashboad
                val intent = Intent(this@Stories, Dashboard::class.java)
                intent.putExtra("userName",userName)
                startActivity(intent)
            }

        })


        image.setOnTouchListener(OnTouchListener { v, event ->
            if (event.action == MotionEvent.ACTION_DOWN) {
                stories.pause()
            }

            if (event.action == MotionEvent.ACTION_UP) {
                val x = event.x.toInt()
                val y = event.y.toInt()
                if (x < (window.decorView.width / 2)) {
                    stories.resume()
                    stories.reverse()

                } else {
                    stories.resume()
                    stories.skip()
                }
            }

            true
        })
    }
}


package com.example.mobile.activity

import android.app.ProgressDialog.show
import android.app.ActivityOptions
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.ImageView
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.Interface.IDrawing
import com.example.mobile.Interface.IStory
import com.example.mobile.Interface.IUser
import com.example.mobile.R
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.activity.drawing.DrawingActivity
import com.example.mobile.adapter.StoryAdapter
import com.example.mobile.popup.StoriesPopUp
import com.example.mobile.viewModel.SharedViewModelToolBar
import io.reactivex.disposables.CompositeDisposable
import retrofit2.Call
import retrofit2.Response
import java.io.Serializable


class Dashboard : AppCompatActivity(), StoryAdapter.StoryAdapterListener {

    lateinit var user: String
    private lateinit var rvOutputStories: RecyclerView
    private lateinit var storyAdapter: StoryAdapter
    private lateinit var stories: ArrayList<IStory>
    private lateinit var sessionStartBtn: ImageView

    private lateinit var displayStoriesPopUp: StoriesPopUp

    private val sharedViewModel: SharedViewModelToolBar by viewModels()

    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()

    override fun onStop() {
        compositeDisposable.clear()
        super.onStop()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)

        user = intent.getStringExtra("userName").toString()
        sharedViewModel.setUser(user)

        sessionStartBtn = findViewById(R.id.session_start)
        rvOutputStories = findViewById(R.id.rvOutputStories)

        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        stories = java.util.ArrayList()

        storyAdapter = StoryAdapter(this, stories, user)

        //Recycler View of rooms
        rvOutputStories.adapter = storyAdapter
        rvOutputStories.layoutManager = LinearLayoutManager(this, RecyclerView.HORIZONTAL, false)

        getAllUsers()

        sessionStartBtn.setOnClickListener {
            openSoloDrawing()
        }
    }

    private fun openSoloDrawing() {
        val intent = Intent(this, DrawingActivity::class.java)
        var bundle:Bundle = ActivityOptions.makeSceneTransitionAnimation(this).toBundle()
        startActivity(intent,bundle)
    }

    private fun getAllUsers() {
        var call: Call<List<IUser>> = iMyService.getAllUsers()
        call.enqueue(object : retrofit2.Callback<List<IUser>> {

            override fun onResponse(call: Call<List<IUser>>, response: Response<List<IUser>>) {
                if (response.body() != null) {
                    for (userElement in response.body()!!) {
                        if (userElement.identifier != user && !userElement.avatar.isNullOrEmpty()) {
                            getAllUserDrawings(userElement.identifier!!, userElement.avatar!!)
                        }
                    }
                }
            }

            override fun onFailure(call: Call<List<IUser>>, t: Throwable) {
                Log.d("Dashboard", "onFailure" + t.message)
            }

        })
    }

    private fun getAllUserDrawings(userName: String, avatar: String) {
        var call: Call<List<IDrawing>> = iMyService.getAllUserDrawings(userName)
        call.enqueue(object : retrofit2.Callback<List<IDrawing>> {

            override fun onResponse(
                call: Call<List<IDrawing>>,
                response: Response<List<IDrawing>>
            ) {
                var drawingsId = arrayListOf<String>()
                for (drawing in response.body()!!) {
                    if (drawing.isStory == true) {
                        drawingsId.add(drawing._id!!)
                    }
                }

                if (!drawingsId.isEmpty()) {
                    addStory(userName, avatar, drawingsId)
                }
            }

            override fun onFailure(call: Call<List<IDrawing>>, t: Throwable) {
                Log.d("Dashboard", "onFailure" + t.message)
            }

        })
    }

    private fun addStory(owner: String, avatar: String, drawingsId: ArrayList<String>) {

        val story = IStory(owner, avatar, drawingsId)

        storyAdapter.addStory(story)
        storyAdapter.notifyItemInserted((rvOutputStories.adapter as StoryAdapter).itemCount)

    }

    override fun storyAdapterListener(currentStory: IStory) {
        //quand on click sur un avatar, on convertit les drawingsId en data et envoie les drawings a l'activite stories
        sendDrawingsData(currentStory)
    }

    private fun sendDrawingsData(currentStory: IStory) {
        var drawingsData = arrayListOf<String>()
        currentStory.drawingsId.forEach { element ->
            var call: Call<IDrawing> = iMyService.getDrawingData(element)
            call.enqueue(object : retrofit2.Callback<IDrawing> {

                override fun onResponse(call: Call<IDrawing>, response: Response<IDrawing>) {
                    val currentDrawing = response.body()
                    if (currentDrawing != null) {
                        drawingsData.add(currentDrawing.data!!)
                        if (drawingsData.size == currentStory.drawingsId.size) {
//                            val intent = Intent(this@Dashboard, Stories::class.java)
//                            intent.putExtra("userName",user)
//                            intent.putExtra("owner", currentStory.owner)
//                            intent.putExtra("avatar", currentStory.avatar)
//                            intent.putExtra("drawingsData", drawingsData)
//                            startActivity(intent)
                            displayStoriesPopUp = StoriesPopUp(
                                currentStory.owner,
                                currentStory.avatar,
                                user,
                                drawingsData
                            )
                            displayStoriesPopUp.show(
                                supportFragmentManager,
                                "customDialog"
                            )
                        }
                    }
                }

                override fun onFailure(call: Call<IDrawing>, t: Throwable) {
                    Log.d("Dashboard", "onFailure" + t.message)
                }
            })
        }
    }
}
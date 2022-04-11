package com.example.mobile.popup

import android.annotation.SuppressLint
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.DialogFragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.mobile.R
import com.example.mobile.activity.Dashboard
import com.example.mobile.activity.profile.visitingProfile
import com.example.mobile.adapter.UserAdapter
import com.example.mobile.bitmapDecoder
import jp.shts.android.storiesprogressview.StoriesProgressView
import kotlinx.android.synthetic.main.activity_accept_membership_requests_pop_up.view.*
import kotlinx.android.synthetic.main.activity_stories_pop_up.view.*
import kotlinx.android.synthetic.main.activity_users_list_pop_up.view.*
import java.util.ArrayList

class StoriesPopUp (val owner: String, val avatar: String, val user:String,val drawingsData: ArrayList<String>) : DialogFragment() {
    private var counter = 0
    private var i = 0


    @SuppressLint("ClickableViewAccessibility")
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        var rootView: View = inflater.inflate(R.layout.activity_stories_pop_up, container, false)


            rootView.storyOwner.text = owner
            rootView.userAvatar.setImageBitmap(bitmapDecoder(avatar))

            rootView.stories.setStoriesCount(drawingsData.size)
            rootView.stories.setStoryDuration(5000L)

            //load first image
            rootView.image.setImageBitmap(bitmapDecoder(drawingsData[0]))
            rootView.stories.startStories()

            rootView.storyOwner.setOnClickListener{
                val intent = Intent(context, visitingProfile::class.java)
                intent.putExtra("user", user)
                intent.putExtra("visitingUser",  rootView.storyOwner.text)
                startActivity(intent)
            }

            rootView.stories.setStoriesListener(object : StoriesProgressView.StoriesListener {
                override fun onNext() {
                    if (counter < drawingsData.size) {
                        counter++
                        rootView.image.setImageBitmap(bitmapDecoder(drawingsData[counter]))
                    }
                }

                override fun onPrev() {
                    if (counter > 0) {
                        counter--
                        rootView.image.setImageBitmap(bitmapDecoder(drawingsData[counter]))
                    }
                }

                override fun onComplete() {
                    counter = 0 //reset
                    dismiss()
                }

            })


            rootView.image.setOnTouchListener(View.OnTouchListener { v, event ->
                if (event.action == MotionEvent.ACTION_DOWN) {
                    rootView.stories.pause()
                }

                if (event.action == MotionEvent.ACTION_UP) {
                    val x = event.x.toInt()
                    val y = event.y.toInt()
                    if (x < (rootView.width / 2)) {
                        rootView.stories.resume()
                        rootView.stories.reverse()

                    } else {
                        rootView.stories.resume()
                        rootView.stories.skip()
                    }
                }

                true
            })

        return rootView
    }

}
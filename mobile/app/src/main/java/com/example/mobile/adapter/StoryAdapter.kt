package com.example.mobile.adapter

import android.content.Context
import android.graphics.Bitmap
import android.graphics.drawable.Drawable
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.activityViewModels
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.Interface.IDrawing
import com.example.mobile.Interface.IStory
import com.example.mobile.R
import com.example.mobile.bitmapDecoder
import com.example.mobile.viewModel.SharedViewModelToolBar
import com.mikhaellopez.circularimageview.CircularImageView
import kotlinx.android.synthetic.main.item_drawing.view.*
import kotlinx.android.synthetic.main.item_story.view.*
import java.util.ArrayList

class StoryAdapter (val context: Context?, var stories: ArrayList<IStory>, val user: String) : RecyclerView.Adapter<StoryAdapter.StoryViewHolder>() {

    private var listener: StoryAdapterListener = context as StoryAdapterListener

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): StoryViewHolder {
        return StoryViewHolder(
            LayoutInflater.from(parent.context).inflate(
                R.layout.item_story,
                parent,
                false
            )
        )
    }

    override fun onBindViewHolder(holder: StoryViewHolder, position: Int) {
        val currentStory = stories[position]

        holder.itemView.apply {
            storyOwner.text = currentStory.owner
            userAvatar.setImageBitmap(currentStory.avatar)

            userAvatar.setOnClickListener {
                listener.storyAdapterListener(currentStory)
            }
        }
    }

    fun addStory (story: IStory) {
        stories.add(story)
    }

    override fun getItemCount(): Int {
        return stories.size
    }

    public interface StoryAdapterListener {
        fun storyAdapterListener(drawingsId: IStory)
    }


    class StoryViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView)
}
package com.example.mobile.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.Interface.IDrawing
import com.example.mobile.R
import com.example.mobile.bitmapDecoder
import kotlinx.android.synthetic.main.item_drawing.view.*
import java.util.ArrayList

class DrawingAdapter (val context: Context?, var drawings: ArrayList<IDrawing>, val user: String) : RecyclerView.Adapter<DrawingAdapter.DrawingViewHolder>() {

    private var listener: DrawingAdapterListener = context as DrawingAdapterListener
//    private var alreadyLiked: Boolean = false

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): DrawingViewHolder {
        return DrawingViewHolder(
            LayoutInflater.from(parent.context).inflate(
                R.layout.item_drawing,
                parent,
                false
            )
        )
    }

    override fun onBindViewHolder(holder: DrawingViewHolder, position: Int) {
        val currentDrawing = drawings[position]



        holder.itemView.apply {
            drawingName.text = currentDrawing.name
            owner.text = currentDrawing.owner

            var likes = arrayListOf<String>()
            var incrementNbrOfLikes = 0

            if (currentDrawing.likes != null) {
                incrementNbrOfLikes = currentDrawing.likes.size
                likes = currentDrawing.likes
                if (currentDrawing.likes.contains(user)) {
                    likeBtn.setBackgroundResource(R.drawable.imageliked)
                }
            }

            nbrOfLikes.text = incrementNbrOfLikes.toString()

            imgDrawing.setImageBitmap(bitmapDecoder(currentDrawing.data))

            imgDrawing.setOnClickListener {
                listener.drawingAdapterListener(drawingName.text.toString())
            }

            likeBtn.setOnClickListener {
                if (!likes.contains(user)){
                    listener.addLikeToDrawingAdapterListener(currentDrawing._id!!)
                    likes.add(user)
                    incrementNbrOfLikes++
                    nbrOfLikes.text = incrementNbrOfLikes.toString()
                    likeBtn.setBackgroundResource(R.drawable.imageliked)
                } else {
                    Toast.makeText(context, "already liked", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    fun addDrawing (drawing: IDrawing) {
        drawings.add(drawing)
    }

    fun searchArrayList (list: ArrayList<IDrawing>) {
        drawings = list
        notifyDataSetChanged()
    }

    override fun getItemCount(): Int {
        return drawings.size
    }

    public interface DrawingAdapterListener {
        fun drawingAdapterListener(drawingName: String)
        fun addLikeToDrawingAdapterListener(drawingId: String)
    }


    class DrawingViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView)
}
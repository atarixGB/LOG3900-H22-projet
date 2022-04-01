package com.example.mobile.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.Interface.IDrawing
import com.example.mobile.R
import com.example.mobile.bitmapDecoder
import kotlinx.android.synthetic.main.item_drawing.view.*
import kotlinx.android.synthetic.main.item_top_drawing.view.*
import kotlinx.android.synthetic.main.item_top_drawing.view.likeBtn
import kotlinx.android.synthetic.main.item_top_drawing.view.nbrOfLikes

class SimpleDrawingAdapter(val context: Context?, var drawings:ArrayList<IDrawing>,val user:String) : RecyclerView.Adapter<SimpleDrawingAdapter.SimpleDrawingViewHolder> (){

    private var listener: SimpleDrawingAdapterListener = context as SimpleDrawingAdapterListener

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SimpleDrawingViewHolder {
        return SimpleDrawingViewHolder(
            LayoutInflater.from(parent.context).inflate(
                R.layout.item_top_drawing,
                parent,
                false
            )
        )
    }

    override fun onBindViewHolder(holder: SimpleDrawingViewHolder, position: Int) {
        val currentDrawing = drawings[position]

        holder.itemView.apply {
            topDrawingName.text = currentDrawing.name
            ownerTop.text = currentDrawing.owner

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

            imgTopDrawing.setImageBitmap(bitmapDecoder(currentDrawing.data))
//            imgTopDrawing.setImageResource(R.drawable.monster1)

            imgTopDrawing.setOnClickListener {
                listener.SimpledrawingAdapterListener(topDrawingName.text.toString())
            }

        }
    }



    fun addDrawing (drawing: IDrawing) {
        drawings.add(drawing)
    }

    fun searchArrayList (list: java.util.ArrayList<IDrawing>) {
        drawings = list
        notifyDataSetChanged()
    }

    override fun getItemCount(): Int {
        return drawings.size
    }
    public interface SimpleDrawingAdapterListener {
        fun SimpledrawingAdapterListener(drawingName: String)

    }
    class SimpleDrawingViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView)
}
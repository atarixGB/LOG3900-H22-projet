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
import kotlinx.android.synthetic.main.item_top_drawing.view.*

class TopDrawingAdapter(val context: Context?, var drawings:ArrayList<IDrawing>) : RecyclerView.Adapter<TopDrawingAdapter.TopDrawingViewHolder> (){

    private var listener: TopDrawingAdapterListener = context as TopDrawingAdapterListener

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TopDrawingViewHolder {
        return TopDrawingViewHolder(
            LayoutInflater.from(parent.context).inflate(
                R.layout.item_top_drawing,
                parent,
                false
            )
        )
    }

    override fun onBindViewHolder(holder: TopDrawingViewHolder, position: Int) {
        val currentDrawing = drawings[position]

        holder.itemView.apply {
            topDrawingName.text = currentDrawing.name
            ownerTop.text = currentDrawing.owner

            var likes = arrayListOf<String>()
            var incrementNbrOfLikes = 0


//            imgDrawing.setImageBitmap(bitmapDecoder(currentDrawing.data))
            imgTopDrawing.setImageResource(R.drawable.monster1)

            imgTopDrawing.setOnClickListener {
                listener.TopdrawingAdapterListener(topDrawingName.text.toString())
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
    public interface TopDrawingAdapterListener {
        fun TopdrawingAdapterListener(drawingName: String)

    }
    class TopDrawingViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView)
}
package com.example.mobile

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import kotlinx.android.synthetic.main.item_album.view.*
import kotlinx.android.synthetic.main.item_drawing.view.*
import java.util.ArrayList

class DrawingAdapter (val context: Context?, var drawings: ArrayList<String>) : RecyclerView.Adapter<DrawingAdapter.DrawingViewHolder>() {

    private var listener: DrawingAdapterListener = context as DrawingAdapterListener

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
            drawingName.text = currentDrawing

            imgDrawing.setOnClickListener {
                listener.drawingAdapterListener(drawingName.text.toString())
            }
        }
    }

    fun addDrawing (drawing: String) {
        drawings.add(drawing)
    }

    override fun getItemCount(): Int {
        return drawings.size
    }

    public interface DrawingAdapterListener {
        fun drawingAdapterListener(drawingName: String)
    }

    class DrawingViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView)
}
package com.example.mobile

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Base64
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import kotlinx.android.synthetic.main.item_album.view.*
import kotlinx.android.synthetic.main.item_drawing.view.*
import java.util.ArrayList

class DrawingAdapter (val context: Context?, var drawings: ArrayList<IDrawing>) : RecyclerView.Adapter<DrawingAdapter.DrawingViewHolder>() {

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
            drawingName.text = currentDrawing.name
            owner.text = currentDrawing.owner
            if (currentDrawing.nbrOfLikes == null) {
                nbrOfLikes.text = "0"
            } else {
                nbrOfLikes.text = currentDrawing.nbrOfLikes.toString()
            }

            imgDrawing.setImageBitmap(bitmapDecoder(currentDrawing.data))

            imgDrawing.setOnClickListener {
                listener.drawingAdapterListener(drawingName.text.toString())
            }
        }
    }

    private fun bitmapDecoder(avatar_str:String?): Bitmap {
        val decodedString: ByteArray = Base64.decode(avatar_str, Base64.DEFAULT)
        return BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
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
    }

    class DrawingViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView)
}
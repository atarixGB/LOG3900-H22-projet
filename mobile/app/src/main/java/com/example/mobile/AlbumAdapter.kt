package com.example.mobile

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import kotlinx.android.synthetic.main.item_album.view.*
import java.util.ArrayList

class AlbumAdapter (val context : Context, var albums: ArrayList<IAlbum>) : RecyclerView.Adapter<AlbumAdapter.RoomViewHolder>() {

    private var listener: AlbumAdapterListener = context as AlbumAdapterListener

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RoomViewHolder {
        return RoomViewHolder(
            LayoutInflater.from(parent.context).inflate(
                R.layout.item_album,
                parent,
                false
            )
        )
    }

    override fun onBindViewHolder(holder: RoomViewHolder, position: Int) {
        val currentAlbum = albums[position]

        holder.itemView.apply {
            albumName.text = currentAlbum.name

            imgAlbum.setOnClickListener {
                listener.albumAdapterListener(albumName.text.toString())
            }
        }
    }

    fun addAlbum (album: IAlbum) {
        albums.add(album)
    }

    override fun getItemCount(): Int {
        return albums.size
    }

    public interface AlbumAdapterListener {
        fun albumAdapterListener(albumName: String)
    }

    class RoomViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView)
}
package com.example.mobile

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import kotlinx.android.synthetic.main.item_album.view.*
import java.util.ArrayList

class AlbumAdapter(val context: Context?, var albums: ArrayList<IAlbum>) : RecyclerView.Adapter<AlbumAdapter.AlbumViewHolder>() {

    private var listener: AlbumAdapterListener = context as AlbumAdapterListener

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AlbumViewHolder {
        return AlbumViewHolder(
            LayoutInflater.from(parent.context).inflate(
                R.layout.item_album,
                parent,
                false
            )
        )
    }

    override fun onBindViewHolder(holder: AlbumViewHolder, position: Int) {
        val currentAlbum = albums[position]

        holder.itemView.apply {
            albumName.text = currentAlbum.name

            imgAlbum.setOnClickListener {
                listener.albumAdapterListener(albumName.text.toString(), albums[position].members, albums[position].owner, albums[position].membershipRequests)
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
        fun albumAdapterListener(albumName: String, albumsMembers: ArrayList<String>, albumOwner: String, albumMembershipRequests: ArrayList<String>)
    }

    class AlbumViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView)
}
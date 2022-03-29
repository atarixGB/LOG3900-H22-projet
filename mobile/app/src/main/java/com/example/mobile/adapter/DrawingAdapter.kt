package com.example.mobile.adapter


import android.content.Context
import android.content.Intent
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.PopupMenu
import androidx.core.content.ContextCompat.startActivity
import androidx.core.view.isVisible
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.Interface.IDrawing
import com.example.mobile.Interface.IVec2
import com.example.mobile.Interface.Stroke
import com.example.mobile.R
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.activity.chat.ChatPage
import com.example.mobile.activity.drawing.DrawingActivity
import com.example.mobile.activity.drawing.DrawingCollaboration
import com.example.mobile.bitmapDecoder
import com.example.mobile.popup.ChangeAlbumPopUp
import com.example.mobile.popup.DrawingNameModificationPopUp
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import io.socket.client.Socket
import io.socket.emitter.Emitter
import kotlinx.android.synthetic.main.item_album.view.*
import kotlinx.android.synthetic.main.item_drawing.view.*
import org.json.JSONArray
import org.json.JSONObject


class DrawingAdapter (val context: Context?, var drawings: ArrayList<IDrawing>, val user: String, val albumID: String) : RecyclerView.Adapter<DrawingAdapter.DrawingViewHolder>(), ChangeAlbumPopUp.DialogListener {

    private var listener: DrawingAdapterListener = context as DrawingAdapterListener
    private lateinit var dialogEditDrawingName: DrawingNameModificationPopUp
    private lateinit var dialogChangeAlbumName: ChangeAlbumPopUp
    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()
    var newDrawingName:String ="new name"
    var newAlbum:String=""
    var socket = DrawingCollaboration()
//    private var alreadyLiked: Boolean = false

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): DrawingViewHolder {
        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)
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

//        socket.init()



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

            if (albumID == "" || user!= currentDrawing.owner) {
                drawingViewOptions.isVisible = false
            }

            drawingViewOptions.setOnClickListener {
                //getAlbumParameters(albumName) //pour avoir les parametres d'album a jour
                val popupMenu = PopupMenu(
                    context,
                    drawingViewOptions
                )

                popupMenu.setOnMenuItemClickListener { menuItem ->
                    //get id of the item clicked and handle clicks
                    when (menuItem.itemId) {
                        R.id.menu_editDrawingParameters -> {
                            //ouvrir pop up modification nom album
                            dialogEditDrawingName= DrawingNameModificationPopUp(currentDrawing._id!!,currentDrawing.name, position)
                            dialogEditDrawingName.show((context as AppCompatActivity).supportFragmentManager,"customDialog")
//                            currentDrawing.name=newDrawingName
//                            drawingName.text = newDrawingName
                            true
                        }
                        R.id.menu_changeAlbum -> {
                            dialogChangeAlbumName= ChangeAlbumPopUp(currentDrawing._id!!, user, position, albumID)
                            dialogChangeAlbumName.show((context as AppCompatActivity).supportFragmentManager,"customDialog")

                            true
                        }
                        R.id.menu_deleteDrawing -> {
                            removeDrawingFromAlbum(currentDrawing._id!!,albumID)
                            deleteDrawing(currentDrawing._id!!)
                            deleteDrawings(position)
                            true
                        }
                        else -> false
                    }
                }

                popupMenu.inflate(R.menu.drawing_options_menu)

                if (user != currentDrawing.owner) {
                    popupMenu.menu.findItem(R.id.menu_editDrawingParameters).isVisible = false
                    popupMenu.menu.findItem(R.id.menu_changeAlbum).isVisible = false
                    popupMenu.menu.findItem(R.id.menu_deleteDrawing).isVisible=false
                }

                //to show icons for menu
                try {
                    val fieldMPopup = PopupMenu::class.java.getDeclaredField("mPopup")
                    fieldMPopup.isAccessible = true
                    val mPopup = fieldMPopup.get(popupMenu)
                    mPopup.javaClass.getDeclaredMethod("setForceShowIcon", Boolean::class.java).invoke(mPopup, true)
                } catch (e: Exception) {
                    Log.e("DrawingAdapter", "Error showing menu icons", e)
                } finally {
                    popupMenu.show()
                }
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

            modifDrawing.setOnClickListener {
//                socket.socket.emit("joinCollab", currentDrawing._id)
                listener.emitJoinDrawingListener(currentDrawing._id!!)
            }
        }

//        socket.socket.on("joinSuccessfulwithID", onJoinCollab)
    }

//    private var onJoinCollab = Emitter.Listener {
////        val joinEvent = it[0] as JSONObject
//        val drawingId = it[0] as String
////        var strokes = java.util.ArrayList<Stroke>()
////        val jsonStrokes = joinEvent["strokes"]  as JSONArray
////        for (i in 0 until jsonStrokes.length()) {
////            val obj = jsonStrokes[i] as JSONObject
////            //boundingPoints.add( IVec2(obj.getDouble("x").toFloat(), obj.getDouble("y").toFloat()) )
////            strokes.add(obj as Stroke)
////        }
//        listener.editDrawingListener(drawingId)
//    }

    fun addDrawing (drawing: IDrawing) {
        drawings.add(drawing)
    }

    fun changeDrawingName(newDrawingName: String, position: Int) {
        drawings[position].name = newDrawingName
    }

    fun deleteDrawings(position: Int) {
        drawings.removeAt(position)
        notifyDataSetChanged()
    }

    fun removeDrawing(drawing:IDrawing){
        drawings.remove(drawing)
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
        fun emitJoinDrawingListener(drawingId: String)
    }


    class DrawingViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView)

    private fun removeDrawingFromAlbum(drawingId: String, albumName:String){
        compositeDisposable.add(iMyService.removeDrawing(drawingId, albumName)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe { result ->
                if (result == "201") {
                    Toast.makeText(context, "dessin supprimé de l'album", Toast.LENGTH_SHORT).show()

                } else {
                    Toast.makeText(context, "erreur de suppression de dessin", Toast.LENGTH_SHORT).show()
                }
            })

    }


    private fun deleteDrawing(drawingId: String){
            compositeDisposable.add(iMyService.deleteDrawing(drawingId)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe { result ->
                    if (result == "201") {
                        Toast.makeText(context, "dessin supprimé définitivement", Toast.LENGTH_SHORT).show()
                    } else {
                        Toast.makeText(context, "erreur de suppression de dessin", Toast.LENGTH_SHORT).show()
                    }
                })

    }



//    override fun popUpListener(drawingName: String) {
//        this.newDrawingName=drawingName
//    }

    override fun changeAlbumPopUpListener(albumName: String, position: Int) {
        this.newAlbum=albumName
    }
}
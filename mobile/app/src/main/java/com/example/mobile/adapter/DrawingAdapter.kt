package com.example.mobile.adapter


import android.content.Context
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.PopupMenu
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.Interface.IDrawing
import com.example.mobile.R
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.bitmapDecoder
import com.example.mobile.popup.DrawingNameModificationPopUp
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import kotlinx.android.synthetic.main.item_drawing.view.*


class DrawingAdapter (val context: Context?, var drawings: ArrayList<IDrawing>, val user: String) : RecyclerView.Adapter<DrawingAdapter.DrawingViewHolder>(),DrawingNameModificationPopUp.DialogListener {

    private var listener: DrawingAdapterListener = context as DrawingAdapterListener
    private lateinit var dialogEditDrawingName: DrawingNameModificationPopUp
    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()
    var newDrawingName:String ="testing new name"
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
                            dialogEditDrawingName= DrawingNameModificationPopUp(currentDrawing.name)
                            dialogEditDrawingName.show((context as AppCompatActivity).supportFragmentManager,"customDialog")
                            currentDrawing.name=newDrawingName
                            true
                        }
                        R.id.menu_changeAlbum -> {
                        true
                        }
                        R.id.menu_deleteDrawing -> {
                            removeDrawing(currentDrawing)
                            deleteDrawing(currentDrawing._id!!)
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
        }
    }

    fun addDrawing (drawing: IDrawing) {
        drawings.add(drawing)
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
    }


    class DrawingViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView)

    private fun deleteDrawing(drawingId: String){
            compositeDisposable.add(iMyService.deleteDrawing(drawingId)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe { result ->
                    if (result == "201") {
                        Toast.makeText(context, "dessin supprimé", Toast.LENGTH_SHORT).show()
                    } else {
                        Toast.makeText(context, "erreur de suppression de dessin", Toast.LENGTH_SHORT).show()
                    }
                })

    }



    override fun popUpListener(drawingName: String) {
        this.newDrawingName=drawingName
    }
}
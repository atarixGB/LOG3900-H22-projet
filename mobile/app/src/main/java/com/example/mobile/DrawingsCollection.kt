package com.example.mobile

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.ImageButton
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.widget.PopupMenu
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import io.reactivex.disposables.CompositeDisposable
import retrofit2.Call
import retrofit2.Response

class DrawingsCollection : AppCompatActivity(), DrawingAdapter.DrawingAdapterListener {
    private lateinit var leaveAlbumBtn: ImageButton
    private lateinit var albumNameTextView: TextView
    private lateinit var albumName: String
    private lateinit var albumMembers: ArrayList<String>
    private lateinit var user: String
    private lateinit var membersListButton: ImageButton
    private lateinit var addDrawingButton: ImageButton
    private lateinit var albumViewOptions: ImageButton
    private lateinit var albumOwner: String
    private lateinit var rvOutputDrawings: RecyclerView
    private lateinit var drawingAdapter: DrawingAdapter
    private lateinit var drawings: ArrayList<String>
    private lateinit var drawingName: String

    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()

    override fun onStop() {
        compositeDisposable.clear()
        super.onStop()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_drawings_collection)

        leaveAlbumBtn = findViewById(R.id.leaveAlbumBtn)
        albumNameTextView = findViewById(R.id.albumName)
        membersListButton = findViewById(R.id.membersListButton)
        addDrawingButton = findViewById(R.id.addDrawingButton)
        albumViewOptions = findViewById(R.id.albumViewOptions)
        rvOutputDrawings = findViewById(R.id.rvOutputDrawings)

        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        albumName = intent.getStringExtra("albumName").toString()
        albumMembers = intent.getStringArrayListExtra("albumMembers") as ArrayList<String>
        albumOwner = intent.getStringExtra("albumOwner").toString()
        user = intent.getStringExtra("userName").toString()

        drawings = java.util.ArrayList()

        drawingAdapter = DrawingAdapter(this, drawings)

        //Recycler View of rooms
        rvOutputDrawings.adapter = drawingAdapter
        rvOutputDrawings.layoutManager = GridLayoutManager(this, 3)

        albumNameTextView.text = albumName

        getAllAlbumDrawings(albumName)

        leaveAlbumBtn.setOnClickListener {
            val intent = Intent(this, Albums::class.java)
            intent.putExtra("userName", user)
            startActivity(intent)
        }

        membersListButton.setOnClickListener {
            //ouvrir le popup window des utilisateurs
            var dialog = UsersListPopUp(albumName, albumMembers)
            dialog.show(supportFragmentManager, "customDialog")
        }

        addDrawingButton.setOnClickListener {
            Toast.makeText(this, "Ajouter un dessin", Toast.LENGTH_LONG).show()
        }

        //handle popup menu options
        albumViewOptions.setOnClickListener {
            val popupMenu = PopupMenu(
                this,
                albumViewOptions
            )

            popupMenu.setOnMenuItemClickListener { menuItem ->
                //get id of the item clicked and handle clicks
                when (menuItem.itemId) {
                    R.id.menu_editAlbumParameters -> {
                        Toast.makeText(this, "Modifier Album", Toast.LENGTH_LONG).show()
                        true
                    }
                    R.id.menu_acceptRequestMembership -> {
                        Toast.makeText(this, "Accepter les demandes d'adhesion", Toast.LENGTH_LONG).show()
                        true
                    }
                    R.id.menu_leaveAlbum -> {
                        Toast.makeText(this, "Quitter Album", Toast.LENGTH_LONG).show()
                        true
                    }
                    R.id.menu_deleteAlbum -> {
                        Toast.makeText(this, "Supprimer Album", Toast.LENGTH_LONG).show()
                        true
                    }
                    else -> false
                }
            }

            popupMenu.inflate(R.menu.drawingscollection_options_menu)

            if (user != albumOwner) {
                popupMenu.menu.findItem(R.id.menu_editAlbumParameters).isVisible = false
                popupMenu.menu.findItem(R.id.menu_deleteAlbum).isVisible = false
            } else if (user == albumOwner){
                popupMenu.menu.findItem(R.id.menu_leaveAlbum).isVisible = false
            }

            //to show icons for menu
            try {
                val fieldMPopup = PopupMenu::class.java.getDeclaredField("mPopup")
                fieldMPopup.isAccessible = true
                val mPopup = fieldMPopup.get(popupMenu)
                mPopup.javaClass.getDeclaredMethod("setForceShowIcon", Boolean::class.java).invoke(mPopup, true)
            } catch (e: Exception) {
                Log.e("ChatPage", "Error showing menu icons", e)
            } finally {
                popupMenu.show()
            }
        }
    }

    private fun getAllAlbumDrawings(albumName: String) {
        var call: Call<List<String>> = iMyService.getAllAlbumDrawings(albumName)
        call.enqueue(object: retrofit2.Callback<List<String>> {

            override fun onResponse(call: Call<List<String>>, response: Response<List<String>>) {
                for (drawing in response.body()!!) {
                    drawingAdapter.addDrawing(drawing)
                    drawingAdapter.notifyItemInserted((rvOutputDrawings.adapter as DrawingAdapter).itemCount)
                }
            }

            override fun onFailure(call: Call<List<String>>, t: Throwable) {
                Log.d("Albums", "onFailure" +t.message )
            }
        })
    }

    override fun drawingAdapterListener(drawingName: String) {
        this.drawingName = drawingName
    }
}
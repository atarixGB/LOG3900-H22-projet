package com.example.mobile

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Base64
import android.util.Log
import android.widget.ImageButton
import android.widget.TextView
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.widget.PopupMenu
import androidx.core.view.isVisible
import androidx.fragment.app.activityViewModels
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.mikhaellopez.circularimageview.CircularImageView
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import kotlinx.android.synthetic.main.activity_profile_modification.*
import kotlinx.android.synthetic.main.fragment_create_album_pop_up.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class DrawingsCollection : AppCompatActivity(), DrawingAdapter.DrawingAdapterListener, UserAdapter.UserAdapterListener,AlbumAttributeModificationPopUp.DialogListener {
    private lateinit var leaveAlbumBtn: ImageButton
    private lateinit var albumNameTextView: TextView
    private lateinit var currentAlbum: IAlbum
    private lateinit var albumName: String
    private lateinit var user: String
    private lateinit var membersListButton: ImageButton
    private lateinit var addDrawingButton: ImageButton
    private lateinit var albumViewOptions: ImageButton
    private lateinit var rvOutputDrawings: RecyclerView
    private lateinit var drawingAdapter: DrawingAdapter
    private lateinit var drawings: ArrayList<String>
    private lateinit var drawingName: String
    private lateinit var userNameAccepted: String
    private lateinit var dialogAcceptMembershipRequest: AcceptMembershipRequestsPopUp
    private lateinit var dialogEditAlbumAttributes: AlbumAttributeModificationPopUp



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

        user = intent.getStringExtra("userName").toString()
        albumName = intent.getStringExtra("albumName").toString()
        getAlbumParameters(albumName)

        if(albumName=="album public"){
            albumViewOptions.isVisible=false
            membersListButton.isVisible=false
        }

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
            //getAlbumParameters(albumName) //pour avoir les parametres d'album a jour
            var dialog = UsersListPopUp(albumName, currentAlbum.members)
            dialog.show(supportFragmentManager, "customDialog")
        }

        addDrawingButton.setOnClickListener {
            val intent = Intent(this, DrawingActivity::class.java)
            intent.putExtra("userName", user)
            intent.putExtra("albumName", albumName)
            intent.putExtra("albumAlreadySelected", true)
            startActivity(intent)
            Toast.makeText(this, "Ajouter un dessin", Toast.LENGTH_LONG).show()
        }

        //handle popup menu options
        albumViewOptions.setOnClickListener {
            //getAlbumParameters(albumName) //pour avoir les parametres d'album a jour
            val popupMenu = PopupMenu(
                this,
                albumViewOptions
            )

            popupMenu.setOnMenuItemClickListener { menuItem ->
                //get id of the item clicked and handle clicks
                when (menuItem.itemId) {
                    R.id.menu_editAlbumParameters -> {
                        //ouvrir pop up modification attributs d'album
                        dialogEditAlbumAttributes= AlbumAttributeModificationPopUp(albumName,currentAlbum.description!!)
                        dialogEditAlbumAttributes.show(supportFragmentManager, "customDialog")
                        true
                    }
                    R.id.menu_acceptRequestMembership -> {
                        //ouvrir le popup window des utilisateurs
                        dialogAcceptMembershipRequest = AcceptMembershipRequestsPopUp(albumName, currentAlbum.membershipRequests, user)
                        dialogAcceptMembershipRequest.show(supportFragmentManager, "customDialog")

                        true
                    }
                    R.id.menu_leaveAlbum -> {
                        leaveAlbum(currentAlbum._id!!, user)
                        Toast.makeText(this, "Album quitter", Toast.LENGTH_LONG).show()
                        val intent = Intent(this, Albums::class.java)
                        intent.putExtra("userName", user)
                        startActivity(intent)
                        true
                    }
                    R.id.menu_deleteAlbum -> {
                        deleteAlbum(currentAlbum._id!!)
                        val intent = Intent(this, Albums::class.java)
                        intent.putExtra("userName", user)
                        startActivity(intent)
                        true
                    }
                    else -> false
                }
            }

            popupMenu.inflate(R.menu.drawingscollection_options_menu)

            if (user != currentAlbum.owner) {
                popupMenu.menu.findItem(R.id.menu_editAlbumParameters).isVisible = false
                popupMenu.menu.findItem(R.id.menu_deleteAlbum).isVisible = false
            } else if (user == currentAlbum.owner){
                popupMenu.menu.findItem(R.id.menu_leaveAlbum).isVisible = false
            }

            //to show icons for menu
            try {
                val fieldMPopup = PopupMenu::class.java.getDeclaredField("mPopup")
                fieldMPopup.isAccessible = true
                val mPopup = fieldMPopup.get(popupMenu)
                mPopup.javaClass.getDeclaredMethod("setForceShowIcon", Boolean::class.java).invoke(mPopup, true)
            } catch (e: Exception) {
                Log.e("DrawingsCollection", "Error showing menu icons", e)
            } finally {
                popupMenu.show()
            }
        }
    }

//    override fun popUpListener(albumName: String,albumDescription:String) {
//        updateAlbum(this.albumName,albumName,albumDescription)
//    }

    private fun updateAlbum(oldAlbumName: String, newAlbumName:String,newDescription:String) {
        compositeDisposable.add(iMyService.updateAlbum(oldAlbumName,newAlbumName,newDescription)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe { result->
                if(result == "200"){
                    Toast.makeText(this,"Modification faite avec succès", Toast.LENGTH_SHORT).show()

                }else{
                    Toast.makeText(this,"Échec de modification", Toast.LENGTH_SHORT).show()
                }
            })
    }
    private fun getAllAlbumDrawings(albumName: String) {
        var call: Call<List<String>> = iMyService.getAllAlbumDrawings(albumName)
        call.enqueue(object: retrofit2.Callback<List<String>> {

            override fun onResponse(call: Call<List<String>>, response: Response<List<String>>) {
                for (drawing in response.body()!!) {
                    displayDrawingName(drawing)
                }
            }

            override fun onFailure(call: Call<List<String>>, t: Throwable) {
                Log.d("Albums", "onFailure" +t.message )
            }
        })
    }

    private fun getAlbumParameters (albumName: String) {
        var call: Call<IAlbum> = iMyService.getAlbumParameters(albumName)
        call.enqueue(object: Callback<IAlbum> {
            override fun onResponse(call: Call<IAlbum>, response: Response<IAlbum>) {
                currentAlbum = response.body()!!
            }

            override fun onFailure(call: Call<IAlbum>, t: Throwable) {
                Log.d("DrawingsCollection", "onFailure" +t.message )
            }

        })
    }

    override fun drawingAdapterListener(drawingName: String) {
        this.drawingName = drawingName
    }

    override fun userAdapterListener(userName: String) {
        this.userNameAccepted = userName
        acceptMemberRequest(userNameAccepted, user, albumName)
        dialogAcceptMembershipRequest.dismiss()
        getAlbumParameters(albumName)
    }

    private fun acceptMemberRequest(userToAdd: String, currentUser: String, albumName: String) {
        compositeDisposable.add(iMyService.acceptMemberRequest(userToAdd, currentUser, albumName)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe { result ->
                if (result == "201") {
                    Toast.makeText(this, "$userToAdd a ete accepter", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(this, "erreur", Toast.LENGTH_SHORT).show()
                }
            })
    }

    private fun leaveAlbum(albumId: String, memberToRemove: String) {
        compositeDisposable.add(iMyService.leaveAlbum(albumId, memberToRemove)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe { result ->
                if (result == "201") {
                    Toast.makeText(this, "bye", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(this, "erreur", Toast.LENGTH_SHORT).show()
                }
            })
    }

    private fun displayDrawingName(drawingId: String) {
        var call: Call<String> = iMyService.getDrawingName(drawingId)
        call.enqueue(object: retrofit2.Callback<String> {

            override fun onResponse(call: Call<String>, response: Response<String>) {
                drawingName = response.body()!!
                drawingAdapter.addDrawing(drawingName)
                drawingAdapter.notifyItemInserted((rvOutputDrawings.adapter as DrawingAdapter).itemCount)
            }

            override fun onFailure(call: Call<String>, t: Throwable) {
                Log.d("Albums", "onFailure" +t.message )
            }
        })
    }

    private fun deleteAlbum(albumId: String) {
        compositeDisposable.add(iMyService.deleteAlbum(albumId)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe { result ->
                if (result == "201") {
                    Toast.makeText(this, "album supprimé", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(this, "erreur de suppression d'album", Toast.LENGTH_SHORT).show()
                }
            })
    }

    override fun popUpListener(albumName: String, albumDescription: String) {
        this.albumNameTextView.text=albumName
        updateAlbum(this.albumName,albumName,albumDescription)
        this.albumName=albumName
    }
}
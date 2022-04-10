package com.example.mobile.popup

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.location.Geocoder
import android.location.Location
import android.media.MediaPlayer
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.AnimationUtils
import android.widget.*
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.view.isVisible
import androidx.fragment.app.DialogFragment
import androidx.fragment.app.activityViewModels
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.Interface.IAlbum
import com.example.mobile.R
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.SOUND_EFFECT
import com.example.mobile.viewModel.SharedViewModelCreateDrawingPopUp
import com.example.mobile.activity.Dashboard
import com.example.mobile.activity.albums.DrawingsCollection
import com.example.mobile.adapter.AlbumAdapter
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import kotlinx.android.synthetic.main.activity_create_drawing_pop_up.view.*
import kotlinx.android.synthetic.main.activity_create_room_pop_up.view.cancelBtn
import kotlinx.android.synthetic.main.activity_create_room_pop_up.view.submitBtn
import retrofit2.Call
import retrofit2.Response
import java.text.Format
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.format.FormatStyle
import java.util.*


class CreateDrawingPopUp(val user: String, val isAlbumAlreadySelected: Boolean) : DialogFragment() {

    private lateinit var drawingName: EditText
    private lateinit var drawingNameEmptyError: TextView
    private lateinit var albumEmptyError: TextView
    private lateinit var radioGroup: RadioGroup
    private lateinit var publicRB: RadioButton
    private lateinit var rvOutputAlbums: RecyclerView
    private lateinit var locationText: TextView
    private lateinit var timeText: TextView
    private lateinit var albumAdapter: AlbumAdapter
    private lateinit var albums : ArrayList<IAlbum>
    private lateinit var iMyService: IMyService
    private lateinit var fusedLocationProvidedClient : FusedLocationProviderClient
    private var albumName: String = ""
    private var albumID: String = ""
    private var drawingId: String = ""
    internal var compositeDisposable = CompositeDisposable()
    private lateinit var listener: DialogListener
    private val sharedViewModelCreateDrawingPopUp: SharedViewModelCreateDrawingPopUp by activityViewModels()



    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        var rootView: View = inflater.inflate(R.layout.activity_create_drawing_pop_up, container, false)

        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        dialog?.setCanceledOnTouchOutside(false)
        locationText = rootView.city
        timeText = rootView.timestamp

        fusedLocationProvidedClient = LocationServices.getFusedLocationProviderClient(activity)
        activityResultLauncher.launch(Manifest.permission.ACCESS_FINE_LOCATION)
        getTime()



        sharedViewModelCreateDrawingPopUp.albumName.observe(viewLifecycleOwner) {
            albumName = it
            Toast.makeText(context, "$albumName choisi" , Toast.LENGTH_LONG).show()
        }
        sharedViewModelCreateDrawingPopUp.albumID.observe(viewLifecycleOwner) {
            albumID = it
        }

        var mediaPlayerMagic: MediaPlayer = MediaPlayer.create(context,R.raw.magic)
        var mediaPlayerFail: MediaPlayer = MediaPlayer.create(context,R.raw.failure)

        drawingName = rootView.drawingName
        radioGroup = rootView.accessibilityRadioGroup
        publicRB = rootView.publicRB
        drawingNameEmptyError = rootView.drawingNameEmptyError
        albumEmptyError = rootView.albumEmptyError
        rvOutputAlbums = rootView.rvOutputAlbums

        rvOutputAlbums.isVisible = false
        drawingNameEmptyError.isVisible = false
        albumEmptyError.isVisible = false
        publicRB.isChecked = true

        rootView.accessibilityTitle.isVisible = !isAlbumAlreadySelected
        radioGroup.isVisible = !isAlbumAlreadySelected

        albums = ArrayList()

        albumAdapter = AlbumAdapter(context, albums)

        //Recycler View of rooms
        rvOutputAlbums.adapter = albumAdapter
        rvOutputAlbums.layoutManager = GridLayoutManager(context, 3)

        getAllAvailableAlbums()


        radioGroup.setOnCheckedChangeListener { radioGroup, i ->
            var rb: RadioButton = rootView.findViewById<RadioButton>(i)

            rvOutputAlbums.isVisible = rb.text.toString() != "public"
        }


        rootView.cancelBtn.setOnClickListener {
            if (isAlbumAlreadySelected) {
                val intent = Intent(activity, DrawingsCollection::class.java)
                intent.putExtra("userName", user)
                intent.putExtra("albumName", albumName)
                startActivity(intent)
            } else {
                val intent = Intent(activity, Dashboard::class.java)
                intent.putExtra("userName", user)
                startActivity(intent)
            }
        }

        rootView.submitBtn.setOnClickListener {
            val data: String = "37a4650300b6b92238e8bab3ab265cc8.png"
            val members = ArrayList<String>()
            val likes = ArrayList<String>()

            val current = LocalDateTime.now()
            val formatted = current.format(DateTimeFormatter.ofPattern("dd MMMM, yyyy", Locale.FRENCH))
            val creationData = formatted.toString()

            var rb: RadioButton = rootView.findViewById<RadioButton>(radioGroup.checkedRadioButtonId)
            if (drawingName.text.toString().isNotEmpty()) {
                drawingNameEmptyError.isVisible = false
                albumEmptyError.isVisible = false
                var location = locationText.text.toString()
                if(location == "Géolocalisation non disponible"){
                    location = ""
                }
                if (isAlbumAlreadySelected) {
                    createDrawing(albumName, drawingName.text.toString(), user, data, members, likes, false,location, creationData)
                    Toast.makeText(
                        context,
                        "ajout du dessin a $albumName",
                        Toast.LENGTH_LONG
                    )
                        .show()
                    if(SOUND_EFFECT){
                        mediaPlayerMagic.start()
                    }

                    listener.popUpListener(albumName, drawingName.text.toString(), drawingId)
                    dismiss()
                } else if (rb.text.toString().equals("privé")) {
                    //add drawing to private album
                        if (albumName.isNotEmpty()) {
                            createDrawing(albumName, drawingName.text.toString(), user, data, members, likes, false,location, creationData)
                            Toast.makeText(
                                context,
                                "ajout du dessin a $albumName",
                                Toast.LENGTH_LONG
                            )
                                .show()
                            if(SOUND_EFFECT){
                                mediaPlayerMagic.start()
                            }
                            listener.popUpListener(albumName, drawingName.text.toString(), drawingId)
                            dismiss()
                        } else {
                            // s'il n'a pas choisi un album sors une erreur
                            albumEmptyError.isVisible = true

                        }
                } else {
                    //add drawing to public album
                    createDrawing("album public", drawingName.text.toString(), user, data, members, likes, false,location, creationData)
//                    addDrawingToAlbum("Album public", drawingName.text.toString())
                    Toast.makeText(context, "ajout du dessin a l'album public", Toast.LENGTH_LONG)
                        .show()
                    if(SOUND_EFFECT){
                        mediaPlayerMagic.start()
                    }
                    listener.popUpListener(albumName, drawingName.text.toString(), drawingId)
                    dismiss()
                }
            } else {
                // s'il n'a pas selectionner de drawing name, rend visible le champ d'erreur
                drawingNameEmptyError.isVisible = true
                drawingName.animation=AnimationUtils.loadAnimation(context,R.anim.shake_animation)
                if(SOUND_EFFECT){
                    mediaPlayerFail.start()
                }

            }
        }

        return rootView

    }


    private fun getTime() {
        val current = LocalDateTime.now()
        val formatter = DateTimeFormatter.ofPattern("HH:mm:ss")
        val formatted = current.format(formatter)
        timeText.text = formatted
    }

    @SuppressLint("MissingPermission")
    private val activityResultLauncher =
        registerForActivityResult(
            ActivityResultContracts.RequestPermission()){ isGranted ->
            // Handle Permission granted/rejected
            if (isGranted) {
                val task = fusedLocationProvidedClient.lastLocation.addOnSuccessListener { location : Location? ->
                    if(location!= null) {
                        val geocoder = Geocoder(context)
                        val list =
                            geocoder.getFromLocation(location.latitude, location.longitude, 1)
                        locationText.text =
                            list[0].locality.toString() + ", " + list[0].countryName.toString()
                    }
                }
            } else {
                locationText.text = "Géolocalisation non disponible"
            }
        }




//    private fun fetchLocation() {
//        val task = fusedLocationProvidedClient.lastLocation
//        if(ActivityCompat.checkSelfPermission(requireActivity(), android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
//            && ActivityCompat.checkSelfPermission(requireActivity(), android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
//                //permission is not granted
//            requestPermissions(permissionsList, REQUEST_CODE);
//            requestPermissions(
//                requireActivity(),
//                arrayOf(android.Manifest.permission.ACCESS_FINE_LOCATION),
//                101
//            )
//        }
//
//        task.addOnSuccessListener {
//            if(it != null){
//                val geocoder = Geocoder(context)
//                val list = geocoder.getFromLocation(it.latitude, it.longitude, 1)
//                localisationText.text = list[0].locality.toString() + ", " +  list[0].countryName.toString()
//            }
//        }
//    }


    private fun createDrawing(albumName: String, drawingName: String, owner: String, data:String, members:ArrayList<String>, likes:ArrayList<String>, isStory : Boolean,location:String, creationDate: String) {
        var location = location
        if(location == "Géolocalisation non disponible"){
            location = ""
        }
        compositeDisposable.add(iMyService.createDrawing(drawingName, owner, data, members, likes, isStory,location, creationDate)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe { result ->
                //result est drawingID
                //this.drawingId = result
                listener.drawingIdPopUpListener(result as String)
                if (albumName == "album public") {
                    albumID = "623e5f7cbd233e887bcb6034"
                }
                addDrawingToAlbum(albumID, result)
//                if (result == "201") {
////                    Toast.makeText(context, "added", Toast.LENGTH_SHORT).show()
//                } else {
//                    Toast.makeText(context, "erreur", Toast.LENGTH_SHORT).show()
//                }
            })
    }

    private fun addDrawingToAlbum(albumID: String, drawingId: String) {
        compositeDisposable.add(iMyService.addDrawingToAlbum(albumID, drawingId)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe { result ->
                if (result == "201") {
//                    Toast.makeText(context, "added", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(context, "erreur", Toast.LENGTH_SHORT).show()
                }
            })
    }

    private fun getAllAvailableAlbums() {
        var call: Call<List<IAlbum>> = iMyService.getAllAvailableAlbums()
        call.enqueue(object: retrofit2.Callback<List<IAlbum>> {

            override fun onResponse(call: Call<List<IAlbum>>, response: Response<List<IAlbum>>) {
                for (album in response.body()!!) {
                    if (album._id != "623e5f7cbd233e887bcb6034"){
                        if (album.members.contains(user)) {
                            albumAdapter.addAlbum(album)
                            albumAdapter.notifyItemInserted((rvOutputAlbums.adapter as AlbumAdapter).itemCount)
                        }
                    }
                }
            }

            override fun onFailure(call: Call<List<IAlbum>>, t: Throwable) {
                Log.d("Albums", "onFailure" +t.message )
            }

        })
    }

    override fun onAttach(context: Context) {
        super.onAttach(context)
        listener = try {
            context as DialogListener
        } catch (e: ClassCastException) {
            throw ClassCastException(
                context.toString() + "must implement DialogListener"
            )
        }
    }


    public interface DialogListener {
        fun popUpListener(albumName: String, drawingName: String, drawingId: String)
        fun drawingIdPopUpListener(drawingId: String)
    }

}
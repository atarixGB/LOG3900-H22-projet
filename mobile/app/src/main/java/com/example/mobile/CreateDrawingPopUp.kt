package com.example.mobile

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.isVisible
import androidx.fragment.app.DialogFragment
import androidx.fragment.app.activityViewModels
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import kotlinx.android.synthetic.main.activity_create_drawing_pop_up.*
import kotlinx.android.synthetic.main.activity_create_drawing_pop_up.view.*
import kotlinx.android.synthetic.main.activity_create_room_pop_up.view.cancelBtn
import kotlinx.android.synthetic.main.activity_create_room_pop_up.view.submitBtn
import kotlinx.coroutines.currentCoroutineContext
import retrofit2.Call
import retrofit2.Response
import java.util.ArrayList

class CreateDrawingPopUp(val user: String) : DialogFragment() {

    private lateinit var drawingName: EditText
    private lateinit var drawingNameEmptyError: TextView
    private lateinit var albumEmptyError: TextView
    private lateinit var radioGroup: RadioGroup
    private lateinit var publicRB: RadioButton
    private lateinit var rvOutputAlbums: RecyclerView
    private lateinit var albumAdapter: AlbumAdapter
    private lateinit var albums : ArrayList<IAlbum>
    private lateinit var iMyService: IMyService
    private var albumName: String = ""
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

        sharedViewModelCreateDrawingPopUp.albumName.observe(viewLifecycleOwner) {
            albumName = it
            Toast.makeText(context, "$albumName choisi" , Toast.LENGTH_LONG).show()
        }

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
            val intent = Intent(activity, Dashboard::class.java)
            intent.putExtra("userName",user)
            startActivity(intent)
        }

        rootView.submitBtn.setOnClickListener {
            var rb: RadioButton = rootView.findViewById<RadioButton>(radioGroup.checkedRadioButtonId)
            if (drawingName.text.toString().isNotEmpty()) {
                drawingNameEmptyError.isVisible = false
                albumEmptyError.isVisible = false
                if (rb.text.toString().equals("privé")) {
                    //add drawing to private album
                        if (albumName.isNotEmpty()) {
                            addDrawingToAlbum(albumName, drawingName.text.toString())
                            Toast.makeText(
                                context,
                                "ajout du dessin a $albumName",
                                Toast.LENGTH_LONG
                            )
                                .show()
                            listener.popUpListener(albumName, drawingName.text.toString())
                            dismiss()
                        } else {
                            // s'il n'a pas choisi un album sors une erreur
                            albumEmptyError.isVisible = true

                        }
                } else {
                    //add drawing to public album
                    addDrawingToAlbum("Album public", drawingName.text.toString())
                    Toast.makeText(context, "ajout du dessin a l'album public", Toast.LENGTH_LONG)
                        .show()
                    listener.popUpListener(albumName, drawingName.text.toString())
                    dismiss()
                }
            } else {
                // s'il n'a pas selectionner de drawing name, rend visible le champ d'erreur
                drawingNameEmptyError.isVisible = true
            }
        }

        return rootView

    }

    private fun addDrawingToAlbum(albumName: String, drawingName: String) {
        compositeDisposable.add(iMyService.addDrawingToAlbum(albumName, drawingName)
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
                    if (album.members.contains(user)) {
                        albumAdapter.addAlbum(album)
                        albumAdapter.notifyItemInserted((rvOutputAlbums.adapter as AlbumAdapter).itemCount)
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
        fun popUpListener(albumName: String, drawingName: String)
    }

}
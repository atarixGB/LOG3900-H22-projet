package com.example.mobile.popup

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.RadioButton
import android.widget.RadioGroup
import android.widget.Toast
import androidx.core.view.isVisible
import androidx.fragment.app.DialogFragment
import androidx.fragment.app.activityViewModels
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.Interface.IAlbum
import com.example.mobile.R
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.activity.Dashboard
import com.example.mobile.activity.albums.DrawingsCollection
import com.example.mobile.adapter.AlbumAdapter
import com.example.mobile.viewModel.SharedViewModelCreateDrawingPopUp
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers

import kotlinx.android.synthetic.main.change_album_pop_up.view.*
import retrofit2.Call
import retrofit2.Response
import java.util.ArrayList

class ChangeAlbumPopUp(val drawingID:String,val user:String, val position: Int, val oldAlbumID: String):DialogFragment() {
    private lateinit var listener: ChangeAlbumPopUp.DialogListener
    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()
   // private lateinit var albumAdapter: AlbumAdapter
    private lateinit var rvOutputAlbums: RecyclerView
    private lateinit var albumAdapter: AlbumAdapter
    private lateinit var albums : ArrayList<IAlbum>
    private lateinit var publicRB: RadioButton
    private lateinit var radioGroup: RadioGroup
    private var albumName: String = ""
    private lateinit var newAlbumID: String
    private val sharedViewModelCreateDrawingPopUp: SharedViewModelCreateDrawingPopUp by activityViewModels()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        var rootView: View = inflater.inflate(R.layout.change_album_pop_up, container, false)

        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        sharedViewModelCreateDrawingPopUp.albumID.observe(viewLifecycleOwner) {
            newAlbumID = it
        }

        dialog?.setCanceledOnTouchOutside(false)

        sharedViewModelCreateDrawingPopUp.albumName.observe(viewLifecycleOwner) {
            albumName = it
            Toast.makeText(context, "$albumName choisi" , Toast.LENGTH_LONG).show()
        }

        publicRB = rootView.publicRB
        rvOutputAlbums = rootView.rvOutputAlbums
        radioGroup = rootView.albumChangeRadioGroup
        rvOutputAlbums.isVisible = false
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
            dismiss()
        }

        rootView.submitBtn.setOnClickListener {

            //step 1 : we add the drawing to the destination album
            addDrawingToAlbum(newAlbumID,drawingID)
            //step 2: we change the variable album name in the drawing element
//            changeAlbumOfDrawing(newAlbumID,drawingID)
            //step 3 : we remove the drawing from the drawing IDs in the oldAlbum
            removeDrawingFromAlbum(drawingID,oldAlbumID)

            Toast.makeText(context, "le dessin a été transféré vers l'album $albumName", Toast.LENGTH_SHORT).show()

            //we send out the new album
            listener.changeAlbumPopUpListener(albumName, position)
            dismiss()
        }

        return rootView


    }

    private fun changeAlbumOfDrawing(albumName: String, drawingId: String) {
        compositeDisposable.add(iMyService.changeAlbumOfDrawing(albumName, drawingId)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe {
            })
    }

    private fun addDrawingToAlbum(albumID: String, drawingId: String) {
        compositeDisposable.add(iMyService.addDrawingToAlbum(albumID, drawingId)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe {
            })
    }

    private fun removeDrawingFromAlbum(drawingId: String, albumID:String){
        compositeDisposable.add(iMyService.removeDrawing(drawingId, albumID)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe {
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

//    private fun getAllAvailableAlbums() {
//        var call: Call<List<IAlbum>> = iMyService.getAllAvailableAlbums()
//        call.enqueue(object: retrofit2.Callback<List<IAlbum>> {
//
//            override fun onResponse(call: Call<List<IAlbum>>, response: Response<List<IAlbum>>) {
//                for (album in response.body()!!) {
//                    if (album._id != "623e5f7cbd233e887bcb6034"){
//                        if (album.members.contains(user)) {
//                            albumAdapter.addAlbum(album)
//                            albumAdapter.notifyItemInserted((rvOutputAlbums.adapter as AlbumAdapter).itemCount)
//                        }
//                    }
//                }
//            }
//
//            override fun onFailure(call: Call<List<IAlbum>>, t: Throwable) {
//                Log.d("Albums", "onFailure" +t.message )
//            }
//
//        })
//    }

    override fun onAttach(context: Context) {
        super.onAttach(context)
        listener = try {
            context as ChangeAlbumPopUp.DialogListener
        } catch (e: ClassCastException) {
            throw ClassCastException(
                context.toString() + "must implement DialogListener"
            )
        }
    }
    public interface DialogListener {
        fun changeAlbumPopUpListener(albumName: String, position: Int)
    }

}
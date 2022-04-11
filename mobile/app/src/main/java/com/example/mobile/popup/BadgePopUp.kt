package com.example.mobile.popup

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
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

class BadgePopUp():DialogFragment() {

    private lateinit var cancelButton: Button


    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        var rootView: View = inflater.inflate(R.layout.popup_badge_layout, container, false)

        cancelButton=rootView.findViewById(R.id.retour)

        cancelButton.setOnClickListener(){
            dismiss()
        }



        return rootView


    }


}
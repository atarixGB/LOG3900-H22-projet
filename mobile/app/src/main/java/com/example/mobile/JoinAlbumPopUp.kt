package com.example.mobile

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.RadioButton
import android.widget.TextView
import android.widget.Toast
import androidx.core.view.isVisible
import androidx.fragment.app.DialogFragment
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import kotlinx.android.synthetic.main.activity_create_room_pop_up.view.*
import kotlinx.android.synthetic.main.activity_join_album_pop_up.view.*
import kotlinx.android.synthetic.main.activity_join_album_pop_up.view.cancelBtn
import kotlinx.android.synthetic.main.activity_join_album_pop_up.view.submitBtn

class JoinAlbumPopUp(val albumName: String, val user: String) : DialogFragment() {

    private lateinit var popupTitle: TextView
    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        var rootView: View = inflater.inflate(R.layout.activity_join_album_pop_up, container, false)

        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        popupTitle = rootView.popupTitleJoinAlbum
        popupTitle.text = "Demande d'adhésion a l'album $albumName "

        rootView.cancelBtn.setOnClickListener {
            dismiss()
        }

        rootView.submitBtn.setOnClickListener {
            if (sendRequestToJoinAlbum(albumName, user)) {
                Toast.makeText(context, "demande envoyée", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(context, "Vous avez deja soumis une demande", Toast.LENGTH_SHORT).show()
            }
            dismiss()
        }

        return rootView

    }

    private fun sendRequestToJoinAlbum(albumName: String, userName: String): Boolean {
        var requestSent: Boolean= false
        compositeDisposable.add(iMyService.sendRequestToJoinAlbum(albumName, userName)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe { result ->
                requestSent = result == "201"
            })
        return requestSent
    }
}
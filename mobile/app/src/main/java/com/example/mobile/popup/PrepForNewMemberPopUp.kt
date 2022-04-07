package com.example.mobile.popup

import android.content.Context
import android.media.MediaPlayer
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.activity.viewModels
import androidx.fragment.app.DialogFragment
import androidx.fragment.app.viewModels
import com.example.mobile.R
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.viewModel.SharedViewModelToolBar
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import kotlinx.android.synthetic.main.activity_join_album_pop_up.view.*
import kotlinx.android.synthetic.main.activity_join_album_pop_up.view.submitBtn
import kotlinx.android.synthetic.main.activity_prep_for_new_member_pop_up.view.*

class PrepForNewMemberPopUp(val userJoined: String) : DialogFragment() {

    private lateinit var popUpDescription: TextView
    private val sharedViewModelToolBar: SharedViewModelToolBar by viewModels()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        var rootView: View = inflater.inflate(R.layout.activity_prep_for_new_member_pop_up, container, false)



        popUpDescription = rootView.popupDescriptionJoinMember
        popUpDescription.text = "Merci d'acceuillir $userJoined ! "

        rootView.continueBtn.setOnClickListener {
            dismiss()
        }

        return rootView

    }
}
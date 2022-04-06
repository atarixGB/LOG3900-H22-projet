package com.example.mobile.popup

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.DialogFragment
import com.example.mobile.R
import kotlinx.android.synthetic.main.activity_prep_for_member_leaving_pop_up.view.*
import kotlinx.android.synthetic.main.activity_prep_for_new_member_pop_up.view.*
import kotlinx.android.synthetic.main.activity_prep_for_new_member_pop_up.view.continueBtn

class PrepForMemberLeavingPopUp(val userLeft: String) : DialogFragment() {

    private lateinit var popUpTitle: TextView

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        var rootView: View = inflater.inflate(R.layout.activity_prep_for_member_leaving_pop_up, container, false)



        popUpTitle = rootView.popupTitleMemberLeaving
        popUpTitle.text = "$userLeft a quitté la session! "

        rootView.continueBtn.setOnClickListener {
            dismiss()
        }

        return rootView

    }
}
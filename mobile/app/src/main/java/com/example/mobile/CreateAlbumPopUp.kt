package com.example.mobile

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.fragment.app.DialogFragment
import kotlinx.android.synthetic.main.fragment_create_album_pop_up.view.*


class CreateAlbumPopUp : DialogFragment() {
    private lateinit var radioGroup: RadioGroup
    private lateinit var radioButton: RadioButton
    private lateinit var submitButton: Button
    private lateinit var cancelButton: Button
    private lateinit var textViewAlbumName: TextView
    private lateinit var textViewVisibility: TextView

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        var rootView: View= inflater.inflate(R.layout.fragment_create_album_pop_up, container, false)
        radioGroup=rootView.findViewById(R.id.radioGroup)
        textViewAlbumName=rootView.findViewById(R.id.text_view_albumName)
        textViewVisibility=rootView.findViewById(R.id.text_view_visibility)
        submitButton= rootView.findViewById(R.id.submitBtn)
        cancelButton=rootView.findViewById(R.id.cancelBtn)

        cancelButton.setOnClickListener(){
            dismiss()
        }

        submitButton.setOnClickListener(){
            val selectedID=radioGroup.checkedRadioButtonId
            val radio= rootView.findViewById<RadioButton>(selectedID)

            var result=radio.text.toString()
            Toast.makeText(context, "choix d'accès est $result", Toast.LENGTH_LONG)

        }
        
        return rootView
    }

}
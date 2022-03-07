package com.example.mobile

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.fragment.app.DialogFragment
import kotlinx.android.synthetic.main.fragment_create_album_pop_up.*
import kotlinx.android.synthetic.main.fragment_create_album_pop_up.view.*


class CreateAlbumPopUp : DialogFragment() {
    private lateinit var radioGroup: RadioGroup
    private lateinit var albumName:EditText
    private lateinit var albumDescription: EditText
    private lateinit var submitButton: Button
    private lateinit var cancelButton: Button
    private lateinit var listener: DialogListener

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        var rootView: View= inflater.inflate(R.layout.fragment_create_album_pop_up, container, false)
        radioGroup=rootView.findViewById(R.id.radioGroup)
        albumName=rootView.findViewById(R.id.newAlbumName)
        albumDescription=rootView.findViewById(R.id.albumDescription)
        submitButton= rootView.findViewById(R.id.submitBtn)
        cancelButton=rootView.findViewById(R.id.cancelBtn)

        cancelButton.setOnClickListener(){
            dismiss()
        }

        submitButton.setOnClickListener(){
            val selectedID=radioGroup.checkedRadioButtonId
            val radio= rootView.findViewById<RadioButton>(selectedID)

            var result=radio.text.toString()
            var name= albumName.text.toString()
            var description = albumDescription.text.toString()

            listener.popUpListener(name,description,result)

            Toast.makeText(context, "le nom de votre album est $name choix d'accès est $result", Toast.LENGTH_LONG)

            dismiss()
        }

        return rootView
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
        fun popUpListener(albumName: String,albumDescription:String,visibility: String)
    }

}
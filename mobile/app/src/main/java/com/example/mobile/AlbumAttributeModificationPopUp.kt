package com.example.mobile

import android.content.Context
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.fragment.app.DialogFragment
import kotlinx.android.synthetic.main.fragment_album_attribute_modification_pop_up.*

class AlbumAttributeModificationPopUp : DialogFragment() {
    private lateinit var albumName: EditText
    private lateinit var albumDescription: EditText
    private lateinit var submitButton: Button
    private lateinit var cancelButton: Button
    private lateinit var listener: CreateAlbumPopUp.DialogListener

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        var rootView: View= inflater.inflate(R.layout.fragment_album_attribute_modification_pop_up, container, false)
        albumName=rootView.findViewById(R.id.modifiedAlbumName)
        albumDescription=rootView.findViewById(R.id.newAlbumDescription)
        submitButton= rootView.findViewById(R.id.modifyAlbumBtn)
        cancelButton=rootView.findViewById(R.id.cancelBtn)

        cancelButton.setOnClickListener(){
            dismiss()
        }

        submitButton.setOnClickListener{
            if(albumName.text.toString()!="album public"){
                var modifiedName= albumName.text.toString()
                var newDescription = albumDescription.text.toString()

                listener.popUpListener(modifiedName,newDescription)

                dismiss()
            }
            else {
                Toast.makeText(context,"Album public est un nom reservé", Toast.LENGTH_SHORT).show()
            }

        }

        return rootView
    }

    override fun onAttach(context: Context) {
        super.onAttach(context)
        listener = try {
            context as CreateAlbumPopUp.DialogListener
        } catch (e: ClassCastException) {
            throw ClassCastException(
                context.toString() + "must implement DialogListener"
            )
        }
    }

    public interface DialogListener {
        fun popUpListener(albumName: String,albumDescription:String)
    }
}
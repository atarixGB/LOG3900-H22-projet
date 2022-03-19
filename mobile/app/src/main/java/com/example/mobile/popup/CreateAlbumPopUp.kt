package com.example.mobile.popup

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.fragment.app.DialogFragment
import com.example.mobile.R


class CreateAlbumPopUp : DialogFragment() {
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
        albumName=rootView.findViewById(R.id.newAlbumName)
        albumDescription=rootView.findViewById(R.id.albumDescription)
        submitButton= rootView.findViewById(R.id.submitBtn)
        cancelButton=rootView.findViewById(R.id.cancelBtn)

        cancelButton.setOnClickListener(){
            dismiss()
        }

        submitButton.setOnClickListener(){
            if(albumName.text.toString()!="album public"){
                var name= albumName.text.toString()
                var description = albumDescription.text.toString()

                listener.popUpListener(name,description)

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
            context as DialogListener
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
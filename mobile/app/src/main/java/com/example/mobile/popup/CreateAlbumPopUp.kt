package com.example.mobile.popup

import android.content.Context
import android.media.MediaPlayer
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.AnimationUtils
import android.widget.*
import androidx.core.view.isVisible
import androidx.fragment.app.DialogFragment
import com.example.mobile.R
import com.example.mobile.SOUND_EFFECT


class CreateAlbumPopUp : DialogFragment() {
    private lateinit var albumName:EditText
    private lateinit var albumDescription: EditText
    private lateinit var submitButton: Button
    private lateinit var cancelButton: Button
    private lateinit var listener: DialogListener
    private lateinit var albumNameEmptyError:TextView


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
        albumNameEmptyError=rootView.findViewById(R.id.albumNameEmptyError)
        var mediaPlayerMagic: MediaPlayer = MediaPlayer.create(context,R.raw.magic)
        var mediaPlayerFail: MediaPlayer = MediaPlayer.create(context,R.raw.failure)

        albumNameEmptyError.isVisible=false

        cancelButton.setOnClickListener(){
            dismiss()
        }

        submitButton.setOnClickListener(){
            if(albumName.text.toString()!="album public" && !albumName.text.toString().isNullOrBlank()){
                var name= albumName.text.toString()
                var description = albumDescription.text.toString()
                albumNameEmptyError.isVisible=false
                listener.popUpListener(name,description)
                if(SOUND_EFFECT){
                    mediaPlayerMagic.start()
                }


                dismiss()
            }
            else if(albumName.text.toString().isNullOrBlank() || albumName.text.toString().isEmpty()){
                albumNameEmptyError.isVisible=true
                albumName.animation=AnimationUtils.loadAnimation(context,R.anim.shake_animation)
                if(SOUND_EFFECT){
                    mediaPlayerFail.start()
                }


            }
            else {
                Toast.makeText(context,"Album public est un nom reservé", Toast.LENGTH_SHORT).show()
                albumName.animation=AnimationUtils.loadAnimation(context,R.anim.shake_animation)
                if(SOUND_EFFECT){
                    mediaPlayerFail.start()
                }

            }
            mediaPlayerMagic.release()
            mediaPlayerFail.release()

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
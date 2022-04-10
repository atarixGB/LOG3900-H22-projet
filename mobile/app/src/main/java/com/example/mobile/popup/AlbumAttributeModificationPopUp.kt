package com.example.mobile.popup

import android.content.Context
import android.media.MediaPlayer
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.AnimationUtils
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.core.view.isVisible
import androidx.fragment.app.DialogFragment
import com.example.mobile.R
import com.example.mobile.SOUND_EFFECT
import kotlinx.android.synthetic.main.fragment_album_attribute_modification_pop_up.*

class AlbumAttributeModificationPopUp(val oldAlbumName: String,val oldDescription:String) : DialogFragment() {
    private lateinit var albumName: EditText
    private lateinit var albumDescription: EditText
    private lateinit var submitButton: Button
    private lateinit var cancelButton: Button
    private lateinit var listener: DialogListener
    private var mediaPlayerMagic: MediaPlayer? = null
    private var mediaPlayerFail: MediaPlayer? = null

    private lateinit var albumNameEmptyError: TextView

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        var rootView: View= inflater.inflate(R.layout.fragment_album_attribute_modification_pop_up, container, false)
        albumName=rootView.findViewById(R.id.modifiedAlbumName)
        albumName.setText(oldAlbumName)
        albumNameEmptyError=rootView.findViewById(R.id.albumNameEmptyError)
        albumDescription=rootView.findViewById(R.id.newAlbumDescription)
        albumDescription.setText(oldDescription)
        submitButton= rootView.findViewById(R.id.modifyAlbumBtn)
        cancelButton=rootView.findViewById(R.id.cancelBtn)
        mediaPlayerMagic = MediaPlayer.create(context,R.raw.magic)
        mediaPlayerFail = MediaPlayer.create(context,R.raw.failure)

        albumNameEmptyError.isVisible=false

        cancelButton.setOnClickListener(){
            dismiss()
        }

        submitButton.setOnClickListener{
            if(albumName.text.toString()!="album public" && !albumName.text.toString().isNullOrBlank()){
                var modifiedName= albumName.text.toString()
                var newDescription = albumDescription.text.toString()
                albumNameEmptyError.isVisible=false
                listener.popUpListener(modifiedName,newDescription)
                if(SOUND_EFFECT){
                    mediaPlayerMagic?.start()
                }

                dismiss()
            }

            else if(albumName.text.toString().isNullOrBlank() || albumName.text.toString().isEmpty()){
                albumNameEmptyError.isVisible=true
                albumName.animation= AnimationUtils.loadAnimation(context,R.anim.shake_animation)
                if(SOUND_EFFECT){
                    mediaPlayerFail?.start()
                }
            }
            else {
                Toast.makeText(context,"Album public est un nom reservé", Toast.LENGTH_SHORT).show()
                albumName.animation=AnimationUtils.loadAnimation(context,R.anim.shake_animation)
                if(SOUND_EFFECT){
                    mediaPlayerFail?.start()
                }
            }
        }

        return rootView
    }

//    override fun onResume() {
//        super.onResume()
//        mediaPlayerFail?.start()
//        mediaPlayerMagic?.start()
//    }
//
//    override fun onPause() {
//        super.onPause()
//        mediaPlayerFail?.pause()
//        mediaPlayerMagic?.pause()
//    }

    override fun onDestroy() {
        super.onDestroy()
        mediaPlayerFail?.stop()
        mediaPlayerMagic?.stop()

        mediaPlayerFail?.release()
        mediaPlayerMagic?.release()

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
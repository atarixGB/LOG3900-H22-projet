package com.example.mobile.popup

import android.content.Context
import android.media.MediaPlayer
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.AnimationUtils
import android.widget.EditText
import android.widget.TextView
import androidx.core.view.isVisible
import androidx.fragment.app.DialogFragment
import com.example.mobile.R
import kotlinx.android.synthetic.main.activity_create_room_pop_up.view.*
import kotlinx.android.synthetic.main.activity_profile_modification.*

class CreateRoomPopUp : DialogFragment() {
    private lateinit var editTextNewRoomName: EditText
    private lateinit var roomNameEmptyError: TextView
    private lateinit var roomName: String
    private lateinit var listener: DialogListener


    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        var rootView: View = inflater.inflate(R.layout.activity_create_room_pop_up, container, false)

        this.editTextNewRoomName = rootView.findViewById<EditText>(R.id.newRoomName)
        this.roomNameEmptyError=rootView.findViewById<EditText>(R.id.roomNameEmptyError)
        var mediaPlayerMagic: MediaPlayer = MediaPlayer.create(context,R.raw.magic)
        roomNameEmptyError.isVisible=false

        rootView.cancelBtn.setOnClickListener {
            dismiss()
        }

        rootView.submitBtn.setOnClickListener {
            if(!editTextNewRoomName.text.toString().isNullOrBlank()) {
                roomName = this.editTextNewRoomName.text.toString()
                roomNameEmptyError.isVisible=false
                mediaPlayerMagic.start()
                listener.popUpListener(roomName)

            }
            else if(editTextNewRoomName.text.toString().isNullOrBlank())  {
                editTextNewRoomName.animation= AnimationUtils.loadAnimation(context,R.anim.shake_animation)
                roomNameEmptyError.isVisible=true
            }


            //Toast.makeText(context, "$roomName created!" , Toast.LENGTH_LONG).show()
            dismiss()
            mediaPlayerMagic.release()
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
        fun popUpListener(roomName: String)
    }

}
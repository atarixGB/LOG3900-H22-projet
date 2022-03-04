package com.example.mobile

import android.content.Context
import android.graphics.drawable.Drawable

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.Toast
import androidx.fragment.app.DialogFragment
import com.mikhaellopez.circularimageview.CircularImageView
import kotlinx.android.synthetic.main.activity_add_avatar_pop_up.view.*

class SelectAvatarPopUp : DialogFragment() {
    private lateinit var userAvatar: CircularImageView
    private lateinit var listener: DialogListener

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        var rootView: View = inflater.inflate(R.layout.activity_add_avatar_pop_up, container, false)

        this.userAvatar = rootView.findViewById(R.id.userAvatar)


        rootView.cancelBtn.setOnClickListener {
            dismiss()
        }

        rootView.valider.setOnClickListener {
            var id = userAvatar.id
            listener.popUpListener(userAvatar.drawable)
            Toast.makeText(context, "Avatar sélectionné!", Toast.LENGTH_LONG).show()
            dismiss()
        }

        for (i in 1..9) {
            val imageId = rootView.resources.getIdentifier("avatar$i", "id", context?.packageName)!!
            val image = rootView.findViewById<ImageView>(imageId)!!
            image.setOnClickListener() {
                userAvatar?.setImageDrawable(image.drawable)
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
        fun popUpListener(avatar: Drawable)
    }

}
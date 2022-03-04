package com.example.mobile

import android.content.Context
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Base64
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.Toast
import androidx.fragment.app.DialogFragment
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.mikhaellopez.circularimageview.CircularImageView
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import kotlinx.android.synthetic.main.activity_create_room_pop_up.view.*

class CreateRoomPopUp : DialogFragment() {
    private lateinit var editTextNewRoomName: EditText
    private lateinit var roomName: String
    private lateinit var listener: DialogListener





    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        var rootView: View = inflater.inflate(R.layout.activity_create_room_pop_up, container, false)

        this.editTextNewRoomName = rootView.findViewById<EditText>(R.id.newRoomName)

        rootView.cancelBtn.setOnClickListener {
            dismiss()
        }

        rootView.submitBtn.setOnClickListener {
            roomName = this.editTextNewRoomName.text.toString()
            listener.popUpListener(roomName)

            //Toast.makeText(context, "$roomName created!" , Toast.LENGTH_LONG).show()
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
        fun popUpListener(roomName: String)
    }

}
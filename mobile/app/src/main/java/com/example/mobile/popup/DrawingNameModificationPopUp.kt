package com.example.mobile.popup

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.fragment.app.DialogFragment
import com.example.mobile.R


class DrawingNameModificationPopUp (val oldDrawingName: String) : DialogFragment(){
    private lateinit var listener: DialogListener
    private lateinit var submitButton: Button
    private lateinit var cancelButton: Button
    private lateinit var drawingName: EditText

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        var rootView: View = inflater.inflate(R.layout.fragment_drawing_name_modification_pop_up, container, false)
        drawingName=rootView.findViewById(R.id.modifiedDrawingName)
        drawingName.setText(oldDrawingName)

        submitButton= rootView.findViewById(R.id.modifyDrawingBtn)
        cancelButton=rootView.findViewById(R.id.cancelBtn)

        cancelButton.setOnClickListener(){
            dismiss()
        }

        submitButton.setOnClickListener{

            var modifiedName= drawingName.text.toString()

            listener.popUpListener(modifiedName)

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
        fun popUpListener(drawingName: String)
    }
}
package com.example.mobile.popup

import android.content.Context
import android.content.Intent
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
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.activity.albums.DrawingsCollection
import com.example.mobile.activity.profile.Profile_modification
import com.example.mobile.adapter.DrawingAdapter
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import kotlinx.android.synthetic.main.activity_profile.*


class DrawingNameModificationPopUp (val drawingID:String, val oldDrawingName: String, val position: Int) : DialogFragment(){
    private lateinit var listener: DialogListener
    private lateinit var submitButton: Button
    private lateinit var cancelButton: Button
    private lateinit var drawingName: EditText
    private lateinit var iMyService: IMyService
    private lateinit var drawingNameEmptyError: TextView

    internal var compositeDisposable = CompositeDisposable()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        var rootView: View = inflater.inflate(R.layout.fragment_drawing_name_modification_pop_up, container, false)
        drawingName=rootView.findViewById(R.id.modifiedDrawingName)
        drawingName.setText(oldDrawingName)
        drawingNameEmptyError=rootView.findViewById(R.id.drawingNameEmptyError)
        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        submitButton= rootView.findViewById(R.id.modifyDrawingBtn)
        cancelButton=rootView.findViewById(R.id.cancelBtn)

        drawingNameEmptyError.isVisible=false

        cancelButton.setOnClickListener(){
            dismiss()
        }

        submitButton.setOnClickListener{
            if(!drawingName.text.toString().isNullOrBlank()){
                var modifiedName= drawingName.text.toString()

                updateDrawing(drawingID,modifiedName)
                drawingNameEmptyError.isVisible=false
                listener.popUpListener(modifiedName, position)
                dismiss()
            }

            else if(drawingName.text.toString().isNullOrBlank() ||drawingName.text.toString().isEmpty()){
                drawingNameEmptyError.isVisible=true
                drawingName.animation= AnimationUtils.loadAnimation(context,R.anim.shake_animation)
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
        fun popUpListener(drawingName: String, position: Int)
    }

    private fun updateDrawing(drawingID: String, newDrawingName:String) {
        compositeDisposable.add(iMyService.updateDrawing(drawingID,newDrawingName)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe {

            })
    }
}
package com.example.mobile.popup

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
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


class DrawingNameModificationPopUp (val oldDrawingName: String, val position: Int) : DialogFragment(){
    private lateinit var listener: DialogListener
    private lateinit var submitButton: Button
    private lateinit var cancelButton: Button
    private lateinit var drawingName: EditText
    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        var rootView: View = inflater.inflate(R.layout.fragment_drawing_name_modification_pop_up, container, false)
        drawingName=rootView.findViewById(R.id.modifiedDrawingName)
        drawingName.setText(oldDrawingName)

        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        submitButton= rootView.findViewById(R.id.modifyDrawingBtn)
        cancelButton=rootView.findViewById(R.id.cancelBtn)



        cancelButton.setOnClickListener(){
            dismiss()
        }

        submitButton.setOnClickListener{

            var modifiedName= drawingName.text.toString()



            updateDrawing(oldDrawingName,modifiedName)

            listener.popUpListener(modifiedName, position)
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
        fun popUpListener(drawingName: String, position: Int)
    }

    private fun updateDrawing(oldDrawingName: String, newDrawingName:String) {
        compositeDisposable.add(iMyService.updateDrawing(oldDrawingName,newDrawingName)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe {

            })
    }
}
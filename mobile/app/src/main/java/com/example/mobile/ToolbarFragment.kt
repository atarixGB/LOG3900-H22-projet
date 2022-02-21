package com.example.mobile

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import androidx.core.content.ContextCompat

class ToolbarFragment : Fragment() {
//    private lateinit var pencilButton: ImageButton
//    private lateinit var eraserButton: ImageButton
//    private lateinit var rectangleButton: ImageButton
//    private lateinit var circleButton: ImageButton
//    private lateinit var saveButton: ImageButton
//    private lateinit var chatButton: ImageButton

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
//        pencilButton = requireView().findViewById(R.id.pencilButton)
//        eraserButton = requireView().findViewById(R.id.eraserButton)
//        rectangleButton =  requireView().findViewById(R.id.rectangleButton)
//        circleButton =  requireView().findViewById(R.id.circleButton)
//        saveButton =  requireView().findViewById(R.id.saveButton)
//        chatButton =  requireView().findViewById(R.id.chatButton)
//
//        pencilButton.setOnClickListener{
//            //TODO
//        }
//
//        eraserButton.setOnClickListener{
//            //TODO
//        }
//
//        rectangleButton.setOnClickListener{
//            //TODO
//        }
//
//        circleButton.setOnClickListener{
//            //TODO
//        }
//
//        saveButton.setOnClickListener{
//            //TODO
//        }
//
//        chatButton.setOnClickListener{
//            //TODO
//        }



        return inflater.inflate(R.layout.fragment_toolbar, container, false)
    }

}
package com.example.mobile

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout

class DrawingZoneFragment : Fragment() {
    lateinit var canvasView: MyCanvasView

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_drawing_zone, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        canvasView = MyCanvasView(requireContext())
        view.findViewById<LinearLayout>(R.id.canvas).addView(canvasView)
    }

}
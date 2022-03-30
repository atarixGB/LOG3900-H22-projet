package com.example.mobile.activity.profile

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.Interface.IDrawing
import com.example.mobile.R
import com.example.mobile.adapter.DrawingAdapter
import com.example.mobile.adapter.TopDrawingAdapter
import kotlinx.android.synthetic.main.item_drawing.*

class TopDrawingDisplay : AppCompatActivity(),TopDrawingAdapter.TopDrawingAdapterListener {
    private lateinit var drawingName: String
    private lateinit var drawings: ArrayList<IDrawing>
    private lateinit var topDrawingAdapter: TopDrawingAdapter
    private lateinit var rvOutputTopDrawings: RecyclerView
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_top_dessin)

        drawings = java.util.ArrayList()

        topDrawingAdapter = TopDrawingAdapter(this, drawings)

        //Recycler View of rooms
        rvOutputTopDrawings.adapter = topDrawingAdapter
        rvOutputTopDrawings.layoutManager = GridLayoutManager(this, 3)
    }

    override fun TopdrawingAdapterListener(drawingName: String) {
        this.drawingName=drawingName
    }


}
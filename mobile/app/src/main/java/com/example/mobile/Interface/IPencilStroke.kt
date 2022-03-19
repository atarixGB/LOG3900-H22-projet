package com.example.mobile.Interface

import com.example.mobile.Tools.Pencil
import com.example.mobile.Tools.ToolbarFragment

//class IPencilStroke : Stroke{
//    constructor( boundingPoints: ArrayList<IVec2>,
//                 color: Int,
//                 strokeWidth: Float,
//                 points: ArrayList<IVec2>,
//    pencil:Pencil):super(boundingPoints,color,strokeWidth,points,pencil)
//}

data class IPencilStroke (
    override val boundingPoints: ArrayList<IVec2>,
    override val color: Int,
    override val strokeWidth: Float,
    override val points: ArrayList<IVec2>,
    ):Stroke(boundingPoints,color,strokeWidth,points,ToolbarFragment.MenuItem.PENCIL) {}

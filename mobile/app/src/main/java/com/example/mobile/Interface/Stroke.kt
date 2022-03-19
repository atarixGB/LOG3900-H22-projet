package com.example.mobile.Interface

import com.example.mobile.Tools.Tool
import com.example.mobile.Tools.ToolbarFragment


abstract class Stroke(open val  boundingPoints: ArrayList<IVec2>,
                      open val  color: Int,
                      open val  strokeWidth: Float,
                      open val  points: ArrayList<IVec2>,
                      val toolType:ToolbarFragment.MenuItem)  {


}
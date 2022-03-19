package com.example.mobile.Tools

import android.content.Context
import android.graphics.Canvas
import com.example.mobile.DrawingCollaboration
import com.example.mobile.Interface.IPencilStroke
import com.example.mobile.Interface.IVec2
import org.json.JSONObject
import java.util.*

class  Selection(context: Context, baseCanvas: Canvas, socket : DrawingCollaboration) : Tool(context, baseCanvas, socket) {
    private var selectedIndex:Int=0
    override fun touchStart() {
        mStartX = mx
        mStartY = my
    }

    override fun touchMove() {}

    override fun touchUp() {
        onDraw(baseCanvas)
    }

    override fun onStrokeReceived(stroke: JSONObject) {
        TODO("Not yet implemented")
    }

    override fun onDraw(canvas: Canvas) {
        val right = if (mStartX > mx) mStartX else mx
        val left = if (mStartX > mx) mx else mStartX
        val bottom = if (mStartY > my) mStartY else my
        val top = if (mStartY > my) my else mStartY
        canvas!!.drawOval(left, top, right, bottom, paint!!)
    }

    private fun isStrokeFound(clickedPos: IVec2): Boolean {
//        for (item in strokes.reversed() ) {
//            if (this.isInBounds(item.boundingPoints, clickedPos)) {
//                this.selectedIndex = item.;
//                return true;
//            }
//        }
        strokes.reversed().forEachIndexed{i,element->
            if (this.isInBounds(element.boundingPoints, clickedPos)) {
                this.selectedIndex = i
                return true;
            }

        }
        return false;
    }

    private fun isInBounds(bounds: ArrayList<IVec2>, pointToCheck: IVec2): Boolean {
        val topLeftBound = bounds[0];
        val bottomRightBound = bounds[1];
        return (
                pointToCheck.x >= topLeftBound.x &&
                        pointToCheck.x <= bottomRightBound.x &&
                        pointToCheck.y >= topLeftBound.y &&
                        pointToCheck.y <= bottomRightBound.y
                );
    }


}
package com.example.mobile

import android.content.Context
import android.graphics.*
import android.graphics.Path
import android.widget.Toast

class Pencil(private val extraCanvas: Canvas, context: Context) : Tool(context, extraCanvas) {

    override fun touchMove() {
        val dx = Math.abs(motionTouchEventX - currentX)
        val dy = Math.abs(motionTouchEventY - currentY)
        if (dx >= touchTolerance || dy >= touchTolerance) {
                path.lineTo(motionTouchEventX, motionTouchEventY)
                currentX = motionTouchEventX
                currentY = motionTouchEventY
                // Draw the path in the extra bitmap to save it.
                extraCanvas.drawPath(path, paint)
        }
    }
}
package com.example.mobile

import android.content.Context
import android.graphics.*

class Pencil(context: Context, canvas: Canvas) : Tool(context, canvas) {

    override fun touchMove() {
        this.paint.color = drawColor
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
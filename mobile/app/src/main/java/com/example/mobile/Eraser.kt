package com.example.mobile

import android.content.Context
import android.graphics.Canvas
import com.example.mobile.Tool

class Eraser(context: Context, canvas: Canvas) : Tool(context, canvas) {

    override fun touchMove() {
        this.paint.color = backgroundColor
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
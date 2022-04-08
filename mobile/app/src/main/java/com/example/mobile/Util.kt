package com.example.mobile

import android.content.Context
import android.content.res.Resources
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.drawable.BitmapDrawable
import android.util.Base64
import android.util.DisplayMetrics
import android.util.Log
import com.example.mobile.Interface.IMessage
import com.google.gson.Gson
import com.mikhaellopez.circularimageview.CircularImageView
import org.json.JSONObject
import java.io.ByteArrayOutputStream

var CURRENT_ALBUM_ID :String = ""
fun convertToByteArray(imageView: CircularImageView): ByteArray {
    val bitmap = (imageView.drawable as BitmapDrawable).bitmap
    val stream = ByteArrayOutputStream()
    bitmap.compress(Bitmap.CompressFormat.PNG, 90, stream)
    return stream.toByteArray()
}

fun bitmapDecoder(avatar_str:String?):Bitmap{
    val decodedString: ByteArray = Base64.decode(avatar_str, Base64.DEFAULT)
    return BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
}

fun convertBitmapToByteArray(bitmap: Bitmap): ByteArray {
    val stream = ByteArrayOutputStream()
    bitmap.compress(Bitmap.CompressFormat.PNG, 90, stream)
    return stream.toByteArray()
}

fun convertDpToPixel(dp: Float, context: Context?): Float {
    return if (context != null) {
        val resources = context.resources
        val metrics = resources.displayMetrics
        dp * (metrics.densityDpi.toFloat() / DisplayMetrics.DENSITY_DEFAULT)
    } else {
        val metrics = Resources.getSystem().displayMetrics
        dp * (metrics.densityDpi.toFloat() / DisplayMetrics.DENSITY_DEFAULT)
    }
}

fun convertPixelsToDp(px: Float, context: Context?): Float {
    return if (context != null) {
        val resources = context.resources
        val metrics = resources.displayMetrics
        px / (metrics.densityDpi.toFloat() / DisplayMetrics.DENSITY_DEFAULT)
    } else {
        val metrics = Resources.getSystem().displayMetrics
        px / (metrics.densityDpi.toFloat() / DisplayMetrics.DENSITY_DEFAULT)
    }

fun saveMessageInFile(msg : IMessage, context: Context, roomName : String){
    try{
        var gson = Gson()
        var jsonString = gson.toJson(msg)
        context.openFileOutput(roomName+".txt", Context.MODE_APPEND).use {
            it.write(jsonString.toByteArray())
            it.write(("//").toByteArray())
        }
    }catch (e:Exception){
        Log.d("ChatPage", "Erreur dans l'ecriture du fichier")
    }
}

}
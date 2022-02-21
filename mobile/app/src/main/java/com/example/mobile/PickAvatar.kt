package com.example.mobile

import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.drawable.BitmapDrawable
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.CheckBox
import androidx.core.view.drawToBitmap
import com.mikhaellopez.circularimageview.CircularImageView
import java.io.ByteArrayOutputStream

class PickAvatar : AppCompatActivity() {
    private lateinit var userAvatar: CircularImageView

    //private lateinit var avatarChosen: CircularImageView
//    private lateinit var selectbutton:Button
    private lateinit var validateButton: Button

//    val list= listOf(R.drawable.monster1,
//        R.drawable.monster2,
//        R.drawable.monster3,
//        R.drawable.monster4,
//        R.drawable.monster5,
//        R.drawable.monster6,
//        R.drawable.monster7,
//        R.drawable.monster8,
//        R.drawable.monster9)


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_pick_avatar)
        validateButton = findViewById(R.id.valider)
        userAvatar = findViewById(R.id.userAvatar)



        validateButton.setOnClickListener {
            //val intent = Intent(this, Registration::class.java)
            //ici je voudrai envoyer le contenu qui est dans imageView userAvatar
            //le moyen que j'ai trouvé serait d'obtenir un byteArray de l'image que je pourrai passer
            //intent.putExtra("avatar", R.drawable.monster1)
            var avatarToByteArray : ByteArray = convertToBitmap(userAvatar)
            intent.putExtra("avatar",avatarToByteArray)
            finish()
        }
    }

    fun convertToBitmap(imageView: CircularImageView): ByteArray{
        val bitmap =(imageView.drawable as BitmapDrawable).bitmap
        val stream= ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG,90,stream)
        return stream.toByteArray()
    }

    fun onCheckboxClicked(view: View){
        userAvatar = findViewById(R.id.userAvatar)

        if (view is CheckBox) {
            val checked: Boolean = view.isChecked
            when (view.id) {
                R.id.select1 -> {
                    if (checked) {
                        userAvatar.setImageResource(R.drawable.monster1)
                    }
                }
                R.id.select2 -> {
                    if (checked) {
                        userAvatar.setImageResource(R.drawable.monster2)
                    }
                }
                R.id.select3 -> {
                    if (checked) {
                        userAvatar.setImageResource(R.drawable.monster3)
                    }
                }
                R.id.select4 -> {
                    if (checked) {
                        userAvatar.setImageResource(R.drawable.monster4)
                    }
                }
                R.id.select5 -> {
                    if (checked) {
                        userAvatar.setImageResource(R.drawable.monster5)
                    }
                }
                R.id.select6 -> {
                    if (checked) {
                        userAvatar.setImageResource(R.drawable.monster6)
                    }
                }
                R.id.select7 -> {
                    if (checked) {
                        userAvatar.setImageResource(R.drawable.monster7)
                    }
                }
                R.id.select8 -> {
                    if (checked) {
                        userAvatar.setImageResource(R.drawable.monster8)
                    }
                }
                R.id.select9 -> {
                    if (checked) {
                        userAvatar.setImageResource(R.drawable.monster9)
                    }
                }
            }
        }
    }

}
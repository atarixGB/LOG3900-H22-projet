package com.example.mobile

import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.provider.MediaStore
import android.util.Base64
import android.widget.EditText
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.mikhaellopez.circularimageview.CircularImageView
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import kotlinx.android.synthetic.main.activity_profile_modification.*
import kotlinx.android.synthetic.main.activity_registration.*
import java.io.ByteArrayOutputStream

class Profile_modification : AppCompatActivity(),SelectAvatarPopUp.DialogListener {
    private lateinit var cameraBtn : ImageButton
    private lateinit var avatarBtn : ImageButton
    private lateinit var backBtn : ImageView
    private lateinit var avatarPicker: CircularImageView
    private lateinit var newIdentifier: EditText
    private lateinit var newEmail: EditText
    private lateinit var newDescription: EditText

    private lateinit var oldUsername:String

    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()

    private val REQUEST_IMAGE_CAMERA = 142

    override fun onStop() {
        compositeDisposable.clear()
        super.onStop()
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profile_modification)

        avatarBtn=findViewById(R.id.edt_avatar)
        cameraBtn= findViewById(R.id.edt_camera)
        backBtn=findViewById(R.id.back_btn)
        avatarPicker = findViewById(R.id.userAvatarModif)

        newIdentifier=findViewById(R.id.username)
        newEmail=findViewById(R.id.user_email)
        newDescription=findViewById(R.id.edt_description)
        oldUsername= intent.getStringExtra("userName").toString()


        //init api
        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        //lancer la camera quand tu clic sur icone caméra
        cameraBtn.setOnClickListener {
            val builder = AlertDialog.Builder(this)
            builder.setTitle("Photo de profile")
            builder.setMessage("Prends une belle photo! ")
            builder.setNegativeButton("Lance la caméra") { dialog, which ->
                dialog.dismiss()
                Intent(MediaStore.ACTION_IMAGE_CAPTURE).also { takePictureIntent ->
                    takePictureIntent.resolveActivity(packageManager).also {
                        val permission = ContextCompat.checkSelfPermission(
                            this,
                            android.Manifest.permission.CAMERA
                        )
                        if (permission != PackageManager.PERMISSION_GRANTED) {
                            ActivityCompat.requestPermissions(
                                this,
                                arrayOf(android.Manifest.permission.CAMERA),
                                1
                            )
                        } else {
                            startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAMERA)
                        }
                    }
                }
            }

            val dialog: AlertDialog = builder.create()
            dialog.show()

        }
        //bouton pour avatar predefinis
        avatarBtn.setOnClickListener{
            var dialog = SelectAvatarPopUp()
            dialog.show(supportFragmentManager,"customDialog")
        }
//        backBtn.setOnClickListener(){
//            val intent = Intent(this, Profile::class.java)
//            startActivity(intent)
//        }
        modify_label.setOnClickListener(){
            updateProfile(oldUsername,username.text.toString(),userAvatarModif,user_email.text.toString(),edt_description.text.toString())
        }

    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == REQUEST_IMAGE_CAMERA && resultCode == Activity.RESULT_OK && data != null) {
            userAvatarModif.setImageBitmap(data.extras?.get("data") as Bitmap)
        } else {
            Toast.makeText(this, "", Toast.LENGTH_SHORT).show()
        }
    }


    override fun popUpListener(avatarChosen: Drawable) {
        this.avatarPicker.setImageDrawable(avatarChosen)
    }
    private fun updateProfile(oldIdentifier: String,newIdentifier:String,avatar:CircularImageView,newEmail: String,newDescription:String) {
        var avatarByteArray:ByteArray = convertToByteArray(avatar)
        var avatar_str:String = Base64.encodeToString(avatarByteArray,0)
        compositeDisposable.add(iMyService.updateProfile(oldIdentifier, newIdentifier,avatar_str,newEmail,newDescription)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe { result->
                if(result == "200"){
                    Toast.makeText(this,"Modification faite avec succès", Toast.LENGTH_SHORT).show()
                    val intent = Intent(this, Profile::class.java)
                    intent.putExtra("userName",username.text.toString())
                    intent.putExtra("email",user_email.text.toString())
                    startActivity(intent)
                }else{
                    Toast.makeText(this,"Nom d'utilisateur déjà existant", Toast.LENGTH_SHORT).show()
                }
            })
    }
    fun convertToByteArray(imageView: CircularImageView): ByteArray {
        val bitmap = (imageView.drawable as BitmapDrawable).bitmap
        val stream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 90, stream)
        return stream.toByteArray()
    }
}
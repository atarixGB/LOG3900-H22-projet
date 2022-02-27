package com.example.mobile

import android.app.Activity
import android.content.DialogInterface
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.drawable.BitmapDrawable
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.provider.MediaStore
import android.text.method.HideReturnsTransformationMethod
import android.text.method.PasswordTransformationMethod
import android.util.Base64
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.view.drawToBitmap
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.mikhaellopez.circularimageview.CircularImageView
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import kotlinx.android.synthetic.main.activity_registration.*
import okhttp3.MediaType
import okhttp3.MultipartBody
import okhttp3.RequestBody
import java.io.ByteArrayOutputStream
import java.util.jar.Manifest

class Registration : AppCompatActivity() {
    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()
    private lateinit var identifiant: EditText
    private lateinit var pwd: EditText
    private lateinit var showHideBtn: Button
    private lateinit var registerAccountBtn: Button
    private lateinit var loginAccountBtn: Button
    private lateinit var avatarPicker: CircularImageView

    private val REQUEST_IMAGE_CAMERA = 142

    override fun onStop() {
        compositeDisposable.clear()
        super.onStop()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_registration)

        registerAccountBtn = findViewById(R.id.edt_registration)
        loginAccountBtn = findViewById(R.id.connect_btn)
        showHideBtn = findViewById(R.id.showHideBtn)
        pwd = findViewById(R.id.edt_pwd)
        identifiant = findViewById(R.id.edt_id)
        avatarPicker = findViewById(R.id.displaypicture)

        //init api
        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        //cliquer sur l'avatar pour le changer
        avatarPicker.setOnClickListener {
            val builder = AlertDialog.Builder(this)
            builder.setTitle("Select avatar")
            builder.setMessage("choisi celui qui te plait")
            builder.setPositiveButton("Avatars") { dialog, which ->
                dialog.dismiss()
                val intent = Intent(this, PickAvatar::class.java)
                //intent.type="image/*"
                startActivity(intent)

            }
            builder.setNegativeButton("Camera") { dialog, which ->
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

        //bouton qui affiche et qui masque le mdp
        showHideBtn.setOnClickListener {
            if (showHideBtn.text.toString().equals("Show")) {
                pwd.transformationMethod = HideReturnsTransformationMethod.getInstance()
                showHideBtn.text = "Hide"
            } else {
                pwd.transformationMethod = PasswordTransformationMethod.getInstance()
                showHideBtn.text = "Show"
            }
        }

        registerAccountBtn.setOnClickListener {
            registerUser(identifiant.text.toString(), pwd.text.toString(),displaypicture)
        }

        loginAccountBtn.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
        }

        //TODO : ici on va recevoir le byteArray qui est transféré du coté du login donc ici ca marche pas on doit retrieve
//        val newAvatar:Int= intent.getIntExtra("avatar",0)
//        avatarPicker.setImageResource(newAvatar)
        var bmpTransfered: Bitmap
        var byteArray: ByteArray? = intent.getByteArrayExtra("avatar")
        if (byteArray != null) {
            bmpTransfered = BitmapFactory.decodeByteArray(byteArray, 0, byteArray.size)
            avatarPicker.setImageBitmap(bmpTransfered)
        }
    }


    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == REQUEST_IMAGE_CAMERA && resultCode == Activity.RESULT_OK && data != null) {
            displaypicture.setImageBitmap(data.extras?.get("data") as Bitmap)
        } else {
            Toast.makeText(this, "", Toast.LENGTH_SHORT).show()
        }
    }

    private fun registerUser(identifier: String, password: String, avatar:CircularImageView) {
        var avatarByteArray:ByteArray = convertToByteArray(avatar)
        var avatar_str:String = Base64.encodeToString(avatarByteArray,0)
        compositeDisposable.add(iMyService.registerUser(identifier, password,avatar_str)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe { result->
                if(result == "201"){
                    Toast.makeText(this,"Enregistrement fait avec succès", Toast.LENGTH_SHORT).show()
                    val intent = Intent(this, Profile::class.java)
                    intent.putExtra("userName",identifiant.text.toString())
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
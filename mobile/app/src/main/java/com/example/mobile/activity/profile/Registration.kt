package com.example.mobile.activity.profile

import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.media.MediaPlayer
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.provider.MediaStore
import android.text.method.HideReturnsTransformationMethod
import android.text.method.PasswordTransformationMethod
import android.util.Base64
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.view.isVisible
import com.example.mobile.R
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.activity.MainActivity
import com.example.mobile.popup.SelectAvatarPopUp
import com.mikhaellopez.circularimageview.CircularImageView
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import kotlinx.android.synthetic.main.activity_registration.*
import java.io.ByteArrayOutputStream

class Registration : AppCompatActivity(), SelectAvatarPopUp.DialogListener {
    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()
    private lateinit var idEmptyError:TextView
    private lateinit var mdpEmptyError:TextView
    private lateinit var emailEmptyError:TextView

    private lateinit var identifiant: EditText
    private lateinit var pwd: EditText
    private lateinit var email:EditText
    private lateinit var showHideBtn: Button
    private lateinit var registerAccountBtn: Button
    private lateinit var loginAccountBtn: Button
    private lateinit var avatarPicker: CircularImageView
    private lateinit var cameraBtn : ImageButton
    private lateinit var avatarBtn : ImageButton
    private lateinit var description:String


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
        email=findViewById(R.id.edt_email)
        avatarPicker = findViewById(R.id.displaypicture)
        cameraBtn= findViewById(R.id.edt_camera)
        avatarBtn=findViewById(R.id.edt_avatar)
        description="Accédez aux paramètres du profil pour ajouter une description!"
        idEmptyError=findViewById(R.id.idEmptyError)
        mdpEmptyError=findViewById(R.id.mdpEmptyError)
        emailEmptyError=findViewById(R.id.emailEmptyError)

        idEmptyError.isVisible=false
        mdpEmptyError.isVisible=false
        emailEmptyError.isVisible=false

        //init api
        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        //cliquer sur l'avatar pour le changer
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
            var mediaPlayerFail:MediaPlayer=MediaPlayer.create(this,R.raw.failure)
            if(!identifiant.text.toString().isNullOrBlank() && !pwd.text.toString().isNullOrBlank() && !email.text.toString().isNullOrBlank()){
                idEmptyError.isVisible=false
                mdpEmptyError.isVisible=false
                emailEmptyError.isVisible=false
                registerUser(identifiant.text.toString(), pwd.text.toString(),displaypicture,edt_email.text.toString(),description)
            }
            else if(identifiant.text.toString().isEmpty() || pwd.text.toString().isEmpty()|| email.text.toString().isEmpty()){
                idEmptyError.isVisible=true
                mdpEmptyError.isVisible=true
                emailEmptyError.isVisible=true
                mediaPlayerFail.start()
            }

        }

        loginAccountBtn.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
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

    private fun registerUser(identifier: String, password: String, avatar:CircularImageView,email: String,description:String) {
        var avatarByteArray:ByteArray = convertToByteArray(avatar)
        var avatar_str:String = Base64.encodeToString(avatarByteArray,0)
        var mediaPlayerSuccess:MediaPlayer=MediaPlayer.create(this,R.raw.success)
        var mediaPlayerFail:MediaPlayer=MediaPlayer.create(this,R.raw.failure)
        compositeDisposable.add(iMyService.registerUser(identifier, password,avatar_str,email,description)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe { result->
                if(result == "201"){
                    Toast.makeText(this,"Enregistrement fait avec succès", Toast.LENGTH_SHORT).show()
                    val intent = Intent(this, MainActivity::class.java)
//                    intent.putExtra("userName",identifiant.text.toString())
//                    intent.putExtra("email",edt_email.text.toString())
                    acceptMemberRequest(identifiant.text.toString(),"","album public")
                    mediaPlayerSuccess.start()
                    startActivity(intent)
                }else{
                    mediaPlayerFail.start()
                    Toast.makeText(this,"Nom d'utilisateur ou courriel déjà existants", Toast.LENGTH_SHORT).show()
                }
            })
    }

    fun convertToByteArray(imageView: CircularImageView): ByteArray {
        val bitmap = (imageView.drawable as BitmapDrawable).bitmap
        val stream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 90, stream)
        return stream.toByteArray()
    }

    private fun acceptMemberRequest(userToAdd: String, currentUser: String, albumName: String) {
        compositeDisposable.add(iMyService.acceptMemberRequest(userToAdd, currentUser, albumName)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe { result ->
                if (result == "201") {
                    Toast.makeText(this, "$userToAdd a ete accepter", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(this, "erreur", Toast.LENGTH_SHORT).show()
                }
            })
    }

    override fun popUpListener(avatarChosen: Drawable) {
            this.avatarPicker.setImageDrawable(avatarChosen)
    }
}
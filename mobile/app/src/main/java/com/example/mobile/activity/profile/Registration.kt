package com.example.mobile.activity.profile

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.app.ActivityOptions
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.media.MediaPlayer
import android.os.Bundle
import android.provider.MediaStore
import android.text.TextUtils
import android.text.method.HideReturnsTransformationMethod
import android.text.method.PasswordTransformationMethod
import android.util.Base64
import android.util.Patterns
import android.view.animation.AnimationUtils
import android.widget.*
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.isVisible
import com.example.mobile.Interface.IUser
import com.example.mobile.Interface.myUser
import com.example.mobile.R
import com.example.mobile.REQUEST_IMAGE_CAMERA
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
    var collaborationCount:Int=0
    var totalCollaborationTime:Int=0



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
                activityResultLauncher.launch(Manifest.permission.CAMERA)
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
            if(!identifiant.text.toString().isNullOrBlank() && !pwd.text.toString().isNullOrBlank() && !email.text.toString().isNullOrBlank() && isValidEmail(email.text.toString())){
                idEmptyError.isVisible=false
                mdpEmptyError.isVisible=false
                emailEmptyError.isVisible=false


                registerUser(identifiant.text.toString(), pwd.text.toString(),displaypicture,edt_email.text.toString(),description,collaborationCount,totalCollaborationTime)
            }
            else if(identifiant.text.toString().isEmpty() || pwd.text.toString().isEmpty()|| email.text.toString().isEmpty()){
                idEmptyError.isVisible=true
                mdpEmptyError.isVisible=true
                emailEmptyError.isVisible=true
                identifiant.animation=AnimationUtils.loadAnimation(this,R.anim.shake_animation)
                pwd.animation=AnimationUtils.loadAnimation(this,R.anim.shake_animation)
                email.animation=AnimationUtils.loadAnimation(this,R.anim.shake_animation)
                mediaPlayerFail.start()
            }
            else if(!isValidEmail(email.text.toString())){
                Toast.makeText(this, "Email invalide ! ", Toast.LENGTH_SHORT).show()
            }

        }

        loginAccountBtn.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
            var bundle:Bundle =ActivityOptions.makeSceneTransitionAnimation(this).toBundle()
            startActivity(intent,bundle)
        }

    }

    fun isValidEmail(target: CharSequence?): Boolean {
        return if (TextUtils.isEmpty(target)) {
            false
        } else {
            Patterns.EMAIL_ADDRESS.matcher(target).matches()
        }
    }

    @SuppressLint("MissingPermission")
    private val activityResultLauncher =
        registerForActivityResult(
            ActivityResultContracts.RequestPermission()){ isGranted ->
            // Handle Permission granted/rejected
            if (isGranted) {
                Intent(MediaStore.ACTION_IMAGE_CAPTURE).also { takePictureIntent ->
                    takePictureIntent.resolveActivity(packageManager).also {
                        startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAMERA)
                    }
                }
            } else {
                Toast.makeText(this, "Autorisation nécessaire pour utiliser la caméra", Toast.LENGTH_SHORT).show()
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

    private fun registerUser(identifier: String, password: String, avatar:CircularImageView,email: String,description:String,collaborationCount:Int,totalCollaborationTime:Int) {
        var avatarByteArray:ByteArray = convertToByteArray(avatar)
        var avatar_str:String = Base64.encodeToString(avatarByteArray,0)
        var mediaPlayerSuccess:MediaPlayer=MediaPlayer.create(this,R.raw.success)
        var mediaPlayerFail:MediaPlayer=MediaPlayer.create(this,R.raw.failure)

//        var registeredUser = myUser(identifier, password,avatar_str,email,description,collaborationCount,totalCollaborationTime)

        compositeDisposable.add(iMyService.registerUser(identifier, password,avatar_str,email,description,collaborationCount,totalCollaborationTime, false)
//        compositeDisposable.add(iMyService.registerUser(registeredUser)
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
                    var bundle:Bundle =ActivityOptions.makeSceneTransitionAnimation(this).toBundle()
                    startActivity(intent,bundle)
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
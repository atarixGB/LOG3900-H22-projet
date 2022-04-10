package com.example.mobile.activity.profile

import android.app.Activity
import android.app.ActivityOptions
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.drawable.Drawable
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.provider.MediaStore
import android.util.Base64
import android.view.View
import android.view.animation.AnimationUtils
import android.widget.*
import androidx.activity.viewModels
import androidx.appcompat.app.AlertDialog
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.view.get
import com.example.mobile.*
import com.example.mobile.Interface.IUser
import com.example.mobile.R
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.popup.SelectAvatarPopUp
import com.example.mobile.viewModel.SharedViewModelToolBar
import com.mikhaellopez.circularimageview.CircularImageView
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import kotlinx.android.synthetic.main.activity_profile_modification.*
import kotlinx.android.synthetic.main.activity_profile_modification.modify_label
import kotlinx.android.synthetic.main.activity_profile_modification.username
import retrofit2.Call
import retrofit2.Response

class Profile_modification : AppCompatActivity(), SelectAvatarPopUp.DialogListener {
    private lateinit var cameraBtn : ImageButton
    private lateinit var avatarBtn : ImageButton
    private lateinit var avatarPicker: CircularImageView
    private lateinit var newIdentifier: EditText

    private lateinit var newDescription: EditText

    private lateinit var oldUsername:String

    private lateinit var oldDescription:String

    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()

    private val REQUEST_IMAGE_CAMERA = 142
    private val sharedViewModel: SharedViewModelToolBar by viewModels()

    override fun onStop() {
        compositeDisposable.clear()
        super.onStop()
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profile_modification)

        avatarBtn=findViewById(R.id.edt_avatar)
        cameraBtn= findViewById(R.id.edt_camera)

        avatarPicker = findViewById(R.id.userAvatarModif)

        newIdentifier=findViewById(R.id.username)

        newDescription=findViewById(R.id.edt_description)
        oldUsername= intent.getStringExtra("userName").toString()

        oldDescription=intent.getStringExtra("description").toString()

        newIdentifier.setText(oldUsername)
        newDescription.setText(oldDescription)


        //init api
        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        //to get avatar from DB
        getUserFromDB(oldUsername)
        sharedViewModel.setUser(oldUsername)

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

        modify_label.setOnClickListener(){
            if(!username.text.toString().isNullOrBlank()){
                updateProfile(oldUsername,username.text.toString(),userAvatarModif,edt_description.text.toString())
                sharedViewModel.setUser(username.text.toString())
            }
            else if(username.text.toString().isNullOrBlank()){
                username.animation=AnimationUtils.loadAnimation(this,R.anim.shake_animation)
                Toast.makeText(this, "Les champs sont vides réessayer!", Toast.LENGTH_SHORT).show()
            }
        }
        discard_label.setOnClickListener{
            val intent = Intent(this, Profile::class.java)
            var bundle:Bundle = ActivityOptions.makeSceneTransitionAnimation(this).toBundle()
            intent.putExtra("userName",oldUsername)
            intent.putExtra("description",oldDescription)
            startActivity(intent,bundle)
        }

        val soundActivator:MutableList<String> = ArrayList()
        soundActivator.add("Activés")
        soundActivator.add("Désactivés")

        val adapter = ArrayAdapter(this, R.layout.support_simple_spinner_dropdown_item,soundActivator)
        soundControl.adapter = adapter

        soundControl.onItemSelectedListener = object : AdapterView.OnItemSelectedListener{
            override fun onItemSelected(
                parent: AdapterView<*>?,
                view: View?,
                position: Int,
                id: Long
            ) {
               val item = soundActivator[position]
                Toast.makeText(this@Profile_modification,"$item selected",Toast.LENGTH_SHORT).show()
                if (item=="Activés"){
                    SOUND_EFFECT=true
                }
                else if(item=="Désactivés"){
                    SOUND_EFFECT=false
                }
            }

            override fun onNothingSelected(parent: AdapterView<*>?) {}

        }

        val musicSelector:MutableList<String> = ArrayList()
        musicSelector.add("Desactiver")
        musicSelector.add("Lofi1")
        musicSelector.add("Lofi2")
        musicSelector.add("Minecraft")
        musicSelector.add("Kahoot")

        val adapter2 = ArrayAdapter(this, R.layout.support_simple_spinner_dropdown_item,musicSelector)
        musicPicker.adapter = adapter2
        musicPicker.onItemSelectedListener = object:AdapterView.OnItemSelectedListener{
            override fun onItemSelected(
                parent: AdapterView<*>?,
                view: View?,
                position: Int,
                id: Long
            ) {
                val item = musicSelector[position]
                Toast.makeText(this@Profile_modification,"$item selected",Toast.LENGTH_SHORT).show()

                when(item){
                    MUSIC.Desactiver.name -> MUSIC_TRACK=0
                    MUSIC.Kahoot.name-> MUSIC_TRACK=1
                    MUSIC.Lofi1.name-> MUSIC_TRACK=2
                    MUSIC.Lofi2.name-> MUSIC_TRACK=3
                    MUSIC.Minecraft.name-> MUSIC_TRACK=4
                }
            }

            override fun onNothingSelected(parent: AdapterView<*>?) {}
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
    private fun updateProfile(oldIdentifier: String,newIdentifier:String,avatar:CircularImageView,newDescription:String) {
        var avatarByteArray:ByteArray = convertToByteArray(avatar)
        var avatar_str:String = Base64.encodeToString(avatarByteArray,0)
        compositeDisposable.add(iMyService.updateProfile(oldIdentifier, newIdentifier,avatar_str,newDescription)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe { result->
                if(result == "200"){
                    Toast.makeText(this,"Modification faite avec succès", Toast.LENGTH_SHORT).show()
                    val intent = Intent(this, Profile::class.java)
                    intent.putExtra("userName",username.text.toString())
                    var bundle:Bundle =ActivityOptions.makeSceneTransitionAnimation(this).toBundle()
                    startActivity(intent,bundle)
                }else{
                    Toast.makeText(this,"Nom d'utilisateur déjà existant", Toast.LENGTH_SHORT).show()
                }
            })
    }


    private fun getUserFromDB(user:String) {
        var call: Call<IUser> = iMyService.getUserFromDB(user)
        call.enqueue(object: retrofit2.Callback<IUser> {
            override fun onResponse(call: Call<IUser>, response: Response<IUser>) {
                Toast.makeText(this@Profile_modification, "Bienvenu!", Toast.LENGTH_SHORT).show()
                userAvatarModif.setImageBitmap(bitmapDecoder(response.body()?.avatar))
            }
            override fun onFailure(call: Call<IUser>, t: Throwable) {
                Toast.makeText(this@Profile_modification, "erreur importation avatar", Toast.LENGTH_SHORT).show()
            }
        })

    }

}
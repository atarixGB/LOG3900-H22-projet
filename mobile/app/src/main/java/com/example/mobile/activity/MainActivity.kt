package com.example.mobile.activity

import android.app.ActivityOptions
import android.content.Context
import android.content.Intent
import android.media.MediaPlayer
import android.os.Bundle
import android.text.method.HideReturnsTransformationMethod
import android.text.method.PasswordTransformationMethod
import android.util.Log
import android.view.animation.AnimationUtils
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.isVisible
import com.example.mobile.R
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.activity.profile.Registration
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import retrofit2.Call
import retrofit2.Response
import java.io.File

class MainActivity : AppCompatActivity()  {
    private var isDashboardOpen: Boolean = false
    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()
    private lateinit var email: EditText
    private lateinit var pwd: EditText
    private lateinit var loginBtn: Button
    private lateinit var showHideBtn:Button
    private lateinit var createAccountBtn: Button
    private lateinit var identifiant:String

    private lateinit var mdpEmptyError: TextView
    private lateinit var emailEmptyError: TextView
    private var isChatOpen: Boolean = false

    override fun onStop(){
        compositeDisposable.clear()
        super.onStop()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        email = findViewById(R.id.edt_email) as EditText
        loginBtn = findViewById(R.id.connect_btn) as Button
        createAccountBtn = findViewById(R.id.edt_createAccountButton)
        showHideBtn = findViewById(R.id.showHideBtn)
        pwd = findViewById(R.id.edt_password)


        mdpEmptyError=findViewById(R.id.mdpEmptyError)
        emailEmptyError=findViewById(R.id.emailEmptyError)
        var mediaPlayerFail:MediaPlayer=MediaPlayer.create(this,R.raw.failure)
        mdpEmptyError.isVisible=false
        emailEmptyError.isVisible=false

        clearAllInternalFiles(baseContext)
        //init API
        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        loginBtn.setOnClickListener {
            if (email.text.toString().length > 0) {
                if (!email.text.toString().isNullOrBlank()) {
                    //socket.emit("newUser", identifiant.text.toString())
                    mdpEmptyError.isVisible=false
                    emailEmptyError.isVisible=false
                    loginUser(email.text.toString(), pwd.text.toString())
                }

            }
            else if(email.text.toString().isNullOrBlank() && pwd.text.toString().isNullOrBlank()){
                emailEmptyError.isVisible=true
                mdpEmptyError.isVisible=true
                email.animation= AnimationUtils.loadAnimation(this,R.anim.shake_animation)
                pwd.animation= AnimationUtils.loadAnimation(this,R.anim.shake_animation)
                mediaPlayerFail.start()
            }
        }


        createAccountBtn.setOnClickListener {
            val intent = Intent(this, Registration::class.java)
            var bundle:Bundle = ActivityOptions.makeSceneTransitionAnimation(this).toBundle()
//            intent.putExtra("userName",identifiant.text.toString())
            startActivity(intent,bundle)
        }

        showHideBtn.setOnClickListener {
            if (showHideBtn.text.toString().equals("Show")) {
                pwd.transformationMethod = HideReturnsTransformationMethod.getInstance()
                showHideBtn.text = "Hide"
            } else {
                pwd.transformationMethod = PasswordTransformationMethod.getInstance()
                showHideBtn.text = "Show"

                /*socket.on("newUser") { args ->
                    if (args[0] != null && !isChatOpen && identifiant.text.toString().length > 0) {
                        openChatRooms()
                    }
                }*/
            }
        }
    }

    private fun openDashboard(){
        isDashboardOpen = true
        val intent = Intent(this, Dashboard::class.java)
        var bundle:Bundle =ActivityOptions.makeSceneTransitionAnimation(this).toBundle()
        intent.putExtra("userName",identifiant)
        startActivity(intent,bundle)
    }


    private fun getUsernameFromDB(email: String) {
        var call: Call<Any> = iMyService.getUsernameFromDB(email)
        call.enqueue(object: retrofit2.Callback<Any>{
            override fun onResponse(call: Call<Any>, response: Response<Any>) {
                identifiant=response.body()!!.toString()
                openDashboard()
            }
            override fun onFailure(call: Call<Any>, t: Throwable) {
                TODO("Not yet implemented")
            }
        })
    }


    private fun loginUser(email: String, password: String) {
        var mediaPlayerFail: MediaPlayer = MediaPlayer.create(this,R.raw.failure)
        compositeDisposable.add(iMyService.loginUser(email, password)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe { result ->
                if(result == "404"){
                    Toast.makeText(this, "Utilisateur inexistant", Toast.LENGTH_SHORT).show()
                    mediaPlayerFail.start()
                }else if(result == "200"){
                    getUsernameFromDB(email)
                }
                else{
                    Toast.makeText(this, "Mot de passe incorrect", Toast.LENGTH_SHORT).show()
                    mediaPlayerFail.start()
                }
            })


    }

    private fun clearAllInternalFiles(context : Context){
        var orignalPath = baseContext.getFilesDir().getParentFile().toString()
        var files: Array<String> = context.fileList()
        for(file in files){
            var path = orignalPath+"/files/"+file
            var fileDisk = File(path)
            fileDisk.delete()
        }

    }
}

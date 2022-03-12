package com.example.mobile

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast

import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import android.text.method.HideReturnsTransformationMethod;
import android.text.method.PasswordTransformationMethod;
import android.widget.ImageButton
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity()  {
    private var isDashboardOpen: Boolean = false
    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()
    private lateinit var identifiant: EditText
    private lateinit var pwd: EditText
    private lateinit var loginBtn: Button
    private lateinit var showHideBtn:Button
    private lateinit var createAccountBtn: Button
    private var isChatOpen: Boolean = false

    override fun onStop(){
        compositeDisposable.clear()
        super.onStop()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        identifiant = findViewById(R.id.edt_identifiant) as EditText
        loginBtn = findViewById(R.id.connect_btn) as Button
        createAccountBtn = findViewById(R.id.edt_createAccountButton)
        showHideBtn = findViewById(R.id.showHideBtn)
        pwd = findViewById(R.id.edt_password)

        //Connect to the Server

//        SocketHandler.setSocket()
//        val socket = SocketHandler.getSocket()
//        socket.connect()

        //init API
        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        loginBtn.setOnClickListener {
            if (identifiant.text.toString().length > 0) {
                if (!identifiant.text.toString().isNullOrBlank()) {
                    //socket.emit("newUser", identifiant.text.toString())
                    loginUser(identifiant.text.toString(), pwd.text.toString())
                }
            }
//        }
//        socket.on("newUser") { args ->
//            openDashboard()
//            //openChatRooms()
////            if(args[0] != null && !isDashboardOpen && identifiant.text.toString().length > 0){
////                openDashboard()
////            }
        }


        createAccountBtn.setOnClickListener {
            val intent = Intent(this, Registration::class.java)
//            intent.putExtra("userName",identifiant.text.toString())
            startActivity(intent)
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
        intent.putExtra("userName",identifiant.text.toString())
        startActivity(intent)
    }



    private fun loginUser(identifier: String, password: String) {
        compositeDisposable.add(iMyService.loginUser(identifier, password)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe { result ->
                if(result == "404"){
                    Toast.makeText(this, "Utilisateur inexistant", Toast.LENGTH_SHORT).show()
                }else if(result == "200"){
                    openDashboard()
                }
                else{
                    Toast.makeText(this, "Mot de passe incorrect", Toast.LENGTH_SHORT).show()
                }
            })


    }
}

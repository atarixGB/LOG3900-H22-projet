package com.example.mobile

import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.provider.MediaStore
import android.widget.ImageButton
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.mikhaellopez.circularimageview.CircularImageView
import io.socket.client.Socket
import kotlinx.android.synthetic.main.activity_registration.*

class Profile : AppCompatActivity() {
    private lateinit var leave: ImageButton
    private lateinit var modifyProfile: TextView
    private lateinit var updloadAvatar: TextView
    private lateinit var avatar: CircularImageView
    private lateinit var user: String
    private lateinit var socket: Socket
    private val REQUEST_IMAGE_CAMERA = 142

    //todo: for the statistic portion we will use fragments i think its better to transmit the information
    //todo (suite): or we can use a viewModel to do the calculations and call them on this page

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profile)
        leave = findViewById(R.id.leave)
        updloadAvatar = findViewById(R.id.modify_avatar)
        avatar = findViewById(R.id.userAvatar)
        user = intent.getStringExtra("userName").toString()

        //Connect to the Server
        SocketHandler.setSocket()
        socket = SocketHandler.getSocket()
        socket.connect()

        leave.setOnClickListener() {
            val intent = Intent(this, MainActivity::class.java)
            socket.emit("disconnectUser", user.toString())
            SocketHandler.closeConnection()
            startActivity(intent)
        }

        updloadAvatar.setOnClickListener() {
            val builder = AlertDialog.Builder(this)
            builder.setTitle("Select avatar")
            builder.setMessage("choisi celui qui te plait")
//            builder.setPositiveButton("Avatars") { dialog, which ->
//                dialog.dismiss()
//                val intent = Intent(this, PickAvatar::class.java)
//                startActivity(intent)
//            }

            builder.setNegativeButton("Caméra") { dialog, which ->
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


    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == REQUEST_IMAGE_CAMERA && resultCode == Activity.RESULT_OK && data != null) {
            avatar.setImageBitmap(data.extras?.get("data") as Bitmap)
        } else {
            Toast.makeText(this, "", Toast.LENGTH_SHORT).show()
        }
    }
}
package com.example.mobile
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
class Dashboard : AppCompatActivity() {
    private lateinit var user: String
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)
        val soloBtn = findViewById(R.id.solo_start_btn) as Button
        soloBtn.setOnClickListener{
            openSoloDrawing()
        }
        val chatRooms_btn = findViewById<Button>(R.id.chatRooms_btn)
        user = intent.getStringExtra("userName").toString()
        chatRooms_btn.setOnClickListener {
            val intent = Intent(this, ChatRooms::class.java)
            intent.putExtra("userName",user)
            startActivity(intent)
        }
    }
    private fun openSoloDrawing(){
        val intent = Intent(this, DrawingActivity::class.java)
        startActivity(intent)
    }
}
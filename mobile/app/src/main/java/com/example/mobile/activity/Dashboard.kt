package com.example.mobile.activity
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.example.mobile.R
import com.example.mobile.activity.drawing.DrawingActivity
import com.example.mobile.viewModel.SharedViewModelToolBar

class Dashboard : AppCompatActivity() {

    private lateinit var user: String
    private val sharedViewModel: SharedViewModelToolBar by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)

        user = intent.getStringExtra("userName").toString()
        sharedViewModel.setUser(user)

        val soloBtn = findViewById(R.id.solo_start_btn) as Button
        soloBtn.setOnClickListener{
            openSoloDrawing()
        }
    }
    private fun openSoloDrawing(){
        val intent = Intent(this, DrawingActivity::class.java)
        startActivity(intent)
    }
}
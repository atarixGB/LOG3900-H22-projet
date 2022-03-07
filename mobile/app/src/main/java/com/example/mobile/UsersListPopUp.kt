package com.example.mobile

import android.content.Context
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.fragment.app.DialogFragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import kotlinx.android.synthetic.main.activity_create_room_pop_up.view.*
import kotlinx.android.synthetic.main.activity_users_list_pop_up.view.*
import java.util.ArrayList

class UsersListPopUp(val room: Room) : DialogFragment() {
    private lateinit var userAdapter: UserAdapter
    private lateinit var users : ArrayList<String>

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        var rootView: View = inflater.inflate(R.layout.activity_users_list_pop_up, container, false)

        rootView.roomName.text = "Membres de ${room.roomName}"
        users = ArrayList()

        userAdapter = UserAdapter(requireContext(), users)
        //Recycler View of rooms
        rootView.rvUsersList.adapter = userAdapter
        rootView.rvUsersList.layoutManager = LinearLayoutManager(requireContext())

        for (user in room.usersList) {
            userAdapter.addUser(user)
            userAdapter.notifyItemInserted((rootView.rvUsersList.adapter as UserAdapter).itemCount)
        }

        rootView.closeBtn.setOnClickListener {
            dismiss()
        }

        return rootView
    }

}
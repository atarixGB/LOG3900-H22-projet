package com.example.mobile.popup

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.DialogFragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.mobile.R
import com.example.mobile.adapter.UserAdapter
import kotlinx.android.synthetic.main.activity_users_list_pop_up.view.*
import java.util.ArrayList

class UsersListPopUp(val name: String, val usersList: ArrayList<String>) : DialogFragment() {
    private lateinit var userAdapter: UserAdapter
    private lateinit var users : ArrayList<String>

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        var rootView: View = inflater.inflate(R.layout.activity_users_list_pop_up, container, false)

        rootView.roomName.text = "Membres de ${name}"
        users = ArrayList()

        userAdapter = UserAdapter(requireContext(), users, false)
        //Recycler View of rooms
        rootView.rvUsersList.adapter = userAdapter
        rootView.rvUsersList.layoutManager = LinearLayoutManager(requireContext())

        for (user in usersList) {
            userAdapter.addUser(user)
            userAdapter.notifyItemInserted((rootView.rvUsersList.adapter as UserAdapter).itemCount)
        }

        rootView.closeBtn.setOnClickListener {
            dismiss()
        }

        return rootView
    }

}
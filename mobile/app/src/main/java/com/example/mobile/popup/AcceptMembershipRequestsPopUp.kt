package com.example.mobile.popup

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.DialogFragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.mobile.R
import com.example.mobile.adapter.UserAdapter
import kotlinx.android.synthetic.main.activity_accept_membership_requests_pop_up.view.*
import kotlinx.android.synthetic.main.activity_users_list_pop_up.view.closeBtn
import kotlinx.android.synthetic.main.activity_users_list_pop_up.view.rvUsersList
import java.util.ArrayList

class AcceptMembershipRequestsPopUp(val albumName: String, val usersList: ArrayList<String>, val currentUser: String) : DialogFragment() {
    private lateinit var userAdapter: UserAdapter
    private lateinit var users : ArrayList<String>
    private lateinit var userNameAccepted: String


    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        var rootView: View = inflater.inflate(R.layout.activity_accept_membership_requests_pop_up, container, false)

        rootView.albumName.text = "Accepter les demandes de ${albumName}"
        users = ArrayList()

        userAdapter = UserAdapter(requireContext(), currentUser, users, true)
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
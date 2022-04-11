package com.example.mobile.activity.drawing

import android.os.Bundle
import android.view.KeyEvent
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import androidx.activity.viewModels
import androidx.core.view.isVisible
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.ISDRAFT
import com.example.mobile.Interface.IMessage
import com.example.mobile.R
import com.example.mobile.SocketHandler
import com.example.mobile.adapter.MessageAdapter
import com.example.mobile.viewModel.SharedViewModelToolBar
import io.socket.client.Socket
import io.socket.emitter.Emitter
import org.json.JSONObject
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

class ChatFragment : Fragment() {
    private lateinit var rvOutputMsgs: RecyclerView
    private lateinit var messageText : EditText
    private lateinit var msgAdapter: MessageAdapter
    private lateinit var IMessages : ArrayList<IMessage>
    private  var  roomName  = ""
    private lateinit var btnSend : Button
    private  var  user = ""

    private val sharedViewModelToolBar: SharedViewModelToolBar by activityViewModels()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        DrawingSocket.socket.on("receiveCollabMessage", onReceiveMessage)
        DrawingSocket.socket.on("updateUserList", onUpdateUserList)

        IMessages = ArrayList()
        sharedViewModelToolBar.collabDrawingId.observe(
            viewLifecycleOwner,
            Observer { collabDrawingId ->
                this.roomName = collabDrawingId
            })

        sharedViewModelToolBar.user.observe(
            viewLifecycleOwner,
            Observer { userName ->
                requireActivity().runOnUiThread(){
                    this.user = userName
                    msgAdapter.owner = this.user
                }

            })

        sharedViewModelToolBar.onEnterPressed.observe(viewLifecycleOwner, Observer {
            sendMessage()
        })

        btnSend.setOnClickListener{
            sendMessage()
        }

        //Adapter
        msgAdapter = MessageAdapter(requireContext(), IMessages, this.user)
        rvOutputMsgs.adapter = msgAdapter
        rvOutputMsgs.layoutManager = LinearLayoutManager(requireContext())
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val rootView = inflater.inflate(R.layout.fragment_chat, container, false)
        rvOutputMsgs = rootView.findViewById(R.id.rvOutputMsgs)
        messageText = rootView.findViewById(R.id.msgText)
        btnSend = rootView.findViewById(R.id.btnSend)

        if (ISDRAFT) {
            rvOutputMsgs.isVisible = false
            messageText.isVisible = false
            btnSend.isVisible = false
        }
        return rootView
    }

    private fun sendMessage() {
        if (messageText.text.isNotEmpty()) {
            if (!messageText.text.isNullOrBlank()) {
                var messageData: JSONObject = JSONObject()
                messageData.put("userName", user)
                messageData.put("message", messageText.text.toString())
                val current = LocalDateTime.now()
                val formatter = DateTimeFormatter.ofPattern("HH:mm:ss")
                val formatted = current.format(formatter)
                messageData.put("time", formatted)
                messageData.put("room", this.roomName)
                DrawingSocket.socket.emit("collabMessage", messageData)
            }
        }
    }

    private var onReceiveMessage = Emitter.Listener {
        if(it[0] != null){
            var messageData = it[0] as JSONObject
            val message = messageData.get("message") as String
            val user = messageData.get("userName") as String
            val time = messageData.get("time") as String
            val room = messageData.get("room") as String
            val msg = IMessage(message, user, time, room, false)
            activity?.runOnUiThread {
                msgAdapter.addMsg(msg)
                msgAdapter.notifyItemInserted((rvOutputMsgs.adapter as MessageAdapter).itemCount)
                rvOutputMsgs.scrollToPosition((rvOutputMsgs.adapter as MessageAdapter).itemCount - 1)
                messageText.text.clear()
            }
        }
    }

    private var onUpdateUserList = Emitter.Listener {

    }



}
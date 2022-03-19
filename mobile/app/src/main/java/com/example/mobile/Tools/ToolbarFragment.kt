package com.example.mobile.Tools

import android.content.Intent
import android.graphics.Bitmap
import android.os.Bundle
import android.view.*
import androidx.fragment.app.Fragment
import android.widget.AdapterView
import android.widget.Button
import android.widget.GridView
import androidx.fragment.app.activityViewModels
import com.example.mobile.R
import com.example.mobile.activity.albums.Albums
import com.example.mobile.viewModel.ToolModel
import com.example.mobile.viewModel.SharedViewModelToolBar

class ToolbarFragment : Fragment(), AdapterView.OnItemClickListener {

    private var gridView: GridView? = null
    private var arrayList:ArrayList<ToolItem> ? = null
    private var toolAdapter: ToolAdapter ? = null
    private lateinit var user: String
    private lateinit var saveDrawingBtn : Button
    private lateinit var backBtn : Button
    private lateinit var _img: Bitmap
    private val toolChange: ToolModel by activityViewModels()
    private val sharedViewModel: SharedViewModelToolBar by activityViewModels()

    enum class MenuItem(val position: Int) {
        PENCIL(0),
        ERASER(1),
        RECTANGLE(2),
        OVAL(3),
        BACK(4)
    }
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val rootView = inflater.inflate(R.layout.fragment_toolbar, container, false)
        saveDrawingBtn = rootView.findViewById(R.id.saveDrawingBtn)
        backBtn = rootView.findViewById(R.id.backBtn)
        gridView = rootView.findViewById(R.id.weight_view)
        arrayList = ArrayList()
        arrayList  = setDataList()
        toolAdapter = ToolAdapter(activity?.baseContext!!, arrayList!!)
        gridView?.adapter = toolAdapter
        gridView?.onItemClickListener = this

        sharedViewModel.user.observe(viewLifecycleOwner) {
            user = it
        }

        saveDrawingBtn.setOnClickListener {
            toolChange.onClick()
        }

        backBtn.setOnClickListener {
            //enregistrer avant de quitter
            toolChange.onClick()

            val intent = Intent(activity, Albums::class.java)
            intent.putExtra("userName", user)
            startActivity(intent)
        }

        return rootView
    }

    private fun setDataList():ArrayList<ToolItem>{
        val arrayList:ArrayList<ToolItem> = ArrayList()
        arrayList.add(ToolItem(R.drawable.pencil_clicked))
        arrayList.add(ToolItem(R.drawable.eraser))
        arrayList.add(ToolItem(R.drawable.rectangle))
        arrayList.add(ToolItem(R.drawable.circle))
        arrayList.add(ToolItem(R.drawable.arrow))
        return arrayList
    }

    override fun onItemClick(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
        arrayList!!.set(MenuItem.PENCIL.position, ToolItem(R.drawable.pencil))
        arrayList!!.set(MenuItem.ERASER.position, ToolItem(R.drawable.eraser))
        arrayList!!.set(MenuItem.RECTANGLE.position, ToolItem(R.drawable.rectangle))
        arrayList!!.set(MenuItem.OVAL.position, ToolItem(R.drawable.circle))
        if(position == MenuItem.PENCIL.position){
            arrayList!!.set(MenuItem.PENCIL.position, ToolItem(R.drawable.pencil_clicked))
            toolChange.changeTool(MenuItem.PENCIL)

        }else if(position== MenuItem.ERASER.position){
            arrayList!!.set(MenuItem.ERASER.position, ToolItem(R.drawable.eraser_clicked))
            toolChange.changeTool(MenuItem.ERASER)

        }else if(position== MenuItem.RECTANGLE.position){
            arrayList!!.set(MenuItem.RECTANGLE.position, ToolItem(R.drawable.rectangle_clicked))
            toolChange.changeTool(MenuItem.RECTANGLE)

        } else if(position== MenuItem.OVAL.position){
            arrayList!!.set(MenuItem.OVAL.position, ToolItem(R.drawable.circle_clicked))
            toolChange.changeTool(MenuItem.OVAL)

        }
        toolAdapter!!.notifyDataSetChanged()
    }
}
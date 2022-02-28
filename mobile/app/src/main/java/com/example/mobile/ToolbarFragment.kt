package com.example.mobile

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.GridView
import android.widget.ImageButton
import androidx.core.content.ContextCompat
import androidx.fragment.app.activityViewModels
import com.example.mobile.model.ToolWeight

class ToolbarFragment : Fragment(), AdapterView.OnItemClickListener {

    private var gridView: GridView? = null
    private var arrayList:ArrayList<ToolItem> ? = null
    private var toolAdapter: ToolAdapter ? = null
    private val viewModel: ToolWeight by activityViewModels()
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val rootView = inflater.inflate(R.layout.fragment_toolbar, container, false)
        gridView = rootView.findViewById(R.id.my_grid_view)
        arrayList = ArrayList()
        arrayList  = setDataList()
        toolAdapter = ToolAdapter(activity?.baseContext!!, arrayList!!)
        gridView?.adapter = toolAdapter
        gridView?.onItemClickListener = this
        return rootView
    }

    private fun setDataList():ArrayList<ToolItem>{
        val arrayList:ArrayList<ToolItem> = ArrayList()
        arrayList.add(ToolItem(R.drawable.pencilp))
        arrayList.add(ToolItem(R.drawable.eraser))
        arrayList.add(ToolItem(R.drawable.rectangle))
        arrayList.add(ToolItem(R.drawable.circle))
        return arrayList
    }

    override fun onItemClick(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
        val toolItem:ToolItem = arrayList!!.get(position)
    }
}
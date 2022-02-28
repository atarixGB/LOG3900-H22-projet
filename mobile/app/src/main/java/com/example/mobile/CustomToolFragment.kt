package com.example.mobile

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.GridView
import androidx.fragment.app.activityViewModels
import com.example.mobile.model.ToolWeight


class CustomToolFragment : Fragment(), AdapterView.OnItemClickListener {

    private var gridView:GridView ? = null
    private var arrayList:ArrayList<ToolWeightItem> ? = null
    private var weightAdapter: ToolWeightAdapter ? = null
    private val viewModel: ToolWeight by activityViewModels()
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val rootView = inflater.inflate(R.layout.fragment_custom_tool, container, false)
        gridView = rootView.findViewById(R.id.my_grid_view)
        arrayList = ArrayList()
        arrayList  = setDataList()
        weightAdapter = ToolWeightAdapter(activity?.baseContext!!, arrayList!!)
        gridView?.adapter = weightAdapter
        gridView?.onItemClickListener = this
        return rootView
    }

    private fun setDataList():ArrayList<ToolWeightItem>{
        val arrayList:ArrayList<ToolWeightItem> = ArrayList()
        arrayList.add(ToolWeightItem(R.drawable.circle1, 1f))
        arrayList.add(ToolWeightItem(R.drawable.circle2,2f))
        arrayList.add(ToolWeightItem(R.drawable.circle4,4f))
        arrayList.add(ToolWeightItem(R.drawable.circle8,8f))
        arrayList.add(ToolWeightItem(R.drawable.circle12,12f))
        arrayList.add(ToolWeightItem(R.drawable.circle15,15f))
        arrayList.add(ToolWeightItem(R.drawable.circle20,20f))
        arrayList.add(ToolWeightItem(R.drawable.circle24,24f))
        arrayList.add(ToolWeightItem(R.drawable.circle30,30f))
        return arrayList
    }

    override fun onItemClick(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
        val weightItem:ToolWeightItem = arrayList!!.get(position)
        viewModel.changeWeight(weightItem.size!!)
    }

}
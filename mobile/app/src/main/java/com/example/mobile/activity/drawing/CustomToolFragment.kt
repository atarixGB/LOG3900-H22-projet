package com.example.mobile.activity.drawing

import android.graphics.Color
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.GridView
import android.widget.Toast
import android.widget.ToggleButton
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Observer
import com.example.mobile.R
import com.example.mobile.Tools.ToolColorItem
import com.example.mobile.Tools.ToolItem
import com.example.mobile.Tools.ToolWeightAdapter
import com.example.mobile.Tools.ToolWeightItem
import com.example.mobile.adapter.ColorAdapter
import com.example.mobile.viewModel.ToolModel
import com.example.mobile.viewModel.ToolParameters


class CustomToolFragment : Fragment(), AdapterView.OnItemClickListener {

    private var weightView:GridView ? = null
    private var weights:ArrayList<ToolWeightItem> ? = null
    private var weightAdapter: ToolWeightAdapter? = null
    private val toolParametersModel: ToolParameters by activityViewModels()

    private var colorView:GridView ? = null
    private var colors:ArrayList<ToolColorItem> ? = null
    private var colorAdapter: ColorAdapter? = null

    private var strokeButton: ToggleButton  ? = null
    private var filllButton: ToggleButton  ? = null

    private var selectedColor : Int ? = null
    private var selectedWeight : Float = 1f

    //when click on new tool set default weight and color
    private val toolModel: ToolModel by activityViewModels()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val rootView = inflater.inflate(R.layout.fragment_custom_tool, container, false)
        weightView = rootView.findViewById(R.id.weight_view)
        weights = ArrayList()
        weights  = setWeightList()
        weightAdapter = ToolWeightAdapter(activity?.baseContext!!, weights!!)
        weightView?.adapter = weightAdapter
        weightView?.onItemClickListener = this

        colorView = rootView.findViewById(R.id.color_view)
        colors = ArrayList()
        colors  = setColortList()
        colorAdapter = ColorAdapter(activity?.baseContext!!, colors!!)
        colorView?.adapter = colorAdapter!!
        colorView?.onItemClickListener = this

        val strokeButton: ToggleButton = rootView.findViewById(R.id.toggle_trait)
        val fillButton: ToggleButton = rootView.findViewById(R.id.toggle_fond)

        strokeButton.setOnCheckedChangeListener { _, isChecked ->
            fillButton.isChecked = !isChecked
            if(isChecked) {
                toolParametersModel.changeStroke(true)
            }

        }
        fillButton.setOnCheckedChangeListener { _, isChecked ->
            strokeButton.isChecked = !isChecked
            if(isChecked) {
                toolParametersModel.changeStroke(false)
            }
        }

        toolModel.tool.observe(viewLifecycleOwner, Observer { tool ->
            setDefault()
        })

        return rootView
    }

    private fun setDefault(){
        setAllWeightToUnselectedIcon()
        val weightItem: ToolWeightItem = weights!!.get(0)
        weights!!.set(0, ToolWeightItem(R.drawable.circle1_selected, 1f))
        toolParametersModel.changeWeight(weightItem.size!!)
        selectedWeight = weightItem.size!!
        weightAdapter!!.notifyDataSetChanged()
    }

    private fun setWeightList():ArrayList<ToolWeightItem>{
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

    private fun setColortList():ArrayList<ToolColorItem>{
        val arrayList:ArrayList<ToolColorItem> = ArrayList()
        arrayList.add(ToolColorItem(R.drawable.brown_color, resources.getColor(R.color.brown)))
        arrayList.add(ToolColorItem(R.drawable.white_color, resources.getColor(R.color.white)))
        arrayList.add(ToolColorItem(R.drawable.black_color, resources.getColor(R.color.black)))
        arrayList.add(ToolColorItem(R.drawable.red_color, resources.getColor(R.color.red)))
        arrayList.add(ToolColorItem(R.drawable.red_orange_color, resources.getColor(R.color.red_orange)))
        arrayList.add(ToolColorItem(R.drawable.orange_color, resources.getColor(R.color.orange)))
        arrayList.add(ToolColorItem(R.drawable.yellow_color, resources.getColor(R.color.yellow)))
        arrayList.add(ToolColorItem(R.drawable.yellow_green_color, resources.getColor(R.color.yellow_green)))
        arrayList.add(ToolColorItem(R.drawable.green_color, resources.getColor(R.color.green)))
        arrayList.add(ToolColorItem(R.drawable.sky_blue_color, resources.getColor(R.color.sky_blue)))
        arrayList.add(ToolColorItem(R.drawable.blue_color, resources.getColor(R.color.blue)))
        arrayList.add(ToolColorItem(R.drawable.purple_color, resources.getColor(R.color.purple)))
        arrayList.add(ToolColorItem(R.drawable.circle_transparent, resources.getColor(R.color.black_transparent)))
        return arrayList
    }

    override fun onItemClick(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
        if(parent == weightView){
            val weightItem: ToolWeightItem = weights!!.get(position)
            toolParametersModel.changeWeight(weightItem.size!!)
            selectedWeight = weightItem.size!!
            setAllWeightToUnselectedIcon()
            when (position) {
                0 -> weights!!.set(0, ToolWeightItem(R.drawable.circle1_selected, 1f))
                1 -> weights!!.set(1, ToolWeightItem(R.drawable.circle2_selected, 2f))
                2 -> weights!!.set(2, ToolWeightItem(R.drawable.circle4_selected, 4f))
                3 -> weights!!.set(3, ToolWeightItem(R.drawable.circle8_selected, 8f))
                4 -> weights!!.set(4, ToolWeightItem(R.drawable.circle12_selected, 12f))
                5 -> weights!!.set(5, ToolWeightItem(R.drawable.circle15_selected, 15f))
                6 -> weights!!.set(6, ToolWeightItem(R.drawable.circle20_selected, 20f))
                7 -> weights!!.set(7, ToolWeightItem(R.drawable.circle24_selected, 24f))
                8 -> weights!!.set(8, ToolWeightItem(R.drawable.circle30_selected, 30f))
            }
            weightAdapter!!.notifyDataSetChanged()
        }else{
            val colorItem: ToolColorItem = colors!!.get(position)
            toolParametersModel.changeColor(colorItem.color!!)
            selectedColor = colorItem.color
        }
    }

    private fun setAllWeightToUnselectedIcon(){
        weights!!.set(0, ToolWeightItem(R.drawable.circle1, 1f))
        weights!!.set(1, ToolWeightItem(R.drawable.circle2, 2f))
        weights!!.set(2, ToolWeightItem(R.drawable.circle4, 4f))
        weights!!.set(3, ToolWeightItem(R.drawable.circle8, 8f))
        weights!!.set(4, ToolWeightItem(R.drawable.circle12, 12f))
        weights!!.set(5, ToolWeightItem(R.drawable.circle15, 15f))
        weights!!.set(6, ToolWeightItem(R.drawable.circle20, 20f))
        weights!!.set(7, ToolWeightItem(R.drawable.circle24, 24f))
        weights!!.set(8, ToolWeightItem(R.drawable.circle30, 30f))
    }


}
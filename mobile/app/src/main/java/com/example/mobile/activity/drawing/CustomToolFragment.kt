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
import android.widget.ImageButton
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
    private lateinit var deleteSelection: ImageButton
    private lateinit var pasteSelection: ImageButton
    private val toolParametersModel: ToolParameters by activityViewModels()

    private var colorView:GridView ? = null
    private var colors:ArrayList<ToolColorItem> ? = null
    private var colorAdapter: ColorAdapter? = null

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
        deleteSelection = rootView.findViewById(R.id.deleteSelection)
        pasteSelection = rootView.findViewById(R.id.pasteSelection)
        weights = ArrayList()
        weights = setWeightList()
        weightAdapter = ToolWeightAdapter(activity?.baseContext!!, weights!!)
        weightView?.adapter = weightAdapter
        weightView?.onItemClickListener = this

        colorView = rootView.findViewById(R.id.color_view)
        colors = ArrayList()
        colors = setColortList()
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

        deleteSelection.setOnClickListener {
            toolParametersModel.deleteSelection(true)
        }
        return rootView
    }

    private fun setDefault(){
        setDefaultWeight()
        setDefaultColor()
    }

    private fun setDefaultWeight(){
        setAllWeightToUnselectedIcon()
        val weightItem: ToolWeightItem = weights!!.get(0)
        weights!!.set(0, ToolWeightItem(R.drawable.circle1_selected, 1f))
//        toolParametersModel.changeWeight(weightItem.size!!)
        weightAdapter!!.notifyDataSetChanged()
    }

    private fun setDefaultColor(){
        setAllColorToUnselectedIcon()
        val colorItem: ToolColorItem = colors!!.get(2)
        colors!!.set(2, ToolColorItem(R.drawable.black_color_selected,resources.getColor(R.color.black)))
//        toolParametersModel.changeColor(colorItem.color!!)
        colorAdapter!!.notifyDataSetChanged()
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
        }else if(parent == colorView){
            val colorItem: ToolColorItem = colors!!.get(position)
            toolParametersModel.changeColor(colorItem.color!!)
            setAllColorToUnselectedIcon()

            when (position) {
                0 -> colors!!.set(0,ToolColorItem(R.drawable.brown_selected, resources.getColor(R.color.brown)))
                1 -> colors!!.set(1,ToolColorItem(R.drawable.white_selected, resources.getColor(R.color.white)))
                2 -> colors!!.set(2,ToolColorItem(R.drawable.black_color_selected, resources.getColor(R.color.black)))
                3 -> colors!!.set(3,ToolColorItem(R.drawable.red_selected, resources.getColor(R.color.red)))
                4 -> colors!!.set(4,ToolColorItem(R.drawable.red_orange_selected, resources.getColor(R.color.red_orange)))
                5 -> colors!!.set(5,ToolColorItem(R.drawable.orange_selected, resources.getColor(R.color.orange)))
                6 -> colors!!.set(6,ToolColorItem(R.drawable.yellow_selected, resources.getColor(R.color.yellow)))
                7 -> colors!!.set(7,ToolColorItem(R.drawable.yellow_green_color, resources.getColor(R.color.yellow_green)))
                8 -> colors!!.set(8,ToolColorItem(R.drawable.green_selected, resources.getColor(R.color.green)))
                9 -> colors!!.set(9,ToolColorItem(R.drawable.sky_blue_selected, resources.getColor(R.color.sky_blue)))
                10 -> colors!!.set(10,ToolColorItem(R.drawable.blue_selected, resources.getColor(R.color.blue)))
                11 -> colors!!.set(11,ToolColorItem(R.drawable.purple_selected, resources.getColor(R.color.purple)))
                12 -> colors!!.set(12,ToolColorItem(R.drawable.circle_transparent_selected, resources.getColor(R.color.black_transparent)))
            }
            colorAdapter!!.notifyDataSetChanged()
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

    private fun setAllColorToUnselectedIcon(){
        colors!!.set(0,ToolColorItem(R.drawable.brown_color, resources.getColor(R.color.brown)))
        colors!!.set(1,ToolColorItem(R.drawable.white_color, resources.getColor(R.color.white)))
        colors!!.set(2,ToolColorItem(R.drawable.black_color, resources.getColor(R.color.black)))
        colors!!.set(3,ToolColorItem(R.drawable.red_color, resources.getColor(R.color.red)))
        colors!!.set(4,ToolColorItem(R.drawable.red_orange_color, resources.getColor(R.color.red_orange)))
        colors!!.set(5,ToolColorItem(R.drawable.orange_color, resources.getColor(R.color.orange)))
        colors!!.set(6,ToolColorItem(R.drawable.yellow_color, resources.getColor(R.color.yellow)))
        colors!!.set(7,ToolColorItem(R.drawable.yellow_green_color, resources.getColor(R.color.yellow_green)))
        colors!!.set(8,ToolColorItem(R.drawable.green_color, resources.getColor(R.color.green)))
        colors!!.set(9,ToolColorItem(R.drawable.sky_blue_color, resources.getColor(R.color.sky_blue)))
        colors!!.set(10,ToolColorItem(R.drawable.blue_color, resources.getColor(R.color.blue)))
        colors!!.set(11,ToolColorItem(R.drawable.purple_color, resources.getColor(R.color.purple)))
        colors!!.set(12,ToolColorItem(R.drawable.circle_transparent, resources.getColor(R.color.black_transparent)))
    }


}
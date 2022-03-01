package com.example.mobile

import android.os.Bundle
import android.view.*
import androidx.fragment.app.Fragment
import android.widget.AdapterView
import android.widget.GridView
import androidx.fragment.app.activityViewModels
import com.example.mobile.model.ToolModel
import com.example.mobile.model.ToolWeight

class ToolbarFragment : Fragment(), AdapterView.OnItemClickListener {

    private var gridView: GridView? = null
    private var arrayList:ArrayList<ToolItem> ? = null
    private var toolAdapter: ToolAdapter ? = null
    private val toolChange: ToolModel by activityViewModels()
    enum class MenuItem(val position: Int) {
        BACK(0),
        PENCIL(1),
        ERASER(2),
        RECTANGLE(3),
        CIRCLE(4)
    }
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
        arrayList.add(ToolItem(R.drawable.arrow))
        arrayList.add(ToolItem(R.drawable.pencil_clicked))
        arrayList.add(ToolItem(R.drawable.eraser))
        arrayList.add(ToolItem(R.drawable.rectangle))
        arrayList.add(ToolItem(R.drawable.circle))
        return arrayList
    }

    override fun onItemClick(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
        arrayList!!.set(MenuItem.PENCIL.position,ToolItem(R.drawable.pencil))
        arrayList!!.set(MenuItem.ERASER.position,ToolItem(R.drawable.eraser))
        arrayList!!.set(MenuItem.RECTANGLE.position,ToolItem(R.drawable.rectangle))
        arrayList!!.set(MenuItem.CIRCLE.position,ToolItem(R.drawable.circle))
        if(position == MenuItem.PENCIL.position){
            arrayList!!.set(MenuItem.PENCIL.position,ToolItem(R.drawable.pencil_clicked))
            toolChange.changeTool("pencil")
        }else if(position== MenuItem.ERASER.position){
            arrayList!!.set(MenuItem.ERASER.position,ToolItem(R.drawable.eraser_clicked))
            toolChange.changeTool("eraser")
        }else if(position== MenuItem.RECTANGLE.position){
            arrayList!!.set(MenuItem.RECTANGLE.position,ToolItem(R.drawable.rectangle_clicked))
            toolChange.changeTool("rectangle")
        } else if(position== MenuItem.CIRCLE.position){
            arrayList!!.set(MenuItem.CIRCLE.position,ToolItem(R.drawable.circle_clicked))
            toolChange.changeTool("circle")
        }
        toolAdapter!!.notifyDataSetChanged()
    }
}
package com.example.mobile.Tools

import android.content.Context
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.ImageView
import com.example.mobile.R

class ToolWeightAdapter(var context: Context, var arrayList: ArrayList<ToolWeightItem>): BaseAdapter() {
    override fun getCount(): Int {
       return  arrayList.size
    }

    override fun getItem(position: Int): Any {
        return arrayList.get(position)
    }

    override fun getItemId(position: Int): Long {
       return position.toLong()
    }

    override fun getView(positon: Int, convertView: View?, parent: ViewGroup?): View {
        var view:View = View.inflate(context, R.layout.tools_weight_list, null)
        var icons:ImageView = view.findViewById(R.id.icons)

        var weightItem: ToolWeightItem = arrayList.get(positon)
        icons.setImageResource(weightItem.icons!!)
        return view
    }

}
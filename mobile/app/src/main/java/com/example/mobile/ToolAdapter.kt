package com.example.mobile

import android.content.Context
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.ImageView

class ToolAdapter(var context: Context, var arrayList: ArrayList<ToolItem>): BaseAdapter()  {
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
        var view: View = View.inflate(context, R.layout.tool_list, null)
        var icons: ImageView = view.findViewById(R.id.icons)
        var weightItem: ToolItem = arrayList.get(positon)
        icons.setImageResource(weightItem.icons!!)
        return view
    }
}
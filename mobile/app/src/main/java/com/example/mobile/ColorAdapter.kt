package com.example.mobile

import android.content.Context
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.ImageView
import com.example.mobile.Tools.ToolColorItem

class ColorAdapter(var context: Context, var arrayList: ArrayList<ToolColorItem>): BaseAdapter()  {
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
        var view:View = View.inflate(context, R.layout.color_list, null)
        var icons: ImageView = view.findViewById(R.id.icon_color)

        var colorItem: ToolColorItem = arrayList.get(positon)
        icons.setImageResource(colorItem.icons!!)
        return view
    }
}
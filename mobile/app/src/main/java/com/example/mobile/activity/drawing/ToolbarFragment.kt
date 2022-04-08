package com.example.mobile.activity.drawing

import android.app.Activity
import android.content.Intent
import android.graphics.Bitmap
import android.os.Bundle
import android.provider.MediaStore
import android.view.*
import android.widget.*
import androidx.core.view.isVisible
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import com.example.mobile.ISDRAFT
import com.example.mobile.R
import com.example.mobile.REQUEST_IMAGE_CAMERA
import com.example.mobile.Tools.ToolAdapter
import com.example.mobile.Tools.ToolItem
import com.example.mobile.activity.Dashboard
import com.example.mobile.activity.albums.Albums
import com.example.mobile.viewModel.SharedViewModelToolBar
import com.example.mobile.viewModel.ToolModel
import kotlinx.android.synthetic.main.activity_registration.*
import kotlinx.android.synthetic.main.fragment_toolbar.*


class ToolbarFragment : Fragment(), AdapterView.OnItemClickListener {

    private var gridView: GridView? = null
    private var arrayList:ArrayList<ToolItem> ? = null
    private var toolAdapter: ToolAdapter? = null
    private var cameraPictureBitmap:Bitmap? = null
    private lateinit var user: String
    private lateinit var saveDrawingBtn : Button
    private lateinit var addToStoryBtn : Button
    private lateinit var takePictureBtn : Button
    private lateinit var addToStoryText :TextView
    private lateinit var backBtn : Button
    private lateinit var _img: Bitmap
    private val toolChange: ToolModel by activityViewModels()
    private val sharedViewModel: SharedViewModelToolBar by activityViewModels()

    enum class MenuItem(val position: Int) {
        PENCIL(0),
        RECTANGLE(1),
        OVAL(2),

    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val rootView = inflater.inflate(R.layout.fragment_toolbar, container, false)
        saveDrawingBtn = rootView.findViewById(R.id.saveDrawingBtn)
        addToStoryBtn = rootView.findViewById(R.id.addToStoryBtn)
        addToStoryText=rootView.findViewById(R.id.addToStoryText)
        takePictureBtn=rootView.findViewById(R.id.takePictureBtn)
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

        if (!ISDRAFT){
            takePictureBtn.isVisible=false
            saveDrawingBtn.setOnClickListener {
                toolChange.onClick()
            }

            addToStoryBtn.setOnClickListener {
                toolChange.onStory()
            }

            backBtn.setOnClickListener {
                //enregistrer avant de quitter
                toolChange.onClick()
                val intent = Intent(activity, Albums::class.java)
                intent.putExtra("userName", user)
                startActivity(intent)
            }
        }
        else{
            saveDrawingBtn.isVisible=false
            addToStoryBtn.isVisible=false
            addToStoryText.isVisible=false

            backBtn.setOnClickListener {
                val intent = Intent(activity, Dashboard::class.java)
                intent.putExtra("userName", user)
                startActivity(intent)
            }

            takePictureBtn.setOnClickListener{
                val cInt = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
                startActivityForResult(cInt, REQUEST_IMAGE_CAMERA)
            }

        }
        return rootView
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == REQUEST_IMAGE_CAMERA && resultCode == Activity.RESULT_OK && data != null) {
            cameraPictureBitmap=data.extras?.get("data") as Bitmap
        } else if(resultCode==Activity.RESULT_CANCELED){
            Toast.makeText(activity, "Erreur capture", Toast.LENGTH_SHORT).show()
        }
    }

    private fun setDataList():ArrayList<ToolItem>{
        val arrayList:ArrayList<ToolItem> = ArrayList()
        arrayList.add(ToolItem(R.drawable.pencil_clicked))
        arrayList.add(ToolItem(R.drawable.rectangle))
        arrayList.add(ToolItem(R.drawable.circle))
        return arrayList
    }

    override fun onItemClick(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
        arrayList!!.set(MenuItem.PENCIL.position, ToolItem(R.drawable.pencil))
        arrayList!!.set(MenuItem.RECTANGLE.position, ToolItem(R.drawable.rectangle))
        arrayList!!.set(MenuItem.OVAL.position, ToolItem(R.drawable.circle))
        if(position == MenuItem.PENCIL.position){
            arrayList!!.set(MenuItem.PENCIL.position, ToolItem(R.drawable.pencil_clicked))
            toolChange.changeTool(MenuItem.PENCIL)
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
package com.example.mobile.activity.drawing

import android.Manifest
import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.os.Bundle
import android.provider.MediaStore
import android.view.*
import androidx.fragment.app.Fragment
import android.widget.AdapterView
import android.widget.Button
import android.widget.GridView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.view.isVisible
import androidx.fragment.app.activityViewModels
import com.example.mobile.ISDRAFT
import com.example.mobile.R
import com.example.mobile.REQUEST_IMAGE_CAMERA
import com.example.mobile.Tools.ToolAdapter
import com.example.mobile.Tools.ToolItem
import com.example.mobile.activity.albums.Albums
import com.example.mobile.viewModel.ToolModel
import com.example.mobile.viewModel.SharedViewModelToolBar

class ToolbarFragment : Fragment(), AdapterView.OnItemClickListener {

    private var gridView: GridView? = null
    private var arrayList:ArrayList<ToolItem> ? = null
    private var toolAdapter: ToolAdapter? = null
    private lateinit var user: String
    private lateinit var saveDrawingBtn : Button
    private lateinit var addToStoryBtn : Button
    private lateinit var takePictureBtn : Button
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

            takePictureBtn.setOnClickListener{

                val builder = AlertDialog.Builder(requireContext())
                builder.setTitle("Photo de profile")
                builder.setMessage("Prends une belle photo! ")
                builder.setNegativeButton("Lance la caméra") { dialog, which ->
                    dialog.dismiss()
                    Intent(MediaStore.ACTION_IMAGE_CAPTURE).also { takePictureIntent ->
                        takePictureIntent.resolveActivity().also {
                            val permission = ContextCompat.checkSelfPermission(
                                this,
                                android.Manifest.permission.CAMERA
                            )
                            if (permission != PackageManager.PERMISSION_GRANTED) {
                                ActivityCompat.requestPermissions(
                                    this,
                                    arrayOf(android.Manifest.permission.CAMERA),
                                    1
                                )
                            } else {
                                startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAMERA)
                            }
                        }
                    }
                }

                val dialog: AlertDialog = builder.create()
                dialog.show()
            }

        }



        return rootView
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
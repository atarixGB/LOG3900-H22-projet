package com.example.mobile.Interface

import com.google.gson.annotations.SerializedName

data class IVec2 (
    @SerializedName("x")
    val x: Float,
    @SerializedName("y")
    val y: Float){}
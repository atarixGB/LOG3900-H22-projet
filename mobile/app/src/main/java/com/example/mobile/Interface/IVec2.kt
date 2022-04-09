package com.example.mobile.Interface

import com.google.gson.annotations.SerializedName

data class IVec2 (
    @SerializedName("x")
    var x: Float,
    @SerializedName("y")
    var y: Float){}
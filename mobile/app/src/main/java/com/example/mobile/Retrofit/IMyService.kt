package com.example.mobile.Retrofit

import io.reactivex.Observable
import retrofit2.http.*
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.ResponseBody
import retrofit2.Call

interface IMyService {
    @POST ("register")
    @FormUrlEncoded
    fun registerUser(@Field("identifier") identifier:String,
                     @Field("password")password:String,
                    @Field("avatar")avatar:String):Observable<String>


    @POST("login")
    @FormUrlEncoded
    fun loginUser(@Field("identifier") identifier:String,
                  @Field("password")password:String):Observable<String>



//    @Multipart
//    @POST("upload")
//    fun uploadImage(@Part part: MultipartBody.Part,@Part("somedate") requestBody: RequestBody ) : Call<RequestBody>
}
package com.example.mobile.Retrofit

import com.example.mobile.Room
import io.reactivex.Observable

import retrofit2.http.*
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback

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

    @POST("createRoom")
    @FormUrlEncoded
    fun createRoom(@Field("identifier") identifier:String,
                   @Field("roomName")roomName:String,
                    @Field ("usersList") usersList:ArrayList<String>) : Observable<String>

    @POST("joinRoom")
    @FormUrlEncoded
    fun joinRoom(@Field("user") user:String,
                   @Field("roomName")roomName:String) : Observable<String>

    @POST("quitRoom")
    @FormUrlEncoded
    fun quitRoom(@Field("user") user:String,
                 @Field("roomName")roomName:String) : Observable<String>

    @GET("getAllRooms")
    fun getAllRooms():Call<List<Room>>

    @GET("getRoomParameters")
    fun getRoomParameters(@Query("roomName")roomName:String) : Call<Room>

    @POST("deleteRoom")
    @FormUrlEncoded
    fun deleteRoom(@Field("roomName")roomName:String): Observable<String>


//    @Multipart
//    @POST("upload")
//    fun uploadImage(@Part part: MultipartBody.Part,@Part("somedate") requestBody: RequestBody ) : Call<RequestBody>
}
package com.example.mobile.Retrofit

import com.example.mobile.Interface.User
import com.example.mobile.Room
import com.example.mobile.IAlbum
import com.example.mobile.IDrawing
import io.reactivex.Observable

import retrofit2.http.*
import retrofit2.Call

interface IMyService {
    @POST("register")
    @FormUrlEncoded
    fun registerUser(
        @Field("identifier") identifier: String,
        @Field("password") password: String,
        @Field("avatar") avatar: String,
        @Field("email") email: String,
        @Field("description") description:String,
    ): Observable<String>


    @POST("login")
    @FormUrlEncoded
    fun loginUser(
        @Field("identifier") identifier: String,
        @Field("password") password: String
    ): Observable<String>

    @GET("/profile/{identifier}")
    fun getUserFromDB(@Path("identifier") username: String): Call<User>

    @POST("profileUpdate")
    @FormUrlEncoded
    fun updateProfile(
        @Field("oldUsername") oldUsername: String,
        @Field("newUsername") newUsername: String,
        @Field("newAvatar") newAvatar: String,
        @Field("newEmail") newEmail:String,
        @Field("newDescription") newDescription:String,
    ): Observable<String>

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

    @GET("albums")
    fun getAllAvailableAlbums():Call<List<IAlbum>>

    @GET("albums/{identifier}")
    fun getUserAlbums(@Path("identifier") username: String):Call<List<IAlbum>>

    @GET("albums/Drawings/{albumName}")
    fun getAllAlbumDrawings(@Path("albumName") albumName: String):Call<List<String>>

    @POST("albums")
    @FormUrlEncoded
    fun createNewAlbum(@Field("name")albumName:String,
                       @Field("owner")ownerID:String,
                       @Field("description")description: String,
                       @Field("drawingIDs")drawingIDs:ArrayList<String>,
                       @Field("members")usersList:ArrayList<String>,
                       @Field("membershipRequests")membershipRequests:ArrayList<String>): Observable<String>

    @PUT("albums/addDrawing/{albumName}")
    @FormUrlEncoded
    fun addDrawingToAlbum(@Path("albumName") albumName: String,
                        @Field("drawing") drawing: String): Observable<String>

    @PUT("albums/sendRequest/{albumName}")
    @FormUrlEncoded
    fun sendRequestToJoinAlbum(@Path("albumName") albumName: String,
                          @Field("identifier") userName: String): Observable<String>


//    @Multipart
//    @POST("upload")
//    fun uploadImage(@Part part: MultipartBody.Part,@Part("somedate") requestBody: RequestBody ) : Call<RequestBody>
}
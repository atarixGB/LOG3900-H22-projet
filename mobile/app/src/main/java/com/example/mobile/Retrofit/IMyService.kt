package com.example.mobile.Retrofit

import com.example.mobile.Interface.User
import com.example.mobile.IRoom
import com.example.mobile.Interface.IAlbum
import com.example.mobile.Interface.IDrawing
import io.reactivex.Observable
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.ResponseBody

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
        @Field("email") email: String,
        @Field("password") password: String
    ): Observable<String>

    @GET("/login/{email}")
    fun getUsernameFromDB(@Path("email")email:String):Call<Any>

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
    fun getAllRooms():Call<List<IRoom>>

    @GET("getRoomParameters")
    fun getRoomParameters(@Query("roomName")roomName:String) : Call<IRoom>

    @POST("deleteRoom")
    @FormUrlEncoded
    fun deleteRoom(@Field("roomName")roomName:String): Observable<String>

    @GET("albums")
    fun getAllAvailableAlbums():Call<List<IAlbum>>

    @GET("albums/{identifier}")
    fun getUserAlbums(@Path("identifier") username: String):Call<List<IAlbum>>

    @GET("albums/Drawings/{albumName}")
    fun getAllAlbumDrawings(@Path("albumName") albumName: String):Call<List<String>>

    //get tous les dessins des albums dont userName est membre
    @GET("/albums/getAllDrawings/{userName}")
    fun getAllUserDrawings(@Path("userName") userName: String):Call<List<IAlbum>>

    @POST("albums")
    @FormUrlEncoded
    fun createNewAlbum(@Field("name")albumName:String,
                       @Field("owner")ownerID:String,
                       @Field("description")description: String,
                       @Field("drawingIDs")drawingIDs:ArrayList<String>,
                       @Field("members")usersList:ArrayList<String>,
                       @Field("membershipRequests")membershipRequests:ArrayList<String>): Observable<String>

    @POST("drawing/create")
    @FormUrlEncoded
    fun createDrawing(@Field("name")drawingName:String,
                      @Field("owner")ownerID:String,
                      @Field("data")data:String,
                      @Field("members")members:ArrayList<String>,
                      @Field("likes")likes:ArrayList<String>): Observable<String>

    @PUT("albums/addDrawing/{albumId}")
    @FormUrlEncoded
    fun addDrawingToAlbum(@Path("albumId") albumId: String,
                        @Field("drawing") drawing: String): Observable<String>

    @PUT("albums/sendRequest/{albumName}")
    @FormUrlEncoded
    fun sendRequestToJoinAlbum(@Path("albumName") albumName: String,
                          @Field("identifier") userName: String): Observable<String>

    @PUT("albums/request/add")
    @FormUrlEncoded
    fun acceptMemberRequest(@Field("userToAdd") userToAdd: String,
                            @Field("currentUser") currentUser: String,
                            @Field("albumName") albumName: String): Observable<String>

    @GET("getAlbumParameters")
    fun getAlbumParameters(@Query("albumName")albumName:String) : Call<IAlbum>

    @PUT("/albums/{id}")
    @FormUrlEncoded
    fun leaveAlbum (@Path("id") albumId: String,
                 @Field("memberToRemove")memberToRemove:String) : Observable<String>

    @GET("/getDrawingParameters/{drawingId}")
    fun getDrawingParameters(@Path("drawingId") drawingId: String):Call<IDrawing>

    @DELETE("/albums/{id}")
    fun deleteAlbum(@Path("id")albumID:String): Observable<String>

    @POST("albumUpdate")
    @FormUrlEncoded
    fun updateAlbum(
        @Field("oldAlbumName") oldUsername: String,
        @Field("newAlbumName") newUsername: String,
        @Field("newDescription") newAvatar: String,
    ): Observable<String>

    @Multipart
    @POST("/upload/{drawingId}")
    fun saveDrawing(@Path("drawingId") drawingId: String,
                    @Part image: MultipartBody.Part,
                    @Part("upload") name: RequestBody): Call<ResponseBody>

    @GET("drawings/{drawingId}")
    fun getDrawingData(@Path("drawingId") drawingId: String):Call<IDrawing>

    @PUT("drawings/addLike/{drawingId}")
    @FormUrlEncoded
    fun addLikeToDrawing(@Path("drawingId") drawingId: String,
                         @Field("user")user:String): Observable<String>

    @DELETE("/drawing/delete/{id}")
    fun deleteDrawing(@Path("id")drawingID:String): Observable<String>
}
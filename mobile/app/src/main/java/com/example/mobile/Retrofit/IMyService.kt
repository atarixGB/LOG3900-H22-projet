package com.example.mobile.Retrofit

import androidx.room.Room
import com.example.mobile.Interface.IUser
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
    fun getUserFromDB(@Path("identifier") username: String): Call<IUser>

    @GET("getAllUsers")
    fun getAllUsers():Call<List<IUser>>

    @POST("profileUpdate")
    @FormUrlEncoded
    fun updateProfile(
        @Field("oldUsername") oldUsername: String,
        @Field("newUsername") newUsername: String,
        @Field("newAvatar") newAvatar: String,
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

    @GET("albums/Drawings/{albumID}")
    fun getAllAlbumDrawings(@Path("albumID") albumID: String):Call<List<String>>

    @GET("getAllUserDrawings/{user}")
    fun getAllUserDrawings(@Path("user") user: String):Call<List<IDrawing>>

//    //get tous les dessins des albums dont userName est membre
//    @GET("/albums/getAllDrawings/{userName}")
//    fun getAllUserDrawings(@Path("userName") userName: String):Call<List<IAlbum>>

    @POST("albums")
    @FormUrlEncoded
    fun createNewAlbum(@Field("name")albumName:String,
                       @Field("owner")ownerID:String,
                       @Field("description")description: String,
                       @Field("drawingIDs")drawingIDs:ArrayList<String>,
                       @Field("members")usersList:ArrayList<String>,
                       @Field("membershipRequests")membershipRequests:ArrayList<String>): Observable<Any>

    @POST("drawing/create")
    @FormUrlEncoded
    fun createDrawing(@Field("name")drawingName:String,
                      @Field("owner")ownerID:String,
                      @Field("data")data:String,
                      @Field("members")members:ArrayList<String>,
                      @Field("likes")likes:ArrayList<String>,
                      @Field("isStory")isStory: Boolean,
                      @Field("location")location: String,
                      @Field("creationDate")creationDate: String): Observable<Any>

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
        @Field("oldAlbumName") oldAlbumName: String,
        @Field("newAlbumName") newAlbumname: String,
        @Field("newDescription") newDescription: String,
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

    @GET("/drawings/favorite/{username}")
    fun getFavoriteDrawings(@Path("username")username:String):Call<List<IDrawing>>

    @GET("/drawings/top/{username}")
    fun getTopDrawings(@Path("username")username:String):Call<List<IDrawing>>

    @GET("/profile/stats/drawings/{username}")
    fun getNbTotalDrawings(@Path("username")username:String):Call<Any>

    @GET("/profile/stats/albums/{username}")
    fun getNbAlbumsCreated(@Path("username")username:String):Call<Any>

    @DELETE("/drawing/delete/{id}")
    fun deleteDrawing(@Path("id")drawingID:String): Observable<String>

    @POST("removeDrawing")
    @FormUrlEncoded
    fun removeDrawing(@Field("drawingID") drawingID:String,
                 @Field("albumID")albumID:String) : Observable<String>

    @POST("drawingUpdate")
    @FormUrlEncoded
    fun updateDrawing(
        @Field("drawingID") oldDrawingname: String,
        @Field("newDrawingName") newDrawingname: String,
    ): Observable<String>

    @POST("changeAlbum")
    @FormUrlEncoded
    fun changeAlbumOfDrawing(
        @Field("newAlbumName") newAlbumName: String,
        @Field("drawingID") drawingID: String,
    ): Observable<String>

    @PUT("drawings/addDrawingToStory/{drawingId}")
    fun addDrawingToStory(@Path("drawingId") drawingId: String): Observable<String>
}
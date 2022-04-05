export const COLLAB_URL = `http://localhost:3002`;
export const DATABASE_URL = `http://localhost:3001`;
export const CHAT_URL = `http://localhost:3000`;

export const ALBUM_URL = `${DATABASE_URL}/albums`;
export const JOIN_ALBUM_URL = `${DATABASE_URL}/albums/sendRequest`;

export const ADD_DRAWING_TO_ALBUM_URL = `${DATABASE_URL}/albums/addDrawing`;
export const ACCEPT_MEMBERSHIP_REQUEST_URL = `${DATABASE_URL}/albums/request/add`;
export const DECLINE_MEMBERSHIP_REQUEST_URL = `${DATABASE_URL}/albums/request/decline`;
export const UPDATE_ALBUM_PARAMETERS_URL = `${DATABASE_URL}/albumUpdate`;

export const CREATE_DRAWING_URL = `${DATABASE_URL}/drawing/create`;
export const SAVE_DRAWING_URL = `${DATABASE_URL}/drawing/save`;
export const GET_DRAWING_URL = `${DATABASE_URL}/drawings`;
export const LIKE_DRAWING_URL = `${DATABASE_URL}/drawings/addLike`;
export const GET_USER_FAVORITE_DRAWINGS_URL = `${DATABASE_URL}/drawings/favorite`;
export const GET_USER_TOP_X_DRAWINGS_URL = `${DATABASE_URL}/drawings/top`;
export const CHANGE_DRAWING_NAME_URL = `${DATABASE_URL}/drawingUpdate`;
export const DELETE_DRAWING_URL = `${DATABASE_URL}/drawing/delete`;
export const REMOVE_DRAWING_FROM_ALBUM_URL = `${DATABASE_URL}/removeDrawing`;

export const ADD_DRAWING_TO_STORY_URL = `${DATABASE_URL}/drawings/addDrawingToStory`;
export const GET_ALL_USERS_URL = `${DATABASE_URL}/getAllUsers`
export const GET_ALL_USER_DRAWINGS_URL = `${DATABASE_URL}/getAllUserDrawings`

export const PROFILE_UPDATE_URL = `${DATABASE_URL}/profileUpdate`;
export const PROFILE_URL = `${DATABASE_URL}/profile`;
export const STATS_TOTAL_DRAWINGS_CREATED_URL = `${DATABASE_URL}/profile/stats/drawings`;
export const STATS_TOTAL_LIKES_URL = `${DATABASE_URL}/profile/stats/drawings/likes`;
export const STATS_TOTAL_ALBUMS_CREATED_URL = `${DATABASE_URL}/profile/stats/albums`;
export const STATS_COLLAB_COUNT_URL = `${DATABASE_URL}/profile/stats/collabs`;
export const STATS_AVERAGE_COLLAB_TIME_URL = `${DATABASE_URL}/profile/stats/collabs/session`;
export const STATS_TOTAL_COLLAB_TIME_URL = `${DATABASE_URL}/profile/stats/collabs/total-duration`;
export const STATS_COLLAB_UPDATE_URL = `${DATABASE_URL}/profile/stats/collabs/update`;

export const SIGN_UP_URL = `${DATABASE_URL}/register`;
export const LOGIN_URL = `${DATABASE_URL}/login`;

export const CREATE_ROOM_URL = `${DATABASE_URL}/createRoom`;
export const JOIN_ROOM_URL = `${DATABASE_URL}/joinRoom`;
export const ALL_ROOMS_URL = `${DATABASE_URL}/getAllRooms`;
export const LEAVE_ROOM_URL = `${DATABASE_URL}/quitRoom`;
export const DELETE_ROOM_URL = `${DATABASE_URL}/deleteRoom`;
export const ALL_PUBLIC_CHATROOM_USERS_URL = `${DATABASE_URL}/chat/users`;

export const ADVANCED_SEARCH_URL = `${DATABASE_URL}/search`

export const CREATE_COLLAB_URL = `${DATABASE_URL}/createCollab`;



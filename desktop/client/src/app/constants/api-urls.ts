export const DATABASE_URL = `http://localhost:3001`
export const CHAT_URL = `http://localhost:3000`


export const ALBUM_URL = `${DATABASE_URL}/albums`;
export const JOIN_ALBUM_URL = `${DATABASE_URL}/albums/sendRequest`;
export const CREATE_DRAWING_URL = `${DATABASE_URL}/drawing/create`;

export const ADD_DRAWING_TO_ALBUM_URL = `${DATABASE_URL}/albums/addDrawing`;
export const ACCEPT_MEMBERSHIP_REQUEST_URL = `${DATABASE_URL}/albums/request/add`;
export const DECLINE_MEMBERSHIP_REQUEST_URL = `${DATABASE_URL}/albums/request/decline`;
export const UPDATE_ALBUM_PARAMETERS_URL = `${DATABASE_URL}/albumUpdate`

export const PROFILE_UPDATE_URL = `${DATABASE_URL}/profileUpdate`;
export const PROFILE_URL = `${DATABASE_URL}/profile`;

export const PUBLIC_DRAWINGS_URL = `${DATABASE_URL}/public-drawings`;
export const SIGN_UP_URL = `${DATABASE_URL}/register`;
export const LOGIN_URL = `${DATABASE_URL}/login`;

export const CREATE_ROOM_URL = `${DATABASE_URL}/createRoom`;
export const ALL_ROOMS_URL = `${DATABASE_URL}/getAllRooms`;
export const DELETE_ROOM_URL = `${DATABASE_URL}/deleteRoom`;
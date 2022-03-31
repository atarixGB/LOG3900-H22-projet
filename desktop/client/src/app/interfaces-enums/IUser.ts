export interface IUser {
  _id?: any,
  identifier: string,
  password: string,
  salt?: string,
  avatar: any,
  email: string,
  description?: string,
  favoriteDrawingsID?: string[];
}

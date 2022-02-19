export interface IAlbum {
  name: string,
  id?: string,
  creator: string,
  description: string,
  drawingIds: string[]; // Type to verify
  members: string[]; // Type will probably be an interface IUserInfos later
  isPrivate: boolean;
  isMine: boolean;
}

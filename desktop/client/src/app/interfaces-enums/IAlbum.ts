export interface IAlbum {
  _id?: any,
  name: string,
  owner: string,
  description: string,
  drawingIDs: string[];
  members: string[];
  membershipRequests: string[];
  creationDate: any;
}

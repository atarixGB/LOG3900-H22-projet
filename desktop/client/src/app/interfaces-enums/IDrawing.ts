export interface IDrawing {
  _id?: any,
  name: string,
  creator: string,
  contributors: string[],
  data: string,
  albumId: string | void,
}

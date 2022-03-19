export interface IDrawing {
  _id?: any,
  name: string,
  creator: string,
  contributors: string[],
  albumId?: string | void,
  height: number,
  width: number,
  data: string | undefined,
}

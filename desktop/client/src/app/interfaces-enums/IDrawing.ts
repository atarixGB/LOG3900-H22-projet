export interface IDrawing {
  _id?: any,
  name: string,
  owner: string,
  contributors: string[],
  likes: string[];
  data: string | undefined,
}

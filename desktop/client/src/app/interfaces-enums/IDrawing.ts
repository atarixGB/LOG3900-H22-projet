export interface IDrawing {
  _id?: any,
  name: string,
  owner: string,
  data?: string | undefined,
  members?: string[],
  likes?: string[];
}

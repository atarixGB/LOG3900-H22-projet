export enum ChatTheme {
  Default = 0,
  Dark = 1,
  Minecraft = 2,
}

export interface IChatTheme {
  id: ChatTheme,
  font: string,
  textColor: string,
  backgroundColor: string,
  backgroundImage: string,
  messageColorMine: string
  messageBackgroundMine: string
  messageColorYours: string
  messageBackgroundYours: string
}

export const DEFAULT_THEME: IChatTheme = {
  id: ChatTheme.Default,
  font: "Helvetica",
  textColor: "black",
  backgroundColor: "white",
  backgroundImage: "none",
  messageColorMine: "rgb(255, 184, 51)", // Orange
  messageBackgroundMine: "blue",
  messageColorYours: "white",
  messageBackgroundYours: "rgb(82, 188, 250)" // Blue
}

export const DARK_THEME: IChatTheme = {
  id: ChatTheme.Dark,
  font: "Courier New",
  textColor: "white",
  backgroundColor: "black",
  backgroundImage: "none",
  messageColorMine: "black",
  messageBackgroundMine: "yellow",
  messageColorYours: "black",
  messageBackgroundYours: "pink"
}

export const MINECRAFT_THEME: IChatTheme = {
  id: ChatTheme.Minecraft,
  font: "Helvetica",
  textColor: "black",
  backgroundColor: "none",
  backgroundImage: "url('../../../../assets/minecraft.jpg')",
  messageColorMine: "black",
  messageBackgroundMine: "blue",
  messageColorYours: "black",
  messageBackgroundYours: "green"
}

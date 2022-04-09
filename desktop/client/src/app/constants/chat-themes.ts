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
  backgroundColorMainMessageContainer: string,
  backgroundColorSecondMessageContainer: string,
  opacityMainContainer: string,
  opacitySecondContainer: string,
  borderColor: string,
  messageColorMine: string,
  messageBackgroundMine: string,
  messageColorYours: string,
  messageBackgroundYours: string
}

export const DEFAULT_THEME: IChatTheme = {
  id: ChatTheme.Default,
  font: "Helvetica",
  textColor: "black",
  backgroundColor: "white",
  backgroundImage: "none",
  backgroundColorMainMessageContainer: "none",
  backgroundColorSecondMessageContainer: "none",
  opacityMainContainer: "none",
  opacitySecondContainer: "none",
  borderColor: "none",
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
  backgroundColorMainMessageContainer: "none",
  backgroundColorSecondMessageContainer: "none",
  opacityMainContainer: "none",
  opacitySecondContainer: "none",
  borderColor: "none",
  messageColorMine: "black",
  messageBackgroundMine: "white",
  messageColorYours: "black",
  messageBackgroundYours: "#d6d6d6"
}

export const MINECRAFT_THEME: IChatTheme = {
  id: ChatTheme.Minecraft,
  font: "Arial",
  textColor: "black",
  backgroundColor: "none",
  backgroundImage: "url('../../../../assets/minecraft.jpg')",
  backgroundColorMainMessageContainer: "#a4cd49",
  backgroundColorSecondMessageContainer: "white",
  opacityMainContainer: "90%",
  opacitySecondContainer: "90%",
  borderColor: "none",
  messageColorMine: "black",
  messageBackgroundMine: "#a4cd49",
  messageColorYours: "black",
  messageBackgroundYours: "#00bcbe"
}

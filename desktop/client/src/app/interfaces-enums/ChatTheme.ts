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

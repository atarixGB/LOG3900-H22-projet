import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAlbum } from '@app/interfaces-enums/IAlbum'
import { LoginService } from '../login.service';

export const ALBUM_URL = "http://localhost:3000/"

@Injectable({
  providedIn: 'root'
})
export class AlbumGalleryService {
  albums: IAlbum[];

  constructor(private httpClient: HttpClient, private loginService: LoginService) {
    this.albums = [];
  }

  createAlbum(name: string, description: string, isPrivate: boolean): void {
    const newAlbum: IAlbum = {
      name: name,
      creator: this.loginService.username,
      description: description,
      drawingIds: [],
      members: [this.loginService.username],
      isPrivate: isPrivate,
      isMine: true
    }

    console.log(newAlbum);

  this.httpClient;
    this.httpClient.post(ALBUM_URL, newAlbum).subscribe(
      (result) => {
        console.log("Server result: ", result)
      },
      (error) => {
        console.log("Server error:", error);
      }
    )

  }

  deleteAlbum(): void {
    // TODO
  }

  viewAlbum(): void {
    // TODO
  }

  fetchAlbumsFromDatabase(): void {
    // TODO
  }

  fetchAllAlbumsFronDatabase(): void {
    // TODO
  }
}

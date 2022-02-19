import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAlbum } from '@app/interfaces-enums/IAlbum'
import { LoginService } from '@app/services/login/login.service';

export const ALBUM_URL = "http://localhost:3000/albums"

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

    this.httpClient;
    this.httpClient.post(ALBUM_URL, newAlbum).subscribe(
      (result: IAlbum) => {
        console.log("Server result: ", result)
      },
      (error) => {
        console.log("Server error:", error);
      }
    )

  }

  deleteAlbum(id: string): void {
    // TODO
    const url = ALBUM_URL + `/${id}`;
    this.httpClient.delete(url, { responseType: 'text' }).subscribe(
      (result) => {
        console.log("Server result: ", result);
      },
      (error) => {
        console.log("Server error:", error);
      }
    )
  }

  viewAlbum(): void {
    // TODO
  }

  fetchAlbumsFromDatabase(): void {
    // TODO
    const url = ALBUM_URL;
    this.httpClient.get<IAlbum[]>(url).subscribe(
      (albums: IAlbum[]) => {

        for (let i = 0; i < albums.length; i++) {
          this.albums.push(albums[i]);
          console.log(albums[i]);
        }
      },
      (error: any) => {
        console.log('Impossible de retrouver les albums dans la base de données.\n Erreur:' + error);
      }
    );
  }

  fetchAllAlbumsFronDatabase(): void {
    // TODO
  }
}

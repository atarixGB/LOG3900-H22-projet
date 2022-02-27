import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAlbum } from '@app/interfaces-enums/IAlbum'
import { LoginService } from '@app/services/login/login.service';

export const ALBUM_URL = "http://localhost:3000/albums"

@Injectable({
  providedIn: 'root'
})
export class AlbumGalleryService {
  publicAlbums: IAlbum[];
  myAlbums: IAlbum[];

  constructor(private httpClient: HttpClient, private loginService: LoginService) {
    this.publicAlbums = [];
    this.myAlbums = [];
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

    this.httpClient.post(ALBUM_URL, newAlbum).subscribe(
      (result: IAlbum) => {
        console.log("Server result: ", result)
      },
      (error) => {
        console.log("Server error:", error);
      }
    )

  }

  deleteAlbum(albumId: string | undefined): void {
    const url = ALBUM_URL + `/${albumId}`;
    this.httpClient.delete(url, { responseType: 'text' }).subscribe(
      (result) => {
        console.log("Server result: ", result);
      },
      (error) => {
        console.log(`Impossible de retrouver les dessins de l'album dans la base de données.\nErreur: ${error}`);
      }
    )
  }

  fetchMyAlbumsFromDatabase(): void {
    const url = `${ALBUM_URL}/${this.loginService.username}`;
    console.log(url);

    this.httpClient.get<IAlbum[]>(url).subscribe(
      (albums: IAlbum[]) => {
        for (let i = 0; i < albums.length; i++) {
          this.myAlbums.push(albums[i]);
        }
      },
      (error: any) => {
        console.log(`Impossible de retrouver les albums dans la base de données.\nErreur: ${error}`);
      }
    );
  }

  fetchAllAlbumsFromDatabase(): void {
    const url = ALBUM_URL;
    console.log(url);
    this.httpClient.get<IAlbum[]>(url).subscribe(
      (albums: IAlbum[]) => {
        for (let i = 0; i < albums.length; i++) {
          this.publicAlbums.push(albums[i]);
          console.log(albums[i]);
        }
      },
      (error: any) => {
        console.log(`Impossible de retrouver les albums dans la base de données.\nErreur: ${error}`);
      }
    );
  }

  fetchDrawingsFromSelectedAlbum(albumId: string | undefined): void {
    console.log("Fetching drawings from album with id: " + albumId);
    // TODO: fetch album's drawings from db
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAlbum } from '@app/interfaces-enums/IAlbum'
import { LoginService } from '@app/services/login/login.service';
import { ALBUM_URL, PUBLIC_DRAWINGS_URL } from '@app/constants/api-urls';

@Injectable({
  providedIn: 'root'
})
export class AlbumGalleryService {
  publicAlbums: IAlbum[];
  myAlbums: IAlbum[];
  currentAlbum: IAlbum;
  currentDrawing: string; // TODO: change with an interface

  constructor(private httpClient: HttpClient, private loginService: LoginService) {
    this.publicAlbums = [];
    this.myAlbums = [];
  }

  createDrawing(name: string, isPrivate: boolean, album: string): void {
    console.log(`Create new drawing "${name}" in album "${album}"`);
    // TODO: send new drawing in the specify album here request here
  }

  createAlbum(name: string, description: string): void {
    const newAlbum: IAlbum = {
      name: name,
      owner: this.loginService.username,
      description: description,
      drawingIds: [],
      members: [this.loginService.username],
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

  leaveAlbum(album: IAlbum): void {
    console.log("Leaving album");
    const url = ALBUM_URL + `/${album._id}`;

    if (album.owner != this.loginService.username) {
      const updateData = { memberToRemove: this.loginService.username }; // TODO Set new ownwer, may be in another function
      this.httpClient.put<string>(url, updateData).subscribe(
        (result) => {
          console.log("Server result:", result);
        },
        (error) => {
          console.log(`Impossible de retrouver l'album demandé dans la base de données.\nErreur: ${error}`)
        }
      )
    }
  }

  deleteAlbum(albumId: string | undefined): void {
    const url = ALBUM_URL + `/${albumId}`;
    this.httpClient.delete(url).subscribe(
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

  fetchDrawingsFromSelectedAlbum(album: IAlbum): void {
    // console.log("Fetching drawings from album with id: " + album._id);
    console.log(album);

    // TODO: fetch album's drawings from db
  }

  fetchAllPublicDrawings(): void {
    const url = PUBLIC_DRAWINGS_URL;
    console.log(url);
    console.log("Fetching all public drawings from server...");
    // this.httpClient.get(url).subscribe(
    //   (result) => {},
    //   (error) => {}
    // )
  }
}

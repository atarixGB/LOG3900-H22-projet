import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAlbum } from '@app/interfaces-enums/IAlbum'
import { LoginService } from '@app/services/login/login.service';
import { ALBUM_URL, PUBLIC_DRAWINGS_URL, CREATE_DRAWING_URL, JOIN_ALBUM_URL } from '@app/constants/api-urls';
import { DrawingService } from '../editor/drawing/drawing.service';

@Injectable({
  providedIn: 'root'
})
export class AlbumGalleryService {
  publicAlbums: IAlbum[];
  myAlbums: IAlbum[];
  currentAlbum: IAlbum;
  currentDrawing: string; // TODO: change with an interface

  constructor(private httpClient: HttpClient, private loginService: LoginService, private drawingService: DrawingService) {
    this.publicAlbums = [];
    this.myAlbums = [];
  }

  createDrawing(drawingName: string): void {
    const drawingData = {
      name: drawingName,
      creator: this.loginService.username,
      contributors: [this.loginService.username],
      height: this.drawingService.canvas.height,
      width: this.drawingService.canvas.width,
      data: this.drawingService.canvas.toDataURL(),
    }

    console.log(drawingData)

    this.httpClient.post(CREATE_DRAWING_URL, drawingData).subscribe(
      (result)=>{
        console.log("Résultat du serveur:", result);
        // Add drawing to album
      },
      (error)=>{
        console.log("Erreur du serveur", error);
      });

    }

  addDrawingToAlbum(drawingName: string, albumName: string, albumId: string | void): void {
    console.log("addDrawingToAlbum", `Create new drawing "${drawingName}" in album "${albumName}" with id ${albumId}`);
    // TODO: send new drawing in the specify album request here
    // const drawingToAdd: IDrawing = {
    //   name: drawingName,
    //   creator: this.loginService.username,
    //   contributors: [this.loginService.username],
    //   data: "data in base 64", // Get data from canvas
    //   albumId: albumId,
    // }
    // console.log("drawingToAdd", drawingToAdd);
    // this.httpClient.put(ADD_DRAWING_TO_ALBUM_URL + `/${drawingName}`, drawingToAdd).subscribe(
    //   (result)=> {
    //     console.log(result);

    //   },
    //   (error)=> {
    //     console.log(error);
    //   });
  }

  createAlbum(name: string, description: string): void {
    const newAlbum: IAlbum = {
      name: name,
      owner: this.loginService.username,
      description: description,
      drawingIds: [],
      members: [this.loginService.username],
      membershipRequests: []
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

  sendJoinAlbumRequest(album: IAlbum): void {
    const userToAdd = {
      identifier: this.loginService.username
    }

    this.httpClient.put(`${JOIN_ALBUM_URL}/${album.name}`, userToAdd).subscribe(
      (result) => {
        console.log("Résultat serveur:", result);

      },
      (error) => {
        console.log("Erreur serveur:", error);

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

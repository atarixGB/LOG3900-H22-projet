import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAlbum } from '@app/interfaces-enums/IAlbum'
import { IDrawing } from '@app/interfaces-enums/IDrawing'
import { LoginService } from '@app/services/login/login.service';
import { ALBUM_URL, PUBLIC_DRAWINGS_URL, CREATE_DRAWING_URL, JOIN_ALBUM_URL, DECLINE_MEMBERSHIP_REQUEST_URL, ACCEPT_MEMBERSHIP_REQUEST_URL, UPDATE_ALBUM_PARAMETERS_URL, ADD_DRAWING_TO_ALBUM_URL, UPLOAD_DRAWING_URL} from '@app/constants/api-urls';
import { PUBLIC_ALBUM } from '@app/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class AlbumGalleryService {
  publicAlbums: IAlbum[];
  myAlbums: IAlbum[];
  currentAlbum: IAlbum;
  selectedAlbumId: string | void;

  currentDrawing: IDrawing;

  constructor(private httpClient: HttpClient, private loginService: LoginService) {
    this.publicAlbums = [];
    this.myAlbums = [];

    this.currentDrawing = {
      name: "",
      owner: this.loginService.username,
    }
  }

  createDrawing(drawingName: string): void {
    console.log("CREATE DRAWING")
    this.currentDrawing.name = drawingName;

    console.log(this.currentDrawing)

    this.httpClient.post(CREATE_DRAWING_URL, this.currentDrawing).subscribe(
      (result) => {
        console.log("Résultat du serveur:", result);
        this.currentDrawing._id = result;
        this.addDrawingToAlbum(this.currentDrawing, this.selectedAlbumId);
      },
      (error) => {
        console.log(`Impossible de créer le dessin ${drawingName} dans la base de données.\nErreur: ${error}`);
      });

  }

  addDrawingToAlbum(drawing: IDrawing, albumId: string | void): void {
    console.log("ADD DRAWING TO ALBUM");

    const data = {
      drawing: drawing._id,
    };

    this.httpClient.put(ADD_DRAWING_TO_ALBUM_URL + `/${albumId}`, data).subscribe(
      (result) => {
        console.log(result);
      },
      (error) => {
        console.log(error);
      });
  }

  saveDrawing(): void {
    const body = {
      filename: this.currentDrawing._id
    };

    this.httpClient.post(UPLOAD_DRAWING_URL, body).subscribe(
      (result) => {
        console.log(result);
      },
      (error) => {
        console.log(error);
      });
  }

  createAlbum(name: string, description: string): void {
    const newAlbum: IAlbum = {
      name: name,
      owner: this.loginService.username,
      description: description,
      drawingIDs: [],
      members: [this.loginService.username],
      membershipRequests: []
    }

    this.httpClient.post(ALBUM_URL, newAlbum).subscribe(
      (result: IAlbum) => {
        console.log("Résultat du serveur:", result)
      },
      (error) => {
        console.log(`Impossible de créer l'album "${name}" dans la base de données.\nErreur: ${error}`);
      }
    )

  }

  addUserToPublicAlbum(username: string): void {
    const body = {
      userToAdd: username,
      currentUser: "SYSTEM",
      albumName: PUBLIC_ALBUM.name,
    }

    this.httpClient.put(ACCEPT_MEMBERSHIP_REQUEST_URL, body).subscribe(
      (result) => {
        console.log("Résultat du serveur:", result);

      },
      (error) => {
        console.log(`Impossible d'ajouter l'utilisateur "${username}" dans l'album public.\nErreur: ${error}`);

      }
    )
  }

  sendJoinAlbumRequest(album: IAlbum): void {
    const userToAdd = {
      identifier: this.loginService.username
    }

    this.httpClient.put(`${JOIN_ALBUM_URL}/${album.name}`, userToAdd).subscribe(
      (result) => {
        console.log("Résultat du serveur:", result);

      },
      (error) => {
        console.log(`Impossible d'envoyer une demande d'adhésion à l'album "${album.name}" dans la base de données.\nErreur: ${error}`);

      }
    )
  }

  acceptUser(memberName: string): void {
    const data = {
      userToAdd: memberName,
      currentUser: this.loginService.username,
      albumName: this.currentAlbum.name
    }

    this.httpClient.put(ACCEPT_MEMBERSHIP_REQUEST_URL, data).subscribe(
      (result) => {
        console.log("Résultat du serveur:", result);
        this.currentAlbum.membershipRequests.forEach((user, index) => {
          if (user == memberName) {
            this.currentAlbum.membershipRequests.splice(index, 1);
          }
        });
      },
      (error) => {
        console.log("Erreur du serveur:", error)
      })
    console.log(`${memberName} a été accepté dans l'album "${this.currentAlbum.name}" par ${this.loginService.username}`);
  }

  declineUser(memberName: string): void {
    const data = {
      userToDecline: memberName,
      currentUser: this.loginService.username,
      albumName: this.currentAlbum.name
    }

    this.httpClient.put(DECLINE_MEMBERSHIP_REQUEST_URL, data).subscribe(
      (result) => {
        console.log("Résultat du serveur:", result)

        this.currentAlbum.membershipRequests.forEach((user, index) => {
          if (user == memberName) {
            this.currentAlbum.membershipRequests.splice(index, 1);
          }
        });
      },
      (error) => {
        console.log("Erreur du serveur:", error)
      })
    console.log(`${memberName} a été refusé dans l'album "${this.currentAlbum.name}" par ${this.loginService.username}`);
  }

  leaveAlbum(album: IAlbum): void {
    const url = ALBUM_URL + `/${album._id}`;

    if (album.owner != this.loginService.username && album.name != "album public") {
      const updateData = { memberToRemove: this.loginService.username }; // TODO Set new ownwer, may be in another function
      this.httpClient.put<string>(url, updateData).subscribe(
        (result) => {
          console.log("Résultat du serveur:", result);
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
        console.log("Résultat du serveur:", result);
      },
      (error) => {
        console.log(`Impossible de supprimer l'album dans la base de données.\nErreur: ${error}`);
      }
    )
  }

  updateAlbumParameters(name: string, description: string): void {
    const data = {
      oldAlbumName: this.currentAlbum.name,
      newAlbumName: name,
      newDescription: description
    }

    this.httpClient.post(UPDATE_ALBUM_PARAMETERS_URL, data).subscribe(
      (result) => {
        console.log("Résultat du serveur:", result);
      },
      (error) => {
        console.log(`Impossible de modifier les attributs de l'album dans la base de données.\nErreur: ${error}`);

      }
    )
  }

  fetchMyAlbumsFromDatabase(): void {
    this.httpClient.get<IAlbum[]>(ALBUM_URL).subscribe(
      (albums: IAlbum[]) => {
        for (let i = 0; i < albums.length; i++) {
          if (albums[i].members.includes(this.loginService.username)) {
            this.myAlbums.push(albums[i]);
          }
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
          if (albums[i].name != "album public") {
            this.publicAlbums.push(albums[i]);
            console.log(albums[i]);
          }
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

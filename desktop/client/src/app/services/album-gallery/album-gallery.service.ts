import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAlbum } from '@app/interfaces-enums/IAlbum'
import { IDrawing } from '@app/interfaces-enums/IDrawing'
import { LoginService } from '@app/services/login/login.service';
import { ALBUM_URL, CREATE_DRAWING_URL, JOIN_ALBUM_URL, DECLINE_MEMBERSHIP_REQUEST_URL, ACCEPT_MEMBERSHIP_REQUEST_URL, UPDATE_ALBUM_PARAMETERS_URL, ADD_DRAWING_TO_ALBUM_URL, GET_DRAWING_URL, SAVE_DRAWING_URL, LIKE_DRAWING_URL, GET_USER_FAVORITE_DRAWINGS_URL, GET_USER_TOP_X_DRAWINGS_URL, CHANGE_DRAWING_NAME_URL, DELETE_DRAWING_URL, REMOVE_DRAWING_FROM_ALBUM_URL, GET_LIKE_DRAWING_URL } from '@app/constants/api-urls';
import { PUBLIC_ALBUM } from '@app/constants/constants';
import { DrawingService } from '../editor/drawing/drawing.service';
import { CollaborationService } from '../collaboration/collaboration.service';

@Injectable({
  providedIn: 'root'
})
export class AlbumGalleryService {
  publicAlbums: IAlbum[];
  myAlbums: IAlbum[];
  currentAlbum: IAlbum;

  selectedAlbumId: string;
  selectedAlbumName: string;

  currentDrawing: IDrawing;
  fetchedDrawings: IDrawing[];
  favoriteDrawingsData: IDrawing[];
  topDrawingsData: IDrawing[];

  likes: string[];
  isAlreadyLike: boolean;

  constructor(private httpClient: HttpClient, private loginService: LoginService, private drawingService: DrawingService, private collaborationService: CollaborationService) {
    this.publicAlbums = [];
    this.myAlbums = [];
    this.fetchedDrawings = [];

    this.currentDrawing = {
      _id: null,
      name: "",
      owner: this.loginService.username,
      isStory: false,
      creationDate: ""
    }

    this.favoriteDrawingsData = [];
    this.topDrawingsData = [];
  }

  createDrawing(drawingName: string): void {
    this.currentDrawing._id = null;
    this.currentDrawing.owner = this.loginService.username;
    this.currentDrawing.isStory = false;
    this.currentDrawing.name = drawingName;
    this.currentDrawing.creationDate = new Date().toLocaleString('fr-FR', {day: 'numeric', month: 'long', year : 'numeric'} );
    console.log(this.currentDrawing)

    this.httpClient.post(CREATE_DRAWING_URL, this.currentDrawing).subscribe(
      (result) => {
        console.log("Résultat du serveur:", result);
        this.currentDrawing._id = result;
        this.addDrawingToAlbum(this.currentDrawing, this.selectedAlbumId); // Should be ID not name but we did it with the name
        this.drawingService.setCurrentDrawingBlanc();
        this.collaborationService.joinCollab(this.currentDrawing._id);
        localStorage.setItem('currentDrawingName', this.currentDrawing.name);
        this.saveDrawing();
      },
      (error) => {
        console.log(`Impossible de créer le dessin ${drawingName} dans la base de données.\nErreur: ${error}`);
      });

  }

  addDrawingToAlbum(drawing: IDrawing, albumId: string | void): void {
    const data = {
      drawing: drawing._id,
    };
    this.httpClient.put(ADD_DRAWING_TO_ALBUM_URL + `/${albumId}`, data).subscribe(
      (result) => {
        console.log("Résultat du serveur:", result);
      },
      (error) => {
        console.log(`Impossible d'ajouter le dessin ${drawing.name} dans l'album avec l'ID ${albumId}.\nErreur: ${error}`);
      });
  }

  saveDrawing(): void {
    const drawingMetadata = {
      name: this.currentDrawing.name,
      owner: this.loginService.username,
    }

    // Envoi des métadonnées du dessin
    this.httpClient.post(`${SAVE_DRAWING_URL}/${this.currentDrawing._id}`, drawingMetadata).subscribe(
      (result) => {
        console.log("Résultat du serveur:", result);

        // Envoi du dessin en base64. Celui-ci sera reconverti en image png du côté serveur.
        const drawingData = { data: this.drawingService.canvas.toDataURL() };

        this.httpClient.put(`${SAVE_DRAWING_URL}/${this.currentDrawing._id}`, drawingData).subscribe(
          (result) => { console.log("Résultat du serveur:", result) },
          (error) => { console.log(`Impossible d'enregistrer le dessin en image de type png sur la base de données.\nErreur:`, error); });

      },
      (error) => {
        console.log(`Impossible d'enregistrer les attributs du dessin sur la base de données.\nErreur:`, error);
      }
    )
  }

  likeDrawing(drawing: IDrawing): void {
    const url = `${LIKE_DRAWING_URL}/${drawing._id}`;
    const data = {
      user: this.loginService.username
    }
    this.httpClient.put(url, data).subscribe(
      (result) => {
        console.log("Résultat du serveur:", result)
      },
      (error) => {
        console.log(`Impossible d'aimer le dessin "${drawing.name}".\nErreur: ${error}`);
      }
    )
  }

  updateLikes(drawing: IDrawing): void {
    this.httpClient.get(`${GET_LIKE_DRAWING_URL}/${drawing._id}`).subscribe(
      (result: any[]) => {
        console.log("Résultat du serveur:", result)
        this.likes = result;

        if (!result.includes(this.loginService.username)) {
          this.likeDrawing(drawing);
          this.isAlreadyLike = false;
        } else {
          this.isAlreadyLike = true;
        }
      },
      (error) => {
        console.log(`Impossible d'aimer le dessin "${drawing.name}".\nErreur: ${error}`);
      }
    )
  }

  changeDrawingName(drawing: IDrawing, newDrawingName: string): void {
    const url = `${CHANGE_DRAWING_NAME_URL}`;
    const body = {
      drawingID: drawing._id,
      newDrawingName:  newDrawingName,
    }
    this.httpClient.post(url, body).subscribe(
      (result) => {
        console.log("Résultat du serveur:", result)
      },
      (error) => {
        console.log(`Impossible de changer le nom du dessin "${drawing.name}" à "${newDrawingName}".\nErreur: ${error}`);
      }
    )
  }

  deleteDrawing(drawing: IDrawing): void {
    const url = `${DELETE_DRAWING_URL}/${drawing._id}`;

    const body = {
      albumID: this.currentAlbum._id,
      drawingID: drawing._id,
    }

    this.httpClient.delete(url).subscribe(
      (result) => {
        console.log("Résultat du serveur:", result)


        this.httpClient.post(REMOVE_DRAWING_FROM_ALBUM_URL, body).subscribe(
          (result) => {
            console.log("Résultat du serveur:", result)
          },
          (error) => {
            console.log(`Impossible de retirer le dessin "${drawing.name}" de l'album "${this.currentAlbum.name}".\nErreur: ${error}`);
          }
        )

      },
      (error) => {
        console.log(`Impossible de supprimer le dessin "${drawing.name}".\nErreur: ${error}`);
      }
    )
  }

  createAlbum(name: string, description: string): void {
    const newAlbum: IAlbum = {
      name: name,
      owner: this.loginService.username,
      description: description,
      drawingIDs: [],
      members: [this.loginService.username],
      membershipRequests: [],
      creationDate: new Date().toLocaleString('fr-FR', {day: 'numeric', month: 'long', year : 'numeric'} ),
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

  changeAlbum(drawing: IDrawing, newAlbumId: string): void {
    this.addDrawingToAlbum(drawing, newAlbumId);

    const body = {
      albumID: this.currentAlbum._id,
      drawingID: drawing._id,
    }

    this.httpClient.post(REMOVE_DRAWING_FROM_ALBUM_URL, body).subscribe(
      (result) => {
        console.log("Résultat du serveur:", result)
      },
      (error) => {
        console.log(`Impossible de retirer le dessin "${drawing.name}" de l'album "${this.currentAlbum.name}".\nErreur: ${error}`);
      }
    )
  }

  addUserToPublicAlbum(username: string): void {
    const body = {
      userToAdd: username,
      currentUser: PUBLIC_ALBUM.owner,
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
      const updateData = { memberToRemove: this.loginService.username };
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
    this.myAlbums = [];
    console.log("FETCHING MY ALBUMS")
    this.httpClient.get<IAlbum[]>(ALBUM_URL).subscribe(
      (albums: IAlbum[]) => {
        console.log("ALBUMS",albums)
        for (let i = 0; i < albums.length; i++) {
          if (albums[i].members.includes(this.loginService.username)) {
            this.myAlbums.push(albums[i]);
            console.log(this.myAlbums[i])
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
          if (albums[i].name != "album public" && !albums[i].members.includes(this.loginService.username)) {
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
    console.log("Fetching drawings from album: " + album.name);

    this.fetchedDrawings = [];
    album.drawingIDs.forEach(id => {
      this.httpClient.get(`${GET_DRAWING_URL}/${id}`).subscribe(
        (result: IDrawing) => {
          this.fetchedDrawings.push(result);
        },
        (error) => {
          console.log(`Erreur en allant chercher un dessin.\nErreur: ${error}`);
        }
      );
    });

    console.log(this.fetchedDrawings);
  }

  // All drawings that current user liked
  fetchFavoriteDrawings(username: string): void {
    const url = `${GET_USER_FAVORITE_DRAWINGS_URL}/${username}`;
    let fetchedDrawing: IDrawing[] = [];

    this.httpClient.get(url).subscribe(
      (drawings: IDrawing[]) => {
        console.log(drawings);

        for (const drawing of drawings) {
          fetchedDrawing.push(drawing);
        }

        fetchedDrawing.forEach(drawing => {
          this.httpClient.get(`${GET_DRAWING_URL}/${drawing._id}`).subscribe(
            (result: IDrawing) => {
              this.favoriteDrawingsData.push(result);
            },
            (error) => {
              console.log(`Impossible de charger le dessin avec le ID ${drawing._id} de la base de données`, error);
            })
        })

      },
      (error) => {
        console.log("Impossible de charger les dessins de la base de données", error);
      }
    )
  }

  // All current user's drawings that has at least one like
  fetchTopDrawings(username: string): void {
    const url = `${GET_USER_TOP_X_DRAWINGS_URL}/${username}`;
    let fetchedDrawing: IDrawing[] = [];
    this.httpClient.get(url).subscribe(
      (drawings: IDrawing[]) => {
        console.log(drawings);

        for (const drawing of drawings) {
          fetchedDrawing.push(drawing);
        }

        fetchedDrawing.forEach(drawing => {
          this.httpClient.get(`${GET_DRAWING_URL}/${drawing._id}`).subscribe(
            (result: IDrawing) => {
              this.topDrawingsData.push(result);
            },
            (error) => {
              console.log(`Impossible de charger le dessin avec le ID ${drawing._id} de la base de données`, error);
            })
        })

      },
      (error) => {
        console.log("Impossible de charger les dessins de la base de données", error);
      }
    )
  }
}

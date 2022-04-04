import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ADD_DRAWING_TO_STORY_URL, GET_ALL_USERS_URL, GET_ALL_USER_DRAWINGS_URL, GET_DRAWING_URL } from '@app/constants/api-urls';
import { IDrawing } from '@app/interfaces-enums/IDrawing';
import { IUser } from '@app/interfaces-enums/IUser';
import { AlbumGalleryService } from '../album-gallery/album-gallery.service';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  userStories: Map<IUser, IDrawing[]>;
  users: IUser[];
  selectedUser: IUser;

  constructor(private httpClient: HttpClient, private albumGalleryService: AlbumGalleryService) {
    this.userStories = new Map<IUser, IDrawing[]>();
    this.users = [];
  }

  addToStory(): void {
    this.httpClient.put(ADD_DRAWING_TO_STORY_URL + `/${this.albumGalleryService.currentDrawing._id}`, {}).subscribe(
        (result) => {
          console.log("Succès \n Résultat du serveur:", result);
        },
        (error) => {
          console.log(`Impossible d'ajouter le dessin ${this.albumGalleryService.currentDrawing._id} en temps que story.\nErreur: ${error}`);
        });
  }

  getUserStories(): void {
    this.userStories = new Map<IUser, IDrawing[]>();
    this.users = [];
    this.httpClient.get<IUser[]>(GET_ALL_USERS_URL).subscribe(
      (users: IUser[]) => {
        users.forEach(user => {
          let stories: IDrawing[] = [];
          this.httpClient.get<IDrawing[]>(GET_ALL_USER_DRAWINGS_URL + `/${user.identifier}`).subscribe(
            (drawings: IDrawing[]) => {
              drawings.forEach(drawing => {
                if (drawing.isStory) {
                  stories.push(drawing);
                }
              });
              if (stories.length != 0) {
                this.userStories.set(user, stories);
                this.users.push(user);
              }
            }
          );
        });
      }
    );
  }

  getStoriesData(user: IUser): void {
    (this.userStories.get(user) as IDrawing[]).forEach(drawing => {
      this.httpClient.get(`${GET_DRAWING_URL}/${drawing._id}`).subscribe(
        (result: IDrawing) => {
          drawing.data = result.data;
        }
      );
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROFILE_URL, STATS_TOTAL_ALBUMS_CREATED_URL, STATS_TOTAL_DRAWINGS_CREATED_URL, STATS_TOTAL_LIKES_URL } from '@app/constants/api-urls'
import { BADGES, FAVOURITE, MOST_LIKED, STATS } from '@app/constants/badges'
import { BADGE_COUNT } from '@app/constants/constants'

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  username: string;
  avatarSrc: string;
  email: string;
  description: string;
  currentBadge: string;
  statsImg: string;
  favoritesImg: string;
  mostLikedImg: string;

  isCurrentUserProfile: boolean;

  // Statistics
  totalNbrDrawings: number;
  totalNbrLikes: number;
  totalNbrAlbums: number;

  constructor(private httpClient: HttpClient) {
    this.statsImg = STATS;
    this.favoritesImg = FAVOURITE;
    this.mostLikedImg = MOST_LIKED;
  }

  setUsername(name: string): void {
    this.username = name;
  }

  getUserProfileInfos(username: string | null) {
    this.httpClient.get(`${PROFILE_URL}/${username}`).subscribe(
      (result) => {
        console.log("Résultat du serveur:", result);
        const userData = JSON.parse(JSON.stringify(result));
        this.username = userData.identifier;
        this.avatarSrc = userData.avatar;
        this.email = userData.email;
        this.description = userData.description;
      },
      (error) => {
        console.log(`Impossible d'obtenir les informations de profil de l'utilisateur ${username} de la base do données.\nErreur: ${error}`);
      }
    )
  }

  getUserProfileStatistics(username: string | null): void {

    this.httpClient.get<number>(`${STATS_TOTAL_DRAWINGS_CREATED_URL}/${username}`).subscribe(
      (result: number) => {
        this.totalNbrDrawings = result;
      },
      (error) => {
        console.log(`Impossible d'obtenir le nombre de dessins créés par ${username}.\nErreur: ${error}`);
      }
      )

      this.httpClient.get<number>(`${STATS_TOTAL_LIKES_URL}/${username}`).subscribe(
        (result: number) => {
        this.totalNbrLikes = result;
        this.setBadge();
      },
      (error) => {
        console.log(`Impossible d'obtenir le nombre total de mentions J'aime de ${username}.\nErreur: ${error}`)
      }
      )

      this.httpClient.get<number>(`${STATS_TOTAL_ALBUMS_CREATED_URL}/${username}`).subscribe(
        (result: number) => {
        this.totalNbrAlbums = result;
      },
      (error) => {
        console.log(`Impossible d'obtenir le nombre total d'albums privé créés par ${username}.\nErreur: ${error}`)
      }
    )
  }

  setBadge(): void {
    if (this.totalNbrLikes <= BADGE_COUNT.BEGINNER) {
      this.currentBadge = BADGES.BEGINNER;
    } else if (this.totalNbrLikes <= BADGE_COUNT.INTERMIDIATE) {
      this.currentBadge = BADGES.INTERMEDIATE;
    } else if (this.totalNbrLikes <= BADGE_COUNT.EXPERT) {
      this.currentBadge = BADGES.EXPERT;
    } else {
      this.currentBadge = BADGES.ARTIST;
    }
  }
}

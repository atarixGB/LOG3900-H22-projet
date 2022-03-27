import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROFILE_URL } from '@app/constants/api-urls'

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    username: string;
    avatarSrc: string;
    email: string;
    description: string;



    constructor(private httpClient: HttpClient) {}

    setUsername(name : string) :void {
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
}

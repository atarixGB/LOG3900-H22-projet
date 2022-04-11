import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../profile/profile.service';
import { DISCONNECT_URL, LOGIN_URL } from '@app/constants/api-urls';
import { SoundEffectsService } from '../sound-effects/sound-effects.service';
import { CollaborationService } from '../collaboration/collaboration.service';
import { ChatService } from '@app/services/chat/chat.service';

const electron = (<any>window).require('electron');
@Injectable({
    providedIn: 'root',
})
export class LoginService {
    email: string;
    password: string;
    socket: any;
    username: string;

    isValidEmail: boolean;
    isValidPW: boolean;

    constructor(
      private httpClient: HttpClient,
      private router: Router,
      private route: ActivatedRoute,
      private profileService: ProfileService,
      private soundEffectsService: SoundEffectsService,
      private collaborationService: CollaborationService,
      private chatService: ChatService) {
        this.email = '';
        this.password = '';
    }

    setBoolsToDefault(): void {
        this.isValidEmail = true;
        this.isValidPW = true;
    }

    connect(): void {
        const userCredentials = {
            email: this.email,
            password: this.password,
        };

        this.httpClient.post(LOGIN_URL, userCredentials).subscribe(
            (result) => {
                if (result == 200) {
                  this.router.navigate(['../menu'], { relativeTo: this.route });
                  this.fetchUserInfo();
                  this.collaborationService.enterCollaboration();
                } else if (result == 403) {
                  this.isValidPW = false;
                  this.soundEffectsService.playFailureSound();
                } else if (result == 404) {
                  this.isValidEmail = false;
                  this.soundEffectsService.playFailureSound();
                }
            },
            (error) => {
                console.log("Error: ", error);
            }
        );
    }

    fetchUserInfo(): void {
        this.httpClient.get(LOGIN_URL + '/' + this.email).subscribe(
            (result) => {
                console.log("Current user:", result);
                this.username = result.toString();
                window.localStorage.setItem("username", this.username);
                this.profileService.setUsername(this.username);
            },
            (error) => {
                console.log('Error: ', error);
            },
        );
    }

    disconnect(): void {
      this.httpClient.get(`${DISCONNECT_URL}/${this.email}`).subscribe(
        (result) => {
          console.log(result);

          if (result == 201) {
            console.log("Tu as été déconnecté avec succès!");
            this.router.navigate([`../home`]);
            this.chatService.disconnect();
          }

        },
        (error) => {
          console.log("Erreur du serveur:", error);
      })
    }

    quitApp(): void {
      electron.ipcRenderer.send("quit-app", null);
    }
}

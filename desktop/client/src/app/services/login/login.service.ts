import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../profile/profile.service';
import { LOGIN_URL } from '@app/constants/api-urls';
import { SoundEffectsService } from '../sound-effects/sound-effects.service';
import { CollaborationService } from '../collaboration/collaboration.service';

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
      private collaborationService: CollaborationService) {
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
}

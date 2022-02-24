import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './profile.service';

const PROFILE_UPDATE_URL = 'http://localhost:3000/profileUpdate';

@Injectable({
    providedIn: 'root',
})
export class ProfileSettingsService {
    username: string;
    avatarSrc: string;
    newUsername: string;
    description: string;

    constructor(private httpClient: HttpClient,  private router: Router, private route: ActivatedRoute, public profileService: ProfileService) {
        this.getUserInfoFromProfile();
    }

    getUserInfoFromProfile(): void {
        this.username = this.profileService.username;
        this.description = this.profileService.description;
        this.avatarSrc = this.profileService.avatarSrc;
    }

    isValidNewUsername(): boolean {
        const isChanged = this.newUsername != "";
        if (isChanged) {
            const regex = /^[a-zA-Z0-9]+$/;
            const isValid = regex.test(this.newUsername) && !(this.newUsername === null || this.newUsername.match(/^ *$/) !== null);
            if (!isValid) {
                return false;
            }
            this.profileService.setUsername(this.newUsername);
        } 
        return true;
    }

    sendChangesToDB(): void {
        // POST request to update new profile info 
        const newInfos = {
            oldUsername: this.username,
            newUsername: this.newUsername,
            avatar: this.avatarSrc,
            // description : this.description
        };

        this.httpClient.post(PROFILE_UPDATE_URL, newInfos).subscribe(
            (isSuccess) => {
                if (isSuccess) {
                    this.router.navigate(['../profile'], { relativeTo: this.route });
                }
            },
            (error) => {
                console.log('Error:', error);
            },
        );
    }
}

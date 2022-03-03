import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './profile.service';

const PROFILE_UPDATE_URL = 'http://localhost:3001/profileUpdate';

@Injectable({
    providedIn: 'root',
})
export class ProfileSettingsService {
    newUsername: string;
    newAvatarSrc: string;
    newDescription: string;

    constructor(private httpClient: HttpClient,  private router: Router, private route: ActivatedRoute, public profileService: ProfileService) {
        this.getUserInfoFromProfile();
    }

    getUserInfoFromProfile(): void {
        this.newUsername = this.profileService.username;
        this.newAvatarSrc = this.profileService.avatarSrc;
        this.newDescription = this.profileService.description;
    }

    saveChanges() : void {
        if(this.somethingChanged()) {
            this.isValidNewUsername() ? this.sendChangesToDB() : console.log('TO DO: Message erreur quand le username est invalid (dans profile-settings component)');
        } else {
            this.router.navigate(['../profile'], { relativeTo: this.route });
        }
    }

    private somethingChanged(): boolean {
        return this.profileService.username != this.newUsername || this.profileService.avatarSrc != this.newAvatarSrc || this.profileService.description != this.newDescription;
    }

    private isValidNewUsername(): boolean {
        const regex = /^[a-zA-Z0-9]+$/;
        return regex.test(this.newUsername) && !(this.newUsername === null || this.newUsername.match(/^ *$/) !== null);
    }

    private sendChangesToDB(): void {
        // POST request to update new profile info
        const newInfos = {
            oldUsername: this.profileService.username,
            newUsername: this.newUsername,
            newAvatar: this.newAvatarSrc,
            newDescription : this.newDescription
        };

        this.httpClient.post(PROFILE_UPDATE_URL, newInfos).subscribe(
            (isSuccess) => {
                if (isSuccess) {
                    this.profileService.setUsername(this.newUsername);
                    this.router.navigate(['../profile'], { relativeTo: this.route });
                } else {
                    // TODO: Add UI feedback
                    console.log("Update failed because username already exists, To Do -> UI error feedback in profile settings service");
                }
            },
            (error) => {
                console.log('Error:', error);
            },
        );
    }

}

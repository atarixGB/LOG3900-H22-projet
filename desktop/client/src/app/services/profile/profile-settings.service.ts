import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './profile.service';
import { PROFILE_UPDATE_URL } from '@app/constants/api-urls';
import { SoundEffectsService } from '../sound-effects/sound-effects.service';

@Injectable({
    providedIn: 'root',
})
export class ProfileSettingsService {
    newUsername: string;
    newAvatarSrc: string;
    newDescription: string;

    isAvatarTooLarge: boolean;
    isValidUsername: boolean;
    isExistingUsername: boolean;

    constructor(private httpClient: HttpClient,  private router: Router, private route: ActivatedRoute, public profileService: ProfileService, private soundEffectsService: SoundEffectsService) {
        this.getUserInfoFromProfile();
        this.setBoolsToDefault();
    }

    setBoolsToDefault(): void {
        this.isAvatarTooLarge = false;
        this.isValidUsername = true;
        this.isExistingUsername = false;
    }

    getUserInfoFromProfile(): void {
        this.newUsername = this.profileService.username;
        this.newAvatarSrc = this.profileService.avatarSrc;
        this.newDescription = this.profileService.description;
    }

    saveChanges() : void {
        this.setBoolsToDefault();
        if(this.somethingChanged()) {
            if (this.isValidNewUsername()) {
                this.sendChangesToDB()
            } else {
                this.isValidUsername = false
                this.soundEffectsService.playFailureSound();
            }
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
            newDescription : this.newDescription,
            newEmail: this.profileService.email
        };

        this.httpClient.post(PROFILE_UPDATE_URL, newInfos).subscribe(
            (isSuccess) => {
                if (isSuccess) {
                    this.profileService.setUsername(this.newUsername);
                    this.soundEffectsService.playSuccessSound();
                    this.router.navigate([`../profile/${this.profileService.username}`], { relativeTo: this.route });
                } else {
                    this.soundEffectsService.playFailureSound();
                    this.isExistingUsername = true;
                }
            },
            (error) => {
                console.log('Error:', error);
                this.soundEffectsService.playFailureSound();
                this.isAvatarTooLarge = true;
            },
        );
    }

}

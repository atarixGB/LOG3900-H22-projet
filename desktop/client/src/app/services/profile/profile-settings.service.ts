import { Injectable } from '@angular/core';
import { ProfileService } from './profile.service';

@Injectable({
    providedIn: 'root',
})
export class ProfileSettingsService {
    username: string;
    password: string;
    description: string;
    avatarSrc: any;

    newUsername: string;

    constructor(public profileService: ProfileService) {
        this.getUserInfoFromProfile();
    }

    getUserInfoFromProfile(): void {
        this.username = this.profileService.username;
        this.description = this.profileService.description;
        this.avatarSrc = this.profileService.avatarSrc;
    }

    applyChangesToProfil(): void {
        // To do
        console.log('TO DO: Apply changes to profile (in profile settings service)');
    }

    sendChangesToDB(): void {
        // To do
        console.log('TO DO: Send profile modifications to DB (in profile settings service)');
    }
}

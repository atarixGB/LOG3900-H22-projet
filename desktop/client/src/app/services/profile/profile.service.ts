import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    username: string;
    description: string;
    avatarSrc: string;

    constructor() {
        this.username = 'Léon Le Brun'; // placeholder
        this.description =
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'; // placeholder
        this.avatarSrc = './assets/avatars/av0.png'; // placeholder
    }

    loadProfileInfo(): void {
        // to do
        console.log('TO DO: User info retrieval from bd in profile service');
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { avatars } from '@app/interfaces-enums/avatar-list';

const PROFILE_URL = 'http://localhost:3000/profile';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    username: string;
    description: string;
    avatarSrc: string;

    constructor(private httpClient: HttpClient) {
        this.username = 'Léon Le Brun'; // placeholder
        this.description =
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'; // placeholder
        this.avatarSrc = avatars[0]; // placeholder
    }

    loadProfileInfo(): void {
        this.httpClient.get(PROFILE_URL + '/' + this.username).subscribe(
            (result) => {
                const userdata = JSON.parse(JSON.stringify(result));
                // this.description = userdata.description;
                this.avatarSrc = userdata.avatar;
            },
            (error) => {
                console.log('Error: ', error);
            },
        );
    }
}

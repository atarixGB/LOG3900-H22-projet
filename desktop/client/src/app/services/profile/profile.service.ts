import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const PROFILE_URL = 'http://localhost:3001/profile';

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

    loadProfileInfo(): void {
        this.httpClient.get(PROFILE_URL + '/' + this.username).subscribe(
            (result) => {
                const userdata = JSON.parse(JSON.stringify(result));
                this.avatarSrc = userdata.avatar;
                this.email = userdata.email;
                this.description = userdata.description;

            },
            (error) => {
                console.log('Error: ', error);
            },
        );
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const SIGN_UP_URL = 'http://localhost:3000/register';

@Injectable({
    providedIn: 'root',
})
export class SignUpService {
    identifier: string;
    password: string;
    email: string;
    avatarSrc: any;

    constructor(private httpClient: HttpClient) {}

    signUp(): void {
        // POST resquest to create a new user in the database
        const userInfos = {
            identifier: this.identifier,
            password: this.password,
            email: this.email,
        };

        this.httpClient.post(SIGN_UP_URL, userInfos).subscribe(
            (result) => {
                console.log('Result:', result);
            },
            (error) => {
                console.log('Error:', error);
            },
        );
    }
}

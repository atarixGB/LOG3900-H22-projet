import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

const SIGN_UP_URL = 'http://localhost:3000/register';

@Injectable({
    providedIn: 'root',
})
export class SignUpService {
    identifier: string;
    password: string;
    email: string;
    avatarSrc: string;

    constructor(private httpClient: HttpClient, private router: Router, private route: ActivatedRoute) {}

    signUp(): void {
        // POST resquest to create a new user in the database
        const userInfos = {
            identifier: this.identifier,
            password: this.password,
            email: this.email,
            avatar: this.avatarSrc,
        };

        this.httpClient.post(SIGN_UP_URL, userInfos).subscribe(
            (result) => {
                console.log('Result:', result);

                if (result) {
                    this.router.navigate(['../home'], { relativeTo: this.route });
                }
            },
            (error) => {
                console.log('Error:', error);
            },
        );
    }
}

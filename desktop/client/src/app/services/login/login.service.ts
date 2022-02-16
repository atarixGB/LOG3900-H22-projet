import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

const LOGIN_URL = 'http://localhost:3000/login';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    username: string;
    password: string;
    socket: any;

    constructor(private httpClient: HttpClient, private router: Router, private route: ActivatedRoute) {
        this.username = '';
        this.password = '';
    }

    connect(): void {
        const userCredentials = {
            identifier: this.username,
            password: this.password,
        };

        this.httpClient.post(LOGIN_URL, userCredentials).subscribe(
            (result) => {
                console.log('Result: ', result);
                this.router.navigate(['../menu'], { relativeTo: this.route });
            },
            (error) => {
                console.log("Error: ", error);
            }
        );
    }
}

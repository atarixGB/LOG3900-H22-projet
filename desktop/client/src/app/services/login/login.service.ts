import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../profile/profile.service';

const LOGIN_URL = 'http://localhost:3000/login';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    username: string;
    password: string;
    socket: any;

    constructor(private httpClient: HttpClient, private router: Router, private route: ActivatedRoute, private profileService: ProfileService) {
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
                if (result) {
                  this.router.navigate(['../menu'], { relativeTo: this.route });
                  this.profileService.setUsername(this.username);
                } else {
                  // TODO: Add UI feedback
                }
            },
            (error) => {
                console.log("Error: ", error);
            }
        );
    }
}

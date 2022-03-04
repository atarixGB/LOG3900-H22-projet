import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../profile/profile.service';

const LOGIN_URL = 'http://localhost:3001/login';

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
                if (result == 200) {
                  console.log(result, "Login sucess")
                  this.router.navigate(['../menu'], { relativeTo: this.route });
                  this.profileService.setUsername(this.username);
                } else if (result == 403) {
                  // TODO: Add UI feedback
                  console.log(result, "Wrong password");
                } else if (result == 404) {
                  // TODO: Add UI feedback
                  console.log(result, "Identifier does not exist.")
                }
            },
            (error) => {
                console.log("Error: ", error);
            }
        );
    }
}

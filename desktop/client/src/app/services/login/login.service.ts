import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../profile/profile.service';
import { LOGIN_URL } from '@app/constants/api-urls';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    email: string;
    password: string;
    socket: any;
    username: string;

    isValidEmail: boolean;
    isValidPW: boolean;

    constructor(private httpClient: HttpClient, private router: Router, private route: ActivatedRoute, private profileService: ProfileService) {
        this.email = '';
        this.password = '';
    }

    setBoolsToDefault(): void {
        this.isValidEmail = true;
        this.isValidPW = true;
    } 

    connect(): void {
        const userCredentials = {
            email: this.email,
            password: this.password,
        };

        this.httpClient.post(LOGIN_URL, userCredentials).subscribe(
            (result) => {
                if (result == 200) {
                  console.log(result, "Login sucess")
                  this.router.navigate(['../menu'], { relativeTo: this.route });
                  this.fetchUserInfo();
                } else if (result == 403) {
                  this.isValidPW = false;
                } else if (result == 404) {
                  this.isValidEmail = false;
                }
            },
            (error) => {
                console.log("Error: ", error);
            }
        );
    }

    fetchUserInfo(): void {
        this.httpClient.get(LOGIN_URL + '/' + this.email).subscribe(
            (result) => {
                this.username = result.toString();
                this.profileService.setUsername(this.username);
                console.log(result, ' got name');
                
            },
            (error) => {
                console.log('Error: ', error);
            },
        );
    }
}

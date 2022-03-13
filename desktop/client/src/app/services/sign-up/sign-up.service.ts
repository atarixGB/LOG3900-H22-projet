import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SIGN_UP_URL } from '@app/constants/api-urls';

@Injectable({
    providedIn: 'root',
})
export class SignUpService {
    identifier: string;
    password: string;
    email: string;
    description: string;
    avatarSrc: string;

    isExistingUsername: boolean;
    isUsedEmail: boolean;

    constructor(private httpClient: HttpClient, private router: Router, private route: ActivatedRoute) {
        this.setBoolsToDefault();
    }

    setBoolsToDefault(): void {
        this.isExistingUsername = false;
        this.isUsedEmail = false;
    }

    signUp(): void {
        // POST resquest to create a new user in the database
        const userInfos = {
            identifier: this.identifier,
            password: this.password,
            avatar: this.avatarSrc,
            email: this.email,
            description: "Accédez aux paramètres du profil pour ajouter une description!",
        };

        this.httpClient.post(SIGN_UP_URL, userInfos).subscribe(
            (result) => {
              if (result == "success") {
                    console.log(result, 'Signup success');
                    this.router.navigate(['../home'], { relativeTo: this.route });
                } else if (result == "usernameTaken") {
                    this.isExistingUsername = true;
                }else if (result == "emailUsed") {
                    this.isUsedEmail = true;
                }
            },
            (error) => {
                console.log('Error:', error);
            },
        );
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FORGOT_PASSWORD_URL } from '@app/constants/api-urls';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  emailExists: boolean;

  constructor(private httpClient: HttpClient, public router: Router, private route: ActivatedRoute) {
    this.emailExists = true;
   }

  confirmEmail(email: string): void {
    const body = {
      email: email
    };

    this.httpClient.post(FORGOT_PASSWORD_URL, body).subscribe(
      (result: number) => {
        console.log("LOLOLOL", result)
        if (result == 204) {
          console.log(`Résultat du serveur: ${result}`)
          this.emailExists = true;
          this.router.navigate(['../reset-password'], { relativeTo: this.route });
        } else if (result == 404) {
          this.emailExists = false;
        }
      },
      (error) => {
        console.log(`Erreur du serveur: ${error}`)

      }
    )
  }
}

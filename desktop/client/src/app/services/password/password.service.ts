import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CHECK_UNIQUE_CODE, FORGOT_PASSWORD_URL, RESET_PASSWORD_URL } from '@app/constants/api-urls';

@Injectable({
  providedIn: 'root'
})
export class PasswordService implements OnDestroy {
  emailExists: boolean;
  codeIsValid: boolean;

  email: string;

  newPassword: string;
  confirmedPassword: string;

  constructor(private httpClient: HttpClient, public router: Router, private route: ActivatedRoute) {
    this.emailExists = true;
    this.codeIsValid = false;
    this.email = "";
    this.newPassword = "";
    this.confirmedPassword = "";
   }

   ngOnDestroy(): void {
     this.codeIsValid = false;
   }

  confirmEmail(email: string): void {
    const body = {
      email: email
    };

    this.httpClient.post(FORGOT_PASSWORD_URL, body).subscribe(
      (result: number) => {
        console.log("LOLOLOL", result)
        console.log(`Résultat du serveur: ${result}`)

        if (result == 204) {
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

  verifyCode(code: number): void {
    const body = {
      code: code,
    }

    this.httpClient.post<number>(CHECK_UNIQUE_CODE, body).subscribe(
      (result) => {
        console.log(`Résultat du serveur: ${result}`);

        if (result == 204) {
          this.codeIsValid = true;
        } else if (result == -1) {
          this.codeIsValid = false;
        }
      },
      (error) => {
        console.log(`Erreur du serveur: ${error}`);
      }
    )
  }

  changePassword(): void {
    const body = {
      email: this.email,
      newPassword: this.newPassword,
      confirmedPassword: this.confirmedPassword,
    }

    if (this.checkNewPassword()) {
      this.httpClient.put(RESET_PASSWORD_URL, body).subscribe(
        (result) => {
          console.log(`Résultat du serveur: ${result}`);

          if (result == 204) {
            console.log("Le mot de passe a été changé!")
          } else if (result == -1) {
            console.log("Le mot de passe est diff/rent");

          }
        },
        (error) => {
          console.log(`Erreur du serveur: ${error}`);
        }
      )
    }
  }

  checkNewPassword(): boolean {
    return this.newPassword == this.confirmedPassword;
  }
}

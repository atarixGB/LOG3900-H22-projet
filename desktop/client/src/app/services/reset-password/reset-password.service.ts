import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RESET_PASSWORD_URL } from '@app/constants/api-urls';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(private httpClient: HttpClient) { }

  confirmEmail(email: string): void {
    const body = {
      email: email
    };

    this.httpClient.post(RESET_PASSWORD_URL, body).subscribe(
      (result) => {
        console.log(`Résultat du serveur: ${result}`)
      },
      (error) => {
        console.log(`Erreur du serveur: ${error}`)

      }
    )
  }
}

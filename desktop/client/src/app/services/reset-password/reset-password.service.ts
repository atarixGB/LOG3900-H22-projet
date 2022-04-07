import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor() { }

  confirmEmail(email: string): void {
    console.log("Confirming email in DB...", email);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const SIGN_UP_URL = "http://localhost:3000/register"

@Injectable({
  providedIn: 'root'
})
export class SignUpService {
  identifier: string;
  password: string;
  email: string;

  constructor(private httpClient: HttpClient) { }

  signUp(): void {
    // POST resquest to create a new user in the database
    const credentials = {
      identifier: this.identifier,
      password: this.password,
      email: this.email,
    }

    this.httpClient.post(SIGN_UP_URL, credentials).subscribe(
      (result) => {
      console.log("Result:", result);
    }, (error) => {
      console.log("Error:", error);
    })
  }
}

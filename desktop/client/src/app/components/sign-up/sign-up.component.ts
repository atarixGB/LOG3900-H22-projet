import { Component } from '@angular/core';
import { SignUpService } from '@app/services/sign-up/sign-up.service'
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  username: string;
  password: string;
  confirmedPassword: string;
  email: string;
  // avatar: Avatar;

  constructor(private signUpService: SignUpService) {
    this.username = "";
    this.password = "";
    this.email = "";
  }

  createAccountButton(): void {
    if (this.checkUsername() && this.checkPassword() && this.checkEmail()) {
      this.signUpService.identifier = this.username;
      this.signUpService.password = this.password;
      this.signUpService.email = this.email;
      this.signUpService.signUp();
    } else {
      // TODO: Add UI feedback
    }
  }

  private checkUsername(): boolean {
    let regex = /^[a-zA-Z0-9]+$/;
    const isValid = regex.test(this.username);
    return isValid && this.isValidInput(this.username);
  }

  private checkPassword(): boolean {
    const isValid: boolean = this.password == this.confirmedPassword;
    return isValid && this.isValidInput(this.password);
  }

  private checkEmail(): boolean {
    let regex = /\S+@\S+\.\S+/;
    const isValid = regex.test(this.email);
    return isValid && this.isValidInput(this.email);
  }

  private isValidInput(str: string): boolean {
    return !(str === null || str.match(/^ *$/) !== null);
  }

}

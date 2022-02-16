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

  constructor(private signUpService: SignUpService) {
    this.username = "";
    this.password = "";
    this.email = "";
  }

  createAccountButton(): void {
    console.log(this.username, this.password, this.confirmedPassword, this.email);

    if (this.checkFormInput()) {
      this.signUpService.identifier = this.username;
      this.signUpService.password = this.password;
      this.signUpService.email = this.email;
      this.signUpService.signUp();
    }
  }

  private checkFormInput(): boolean {
    let areValid = this.checkUsername() && this.checkPassword() && this.checkEmail();
    return areValid;
  }

  private checkUsername(): boolean {
    // TODO
    return true;
  }

  private checkPassword(): boolean {
    let isValid: boolean = this.password == this.confirmedPassword;
    return isValid;
  }

  private checkEmail(): boolean {
    // TODO
    return true;
  }

}

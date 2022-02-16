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
    console.log(this.username, this.password, this.confirmedPassword, this.email);

    if (this.checkUsername() && this.checkPassword() && this.checkEmail()) {
      this.signUpService.identifier = this.username;
      this.signUpService.password = this.password;
      this.signUpService.email = this.email;
      this.signUpService.signUp();
    }
  }

  private checkUsername(): boolean {
    let regex = /^[a-zA-Z0-9]+$/;
    const isValid = regex.test(this.username);
    console.log("username ok? ", isValid)
    return isValid;
  }

  private checkPassword(): boolean {
    const isValid: boolean = this.password == this.confirmedPassword;
    console.log("password ok? ", isValid)
    return isValid;
  }

  private checkEmail(): boolean {
    let regex = /\S+@\S+\.\S+/;
    const isValid = regex.test(this.email);
    console.log("email ok? ", isValid)
    return isValid;
  }

}

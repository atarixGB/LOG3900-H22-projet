import { Component, HostListener } from '@angular/core';
import { PasswordService } from '@app/services/password/password.service'

@Component({
  selector: 'app-reset-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email: string;
  isValidEmail: boolean;

  constructor(public passwordService: PasswordService) {
    this.email = "";
    this.isValidEmail = true;
  }

  @HostListener('document:keyup.enter', ['$event'])
  send(): void {
    this.passwordService.emailExists = true;

    if(this.checkEmail()) {
      this.isValidEmail = true;
      this.passwordService.email = this.email;
      this.passwordService.confirmEmail(this.email);
    } else {
      this.isValidEmail = false;
    }

  }

  private checkEmail(): boolean {
    const regex = /\S+@\S+\.\S+/;
    const isValid = regex.test(this.email);
    return isValid && this.isValidInput(this.email);
  }

  private isValidInput(str: string): boolean {
    return !(str === null || str.match(/^ *$/) !== null);
}

}

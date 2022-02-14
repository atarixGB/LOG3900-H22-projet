import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(public loginService: LoginService) { }

  connect(): void {
    if (this.loginService.isValidUsername()) {
      this.loginService.connectUser();
    }
  }
}

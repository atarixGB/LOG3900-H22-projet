import { Component } from '@angular/core';
import { LoginService } from '@app/services/login/login.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    password: string;

    constructor(public loginService: LoginService) {
        this.password = '';
    }

    connect(): void {
        // if (this.loginService.isValidUsername()) {
        //     this.loginService.connectUser();
        // }
    }
}

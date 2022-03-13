import { Component } from '@angular/core';
import { LoginService } from '@app/services/login/login.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    email: string;
    password: string;
    hide: boolean;

    constructor(public loginService: LoginService) {
        this.email = '';
        this.password = '';
    }

    connect(): void {
        if (this.isValidInput(this.email) && this.isValidInput(this.password)) {
            this.loginService.email = this.email;
            this.loginService.password = this.password;
            this.loginService.connect();
        } else {
            // TODO: Add UI feedback
        }
    }

    private isValidInput(str: string): boolean {
        return !(str === null || str.match(/^ *$/) !== null);
    }
}

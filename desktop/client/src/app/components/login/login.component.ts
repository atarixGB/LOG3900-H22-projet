import { Component } from '@angular/core';
import { LoginService } from '@app/services/login/login.service';
import { SoundEffectsService } from '@app/services/sound-effects/sound-effects.service';
import { fadeInAnimation } from '@app/constants/animations';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [fadeInAnimation],
    host: { '[@fadeInAnimation]': '' }
})
export class LoginComponent {
    email: string;
    password: string;
    hide: boolean;

    isValidFields: boolean;

    constructor(public loginService: LoginService, private soundEffetsService: SoundEffectsService) {
        this.email = '';
        this.password = '';
        this.setBoolsToDefault();
    }

    setBoolsToDefault(): void {
        this.loginService.setBoolsToDefault();
        this.isValidFields = true;
    }

    connect(): void {
        this.setBoolsToDefault();
        if (this.isValidInput(this.email) && this.isValidInput(this.password)) {
            this.loginService.email = this.email;
            this.loginService.password = this.password;
            this.loginService.connect();
        } else {
            this.isValidFields = false;
            this.soundEffetsService.playFailureSound();
        }
    }

    private isValidInput(str: string): boolean {
        return !(str === null || str.match(/^ *$/) !== null);
    }
}

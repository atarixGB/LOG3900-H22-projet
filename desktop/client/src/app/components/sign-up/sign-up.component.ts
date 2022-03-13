import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignUpService } from '@app/services/sign-up/sign-up.service';
import { AvatarImportModalComponent } from '../avatar/avatar-import-modal/avatar-import-modal.component';
import { AvatarSelectionModalComponent } from '../avatar/avatar-selection-modal/avatar-selection-modal.component';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
    username: string;
    password: string;
    confirmedPassword: string;
    email: string;

    isValidUsername: boolean;
    isValidPW: boolean;
    isValidConfirmation: boolean;
    isValidEmail: boolean;

    constructor(public signUpService: SignUpService, public dialog: MatDialog) {
        this.username = '';
        this.password = '';
        this.email = '';
        this.setBoolsToDefault();
    }

    createAccountButton(): void {
        this.signUpService.setBoolsToDefault();
        this.setBoolsToDefault();
        this.isValidUsername = this.checkUsername();
        this.isValidPW = this.isValidInput(this.password);
        this.isValidConfirmation = this.password == this.confirmedPassword;
        this.isValidEmail = this.checkEmail();
        if (this.isValidUsername && this.isValidPW && this.isValidConfirmation && this.isValidEmail) {
            this.signUpService.identifier = this.username;
            this.signUpService.password = this.password;
            this.signUpService.email = this.email;
            this.signUpService.signUp();
        } 
    }

    private setBoolsToDefault(): void {
        this.isValidUsername = true;
        this.isValidEmail = true;
        this.isValidPW = true;
        this.isValidConfirmation = true;
    } 

    private checkUsername(): boolean {
        const regex = /^[a-zA-Z0-9]+$/;
        const isValid = regex.test(this.username);
        return isValid && this.isValidInput(this.username);
    }

    private checkEmail(): boolean {
        const regex = /\S+@\S+\.\S+/;
        const isValid = regex.test(this.email);
        return isValid && this.isValidInput(this.email);
    }

    private isValidInput(str: string): boolean {
        return !(str === null || str.match(/^ *$/) !== null);
    }

    openAvatarSelectionModal(): void {
        this.dialog.open(AvatarSelectionModalComponent, {});
    }

    openAvatarImportModal(): void {
        this.dialog.open(AvatarImportModalComponent, {});
    }
}

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AvatarImportModalComponent } from '../avatar/avatar-import-modal/avatar-import-modal.component';
import { AvatarSelectionModalComponent } from '../avatar/avatar-selection-modal/avatar-selection-modal.component';
import { avatars } from '../../interfaces-enums/avatar-list';
import { SignUpService } from '@app/services/sign-up/sign-up.service';

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

    avatarList: string[] = avatars;

    constructor(public signUpService: SignUpService, public dialog: MatDialog) {
        this.username = '';
        this.password = '';
        this.email = '';
        this.avatarList = avatars;
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

    openAvatarSelectionModal(): void {
        this.dialog.open(AvatarSelectionModalComponent, {});
    }

    openAvatarImportModal(): void {
        this.dialog.open(AvatarImportModalComponent, {});
    }
}
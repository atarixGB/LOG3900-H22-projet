import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AvatarModalComponent } from '../avatar-modal/avatar-modal.component';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
    constructor(public dialog: MatDialog) {}

    openAvatarModal(): void {
        this.dialog.open(AvatarModalComponent, {});
    }
}

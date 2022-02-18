import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AvatarImportModalComponent } from '../avatar/avatar-import-modal/avatar-import-modal.component';
import { AvatarSelectionModalComponent } from '../avatar/avatar-selection-modal/avatar-selection-modal.component';
import { avatars } from '../../interfaces-enums/avatar-list';


@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
    avatarList: string[] = avatars;
    avatarFromSelection: number = 0;

    constructor(public dialog: MatDialog) {}

    openAvatarSelectionModal(): void {
        this.dialog.open(AvatarSelectionModalComponent, {});
    }

    openAvatarImportModal(): void {
        this.dialog.open(AvatarImportModalComponent, {});
    }
}

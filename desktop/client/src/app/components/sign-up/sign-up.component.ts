import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AvatarImportModalComponent } from '../avatar/avatar-import-modal/avatar-import-modal.component';
import { AvatarSelectionModalComponent } from '../avatar/avatar-selection-modal/avatar-selection-modal.component';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
    constructor(public dialog: MatDialog) {}

    openAvatarSelectionModal(): void {
        this.dialog.open(AvatarSelectionModalComponent, {});
    }

    openAvatarImportModal(): void {
        this.dialog.open(AvatarImportModalComponent, {});
    }
}

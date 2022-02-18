import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { avatars } from '@app/interfaces-enums/avatar-list';
import { SignUpService } from '@app/services/sign-up/sign-up.service';

const nbRowsForAvatarDisplay = 3;
const nbColumnsForAvatarDisplay = 3;

@Component({
    selector: 'app-avatar-selection-modal',
    templateUrl: './avatar-selection-modal.component.html',
    styleUrls: ['./avatar-selection-modal.component.scss'],
})
export class AvatarSelectionModalComponent implements OnInit {
    avatarList: string[];
    nbRows: number;
    nbColumns: number;
    selectedAvatar: number;

    constructor(private dialogRef: MatDialogRef<AvatarSelectionModalComponent>, public signUpService: SignUpService) {
        this.avatarList = avatars;
        this.nbRows = nbRowsForAvatarDisplay;
        this.nbColumns = nbColumnsForAvatarDisplay;
        this.selectedAvatar = 0;
    }

    ngOnInit(): void {
        this.dialogRef.updateSize('75%', '60%');
    }

    selectAvatar(selected: number): void {
        this.clearSelection();
        const div = document.getElementById(selected.toString());
        if (div) div.className = 'selected';
        this.selectedAvatar = selected;
    }

    clearSelection(): void {
        const div = document.getElementById(this.selectedAvatar.toString());
        if (div) div.className = '';
    }

    confirmAvatar(): void {
        this.signUpService.avatarSrc = this.avatarList[this.selectedAvatar];
        this.dialogRef.close();
    }
}

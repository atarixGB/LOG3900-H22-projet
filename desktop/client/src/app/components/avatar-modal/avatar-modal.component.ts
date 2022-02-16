import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { avatars } from '../../interfaces-enums/avatar-list';

@Component({
    selector: 'app-avatar-modal',
    templateUrl: './avatar-modal.component.html',
    styleUrls: ['./avatar-modal.component.scss'],
})
export class AvatarModalComponent implements OnInit {
    avatarList: string[] = avatars;
    nbRows: number = 2;
    nbColumns: number = 5;
    selectedAvatar: number = 0;

    constructor(private dialogRef: MatDialogRef<AvatarModalComponent>) {}

    ngOnInit() {
        this.dialogRef.updateSize('75%', '60%');
    }

    selectAvatar(selected: number): void {
        this.clearSelection();
        var div = document.getElementById(selected.toString());
        if (div) div.className = 'selected';
        this.selectedAvatar = selected;
    }

    clearSelection(): void {
        var div = document.getElementById(this.selectedAvatar.toString());
        if (div) div.className = '';
    }

    confirmAvatar(): void {
        // Send selected avatar to related services using this.selectedAvatar
        console.log('Avatar ', this.selectedAvatar, ' à été selectionné!');
        this.dialogRef.close();
    }
}

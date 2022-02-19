import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ProfileSettingsService } from '@app/services/profile/profile-settings.service';
import { SignUpService } from '@app/services/sign-up/sign-up.service';

@Component({
    selector: 'app-avatar-import-modal',
    templateUrl: './avatar-import-modal.component.html',
    styleUrls: ['./avatar-import-modal.component.scss'],
})
export class AvatarImportModalComponent implements OnInit {
    imgURL: any;
    isValidFile: boolean;

    constructor(
        private dialogRef: MatDialogRef<AvatarImportModalComponent>,
        public signUpService: SignUpService,
        public profileSettingsService: ProfileSettingsService,
    ) {
        this.isValidFile = true;
    }

    ngOnInit(): void {
        this.dialogRef.updateSize('50', '50%');
    }

    onFileSelection(event: any): void {
        const files = event.target.files;
        if (files.length === 0) return;

        const mimeType = files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            this.isValidFile = false;
            return;
        }
        this.isValidFile = true;
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = () => {
            this.imgURL = reader.result;
        };
    }

    confirmAvatar(): void {
        this.signUpService.avatarSrc = this.imgURL;
        this.profileSettingsService.avatarSrc = this.imgURL;
        this.dialogRef.close();
    }
}

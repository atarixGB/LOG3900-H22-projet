import { AfterContentInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AvatarImportModalComponent } from '@app/components/avatar/avatar-import-modal/avatar-import-modal.component';
import { AvatarSelectionModalComponent } from '@app/components/avatar/avatar-selection-modal/avatar-selection-modal.component';
import { ProfileSettingsService } from '@app/services/profile/profile-settings.service';

@Component({
    selector: 'app-profile-settings',
    templateUrl: './profile-settings.component.html',
    styleUrls: ['./profile-settings.component.scss'],
})
export class ProfileSettingsComponent implements AfterContentInit {
    newUsername: string;

    constructor(public profileSettingsService: ProfileSettingsService, public dialog: MatDialog) {}

    ngAfterContentInit(): void {
        this.profileSettingsService.getUserInfoFromProfile();
    }

    openAvatarSelectionModal(): void {
        this.dialog.open(AvatarSelectionModalComponent, {});
    }

    openAvatarImportModal(): void {
        this.dialog.open(AvatarImportModalComponent, {});
    }

    saveChanges(): void {
        this.validateNewUsername(); // TO DO
        this.profileSettingsService.applyChangesToProfil(); // TO DO
        this.profileSettingsService.sendChangesToDB(); // TO DO
    }

    validateNewUsername(): void {
        // TO DO
        console.log('TO DO: Validate new username (in profile settings component)');
    }
}

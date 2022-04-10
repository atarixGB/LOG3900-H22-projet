import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StampService } from '@app/services/editor/tools/stamp/stamp.service';
import { StampSelectionDialogComponent } from './stamp-selection-dialog/stamp-selection-dialog.component';
@Component({
    selector: 'app-stamp-config',
    templateUrl: './stamp-config.component.html',
    styleUrls: ['./stamp-config.component.scss'],
})
export class StampConfigComponent {

    constructor(public stampService: StampService, public dialog: MatDialog) {}

    openStampSelectionDialog(): void {
        this.dialog.open(StampSelectionDialogComponent, {
            width: "50%",
            height: "90%"
        });
    }
}
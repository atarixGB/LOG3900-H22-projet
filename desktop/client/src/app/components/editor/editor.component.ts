import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ToolList } from '@app/interfaces-enums/tool-list';
import { ToolManagerService } from '@app/services/editor/tools/tool-manager.service';
import { CollaborationService } from '@app/services/collaboration/collaboration.service';
import { CreateDrawingDialogComponent } from './create-drawing-dialog/create-drawing-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements AfterViewInit, OnInit {
    ToolList: typeof ToolList = ToolList;
    constructor(public dialog: MatDialog, public toolManagerService: ToolManagerService, private collaborationService : CollaborationService) {}

    ngOnInit(): void {
      this.dialog.open(CreateDrawingDialogComponent, {
        width: "50%",
        disableClose: true
      });
    }
    ngAfterViewInit(): void {
        this.collaborationService.enterCollaboration();
    }
}

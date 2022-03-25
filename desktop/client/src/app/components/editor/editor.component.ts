import { AfterViewInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToolList } from '@app/interfaces-enums/tool-list';
import { ToolManagerService } from '@app/services/editor/tools/tool-manager.service';
import { CreateDrawingDialogComponent } from './create-drawing-dialog/create-drawing-dialog.component';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements AfterViewInit {
    ToolList: typeof ToolList = ToolList;
    constructor(public toolManagerService: ToolManagerService, public dialog: MatDialog) {}

    ngOnInit(): void {
        this.dialog.open(CreateDrawingDialogComponent, {
          width: "50%",
          disableClose: true
        });
    }

    ngAfterViewInit(): void {}
}

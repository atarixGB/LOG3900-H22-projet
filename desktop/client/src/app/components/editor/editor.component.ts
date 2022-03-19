import { AfterViewInit, Component } from '@angular/core';
import { ToolList } from '@app/interfaces-enums/tool-list';
import { ToolManagerService } from '@app/services/editor/tools/tool-manager.service';
import { CollaborationService } from '@app/services/collaboration/collaboration.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements AfterViewInit {
    ToolList: typeof ToolList = ToolList;
    constructor(public toolManagerService: ToolManagerService, private collaborationService : CollaborationService) {}

    ngAfterViewInit(): void {
        this.collaborationService.enterCollaboration();
    }
}

import { Component } from '@angular/core';
import { ToolList } from '@app/interfaces-enums/tool-list';
import { CollaborationService } from '@app/services/collaboration/collaboration.service';
import { ToolManagerService } from '@app/services/editor/tools/tool-manager.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    ToolList: typeof ToolList = ToolList;
    constructor(public toolManagerService: ToolManagerService, public collaborationService: CollaborationService) {}
}

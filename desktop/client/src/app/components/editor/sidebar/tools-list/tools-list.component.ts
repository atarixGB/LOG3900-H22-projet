import { Component } from '@angular/core';
import { ToolList } from '@app/interfaces-enums/tool-list';
import { ToolManagerService } from '@app/services/editor/tools/tool-manager.service';

@Component({
    selector: 'app-tools-list',
    templateUrl: './tools-list.component.html',
    styleUrls: ['./tools-list.component.scss'],
})
export class ToolsListComponent {
    ToolList: typeof ToolList = ToolList;
    constructor(public toolManagerService: ToolManagerService) {}

    onTool(selectedTool: ToolList): void {
        this.toolManagerService.switchTool(selectedTool);
    }
}

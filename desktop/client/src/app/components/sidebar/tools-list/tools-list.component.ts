import { Component } from '@angular/core';
import { ToolList } from '@app/interfaces-enums/tool-list';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';

@Component({
    selector: 'app-tools-list',
    templateUrl: './tools-list.component.html',
    styleUrls: ['./tools-list.component.scss'],
})
export class ToolsListComponent {
    ToolList: typeof ToolList = ToolList;
    constructor(public toolManagerService: ToolManagerService, public selectionService: SelectionService) {}

    onTool(selectedTool: ToolList): void {
        this.toolManagerService.switchTool(selectedTool);
    }
}

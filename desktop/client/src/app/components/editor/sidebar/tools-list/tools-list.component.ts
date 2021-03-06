import { Component } from '@angular/core';
import { ToolList } from '@app/interfaces-enums/tool-list';
import { SelectionService } from '@app/services/editor/tools/selection/selection.service';
import { StampService } from '@app/services/editor/tools/stamp/stamp.service';
import { ToolManagerService } from '@app/services/editor/tools/tool-manager.service';

@Component({
    selector: 'app-tools-list',
    templateUrl: './tools-list.component.html',
    styleUrls: ['./tools-list.component.scss'],
})
export class ToolsListComponent {
    ToolList: typeof ToolList = ToolList;
    constructor(public toolManagerService: ToolManagerService, public selectionService: SelectionService, public stampService: StampService) {}

    onTool(selectedTool: ToolList): void {
        if (this.selectionService.isActiveSelection) {
            this.selectionService.pasteSelectionOnBaseCnv();
        }
        if (selectedTool === this.ToolList.Selection) {
            this.selectionService.oldTool = this.ToolList.Selection;
        }
        this.toolManagerService.switchTool(selectedTool);
    }
}

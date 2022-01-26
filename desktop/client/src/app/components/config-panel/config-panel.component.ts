import { Component } from '@angular/core';
import { ToolList } from '@app/interfaces-enums/tool-list';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';

@Component({
    selector: 'app-config-panel',
    templateUrl: './config-panel.component.html',
    styleUrls: ['./config-panel.component.scss'],
})
export class ConfigPanelComponent {
    ToolList: typeof ToolList = ToolList;

    constructor(public toolManagerService: ToolManagerService) {}

    includesColorConfiguration(): boolean {
        if (
            this.toolManagerService.currentToolEnum !== ToolList.Eraser &&
            this.toolManagerService.currentToolEnum !== ToolList.SelectionRectangle &&
            this.toolManagerService.currentToolEnum !== ToolList.SelectionEllipse &&
            this.toolManagerService.currentToolEnum !== ToolList.Lasso
        )
            return true;
        return false;
    }
}

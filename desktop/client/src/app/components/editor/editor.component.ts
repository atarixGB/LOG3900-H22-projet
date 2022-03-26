import { AfterViewInit, Component } from '@angular/core';
import { ToolList } from '@app/interfaces-enums/tool-list';
import { SelectionService } from '@app/services/editor/tools/selection/selection.service';
import { ToolManagerService } from '@app/services/editor/tools/tool-manager.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements AfterViewInit {
    ToolList: typeof ToolList = ToolList;
    constructor(public toolManagerService: ToolManagerService, public selectionService: SelectionService) {}

    ngOnInit(): void {
        this.selectionService.clearArrays();
    }

    ngAfterViewInit(): void {}
}

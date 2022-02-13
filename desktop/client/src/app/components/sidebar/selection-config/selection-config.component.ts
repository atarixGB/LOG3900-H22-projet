import { Component  } from '@angular/core';
import { SelectionBox } from '@app/interfaces-enums/selection-box';
import { ClipboardService } from '@app/services/selection/clipboard.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';

@Component({
    selector: 'app-selection-config',
    templateUrl: './selection-config.component.html',
    styleUrls: ['./selection-config.component.scss'],
})
export class SelectionConfigComponent {
    SelectionBox: typeof SelectionBox = SelectionBox;

    constructor(
        public selectionService: SelectionService,
        public clipboardService: ClipboardService,
    ) {}

}

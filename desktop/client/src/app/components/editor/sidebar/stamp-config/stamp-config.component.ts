import { Component } from '@angular/core';
import { StampList } from '@app/interfaces-enums/stamp-list';
import { StampService } from '@app/services/editor/tools/stamp/stamp.service';
@Component({
    selector: 'app-stamp-config',
    templateUrl: './stamp-config.component.html',
    styleUrls: ['./stamp-config.component.scss'],
})
export class StampConfigComponent {
    StampList: typeof StampList = StampList;

    constructor(public stampService: StampService) {}
}
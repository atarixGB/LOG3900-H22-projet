import { Component, OnInit } from '@angular/core';
import { SelectionService } from '@app/services/editor/tools/selection/selection.service';

@Component({
  selector: 'app-selection-config',
  templateUrl: './selection-config.component.html',
  styleUrls: ['./selection-config.component.scss']
})
export class SelectionConfigComponent implements OnInit {

  constructor(public selectionService: SelectionService) { }

  ngOnInit(): void {
  }

}

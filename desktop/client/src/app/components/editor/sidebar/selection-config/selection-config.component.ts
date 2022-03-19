import { AfterViewInit, Component } from '@angular/core';
import { SelectionService } from '@app/services/editor/tools/selection/selection.service';
import { BIGGEST_STROKE_WIDTH, NUMBER_WIDTH_CHOICES } from '@app/constants/constants';

@Component({
  selector: 'app-selection-config',
  templateUrl: './selection-config.component.html',
  styleUrls: ['./selection-config.component.scss']
})
export class SelectionConfigComponent implements AfterViewInit {
  widthBtns: HTMLCollection;

  constructor(public selectionService: SelectionService) { }

  ngAfterViewInit(): void {
    const circleDiam = (document.getElementById('circle') as HTMLElement).offsetHeight;
    this.widthBtns = document.getElementsByClassName('thicknessS'); 
    let diam = '';
    for(let i = 0; i < NUMBER_WIDTH_CHOICES; i++) {
        diam = ((i+1)/NUMBER_WIDTH_CHOICES * circleDiam).toString() + 'px';
        (this.widthBtns.item(i) as HTMLElement).style.width = diam;
        (this.widthBtns.item(i) as HTMLElement).style.height = diam;
    }
  }

  changeWidth(widthChoice: number): void {
    this.selectionService.updateSelectionStrokeWidth(widthChoice/NUMBER_WIDTH_CHOICES * BIGGEST_STROKE_WIDTH)
  }

}

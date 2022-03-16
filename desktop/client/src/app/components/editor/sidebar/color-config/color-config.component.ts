import { AfterViewInit, Component } from '@angular/core';
import { colors } from '@app/constants/colors'
import { ColorManagerService } from '@app/services/editor/color-manager/color-manager.service';

@Component({
  selector: 'app-color-config',
  templateUrl: './color-config.component.html',
  styleUrls: ['./color-config.component.scss']
})
export class ColorConfigComponent implements AfterViewInit {
  colors: string[];

  constructor(public colorManagerService: ColorManagerService) { 
    this.colors = colors;
  }

  ngAfterViewInit(): void {
    const colorBtns = document.getElementsByClassName('color'); 
    for(let i = 0; i < colors.length; i++) {
      (colorBtns.item(i) as HTMLElement).style.backgroundColor = colors[i];
    }
  }

}

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
  primaryColorBtns: HTMLCollection;

  constructor(public colorManagerService: ColorManagerService) { 
    this.colors = colors;
  }

  ngAfterViewInit(): void {
    this.primaryColorBtns = document.getElementsByClassName('primeColor'); 
    for(let i = 0; i < colors.length; i++) {
      (this.primaryColorBtns.item(i) as HTMLElement).style.backgroundColor = colors[i];
    }
  }

  changePrimaryColorTo(newPrimary: string, div: HTMLElement): void {
    this.colorManagerService.primaryColor = newPrimary;
    this.displayActiveColor(div);
  }

  displayActiveColor(div: HTMLElement): void {
      for(let i = 0; i < colors.length; i++) {
          (this.primaryColorBtns.item(i) as HTMLElement).className = "color primeColor";
      }
      div.className += " selected";
  }

}

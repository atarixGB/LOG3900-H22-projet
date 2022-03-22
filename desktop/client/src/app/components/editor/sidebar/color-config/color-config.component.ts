import { AfterViewInit, Component } from '@angular/core';
import { colors } from '@app/constants/colors'
import { TRANSPARENT } from '@app/constants/constants';
import { ColorManagerService } from '@app/services/editor/color-manager/color-manager.service';
import { SelectionService } from '@app/services/editor/tools/selection/selection.service';

@Component({
  selector: 'app-color-config',
  templateUrl: './color-config.component.html',
  styleUrls: ['./color-config.component.scss']
})
export class ColorConfigComponent implements AfterViewInit {
  colors: string[];
  primaryColorBtns: HTMLCollection;
  secondaryColorBtns: HTMLCollection;
  isPrimaryPalette: boolean;

  constructor(public colorManagerService: ColorManagerService, public selectionService: SelectionService) { 
    this.colors = colors;
    this.isPrimaryPalette = true;
  }

  ngAfterViewInit(): void {
    this.primaryColorBtns = document.getElementsByClassName('primeColor'); 
    this.secondaryColorBtns = document.getElementsByClassName('secondColor'); 
    for(let i = 0; i < colors.length; i++) {
      (this.primaryColorBtns.item(i) as HTMLElement).style.backgroundColor = colors[i];
      (this.secondaryColorBtns.item(i) as HTMLElement).style.backgroundColor = colors[i];
    }
  }

  onToggleChange(toggleVal: any): void {
    this.isPrimaryPalette = toggleVal == "primary";
  }

  changePrimaryColorTo(newPrimary: string, div: HTMLElement): void {
    this.colorManagerService.primaryColor = newPrimary;
    if (this.selectionService.isActiveSelection) {
      this.selectionService.updateSelectionPrimaryColor(this.colorManagerService.primaryColor);
    }

    for(let i = 0; i < colors.length; i++) {
      (this.primaryColorBtns.item(i) as HTMLElement).className = "color primeColor";
    }
    div.className += " selected";
  }

  changeSecondaryColorTo(newSecondary: string, div: HTMLElement): void {
    this.colorManagerService.secondaryColor = newSecondary;
    if (this.selectionService.isActiveSelection) {
      this.selectionService.updateSelectionSecondaryColor(this.colorManagerService.secondaryColor);
    }

    for(let i = 0; i < colors.length; i++) {
      (this.secondaryColorBtns.item(i) as HTMLElement).className = "color secondColor";
    }
    div.className += " selected";
  }

  changeBackgroundToTransparent(): void {
    this.colorManagerService.secondaryColor = TRANSPARENT;
    if (this.selectionService.isActiveSelection) {
      this.selectionService.updateSelectionSecondaryColor(this.colorManagerService.secondaryColor);
    }
  }

}

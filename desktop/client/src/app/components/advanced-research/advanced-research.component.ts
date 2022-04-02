import { Component, HostListener } from '@angular/core';
import { AdvancedResearchService } from '@app/services/advanced-research/advanced-research.service'

@Component({
  selector: 'app-advanced-research',
  templateUrl: './advanced-research.component.html',
  styleUrls: ['./advanced-research.component.scss']
})
export class AdvancedResearchComponent {
  searchBarInput: string;
  category: string;
  attribute: string;
  isValidInput: boolean;

  constructor(public advancedResearchService: AdvancedResearchService) {
    this.category = "albums";
    this.attribute = "name";
    this.isValidInput = false;
  }

  @HostListener('document:keyup.enter', ['$event'])
  onSearchBtn(): void {
    if (this.isOneKeywordOnly(this.searchBarInput)) {
      // TODO: requête pour recherche avancée
    }
  }

  onCancelBtn(): void {
    this.searchBarInput = "";
  }

  changeCategory(value: string): void {
    this.category = value;
    this.advancedResearchService.isAlbum = value == "albums";
    this.advancedResearchService.isDrawing = value == "drawings";
    this.advancedResearchService.isUser = value == "users";
  }

  changeAttribute(value: string): void {
    this.attribute = value;
  }

  private isOneKeywordOnly(input: string): boolean {
    this.isValidInput = !(/\s/).test(input);
    return this.isValidInput;
  }
}

import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-advanced-research',
  templateUrl: './advanced-research.component.html',
  styleUrls: ['./advanced-research.component.scss']
})
export class AdvancedResearchComponent implements OnInit {
  searchBarInput: string;

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('document:keyup.enter', ['$event'])
  onSearchBtn(): void {
    console.log("search:", this.searchBarInput)
  }

  onCancelBtn(): void {
    this.searchBarInput = "";
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdvancedResearchService {
  isAlbum: boolean;
  isDrawing: boolean;
  isUser: boolean;

  constructor() {
    this.isAlbum = true;
    this.isDrawing = false;
    this.isUser = false;
  }


}

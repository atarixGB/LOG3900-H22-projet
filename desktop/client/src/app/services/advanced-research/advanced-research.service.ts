import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ADVANCED_SEARCH_URL } from '@app/constants/api-urls';

@Injectable({
  providedIn: 'root'
})
export class AdvancedResearchService {
  isAlbum: boolean;
  isDrawing: boolean;
  isUser: boolean;

  constructor(private httpClient: HttpClient) {
    this.isAlbum = true;
    this.isDrawing = false;
    this.isUser = false;
  }

  search(category: string, attribute: string, keyword: string | null) : void {
    const url = `${ADVANCED_SEARCH_URL}/${category}/${attribute}/${keyword}`;

    this.httpClient.get<any>(url).subscribe(
      (result) => {
        console.log("Résultat du serveur:", result)
      },
      (error) => {
        console.log("Impossible d'effectuer une recherche sur la base de données.\n", error);
      }
    )
  }
}

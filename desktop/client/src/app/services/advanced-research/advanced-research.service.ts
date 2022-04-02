import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ADVANCED_SEARCH_URL } from '@app/constants/api-urls';
import { PUBLIC_ALBUM } from '@app/constants/constants';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class AdvancedResearchService {
  isAlbum: boolean;
  isDrawing: boolean;
  isUser: boolean;
  result: any[];

  constructor(private httpClient: HttpClient, private loginService: LoginService) {
    this.result = [];
    this.isAlbum = true;
    this.isDrawing = false;
    this.isUser = false;
  }

  ngOnDestroy(): void {
    this.result = [];
  }

  search(category: string, attribute: string, keyword: string | null) : void {
    const url = `${ADVANCED_SEARCH_URL}/${category}/${attribute}/${keyword}`;

    this.result = [];
    this.httpClient.get<any>(url).subscribe(
      (result) => {

        if (this.isAlbum) {
          for (const album of result) {
            if (album.owner != this.loginService.username && album.name != PUBLIC_ALBUM.name) {
              this.result.push(album)
            }
          }
        } else {
          this.result = result;
        }

        console.log("Résultat du serveur:", this.result)
      },
      (error) => {
        console.log("Impossible d'effectuer une recherche sur la base de données.\n", error);
      }
    )
  }
}

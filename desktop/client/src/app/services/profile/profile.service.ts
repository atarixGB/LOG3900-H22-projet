import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROFILE_URL } from '@app/constants/api-urls'
import { BADGES, FAVOURITE, MOST_LIKED, STATS } from '@app/constants/badges'

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    username: string;
    avatarSrc: string;
    email: string;
    description: string;
    currentBadge: string;
    statsImg: string;
    favoritesImg: string;
    mostLikedImg: string;

    constructor(private httpClient: HttpClient) {
        this.username = 'r';
        this.currentBadge = BADGES.BEGINNER;
        this.statsImg = STATS;
        this.favoritesImg = FAVOURITE;
        this.mostLikedImg = MOST_LIKED;
    }

    setUsername(name : string) :void {
        this.username = name;
    }

    loadProfileInfo(): void {
        this.httpClient.get(PROFILE_URL + '/' + this.username).subscribe(
            (result) => {
                const userdata = JSON.parse(JSON.stringify(result));
                this.avatarSrc = userdata.avatar;
                this.email = userdata.email;
                this.description = userdata.description;

            },
            (error) => {
                console.log('Error: ', error);
            },
        );
    }
}

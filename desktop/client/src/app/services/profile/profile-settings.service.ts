import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './profile.service';
import { PROFILE_UPDATE_URL, PROFILE_URL } from '@app/constants/api-urls';
import { SoundEffectsService } from '../sound-effects/sound-effects.service';
import { ChatTheme } from '@app/constants/chat-themes';

@Injectable({
  providedIn: 'root',
})
export class ProfileSettingsService {
  newUsername: string;
  newAvatarSrc: string;
  newDescription: string;

  isAvatarTooLarge: boolean;
  isValidUsername: boolean;
  isExistingUsername: boolean;

  currentChatThemeId: ChatTheme;
  newChatThemeId: ChatTheme;

  constructor(private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public profileService: ProfileService,
    private soundEffectsService: SoundEffectsService) {
    this.getUserInfoFromProfile();
    this.setBoolsToDefault();
    this.getChatThemeId(window.localStorage.getItem("username"));
  }

  setBoolsToDefault(): void {
    this.isAvatarTooLarge = false;
    this.isValidUsername = true;
    this.isExistingUsername = false;
  }

  getUserInfoFromProfile(): void {
    this.newUsername = this.profileService.username;
    this.newAvatarSrc = this.profileService.avatarSrc;
    this.newDescription = this.profileService.description;
  }

  saveChanges(): void {
    this.setBoolsToDefault();

    if (this.somethingChanged()) {
      this.currentChatThemeId = this.newChatThemeId;
      if (this.isValidNewUsername()) {
        this.sendChangesToDB()
      } else {
        this.isValidUsername = false
        this.soundEffectsService.playFailureSound();
      }
    } else {
      this.router.navigate([`../profile/${this.profileService.username}`], { relativeTo: this.route });
    }
  }

  private somethingChanged(): boolean {
    return this.profileService.username != this.newUsername
      || this.profileService.avatarSrc != this.newAvatarSrc
      || this.profileService.description != this.newDescription
      || this.currentChatThemeId != this.newChatThemeId;
  }

  private isValidNewUsername(): boolean {
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(this.newUsername) && !(this.newUsername === null || this.newUsername.match(/^ *$/) !== null);
  }

  private sendChangesToDB(): void {

    const newInfos = {
      oldUsername: this.profileService.username,
      newUsername: this.newUsername,
      newAvatar: this.newAvatarSrc,
      newDescription: this.newDescription,
      newEmail: this.profileService.email,
      newChatThemeId: this.newChatThemeId
    };

    this.httpClient.post(PROFILE_UPDATE_URL, newInfos).subscribe(
      (isSuccess) => {
        if (isSuccess) {
          this.profileService.setUsername(this.newUsername);
          this.soundEffectsService.playSuccessSound();
          this.router.navigate([`../profile/${this.profileService.username}`], { relativeTo: this.route });
        } else {
          this.soundEffectsService.playFailureSound();
          this.isExistingUsername = true;
        }
      },
      (error) => {
        console.log('Error:', error);
        this.soundEffectsService.playFailureSound();
        this.isAvatarTooLarge = true;
      },
    );
  }

  getChatThemeId(username: string | null): void {
    this.httpClient.get(`${PROFILE_URL}/${username}`).subscribe(
      (result: any) => {
        this.currentChatThemeId = result.chatThemeId;
        window.localStorage.setItem("themeId", result.chatThemeId);
        console.log("localStorage username", window.localStorage.getItem("username"))
        console.log("localStorage themeId", window.localStorage.getItem("themeId"))
      },
      (error) => {
        console.log(`Impossible d'obtenir le thème de clavardage du profil de l'utilisateur ${this.profileService.username} de la base de données.\nErreur: ${error}`);
      }
    )
  }
}

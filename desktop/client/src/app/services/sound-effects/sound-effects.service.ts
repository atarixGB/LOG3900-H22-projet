import { Injectable } from '@angular/core';
import * as sounds from '@app/constants/sounds';
import { SONGS } from '@app/constants/songs'

@Injectable({
  providedIn: 'root'
})
export class SoundEffectsService {
  soundEffectAudio: any;
  drawAudio: any;
  songAudio: any;

  isSoundEnabled: boolean;
  songChoice: number;

  constructor() {
    this.soundEffectAudio = new Audio();

    this.drawAudio = new Audio(sounds.DRAW);
    this.drawAudio.loop = true;

    this.songAudio = new Audio();
    this.songAudio.loop = true;

    this.isSoundEnabled = true;
    this.songChoice = 0;
  }

  // Sounds 1: Signup and login
  playSuccessSound(): void {
    this.soundEffectAudio.src = sounds.SUCCESS;
    this.loadAndPlay(this.soundEffectAudio);
  }

  playFailureSound(): void {
    this.soundEffectAudio.src = sounds.FAILURE;
    this.loadAndPlay(this.soundEffectAudio);
  }

  // Sounds 2: Chat 
  playSendMsgSound(): void {
    this.soundEffectAudio = new Audio(sounds.SEND_MSG);
    this.loadAndPlay(this.soundEffectAudio);
  }

  playHelloSound(): void {
    this.soundEffectAudio = new Audio(sounds.HELLO);
    this.loadAndPlay(this.soundEffectAudio);
  }

  // Sounds 3: Editor tools
  startDrawSound(): void {
    this.loadAndPlay(this.drawAudio);
  }

  stopDrawSound(): void {
    this.drawAudio.pause();
  }

  playSelectionSound(): void {
    this.soundEffectAudio.src = sounds.SELECT;
    this.loadAndPlay(this.soundEffectAudio);
  }

  playDeleteSound(): void {
    this.soundEffectAudio.src = sounds.DELETE;
    this.loadAndPlay(this.soundEffectAudio);
  }

  playPasteSound(): void {
    this.soundEffectAudio.src = sounds.PASTE;
    this.loadAndPlay(this.soundEffectAudio);
  }

  loadAndPlay(audio: any): void {
    if (this.isSoundEnabled) {
      audio.load();
      audio.play();
    }
  }

  // Music
  startMusic(): void {
    if (this.songChoice == 0) {
      this.songAudio.pause();
    } else {
      this.songAudio.src = SONGS[this.songChoice];
      this.songAudio.load();
      this.songAudio.play();
    }
  }
}

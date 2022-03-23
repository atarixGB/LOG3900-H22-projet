import { Injectable } from '@angular/core';
import * as sounds from '@app/constants/sounds';

@Injectable({
  providedIn: 'root'
})
export class SoundEffectsService {
  soundEffectAudio: any;
  drawAudio: any;

  constructor() {
    this.soundEffectAudio = new Audio();
    this.drawAudio = new Audio(sounds.DRAW);
    this.drawAudio.loop = true;
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
    audio.load();
    audio.play();
  }
}

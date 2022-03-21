import { Injectable } from '@angular/core';
import * as sounds from '@app/constants/soundPaths';

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

  // Group 1: Success and failure
  playSuccessSound(): void {
    this.soundEffectAudio.src = sounds.SUCCESS;
    this.loadAndPlay(this.soundEffectAudio);
  }

  playFailureSound(): void {
    this.soundEffectAudio.src = sounds.FAILURE;
    this.loadAndPlay(this.soundEffectAudio);
  }

  // Group 2: Sending a message
  playSendMsgSound(): void {
    this.soundEffectAudio = new Audio(sounds.SEND_MSG);
    this.loadAndPlay(this.soundEffectAudio);
  }

  // Group 3: Editor tools
  startDrawSound(): void {
    this.loadAndPlay(this.drawAudio);
  }

  stopDrawSound(): void {
    this.drawAudio.pause();
  }

  // Group 2: Sending a message
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

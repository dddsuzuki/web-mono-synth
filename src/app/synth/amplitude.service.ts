import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AmplitudeValue {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

@Injectable()
export class AmplitudeService {
  amp: GainNode;

  private amplitudeValue = new BehaviorSubject<AmplitudeValue>({
    attack: 0,
    decay: 0,
    sustain: 1,
    release: 0,
  });

  get amplitudeValue$(): Observable<AmplitudeValue> {
    return this.amplitudeValue.asObservable();
  }

  constructor(private audioContext: AudioContext) {
    this.amp = this.audioContext.createGain();
  }

  update(value: AmplitudeValue): void {
    this.amplitudeValue.next(value);
  }

  noteOn(): void {
    this.amp.gain.cancelScheduledValues(this.audioContext.currentTime);
    if (this.amplitudeValue.value.attack === 0) {
      this.amp.gain.setValueAtTime(1, this.audioContext.currentTime);
    } else {
      this.amp.gain.setValueAtTime(0, this.audioContext.currentTime);
      this.amp.gain.linearRampToValueAtTime(
        1,
        this.audioContext.currentTime + this.amplitudeValue.value.attack,
      );
    }

    if (this.amplitudeValue.value.decay === 0) {
      this.amp.gain.setValueAtTime(
        this.amplitudeValue.value.sustain,
        this.audioContext.currentTime + this.amplitudeValue.value.attack,
      );
    } else {
      this.amp.gain.setValueCurveAtTime(
        [1, this.amplitudeValue.value.sustain],
        this.audioContext.currentTime + this.amplitudeValue.value.attack,
        this.amplitudeValue.value.decay,
      );
    }
  }

  noteOff(): void {
    this.amp.gain.cancelScheduledValues(this.audioContext.currentTime);
    this.amp.gain.setValueAtTime(
      this.amp.gain.value,
      this.audioContext.currentTime,
    );
    this.amp.gain.linearRampToValueAtTime(
      0,
      this.audioContext.currentTime + this.amplitudeValue.value.release,
    );
  }
}

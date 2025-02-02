import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface MixerValue {
  osc1: number;
  osc2: number;
  noise: number;
}

@Injectable()
export class MixerService {
  osc1Gain: GainNode;
  osc2Gain: GainNode;
  noiseGain: GainNode;

  private mixerValue = new BehaviorSubject<MixerValue>({
    osc1: 0.5,
    osc2: 0.5,
    noise: 0.5,
  });

  get mixerValue$() {
    return this.mixerValue.asObservable();
  }

  constructor(private audioContext: AudioContext) {
    this.osc1Gain = this.audioContext.createGain();
    this.osc1Gain.gain.value = this.mixerValue.value.osc1;

    this.osc2Gain = this.audioContext.createGain();
    this.osc2Gain.gain.value = this.mixerValue.value.osc2;

    this.noiseGain = this.audioContext.createGain();
    this.noiseGain.gain.value = this.mixerValue.value.noise;
  }

  update(value: MixerValue): void {
    this.mixerValue.next(value);

    this.osc1Gain.gain.value = value.osc1;
    this.osc2Gain.gain.value = value.osc2;
    this.noiseGain.gain.value = value.noise;
  }
}

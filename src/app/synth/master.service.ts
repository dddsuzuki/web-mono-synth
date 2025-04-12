import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface MasterValue {
  volume: number;
}

@Injectable()
export class MasterService {
  private masterValue = new BehaviorSubject<MasterValue>({
    volume: 1.0,
  });

  gainNode: GainNode;

  get masterValue$() {
    return this.masterValue.asObservable();
  }

  constructor(private audioContext: AudioContext) {
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
    this.gainNode.gain.value = this.masterValue.value.volume;
  }

  update(value: MasterValue): void {
    this.masterValue.next(value);
    this.gainNode.gain.value = this.masterValue.value.volume;
  }
}

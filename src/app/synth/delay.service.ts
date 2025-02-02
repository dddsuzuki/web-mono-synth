import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DelayValue {
  level: number;
  time: number;
  feedback: number;
}

@Injectable()
export class DelayService {
  private delayValue = new BehaviorSubject<DelayValue>({
    level: 0,
    time: 0,
    feedback: 0,
  });

  dryGain: GainNode;
  wetGain: GainNode;
  delay: DelayNode;
  feedback: GainNode;

  get delayValue$() {
    return this.delayValue.asObservable();
  }

  constructor(private audioContext: AudioContext) {
    this.delay = this.audioContext.createDelay();
    this.dryGain = this.audioContext.createGain();
    this.wetGain = this.audioContext.createGain();
    this.feedback = this.audioContext.createGain();

    this.dryGain.gain.value = 1;
    this.wetGain.gain.value = this.delayValue.value.level;
    this.delay.delayTime.value = this.delayValue.getValue().time;
    this.feedback.gain.value = this.delayValue.getValue().feedback;

    this.delay.connect(this.wetGain);
    this.delay.connect(this.feedback);
    this.feedback.connect(this.delay);
  }

  update(value: DelayValue): void {
    this.delayValue.next(value);
    this.wetGain.gain.value = this.delayValue.value.level;
    this.delay.delayTime.value = value.time;
    this.feedback.gain.value = value.feedback;
  }
}

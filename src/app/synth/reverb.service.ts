import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

export interface ReverbValue {
  level: number;
}

@Injectable()
export class ReverbService {
  private reverbValue = new BehaviorSubject<ReverbValue>({
    level: 0,
  });

  convolver: ConvolverNode;
  dryGain: GainNode;
  wetGain: GainNode;

  get reverbValue$() {
    return this.reverbValue.asObservable();
  }

  constructor(private audioContext: AudioContext, private http: HttpClient) {
    this.convolver = this.audioContext.createConvolver();
    this.dryGain = this.audioContext.createGain();
    this.wetGain = this.audioContext.createGain();

    this.dryGain.gain.value = 1;
    this.wetGain.gain.value = 0;

    this.convolver.connect(this.wetGain);

    this.http
      .get('/assets/ir/big_hall.wav', {
        responseType: 'arraybuffer',
      })
      .subscribe((buffer) => {
        this.audioContext.decodeAudioData(buffer, (decodedData) => {
          this.convolver.buffer = decodedData;
        });
      });
  }

  update(value: ReverbValue): void {
    this.reverbValue.next(value);
    this.wetGain.gain.value = value.level / 10;
  }
}

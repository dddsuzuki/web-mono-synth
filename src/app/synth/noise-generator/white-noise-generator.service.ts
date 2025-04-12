import { Injectable } from '@angular/core';
import { NoiseGenerator, NoiseType } from './noise-generrator-resolver.service';

@Injectable()
export class WhiteNoiseGenerator implements NoiseGenerator {
  constructor(private audioContext: AudioContext) {}

  generate(): AudioBufferSourceNode {
    const bufferSize = 2 * this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(
      1,
      bufferSize,
      this.audioContext.sampleRate,
    );
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.audioContext.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;

    return whiteNoise;
  }

  supports(type: NoiseType): boolean {
    return type === 'white';
  }
}

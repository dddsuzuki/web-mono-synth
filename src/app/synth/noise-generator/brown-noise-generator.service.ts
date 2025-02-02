import { Injectable } from '@angular/core';
import { NoiseGenerator, NoiseType } from './noise-generrator-resolver.service';

@Injectable()
export class BrownNoiseGenerator implements NoiseGenerator {
  constructor(private audioContext: AudioContext) {}

  generate(): AudioBufferSourceNode {
    const bufferSize = 2 * this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(
      1,
      bufferSize,
      this.audioContext.sampleRate,
    );
    const output = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // (roughly) compensate for gain
    }

    const brownNoise = this.audioContext.createBufferSource();
    brownNoise.buffer = buffer;
    brownNoise.loop = true;

    return brownNoise;
  }

  supports(type: NoiseType): boolean {
    return type === 'brown';
  }
}

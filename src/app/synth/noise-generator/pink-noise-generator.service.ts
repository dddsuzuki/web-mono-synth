import { Injectable } from '@angular/core';
import { NoiseGenerator, NoiseType } from './noise-generrator-resolver.service';

@Injectable()
export class PinkNoiseGenerator implements NoiseGenerator {
  constructor(private audioContext: AudioContext) {}

  generate(): AudioBufferSourceNode {
    const bufferSize = 2 * this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(
      1,
      bufferSize,
      this.audioContext.sampleRate,
    );
    const output = buffer.getChannelData(0);

    let b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11; // (roughly) compensate for gain
      b6 = white * 0.115926;
    }

    const pinkNoise = this.audioContext.createBufferSource();
    pinkNoise.buffer = buffer;
    pinkNoise.loop = true;

    return pinkNoise;
  }

  supports(type: NoiseType): boolean {
    return type === 'pink';
  }
}

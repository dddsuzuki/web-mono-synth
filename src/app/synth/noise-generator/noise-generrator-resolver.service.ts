import { Inject, Injectable, InjectionToken } from '@angular/core';

export type NoiseType = 'white' | 'pink' | 'brown';

export interface NoiseGenerator {
  generate(): AudioBufferSourceNode;
  supports(type: NoiseType): boolean;
}

export const NOISE_GENERATOR = new InjectionToken<NoiseGenerator>(
  'Noise Generator',
);

@Injectable()
export class NoiseGeneratorResolver {
  constructor(@Inject(NOISE_GENERATOR) private generators: NoiseGenerator[]) {}

  resolve(type: NoiseType): NoiseGenerator {
    const generator = this.generators.find((g) => g.supports(type));

    if (!generator) {
      throw new Error(`No generator found for type ${type}`);
    }

    return generator;
  }
}

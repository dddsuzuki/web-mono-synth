import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SynthComponent } from './synth.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MidiService } from './midi.service';
import { InputService } from './input.service';
import { OscillatorComponent } from './oscillator/oscillator.component';
import { MixerComponent } from './mixer/mixer.component';
import { NoiseComponent } from './noise/noise.component';
import {
  NoiseGeneratorResolver,
  NOISE_GENERATOR,
} from './noise-generator/noise-generrator-resolver.service';
import { WhiteNoiseGenerator } from './noise-generator/white-noise-generator.service';
import { PinkNoiseGenerator } from './noise-generator/pink-noise-generator.service';
import { BrownNoiseGenerator } from './noise-generator/brown-noise-generator.service';
import { MasterService } from './master.service';
import { FilterService } from './filter.service';
import { FilterComponent } from './filter/filter.component';
import { AmplitudeService } from './amplitude.service';
import { EnvelopeGeneratorComponent } from './envelope-generator/envelope-generator.component';
import { MixerService } from './mixer.service';
import { KeyboardService } from './keyboard.service';
import { LfoComponent } from './lfo/lfo.component';
import { ControllerComponent } from './controller/controller.component';
import { ControllerService } from './controller.service';
import { ReverbComponent } from './reverb/reverb.component';
import { ReverbService } from './reverb.service';
import { DelayComponent } from './delay/delay.component';
import { DelayService } from './delay.service';
import { MasterComponent } from './master/master.component';

@NgModule({
  declarations: [
    SynthComponent,
    OscillatorComponent,
    MixerComponent,
    NoiseComponent,
    FilterComponent,
    EnvelopeGeneratorComponent,
    LfoComponent,
    ControllerComponent,
    ReverbComponent,
    DelayComponent,
    MasterComponent,
  ],
  providers: [
    MidiService,
    KeyboardService,
    InputService,
    MasterService,
    FilterService,
    AmplitudeService,
    MixerService,
    ControllerService,
    ReverbService,
    DelayService,
    WhiteNoiseGenerator,
    PinkNoiseGenerator,
    BrownNoiseGenerator,
    NoiseGeneratorResolver,
    {
      provide: NOISE_GENERATOR,
      useClass: WhiteNoiseGenerator,
      multi: true,
    },
    {
      provide: NOISE_GENERATOR,
      useClass: PinkNoiseGenerator,
      multi: true,
    },
    {
      provide: NOISE_GENERATOR,
      useClass: BrownNoiseGenerator,
      multi: true,
    },
    {
      provide: AudioContext,
      useValue: new AudioContext(),
    },
  ],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [SynthComponent],
})
export class SynthModule {}

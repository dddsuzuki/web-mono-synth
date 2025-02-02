import { Injectable } from '@angular/core';
import { AmplitudeService } from './amplitude.service';
import { ControllerService } from './controller.service';
import { convertToFrequency } from './convert-to-frequency';
import { DelayService } from './delay.service';
import { ReverbService } from './reverb.service';
import { FilterService } from './filter.service';
import { MixerService, MixerValue } from './mixer.service';
import {
  NoiseGeneratorResolver,
  NoiseType,
} from './noise-generator/noise-generrator-resolver.service';
import { MasterService } from './master.service';

export interface Oscillator {
  type: OscillatorType;
  octave: number;
  tune: number;
  active: boolean;
}

export interface Noise {
  type: NoiseType;
  active: boolean;
}

export interface LFO {
  type: OscillatorType;
  rate: number;
  depth: number;
  target: string;
}

export interface Note {
  note: number;
  velocity: number;
  oscillators: OscillatorNode[];
  gainNodes: GainNode[];
  noise: AudioBufferSourceNode | null;
}

@Injectable()
export class SynthService {
  private oscillators: Oscillator[] = [];
  private noise: Noise;
  private lfos: LFO[] = [];

  private lfoNodes: OscillatorNode[] = [];
  private lfoGainNodes: GainNode[] = [];

  private oldNote: Note | null = null;
  private note: Note | null = null;

  private activeNotes: number[] = [];

  constructor(
    private audioContext: AudioContext,
    private noiseGeneratorResolver: NoiseGeneratorResolver,
    private mixerService: MixerService,
    private filterService: FilterService,
    private amplitudeService: AmplitudeService,
    private effectService: ReverbService,
    private delayService: DelayService,
    private outputService: MasterService,
    private controllerService: ControllerService,
  ) {
    this.oscillators[0] = {
      type: 'sawtooth',
      octave: 0,
      tune: 0,
      active: true,
    };

    this.oscillators[1] = {
      type: 'sawtooth',
      octave: 0,
      tune: 0,
      active: true,
    };

    this.noise = { type: 'white', active: false };

    this.lfos[0] = {
      type: 'sine',
      rate: 0,
      depth: 0,
      target: 'none',
    };

    this.lfos[1] = {
      type: 'sine',
      rate: 0,
      depth: 0,
      target: 'none',
    };

    this.lfos.forEach((lfo, index) => {
      this.lfoGainNodes[index] = this.audioContext.createGain();
      this.lfoGainNodes[index].gain.value = lfo.depth;

      this.lfoNodes[index] = this.audioContext.createOscillator();
      this.lfoNodes[index].type = lfo.type;
      this.lfoNodes[index].frequency.value = lfo.rate;
      this.lfoNodes[index].connect(this.lfoGainNodes[index]);
      this.lfoNodes[index].start();
    });
  }

  updateNoise(value: Noise): void {
    this.noise.type = value.type;
    this.noise.active = value.active;

    if (this.note) {
      if (this.note.noise) {
        this.note.noise.stop();
        this.note.noise.disconnect();
        this.note.noise = null;
      }

      if (this.noise.active) {
        this.note.noise = this.noiseGeneratorResolver
          .resolve(this.noise.type)
          .generate();
        this.note.noise.connect(this.mixerService.noiseGain);
        this.note.noise.start();
      }
    }
  }

  updateMixer(value: MixerValue): void {
    this.mixerService.update(value);
  }

  updateOscillator(osc: number, value: Oscillator): void {
    this.oscillators[osc].type = value.type;
    this.oscillators[osc].octave = value.octave;
    this.oscillators[osc].tune = value.tune;

    if (this.note) {
      this.note.oscillators[osc].type = this.oscillators[osc].type;
      this.note.oscillators[osc].frequency.value = convertToFrequency(
        this.note.note,
        this.oscillators[osc].octave,
      );
      this.note.oscillators[osc].detune.value = (value.tune / 7) * 1200;
    }
  }

  updateLFO(lfo: number, value: LFO): void {
    let targetChanged = false;

    this.lfos[lfo].type = value.type;
    this.lfos[lfo].rate = value.rate;
    this.lfos[lfo].depth = value.depth;

    if (this.lfos[lfo].target !== value.target) {
      this.lfos[lfo].target = value.target;
      targetChanged = true;
    }

    this.lfoNodes[lfo].type = this.lfos[lfo].type;
    this.lfoNodes[lfo].frequency.value = this.lfos[lfo].rate;

    switch (this.lfos[lfo].target) {
      case 'osc1_frequency':
        this.lfoGainNodes[lfo].gain.value = (this.lfos[lfo].depth / 100) * 200;
        break;
      case 'osc2_frequency':
        this.lfoGainNodes[lfo].gain.value = (this.lfos[lfo].depth / 100) * 200;
        break;
      case 'osc1_volume':
        this.lfoGainNodes[lfo].gain.value = (this.lfos[lfo].depth / 100) * 0.5;
        break;
      case 'osc2_volume':
        this.lfoGainNodes[lfo].gain.value = (this.lfos[lfo].depth / 100) * 0.5;
        break;
      case 'noise_volume':
        this.lfoGainNodes[lfo].gain.value = (this.lfos[lfo].depth / 100) * 0.5;
        break;
      case 'filter_cutoff':
        this.lfoGainNodes[lfo].gain.value = (this.lfos[lfo].depth / 100) * 200;
        break;
      case 'filter_resonance':
        this.lfoGainNodes[lfo].gain.value = (this.lfos[lfo].depth / 100) * 10;
        break;
    }

    if (targetChanged) {
      this.lfoGainNodes[lfo].disconnect();

      switch (this.lfos[lfo].target) {
        case 'osc1_frequency':
          if (this.note) {
            this.lfoGainNodes[lfo].connect(this.note.oscillators[0].frequency);
          }
          break;
        case 'osc2_frequency':
          if (this.note) {
            this.lfoGainNodes[lfo].connect(this.note.oscillators[1].frequency);
          }
          break;
        case 'osc1_volume':
          this.lfoGainNodes[lfo].connect(this.mixerService.osc1Gain.gain);
          break;
        case 'osc2_volume':
          this.lfoGainNodes[lfo].connect(this.mixerService.osc2Gain.gain);
          break;
        case 'noise_volume':
          this.lfoGainNodes[lfo].connect(this.mixerService.noiseGain.gain);
          break;
        case 'filter_cutoff':
          this.lfoGainNodes[lfo].connect(this.filterService.filter.frequency);
          break;
        case 'filter_resonance':
          this.lfoGainNodes[lfo].connect(this.filterService.filter.Q);
          break;
        case 'amp':
          this.lfoGainNodes[lfo].connect(this.amplitudeService.amp.gain);
          break;
      }
    }
  }

  noteOn(note: number, velocity: number, hanasi?: boolean): void {
    if (this.note && this.note.note === note) {
      return;
    }

    let graidNote: number | null = null;
    if (this.note && this.note.note !== note) {
      graidNote = this.note.note;

      if (!hanasi) {
        this.activeNotes.push(this.note.note);
      }

      this.note!.oscillators.forEach((oscillator) => {
        oscillator.stop();
        oscillator.disconnect();
      });

      this.note!.gainNodes.forEach((gainNode) => {
        gainNode.disconnect();
      });

      const noise = this.note!.noise;
      if (noise) {
        noise.stop();
        noise.disconnect();
        this.note!.noise = null;
      }

      this.note = null;
    }

    if (this.oldNote) {
      this.oldNote!.oscillators.forEach((oscillator) => {
        oscillator.stop();
        oscillator.disconnect();
      });

      this.oldNote!.gainNodes.forEach((gainNode) => {
        gainNode.disconnect();
      });

      const noise = this.oldNote!.noise;
      if (noise) {
        noise.stop();
        noise.disconnect();
        this.oldNote!.noise = null;
      }

      this.oldNote = null;
    }

    const convolver = this.effectService.convolver;
    const dryGain = this.effectService.dryGain;
    const wetGain = this.effectService.wetGain;
    dryGain.connect(this.outputService.gainNode);
    wetGain.connect(this.outputService.gainNode);

    const delay = this.delayService.delay;
    const delayDryGain = this.delayService.dryGain;
    const delayWetGain = this.delayService.wetGain;
    delayDryGain.connect(dryGain);
    delayWetGain.connect(dryGain);
    delayDryGain.connect(convolver);
    delayWetGain.connect(convolver);

    const amp = this.amplitudeService.amp;
    amp.connect(delay);
    amp.connect(delayDryGain);

    const filter = this.filterService.filter;
    filter.connect(amp);

    this.mixerService.osc1Gain.connect(filter);
    this.mixerService.osc2Gain.connect(filter);
    this.mixerService.noiseGain.connect(filter);

    const gainNodes: GainNode[] = [];
    const oscillators: OscillatorNode[] = [];
    this.oscillators.forEach((oscillator, index: number) => {
      const noteGainNode = this.audioContext.createGain();
      noteGainNode.gain.value = velocity;

      const oscillatorNode = this.audioContext.createOscillator();
      oscillatorNode.type = oscillator.type;

      if (graidNote) {
        oscillatorNode.frequency.value = convertToFrequency(
          graidNote,
          oscillator.octave,
        );
        oscillatorNode.frequency.cancelScheduledValues(
          this.audioContext.currentTime,
        );
        oscillatorNode.frequency.linearRampToValueAtTime(
          convertToFrequency(note, oscillator.octave),
          this.audioContext.currentTime + this.controllerService.getGlide(),
        );
      } else {
        oscillatorNode.frequency.value = convertToFrequency(
          note,
          oscillator.octave,
        );
      }

      this.amplitudeService.noteOn();

      oscillatorNode.detune.value = (oscillator.tune / 7) * 1200;
      oscillatorNode.connect(noteGainNode);

      if (index === 0) {
        noteGainNode.connect(this.mixerService.osc1Gain);
      } else if (index === 1) {
        noteGainNode.connect(this.mixerService.osc2Gain);
      }

      if (index === 0) {
        if (this.lfos[0].target === 'osc1_frequency') {
          this.lfoGainNodes[0].connect(oscillatorNode.frequency);
        }
        if (this.lfos[1].target === 'osc1_frequency') {
          this.lfoGainNodes[1].connect(oscillatorNode.frequency);
        }
      } else if (index === 1) {
        if (this.lfos[0].target === 'osc2_frequency') {
          this.lfoGainNodes[0].connect(oscillatorNode.frequency);
        }
        if (this.lfos[1].target === 'osc2_frequency') {
          this.lfoGainNodes[1].connect(oscillatorNode.frequency);
        }
      }

      oscillatorNode.start();

      oscillators.push(oscillatorNode);
      gainNodes.push(noteGainNode);
    });

    // noise
    let noise = null;

    if (this.noise.active) {
      noise = this.noiseGeneratorResolver.resolve(this.noise.type).generate();
      noise.connect(this.mixerService.noiseGain);
      noise.start();
    }

    this.note = {
      note,
      velocity,
      oscillators,
      gainNodes,
      noise,
    };
  }

  noteOff(note: number): void {
    this.activeNotes = this.activeNotes.filter(
      (activeNote) => activeNote !== note,
    );

    if (this.note && this.note.note === note) {
      if (this.activeNotes.length > 0) {
        this.activeNotes.slice(this.activeNotes.length - 1, 1);
        this.noteOn(
          this.activeNotes[this.activeNotes.length - 1],
          this.note.velocity,
          true,
        );
      } else {
        this.oldNote = this.note;
        this.note = null;
        this.amplitudeService.noteOff();
      }
    }
  }
}

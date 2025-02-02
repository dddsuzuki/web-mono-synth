import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { AmplitudeService, AmplitudeValue } from './amplitude.service';
import { ControllerService, ControllerValue } from './controller.service';
import { DelayService, DelayValue } from './delay.service';
import { ReverbService, ReverbValue } from './reverb.service';
import { FilterService, FilterValue } from './filter.service';
import { InputService } from './input.service';
import { MidiService } from './midi.service';
import { MixerService, MixerValue } from './mixer.service';
import { MasterService, MasterValue } from './master.service';
import { LFO, Noise, Oscillator, SynthService } from './synth.service';

@Component({
  selector: 'app-synth',
  templateUrl: './synth.component.html',
  providers: [SynthService, MidiService],
  standalone: false,
})
export class SynthComponent implements OnInit, OnDestroy {
  filterValue: FilterValue | null = null;
  amplitudeValue: AmplitudeValue | null = null;
  mixerValue: MixerValue | null = null;
  controllerValue: ControllerValue | null = null;
  reverbValue: ReverbValue | null = null;
  delayValue: DelayValue | null = null;
  masterValue: MasterValue | null = null;

  private destroy = new EventEmitter();

  constructor(
    private synthService: SynthService,
    private masterService: MasterService,
    private filterService: FilterService,
    private amplitudeService: AmplitudeService,
    private inputService: InputService,
    private mixerService: MixerService,
    private controllerService: ControllerService,
    private reverbService: ReverbService,
    private delayService: DelayService,
  ) {}

  ngOnInit(): void {
    this.inputService.inputEvent$.subscribe((event) => {
      if (event.type === 'on') {
        this.synthService.noteOn(event.note, event.velocity);
      }
      if (event.type === 'off') {
        this.synthService.noteOff(event.note);
      }
    });

    this.filterService.filterValue$
      .pipe(takeUntil(this.destroy))
      .subscribe((value) => {
        this.filterValue = value;
      });

    this.amplitudeService.amplitudeValue$
      .pipe(takeUntil(this.destroy))
      .subscribe((value) => {
        this.amplitudeValue = value;
      });

    this.mixerService.mixerValue$
      .pipe(takeUntil(this.destroy))
      .subscribe((value) => {
        this.mixerValue = value;
      });

    this.masterService.masterValue$
      .pipe(takeUntil(this.destroy))
      .subscribe((value) => {
        this.masterValue = value;
      });

    this.controllerService.controllerValue$
      .pipe(takeUntil(this.destroy))
      .subscribe((value) => {
        this.controllerValue = value;
      });

    this.reverbService.reverbValue$
      .pipe(takeUntil(this.destroy))
      .subscribe((value) => {
        this.reverbValue = value;
      });

    this.delayService.delayValue$
      .pipe(takeUntil(this.destroy))
      .subscribe((value) => {
        this.delayValue = value;
      });
  }

  ngOnDestroy(): void {
    this.destroy.emit();
  }

  updateOscillator(index: number, value: Oscillator): void {
    this.synthService.updateOscillator(index, value);
  }

  updateLfo(index: number, value: LFO): void {
    this.synthService.updateLFO(index, value);
  }

  updateNoise(value: Noise): void {
    this.synthService.updateNoise(value);
  }

  updateMixer(value: MixerValue): void {
    this.synthService.updateMixer(value);
  }

  updateFilter(value: FilterValue): void {
    this.filterService.updateFilter(value);
  }

  updateAmplitude(value: AmplitudeValue): void {
    this.amplitudeService.update(value);
  }

  updateController(value: ControllerValue): void {
    this.controllerService.update(value);
  }

  updateReverb(value: ReverbValue): void {
    this.reverbService.update(value);
  }

  updateDelay(value: DelayValue): void {
    this.delayService.update(value);
  }

  updateMaster(value: MasterValue): void {
    this.masterService.update(value);
  }
}

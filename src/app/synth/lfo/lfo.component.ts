import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-lfo',
  templateUrl: './lfo.component.html',
  standalone: false,
})
export class LfoComponent {
  lfoForm: FormGroup;
  waveformOptions = ['sine', 'square', 'sawtooth', 'triangle'];
  targetOptions = [
    'none',
    'osc1_frequency',
    'osc2_frequency',
    'osc1_volume',
    'osc2_volume',
    'noise_volume',
    'filter_cutoff',
    'filter_resonance',
  ];

  @Output() update = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.lfoForm = this.formBuilder.group({
      type: 'sine',
      rate: 0,
      depth: 0,
      target: 'none',
    });

    this.lfoForm.valueChanges.subscribe((value) => {
      this.update.emit(value);
    });
  }
}

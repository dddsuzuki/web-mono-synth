import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-oscillator',
  templateUrl: './oscillator.component.html',
  standalone: false,
})
export class OscillatorComponent {
  oscillatorForm: FormGroup;
  oscillatorTypeOptions = ['sine', 'square', 'sawtooth', 'triangle'];

  @Output() update = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.oscillatorForm = this.formBuilder.group({
      type: 'sawtooth',
      octave: 0,
      tune: 0,
    });

    this.oscillatorForm.valueChanges.subscribe((value) => {
      this.update.emit(value);
    });
  }
}

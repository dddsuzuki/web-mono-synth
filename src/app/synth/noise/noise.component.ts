import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Noise } from '../synth.service';

@Component({
  selector: 'app-noise',
  templateUrl: './noise.component.html',
  standalone: false,
})
export class NoiseComponent {
  noiseForm: FormGroup;
  noiseTypeOptions = ['white', 'pink', 'brown'];

  @Output() update = new EventEmitter<Noise>();

  constructor(private formBuilder: FormBuilder) {
    this.noiseForm = this.formBuilder.group({
      type: 'white',
      active: false,
    });

    this.noiseForm.valueChanges.subscribe((value) => {
      this.update.emit(value);
    });
  }
}

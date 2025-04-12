import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AmplitudeValue } from '../amplitude.service';

@Component({
  selector: 'app-envelope-generator',
  templateUrl: './envelope-generator.component.html',
  standalone: false,
})
export class EnvelopeGeneratorComponent {
  egForm: FormGroup;

  @Input() set value(value: AmplitudeValue | null) {
    if (value === null) {
      return;
    }

    this.egForm.patchValue(value);
  }

  @Output() update = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.egForm = this.formBuilder.group({
      attack: 0.5,
      decay: 0.5,
      sustain: 0.5,
      release: 0.5,
    });

    this.egForm.valueChanges.subscribe((value) => {
      this.update.emit(value);
    });
  }
}

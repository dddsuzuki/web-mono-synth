import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MixerValue } from '../mixer.service';

@Component({
  selector: 'app-mixer',
  templateUrl: './mixer.component.html',
  standalone: false,
})
export class MixerComponent {
  mixerForm: FormGroup;

  @Input() set value(value: MixerValue) {
    this.mixerForm.setValue(value, { emitEvent: false });
  }
  @Output() update = new EventEmitter<MixerValue>();

  constructor(private formBuilder: FormBuilder) {
    this.mixerForm = this.formBuilder.group({
      osc1: 0.5,
      osc2: 0.5,
      noise: 0.5,
    });

    this.mixerForm.valueChanges.subscribe((value) => {
      this.update.emit(value);
    });
  }
}

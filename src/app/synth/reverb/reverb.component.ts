import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReverbValue } from '../reverb.service';

@Component({
  selector: 'app-reverb',
  templateUrl: './reverb.component.html',
  standalone: false,
})
export class ReverbComponent {
  reverbForm: FormGroup;

  @Input() set value(value: ReverbValue | null) {
    if (value === null) {
      return;
    }

    this.reverbForm.patchValue(value);
  }

  @Output() update = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.reverbForm = this.formBuilder.group({
      level: 0.0,
    });

    this.reverbForm.valueChanges.subscribe((value) => {
      this.update.emit(value);
    });
  }
}

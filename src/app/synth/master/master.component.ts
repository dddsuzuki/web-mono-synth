import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MasterValue } from '../master.service';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  standalone: false,
})
export class MasterComponent {
  masterGainForm: FormGroup;

  @Input() set value(value: MasterValue | null) {
    if (value === null) {
      return;
    }

    this.masterGainForm.patchValue(value);
  }

  @Output() update = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.masterGainForm = this.formBuilder.group({
      volume: 0.0,
    });

    this.masterGainForm.valueChanges.subscribe((value) => {
      this.update.emit(value);
    });
  }
}

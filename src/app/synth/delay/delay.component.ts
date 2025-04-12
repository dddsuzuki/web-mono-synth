import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DelayValue } from '../delay.service';

@Component({
  selector: 'app-delay',
  templateUrl: './delay.component.html',
  standalone: false,
})
export class DelayComponent {
  delayForm: FormGroup;

  @Input() set value(value: DelayValue | null) {
    if (value === null) {
      return;
    }

    this.delayForm.patchValue(value);
  }

  @Output() update = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.delayForm = this.formBuilder.group({
      level: 0,
      time: 0,
      feedback: 0,
    });

    this.delayForm.valueChanges.subscribe((value) => {
      this.update.emit(value);
    });
  }
}

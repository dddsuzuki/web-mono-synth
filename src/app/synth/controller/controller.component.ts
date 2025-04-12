import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ControllerValue } from '../controller.service';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  standalone: false,
})
export class ControllerComponent {
  controllerForm: FormGroup;

  @Input() set value(value: ControllerValue | null) {
    if (value === null) {
      return;
    }

    this.controllerForm.patchValue(value);
  }

  @Output() update = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.controllerForm = this.formBuilder.group({
      glide: 0.1,
    });

    this.controllerForm.valueChanges.subscribe((value) => {
      this.update.emit(value);
    });
  }
}

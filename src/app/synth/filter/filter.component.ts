import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterValue } from '../filter.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  standalone: false,
})
export class FilterComponent {
  filterForm: FormGroup;
  filterTypeOptions = [
    'lowpass',
    'highpass',
    'bandpass',
    'lowshelf',
    'highshelf',
    'peaking',
    'notch',
    'allpass',
  ];

  @Input() set value(value: FilterValue | null) {
    if (value === null) {
      return;
    }

    this.filterForm.patchValue(value);
  }

  @Output() update = new EventEmitter<FilterValue>();

  constructor(private formBuilder: FormBuilder) {
    this.filterForm = this.formBuilder.group({
      type: 'lowpass',
      frequency: 1,
      q: 1,
    });

    this.filterForm.valueChanges.subscribe((value) => {
      this.update.emit(value);
    });
  }
}

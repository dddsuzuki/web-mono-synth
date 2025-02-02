import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type FilterType = BiquadFilterType;

export interface FilterValue {
  type: FilterType;
  frequency: number;
  q: number;
}

@Injectable()
export class FilterService {
  filter: BiquadFilterNode;

  private filterValue = new BehaviorSubject<FilterValue>({
    type: 'lowpass',
    frequency: 1000,
    q: 1,
  });

  get filterValue$(): Observable<FilterValue> {
    return this.filterValue.asObservable();
  }

  constructor(private audioContext: AudioContext) {
    this.filter = this.audioContext.createBiquadFilter();
  }

  updateFilter(value: FilterValue): void {
    this.filterValue.next({
      type: value.type,
      frequency: value.frequency,
      q: value.q,
    });

    this.filter.type = this.filterValue.value.type;
    this.filter.frequency.value = this.filterValue.value.frequency;
    this.filter.Q.value = this.filterValue.value.q;
  }
}

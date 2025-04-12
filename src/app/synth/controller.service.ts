import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ControllerValue {
  glide: number;
}

@Injectable()
export class ControllerService {
  private controllerValue = new BehaviorSubject<ControllerValue>({
    glide: 0.1,
  });

  get controllerValue$() {
    return this.controllerValue.asObservable();
  }

  getGlide(): number {
    return this.controllerValue.getValue().glide;
  }

  update(value: ControllerValue): void {
    this.controllerValue.next(value);
  }
}

import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KeyboardService } from './keyboard.service';
import { MidiService } from './midi.service';

export type InputEventType = 'on' | 'off';

export interface InputEvent {
  type: InputEventType;
  note: number;
  velocity: number;
}

export interface Key {
  note: number;
  velocity: number;
}

@Injectable()
export class InputService {
  private notes: Key[] = [];

  private inputEvent = new EventEmitter<InputEvent>();

  get inputEvent$(): Observable<InputEvent> {
    return this.inputEvent.asObservable();
  }

  constructor(
    private midiService: MidiService,
    private keyboardService: KeyboardService,
  ) {
    for (let i = 0; i < 128; i++) {
      this.notes.push({
        note: i,
        velocity: 0,
      });
    }

    this.midiService.noteEvent$.subscribe((event) => {
      if (event.type === 'on') {
        this.noteOn(event.note, event.velocity);
      }
    });

    this.midiService.noteEvent$.subscribe((event) => {
      if (event.type === 'off') {
        this.noteOff(event.note, event.velocity);
      }
    });

    this.keyboardService.noteEvent$.subscribe((event) => {
      if (event.type === 'on') {
        this.noteOn(event.note, event.velocity);
      }
    });

    this.keyboardService.noteEvent$.subscribe((event) => {
      if (event.type === 'off') {
        this.noteOff(event.note, event.velocity);
      }
    });
  }

  noteOn(note: number, velocity: number): void {
    this.inputEvent.emit({ type: 'on', note, velocity });
  }

  noteOff(note: number, velocity: number): void {
    this.inputEvent.emit({ type: 'off', note, velocity });
  }
}

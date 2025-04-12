import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type NoteEventType = 'on' | 'off';

export interface NoteEvent {
  type: NoteEventType;
  note: number;
  velocity: number;
}

@Injectable()
export class KeyboardService {
  private noteEvent = new EventEmitter<NoteEvent>();

  get noteEvent$(): Observable<NoteEvent> {
    return this.noteEvent.asObservable();
  }

  constructor() {
    window.addEventListener('keydown', (event) => {
      this.handleKeyboardEvent(event);
    });

    window.addEventListener('keyup', (event) => {
      this.handleKeyboardEvent(event);
    });
  }

  handleKeyboardEvent(event: KeyboardEvent): void {
    const { type, note } = this.parseKeyboardEvent(event);

    if (note === null) {
      return;
    }

    if (type === 'keydown') {
      this.noteOn(note, 1);
    } else if (type === 'keyup') {
      this.noteOff(note, 1);
    }
  }

  noteOn(note: number, velocity: number): void {
    this.noteEvent.emit({ type: 'on', note, velocity });
  }

  noteOff(note: number, velocity: number): void {
    this.noteEvent.emit({ type: 'off', note, velocity });
  }

  parseKeyboardEvent(event: KeyboardEvent) {
    event.preventDefault();

    const table = [
      { key: 'z', note: 60 },
      { key: 's', note: 61 },
      { key: 'x', note: 62 },
      { key: 'd', note: 63 },
      { key: 'c', note: 64 },
      { key: 'v', note: 65 },
      { key: 'g', note: 66 },
      { key: 'b', note: 67 },
      { key: 'h', note: 68 },
      { key: 'n', note: 69 },
      { key: 'j', note: 70 },
      { key: 'm', note: 71 },
      { key: ',', note: 72 },
    ];

    const key = event.key.toLowerCase();
    const note = table.find((item) => item.key === key)?.note || null;

    return {
      type: event.type,
      note,
    };
  }
}

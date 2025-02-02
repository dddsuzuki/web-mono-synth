import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface MidiMessage {
  command: number;
  channel: number;
  note: number;
  velocity: number;
}

export type NoteEventType = 'on' | 'off';

export interface NoteEvent {
  type: NoteEventType;
  note: number;
  velocity: number;
}

@Injectable()
export class MidiService {
  private midiAccess: WebMidi.MIDIAccess | null = null;

  private noteEvent = new EventEmitter<NoteEvent>();

  get noteEvent$(): Observable<NoteEvent> {
    return this.noteEvent.asObservable();
  }

  constructor() {
    if (window.navigator.requestMIDIAccess === undefined) {
      return;
    }

    window.navigator.requestMIDIAccess().then((midi) => {
      this.midiAccess = midi;
      this.midiAccess.inputs.forEach((input) => {
        input.onmidimessage = (event) => {
          this.handleMidiMessage(event);
        };
      });
    }, console.error);
  }

  handleMidiMessage(event: WebMidi.MIDIMessageEvent): void {
    const { command, channel, note, velocity } = this.parseMidiMessage(event);

    // Stop command.
    // Negative velocity is an upward release rather than a downward press.
    if (command === 8) {
      if (channel === 0) {
        this.noteOff(note, -velocity);
      } else if (channel === 9) {
        // onPad(note, -velocity);
      }
    }

    // Start command.
    else if (command === 9) {
      if (channel === 0) {
        this.noteOn(note, velocity);
      } else if (channel === 9) {
        // onPad(note, velocity);
      }
    }

    // Knob command.
    else if (command === 11) {
      // if (note === 1) onModWheel(velocity);
    }

    // Pitch bend command.
    else if (command === 14) {
      // onPitchBend(velocity);
    }
  }

  noteOn(note: number, velocity: number): void {
    this.noteEvent.emit({ type: 'on', note, velocity });
  }

  noteOff(note: number, velocity: number): void {
    this.noteEvent.emit({ type: 'off', note, velocity });
  }

  parseMidiMessage(event: WebMidi.MIDIMessageEvent): MidiMessage {
    return {
      command: event.data[0] >> 4,
      channel: event.data[0] & 0xf,
      note: event.data[1],
      velocity: event.data[2] / 127,
    };
  }
}

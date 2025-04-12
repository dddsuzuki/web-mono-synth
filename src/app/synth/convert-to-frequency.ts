const baseFrequency = 440;
const baseNote = 69;

export const convertToFrequency = (note: number, octave: number) => {
  const noteDiff = note - baseNote + octave * 12;
  const frequency = Math.pow(2, noteDiff / 12) * baseFrequency;

  return frequency;
};

export const calcOctaveFrequency = (frequency: number, octave: number) => {
  return frequency * Math.pow(2, octave);
};

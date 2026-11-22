// An original, slow four chord loop with room between the melody notes.
const chords = [[48,55,59,64],[45,52,55,60],[53,60,64,69],[43,50,55,62]];
const melody = [72,null,76,79,null,76,74,null,72,null,69,72,null,76,null,null,
  77,null,76,72,null,69,72,null,74,null,71,67,null,71,null,null];
const hz = midi => 440 * 2 ** ((midi - 69) / 12);
export const beatLength = 60 / 72;

export function musicBeat(index, note) {
  const chord = chords[Math.floor(index / 8) % chords.length];
  if (index % 8 === 0) {
    chord.forEach((pitch,i)=>note(hz(pitch),5.8,.009,'sine',i*.045));
  }
  note(hz(chord[index % 4]+12),1.2,.008,'triangle',0);
  const pitch = melody[index % melody.length];
  if (pitch) note(hz(pitch),1.5,.012,'sine',.12);
}

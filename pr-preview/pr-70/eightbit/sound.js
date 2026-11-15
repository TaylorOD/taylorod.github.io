// Sounds are synthesized locally and only start after the visitor opts in.
export class Sound {
  enabled = false;
  lastStep = 0;
  async toggle() {
    if (this.enabled) { this.enabled = false; await this.context?.suspend(); return false; }
    const AudioContext = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioContext) return false;
    this.context ||= new AudioContext(); await this.context.resume(); this.enabled = true; this.chime(); return true;
  }
  note(frequency, duration = .1, gain = .025, type = 'sine', delay = 0) {
    if (!this.enabled || this.context.state !== 'running') return;
    const time = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator(), volume = this.context.createGain();
    oscillator.type = type; oscillator.frequency.value = frequency;
    volume.gain.setValueAtTime(0, time); volume.gain.linearRampToValueAtTime(gain, time + .01); volume.gain.exponentialRampToValueAtTime(.001, time + duration);
    oscillator.connect(volume); volume.connect(this.context.destination); oscillator.start(time); oscillator.stop(time + duration);
  }
  chime() { this.note(523, .22); this.note(659, .22, .018, 'sine', .08); this.note(784, .3, .015, 'sine', .16); }
  step(time, room) { if (time - this.lastStep > 230) { this.note(room === 'town' ? 110 : 165, .05, .008, 'triangle'); this.lastStep = time; } }
}

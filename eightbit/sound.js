import { musicBeat, beatLength } from './music.js';
import { scoutMoment } from './scout.js';

// Sounds are synthesized locally and only start after the visitor opts in.
export class Sound {
  enabled = false;
  lastStep = 0;
  room = 'town';
  constructor() {
    document.addEventListener('visibilitychange', () => {
      if (!this.context) return;
      if (document.hidden) this.context.suspend();
      else if (this.enabled) this.context.resume();
    });
  }
  setRoom(room) {
    this.room = room;
    if (!this.ambientGain) return;
    this.ambientGain.gain.setTargetAtTime(room === 'town' ? .014 : room === 'arcade' ? .004 : .002, this.context.currentTime, .4);
    this.ambientFilter.frequency.setTargetAtTime(room === 'town' ? 700 : 180, this.context.currentTime, .4);
  }
  position(room, player, lifeTime = 0) {
    if (!this.enabled || !this.ambientGain) return;
    this.playMusic();
    this.scoutVoice(room, player, lifeTime);
    const strength = room === 'town' ? Math.max(0, 1 - Math.abs(player.y - 640) / 320) : 0;
    const volume = room === 'town' ? .003 + strength * .018 : room === 'arcade' ? .004 : .002;
    this.ambientGain.gain.setTargetAtTime(volume, this.context.currentTime, .2);
  }
  playMusic() {
    if (this.context.state !== 'running' || this.context.currentTime < (this.nextBeat || 0)) return;
    musicBeat(this.musicIndex || 0, (...args) => this.note(...args));
    this.musicIndex = ((this.musicIndex || 0) + 1) % 32;
    this.nextBeat = this.context.currentTime + beatLength;
  }
  scoutVoice(room, player, lifeTime) {
    if (room !== 'town' || lifeTime < (this.nextWoof || 0)) return;
    const scout = scoutMoment(lifeTime);
    if (!scout.walking || scout.indoors || scout.vertical || Math.hypot(scout.x-player.x, scout.y-player.y)>430) return;
    this.nextWoof = lifeTime + 11500;
    this.woof(0); this.woof(.25);
  }
  woof(delay) {
    const time=this.context.currentTime+delay;
    const voice=this.context.createOscillator(), filter=this.context.createBiquadFilter(), gain=this.context.createGain();
    voice.type='sawtooth';voice.frequency.setValueAtTime(160,time);voice.frequency.exponentialRampToValueAtTime(75,time+.16);
    filter.type='lowpass';filter.frequency.value=600;filter.Q.value=1;
    gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(.035,time+.025);gain.gain.exponentialRampToValueAtTime(.0001,time+.18);
    voice.connect(filter);filter.connect(gain);gain.connect(this.context.destination);
    voice.onended=()=>{voice.disconnect();filter.disconnect();gain.disconnect();};
    voice.start(time);voice.stop(time+.2);
  }
  startAmbience() {
    if (this.ambientGain) return;
    const buffer = this.context.createBuffer(1, this.context.sampleRate * 3, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    let seed = 13;
    for (let i = 0; i < data.length; i++) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      data[i] = seed / 2147483648 - 1;
    }
    const source = this.context.createBufferSource(); source.buffer = buffer; source.loop = true;
    this.ambientFilter = this.context.createBiquadFilter(); this.ambientFilter.type = 'lowpass';
    this.ambientGain = this.context.createGain(); this.ambientGain.gain.value = 0;
    source.connect(this.ambientFilter); this.ambientFilter.connect(this.ambientGain); this.ambientGain.connect(this.context.destination);
    source.start(); this.setRoom(this.room);
  }
  async toggle() {
    if (this.enabled) { this.enabled = false; await this.context?.suspend(); return false; }
    const AudioContext = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioContext) return false;
    this.context ||= new AudioContext(); await this.context.resume(); this.enabled = true; this.startAmbience(); this.chime(); return true;
  }
  note(frequency, duration = .1, gain = .025, type = 'sine', delay = 0) {
    if (!this.enabled || this.context.state !== 'running') return;
    const time = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator(), volume = this.context.createGain();
    oscillator.type = type; oscillator.frequency.value = frequency;
    volume.gain.setValueAtTime(0, time); volume.gain.linearRampToValueAtTime(gain, time + .01); volume.gain.exponentialRampToValueAtTime(.001, time + duration);
    oscillator.connect(volume); volume.connect(this.context.destination); oscillator.onended = () => { oscillator.disconnect(); volume.disconnect(); }; oscillator.start(time); oscillator.stop(time + duration);
  }
  chime() { this.note(523, .22); this.note(659, .22, .018, 'sine', .08); this.note(784, .3, .015, 'sine', .16); }
  step(time, room) { if (time - this.lastStep > 230) { this.note(room === 'town' ? 110 : 165, .05, .008, 'triangle'); this.lastStep = time; } }
}

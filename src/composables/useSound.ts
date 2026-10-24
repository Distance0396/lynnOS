// WebAudio 提示音（音色/时值逐项对照旧 atmosphere.ts），全部受 soundEnabled 门控
import { useSettingsStore } from '../stores/settings';

let ctx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!)();
    } catch {
      ctx = null;
    }
  }
  return ctx;
}

function tone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.08) {
  if (!useSettingsStore().soundEnabled) return;
  const audio = getAudioCtx();
  if (!audio) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(audio.currentTime);
  osc.stop(audio.currentTime + duration);
}

function pair(first: () => void, second: () => void, delayMs: number) {
  first();
  setTimeout(second, delayMs);
}

export function useSound() {
  return {
    click: () => tone(800, 0.05, 'square', 0.04),
    open: () => pair(() => tone(520, 0.12, 'sine', 0.06), () => tone(780, 0.15, 'sine', 0.06), 80),
    close: () => pair(() => tone(600, 0.1, 'sine', 0.05), () => tone(400, 0.12, 'sine', 0.04), 60),
    error: () => pair(() => tone(320, 0.15, 'square', 0.06), () => tone(250, 0.2, 'square', 0.05), 150),
    startup: () => [523, 659, 784, 1047].forEach((freq, i) => setTimeout(() => tone(freq, 0.3, 'sine', 0.05), i * 120)),
  };
}

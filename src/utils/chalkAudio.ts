// Web Audio API procedural sound effects for realistic chalk writing, tapping, and board erasing.
// 100% self-contained, no external mp3 assets needed.

class ChalkAudioEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;
  private noiseBuffer: AudioBuffer | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.generateNoiseBuffer();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private generateNoiseBuffer() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of pink/filtered noise
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2) * 0.06; // Soft gentle chalk grit
    }
    this.noiseBuffer = buffer;
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  // Play a brief scratch sound like chalk writing a stroke on slate
  public playChalkStroke(durationMs: number = 80) {
    if (!this.isEnabled) return;
    try {
      const ctx = this.initContext();
      if (!ctx || !this.noiseBuffer) return;

      const source = ctx.createBufferSource();
      source.buffer = this.noiseBuffer;

      // Bandpass filter to mimic high-frequency dry friction of calcium carbonate chalk
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2200 + Math.random() * 800, ctx.currentTime);
      filter.Q.setValueAtTime(3.5, ctx.currentTime);

      const gain = ctx.createGain();
      const startTime = ctx.currentTime;
      const durationSec = durationMs / 1000;
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.04, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + durationSec);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      const offset = Math.random() * 1.5;
      source.start(startTime, offset, durationSec);
    } catch {
      // Audio failure should never break UI
    }
  }

  // Play chalk tapping on chalkboard (e.g. for equations, bullet points, dots)
  public playChalkTap() {
    if (!this.isEnabled) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(680 + Math.random() * 120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }

  // Play felt eraser sweep across chalkboard (cleaning the board)
  public playEraserSweep() {
    if (!this.isEnabled) return;
    try {
      const ctx = this.initContext();
      if (!ctx || !this.noiseBuffer) return;

      const source = ctx.createBufferSource();
      source.buffer = this.noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(1400, ctx.currentTime + 0.25);
      filter.frequency.linearRampToValueAtTime(700, ctx.currentTime + 0.5);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.005, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.15);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.55);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start(ctx.currentTime, 0, 0.55);
    } catch {}
  }
}

export const chalkAudio = new ChalkAudioEngine();

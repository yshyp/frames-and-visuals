/**
 * Realistic procedural audio synthesis using Web Audio API
 * Generates an authentic tactile paper rustle, book cover resonance,
 * and cinematic ambient atmospheric soundscape without relying on external mp3 files.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private ambientNoiseSource: AudioBufferSourceNode | null = null;
  private ambientOsc: OscillatorNode | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAmbientSoundscape();
    } else {
      this.startAmbientSoundscape();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Start soft, cinematic analog ambient drone (warm oceanic breeze / gentle film projector hum)
   */
  public startAmbientSoundscape() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || this.ambientGain) return;

      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 3.0);
      masterGain.connect(this.ctx.destination);
      this.ambientGain = masterGain;

      // Gentle low frequency warm drone
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A

      const oscFilter = this.ctx.createBiquadFilter();
      oscFilter.type = 'lowpass';
      oscFilter.frequency.setValueAtTime(120, this.ctx.currentTime);

      const oscGain = this.ctx.createGain();
      oscGain.gain.setValueAtTime(0.15, this.ctx.currentTime);

      osc.connect(oscFilter);
      oscFilter.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();
      this.ambientOsc = osc;

      // Soft wind / air hiss using filtered noise
      const bufferSize = this.ctx.sampleRate * 4;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
      noiseFilter.Q.setValueAtTime(0.8, this.ctx.currentTime);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);
      noiseSource.start();
      this.ambientNoiseSource = noiseSource;
    } catch {
      // Audio autoplay policy fails gracefully
    }
  }

  public stopAmbientSoundscape() {
    if (!this.ambientGain || !this.ctx) return;
    try {
      this.ambientGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 1.0);
      setTimeout(() => {
        try {
          if (this.ambientOsc) {
            this.ambientOsc.stop();
            this.ambientOsc.disconnect();
            this.ambientOsc = null;
          }
          if (this.ambientNoiseSource) {
            this.ambientNoiseSource.stop();
            this.ambientNoiseSource.disconnect();
            this.ambientNoiseSource = null;
          }
          if (this.ambientGain) {
            this.ambientGain.disconnect();
            this.ambientGain = null;
          }
        } catch {
          // ignore
        }
      }, 1100);
    } catch {
      // ignore
    }
  }

  /**
   * Synthesize crisp, soft physical paper turn rustle
   */
  public playPageTurn() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const duration = 0.42;
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let b0 = 0,
        b1 = 0,
        b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + white * 0.05;
        b1 = 0.963 * b1 + white * 0.11;
        b2 = 0.57 * b2 + white * 0.55;
        const pink = b0 + b1 + b2 + white * 0.2;
        const progress = i / bufferSize;
        const env = Math.sin(progress * Math.PI) * Math.pow(1 - progress, 0.4);
        data[i] = pink * env * 0.18;
      }

      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = buffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1400, this.ctx.currentTime);
      bandpass.frequency.exponentialRampToValueAtTime(
        800,
        this.ctx.currentTime + duration
      );
      bandpass.Q.setValueAtTime(1.2, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.65, this.ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + duration
      );

      noiseNode.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.ctx.destination);

      noiseNode.start();
    } catch {
      // Audio playback fails gracefully
    }
  }

  /**
   * Synthesize heavy book cover opening / closing thud & spine creak
   */
  public playCoverMovement(action: 'open' | 'close') {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      if (action === 'open') {
        osc.frequency.setValueAtTime(80, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(
          45,
          this.ctx.currentTime + 0.35
        );
      } else {
        osc.frequency.setValueAtTime(60, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(
          35,
          this.ctx.currentTime + 0.25
        );
      }

      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.35, this.ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + 0.35
      );

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.36);

      this.playPageTurn();
    } catch {
      // Fail silently
    }
  }
}

export const soundManager = new SoundController();

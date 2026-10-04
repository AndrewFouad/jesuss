// Web Audio API Synthesizer for Islamic Chimes & Takbeer harmonic tones
class AudioAdhanSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play gentle bell/adhan tone for prayer notification
  public playAdhanChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Sequence representing the traditional Maqam Bayati tone intervals (D, F, G, A, G, F, E-half-flat, D)
      const notes = [
        { freq: 293.66, duration: 0.9, gain: 0.4 }, // D4 (Allahu)
        { freq: 349.23, duration: 1.1, gain: 0.5 }, // F4 (Akbar)
        { freq: 392.00, duration: 1.4, gain: 0.6 }, // G4
        { freq: 349.23, duration: 0.8, gain: 0.4 }, // F4
        { freq: 293.66, duration: 2.0, gain: 0.5 }, // D4
      ];

      let startTime = now;
      notes.forEach((note) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Warm harmonic tone (triangle + subtle sine)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, startTime);

        // Natural acoustic bell envelope
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(note.gain, startTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + note.duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + note.duration);

        startTime += note.duration * 0.75;
      });
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  // Soft haptic click for Tasbih
  public playTasbihClick() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // ignore
    }
  }
}

export const adhanAudio = new AudioAdhanSynthesizer();

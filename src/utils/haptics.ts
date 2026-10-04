// Haptics & Audio Chime helper for Christian Jesus Prayer App
class SpiritualHapticAudio {
  private ctx: AudioContext | null = null;

  private initAudio() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public triggerCountFeedback(hapticsEnabled: boolean) {
    if (hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(25);
      } catch {
        // ignore
      }
    }

    try {
      this.initAudio();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, this.ctx.currentTime); // 528 Hz - Solfeggio frequency / meditative resonance
      osc.frequency.exponentialRampToValueAtTime(396, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch {
      // Audio fallback silent
    }
  }

  public triggerPrayerSwitchFeedback(hapticsEnabled: boolean) {
    if (hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([20, 40, 20]);
      } catch {
        // ignore
      }
    }

    try {
      this.initAudio();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(660, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // Audio fallback silent
    }
  }

  public triggerTimerCompleteChime() {
    try {
      this.initAudio();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Gentle triple bell chime
      [528, 660, 792].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.4);

        gain.gain.setValueAtTime(0, now + idx * 0.4);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.4 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.4 + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.4);
        osc.stop(now + idx * 0.4 + 1.2);
      });
    } catch {
      // silent
    }
  }
}

export const spiritualHaptics = new SpiritualHapticAudio();

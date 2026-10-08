// Haptics & Audio Chime helper for Christian Jesus Prayer App
// Completely non-blocking and safe in all browser/iframe contexts

class SpiritualHapticAudio {
  private ctx: AudioContext | null = null;
  private alarmIntervalId: number | null = null;
  private isAlarmActive: boolean = false;

  private getAudioContext(): AudioContext | null {
    try {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AudioCtxClass) {
          this.ctx = new AudioCtxClass();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public triggerCountFeedback(hapticsEnabled: boolean = true) {
    if (hapticsEnabled && typeof navigator !== 'undefined') {
      try {
        if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
          navigator.vibrate(20);
        }
      } catch {
        // Safe silent fallback
      }
    }

    try {
      const ctx = this.getAudioContext();
      if (!ctx || ctx.state !== 'running') return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, now); // 528 Hz Meditative Solfeggio frequency
      osc.frequency.exponentialRampToValueAtTime(396, now + 0.08);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Safe silent fallback
    }
  }

  public triggerPrayerSwitchFeedback(hapticsEnabled: boolean = true) {
    if (hapticsEnabled && typeof navigator !== 'undefined') {
      try {
        if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
          navigator.vibrate([15, 30, 15]);
        }
      } catch {
        // Safe silent fallback
      }
    }

    try {
      const ctx = this.getAudioContext();
      if (!ctx || ctx.state !== 'running') return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.18);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.19);
    } catch {
      // Safe silent fallback
    }
  }

  public triggerTimerCompleteChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx || ctx.state !== 'running') return;

      const now = ctx.currentTime;
      [528, 660, 792].forEach((freq, idx) => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const startTime = now + idx * 0.35;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.001, startTime);
          gain.gain.linearRampToValueAtTime(0.12, startTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.9);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 0.95);
        } catch {
          // Safe fallback
        }
      });
    } catch {
      // Safe fallback
    }
  }

  /**
   * Plays a single authentic mobile alarm ringtone burst:
   * Repeating 4-beep rhythmic alarm pattern (like mobile phone clock alarm)
   */
  private playAlarmBurst() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      // Vibrate mobile device in sync with alarm burst
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
        try {
          navigator.vibrate([80, 50, 80, 50, 80, 50, 140]);
        } catch {}
      }

      const now = ctx.currentTime;
      
      // 4-pulse phone alarm motif: Beep - Beep - Beep - BEEP!
      const beeps = [
        { time: 0.00, freq: 932.33, dur: 0.07 }, // A#5
        { time: 0.12, freq: 932.33, dur: 0.07 }, // A#5
        { time: 0.24, freq: 932.33, dur: 0.07 }, // A#5
        { time: 0.36, freq: 1244.51, dur: 0.16 } // D#6 high resolving tone
      ];

      beeps.forEach(({ time, freq, dur }) => {
        try {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          const tStart = now + time;
          const tEnd = tStart + dur;

          // Dual tone: crisp square + full sine for clear phone speaker projection
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(freq, tStart);

          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(freq * 2, tStart); // 1 octave overtone

          // Sharp alarm envelope
          gain.gain.setValueAtTime(0.001, tStart);
          gain.gain.linearRampToValueAtTime(0.22, tStart + 0.01);
          gain.gain.setValueAtTime(0.20, tEnd - 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, tEnd);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(tStart);
          osc2.start(tStart);
          osc1.stop(tEnd);
          osc2.stop(tEnd);
        } catch {}
      });
    } catch {
      // Safe fallback
    }
  }

  /**
   * Starts repeating phone alarm ringtone until explicitly stopped
   */
  public startPhoneAlarm() {
    this.stopPhoneAlarm(); // clear any prior state
    this.isAlarmActive = true;

    // Wake up audio context
    const ctx = this.getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // Play initial burst immediately
    this.playAlarmBurst();

    // Repeat every 950ms (classic mobile alarm cadence)
    if (typeof window !== 'undefined') {
      this.alarmIntervalId = window.setInterval(() => {
        if (!this.isAlarmActive) {
          this.stopPhoneAlarm();
          return;
        }
        this.playAlarmBurst();
      }, 950);
    }
  }

  /**
   * Stops the active phone alarm and cancels vibration
   */
  public stopPhoneAlarm() {
    this.isAlarmActive = false;
    if (this.alarmIntervalId !== null && typeof window !== 'undefined') {
      window.clearInterval(this.alarmIntervalId);
      this.alarmIntervalId = null;
    }
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(0);
      } catch {}
    }
  }

  public isPhoneAlarmRunning(): boolean {
    return this.isAlarmActive;
  }

  /**
   * Plays a 2.5-second preview of the phone alarm so the user can test the sound
   */
  public playAlarmPreview(onDone?: () => void) {
    this.startPhoneAlarm();
    setTimeout(() => {
      this.stopPhoneAlarm();
      if (onDone) onDone();
    }, 2800);
  }
}

export const spiritualHaptics = new SpiritualHapticAudio();

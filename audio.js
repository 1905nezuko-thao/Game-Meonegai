/**
 * Web Audio API Sound Synthesizer for "Mèo né gai"
 * Không cần bất kỳ file âm thanh ngoài nào, tự tổng hợp âm thanh retro sống động!
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('meo-ne-gai-muted') === 'true';
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.masterGain = null;
    this.sfxGain = null;
    this.bgmGain = null;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 1, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);
    } catch (e) {
      console.warn("Web Audio not supported", e);
    }
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.init();
    this.muted = !this.muted;
    localStorage.setItem('meo-ne-gai-muted', this.muted);
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 1, this.ctx.currentTime);
    }
    return this.muted;
  }

  // --- Cute Cat Meow ---
  playMeow() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    // Meow frequency inflection: starts ~550Hz, rises to ~820Hz, then eases down to ~450Hz
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(460, now + 0.32);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  // --- Cat Hurt / Game Over ---
  playHurt() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Sad descending meow + thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.linearRampToValueAtTime(150, now + 0.35);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  // --- Dash Swoosh ---
  playDash() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Fast white noise burst or sweeping resonant filter
    const bufferSize = this.ctx.sampleRate * 0.18;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(700, now);
    filter.frequency.exponentialRampToValueAtTime(2800, now + 0.08);
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.18);
    filter.Q.value = 3;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
  }

  // --- Collectible Pickups ---
  playPickup(type) {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;

    const notes = type === 'pate' 
      ? [523.25, 659.25, 783.99, 1046.5] // Pate: C-E-G-C high arpeggio
      : [659.25, 987.77];                 // Fish: pleasant ding

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.001, now + idx * 0.05);
      gain.gain.linearRampToValueAtTime(0.28, now + idx * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.2);
    });
  }

  // --- Power-up sound ---
  playPowerup(name) {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    if (name === 'shield') {
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.25);
    } else if (name === 'slowmo') {
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.linearRampToValueAtTime(320, now + 0.3);
    } else {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.2);
    }

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  // --- Shield Break / Absorption ---
  playShieldBreak() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.2);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.23);
  }

  // --- Near-miss Sparkle ---
  playNearMiss() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.linearRampToValueAtTime(1600, now + 0.08);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  // --- Laser Warning Beep ---
  playLaserWarning() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(920, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // --- Laser Blast Fire ---
  playLaserFire() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1700, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.28);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  // --- Boss Siren Alert ---
  playBossAlert() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now + i * 0.28);
      osc.frequency.linearRampToValueAtTime(520, now + i * 0.28 + 0.14);
      osc.frequency.linearRampToValueAtTime(220, now + i * 0.28 + 0.26);

      gain.gain.setValueAtTime(0.001, now + i * 0.28);
      gain.gain.linearRampToValueAtTime(0.35, now + i * 0.28 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.28 + 0.27);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + i * 0.28);
      osc.stop(now + i * 0.28 + 0.28);
    }
  }

  // --- Cat Gun Fire (Laser Pew) ---
  playGunFire() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  // --- Boss Hit ---
  playBossHit() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // --- Boss Defeated (Epic Explosion + Victory) ---
  playBossDefeated() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    // Low rumble noise
    const bufferSize = this.ctx.sampleRate * 0.6;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.2));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.linearRampToValueAtTime(80, now + 0.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(now);

    // Victory fanfare shortly after
    setTimeout(() => {
      this.playNewRecord();
    }, 400);
  }

  // --- New High Score Fanfare ---
  playNewRecord() {
    if (this.muted || !this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    const now = this.ctx.currentTime;
    notes.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + i * 0.08);
      gain.gain.setValueAtTime(0.25, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.32);
    });
  }

  // --- Lo-Fi Chiptune Background Music Loop ---
  startBGM() {
    if (this.bgmPlaying) return;
    this.ensureContext();
    this.bgmPlaying = true;
    this.bgmStep = 0;

    // Upbeat pentatonic chord progression (C - Am - F - G)
    const bassline = [130.81, 130.81, 110.00, 110.00, 87.31, 87.31, 98.00, 98.00];
    const melody = [
      523.25, 0, 659.25, 783.99, 659.25, 0, 523.25, 0,
      440.00, 0, 523.25, 659.25, 523.25, 0, 440.00, 0,
      349.23, 0, 440.00, 523.25, 440.00, 0, 392.00, 523.25,
      392.00, 0, 493.88, 587.33, 523.25, 659.25, 783.99, 0
    ];

    const stepDuration = 180; // ms per 16th note

    this.bgmTimer = setInterval(() => {
      if (!this.bgmPlaying || this.muted || !this.ctx) return;
      const now = this.ctx.currentTime;

      // Play bass note on quarter notes
      if (this.bgmStep % 4 === 0) {
        const bassFreq = bassline[(this.bgmStep / 4) % bassline.length];
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(bassFreq, now);
        bassGain.gain.setValueAtTime(0.2, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        bassOsc.connect(bassGain);
        bassGain.connect(this.bgmGain);
        bassOsc.start(now);
        bassOsc.stop(now + 0.36);
      }

      // Play melody note
      const melFreq = melody[this.bgmStep % melody.length];
      if (melFreq > 0) {
        const melOsc = this.ctx.createOscillator();
        const melGain = this.ctx.createGain();
        melOsc.type = 'sine';
        melOsc.frequency.setValueAtTime(melFreq, now);
        melGain.gain.setValueAtTime(0.12, now);
        melGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        melOsc.connect(melGain);
        melGain.connect(this.bgmGain);
        melOsc.start(now);
        melOsc.stop(now + 0.17);
      }

      this.bgmStep++;
    }, stepDuration);
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  // --- Map Stage Clear Fanfare (Level Up) ---
  playMapClear() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      gain.gain.setValueAtTime(0, now + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.36);
    });
  }

  // --- Grand 8-World Victory Fanfare (Star Awarded) ---
  playVictoryFanfare() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    // Triumphant fanfare: G4, C5, E5, G5, F5, G5, C6 (Held)
    const melody = [
      { f: 392.00, t: 0.0, d: 0.15 },
      { f: 523.25, t: 0.15, d: 0.15 },
      { f: 659.25, t: 0.30, d: 0.15 },
      { f: 783.99, t: 0.45, d: 0.35 },
      { f: 698.46, t: 0.80, d: 0.18 },
      { f: 783.99, t: 0.98, d: 0.22 },
      { f: 1046.50, t: 1.20, d: 0.9 }
    ];
    melody.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.t);
      gain.gain.setValueAtTime(0, now + n.t);
      gain.gain.linearRampToValueAtTime(0.35, now + n.t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + n.t);
      osc.stop(now + n.t + n.d + 0.05);
    });
  }
}

const sound = new SoundEngine();

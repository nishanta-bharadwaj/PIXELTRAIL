export default class AudioManager {

  constructor(scene) {

    this.scene = scene;
    this.masterGain = null;
    this.musicOscillators = [];
    this.musicPlaying = false;
    this.volume = 0.25;

    if (scene.sound.locked || (scene.sound.context && scene.sound.context.state === 'suspended')) {
      scene.input.once("pointerdown", () => this.setup());
      scene.input.keyboard.once("keydown", () => this.setup());
    } else {
      this.setup();
    }

  }



  setup() {

    const ctx = this.scene.sound.context;

    if (!ctx || this.masterGain) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = this.volume;
    this.masterGain.connect(ctx.destination);

    this.startMusic();

  }



  playTone(freq, duration, type = "square", volume = 0.15, delay = 0) {

    const ctx = this.scene.sound.context;

    if (!ctx || !this.masterGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.value = freq;

    const start = ctx.currentTime + delay;
    const end = start + duration;

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(start);
    osc.stop(end + 0.02);

  }



  playNoise(duration = 0.12, volume = 0.08) {

    const ctx = this.scene.sound.context;

    if (!ctx || !this.masterGain) return;

    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    const gain = ctx.createGain();

    source.buffer = buffer;

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    source.connect(gain);
    gain.connect(this.masterGain);

    source.start();
    source.stop(ctx.currentTime + duration);

  }



  startMusic() {

    if (this.musicPlaying) return;

    const ctx = this.scene.sound.context;

    if (!ctx || !this.masterGain) return;

    this.musicPlaying = true;

    const notes = [196, 220, 262, 294, 330, 294, 262, 220];
    let step = 0;

    const playStep = () => {

      if (!this.musicPlaying) return;

      this.playTone(
        notes[step % notes.length],
        0.35,
        "triangle",
        0.04
      );

      step++;

      this.scene.time.delayedCall(
        420,
        playStep
      );

    };

    playStep();

  }



  stopMusic() {

    this.musicPlaying = false;

  }



  playJump() {

    this.playTone(320, 0.08, "square", 0.12);
    this.playTone(520, 0.1, "square", 0.1, 0.06);

  }



  playShoot() {

    this.playTone(880, 0.05, "square", 0.1);
    this.playNoise(0.06, 0.06);

  }



  playEnemyHit() {

    this.playTone(240, 0.08, "sawtooth", 0.12);

  }



  playEnemyDeath() {

    this.playTone(180, 0.12, "sawtooth", 0.14);
    this.playTone(90, 0.18, "square", 0.1, 0.05);
    this.playNoise(0.15, 0.1);

  }



  playCoin() {

    this.playTone(880, 0.06, "square", 0.1);
    this.playTone(1175, 0.08, "square", 0.08, 0.05);

  }



  playDiamond() {

    this.playTone(1047, 0.08, "sine", 0.12);
    this.playTone(1568, 0.1, "sine", 0.1, 0.05);
    this.playTone(2093, 0.08, "sine", 0.08, 0.08);

  }



  playDamage() {

    this.playTone(140, 0.15, "sawtooth", 0.18);
    this.playNoise(0.1, 0.12);

  }



  playDeath() {

    this.playTone(220, 0.2, "sawtooth", 0.16);
    this.playTone(110, 0.35, "square", 0.12, 0.1);
    this.stopMusic();

  }



  destroy() {

    this.stopMusic();

    if (this.masterGain) {
      this.masterGain.disconnect();
      this.masterGain = null;
    }

  }

  isMuted() {
    return this.volume === 0;
  }

  toggleMute() {
    if (this.volume > 0) {
      this.volume = 0;
    } else {
      this.volume = 0.25;
    }
    if (this.masterGain) {
      this.masterGain.gain.value = this.volume;
    }
    return this.isMuted();
  }

}

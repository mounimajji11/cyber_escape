/**
 * CYBER ESCAPE — THE DIGITAL MAZE
 * Verified 10-Sector Engine with Centered UI, Hidden Maze on Menu, BFS Solvability Validation & Fluid Collision
 */

(function () {
  'use strict';

  // ==========================================
  // WEB AUDIO SYNTHESIZER
  // ==========================================
  class CyberAudio {
    constructor() {
      this.ctx = null;
      this.enabled = localStorage.getItem('cyber_escape_sound') !== 'false';
      this.lastBeepSecond = -1;
    }

    init() {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('cyber_escape_sound', this.enabled ? 'true' : 'false');
      return this.enabled;
    }

    playKey() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.12);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    }

    playPowerup() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.18, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.05 + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.16);
      });
    }

    playDoorOpen() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.35);
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    }

    playDamage() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.3);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    }

    playShieldDeflect() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(1300, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.25);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    }

    playFreeze() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.4);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    }

    playPoliceAlert() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(740, now);
      osc.frequency.linearRampToValueAtTime(1080, now + 0.08);
      osc.frequency.linearRampToValueAtTime(700, now + 0.16);
      osc.frequency.linearRampToValueAtTime(1120, now + 0.24);
      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.32);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    }

    playWarningBeep(secondsLeft) {
      if (!this.enabled) return;
      if (this.lastBeepSecond === secondsLeft) return;
      this.lastBeepSecond = secondsLeft;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const freq = 600 + (10 - secondsLeft) * 60;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    }

    playLevelClear() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const melody = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      melody.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.25, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.26);
      });
    }

    playGameOver() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [440, 370, 311, 220, 146];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.25, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.28);
      });
    }

    playVictory() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const fanfare = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.51, 1567.98];
      fanfare.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.25, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.36);
      });
    }
  }

  // ==========================================
  // 10 UNIQUE & MATHEMATICALLY VERIFIED SECTORS
  // ==========================================
  const LEVELS = [
  {
    "id": 1,
    "name": "Crystal Blue",
    "timeLimit": 100,
    "enemySpeed": 1.5,
    "detectionRange": 3.8,
    "theme": {
      "name": "Crystal Blue",
      "primary": "#00f3ff",
      "accent": "#38bdf8",
      "wallBg": "#0c1527",
      "wallBorder": "#00f3ff",
      "floorBg": "#050814",
      "glow": "rgba(0, 243, 255, 0.4)",
      "keyColor": "#00f3ff",
      "swatches": [
        "#00f3ff",
        "#ffffff",
        "#38bdf8"
      ]
    },
    "map": [
      "###############",
      "#P....#.....#.#",
      "#####.###.#R#.#",
      "#...#.#...#.#.#",
      "#.#.#.#.###.#.#",
      "#.#.#.#.#.#...#",
      "###.#...#.###.#",
      "#S..#.#.#...#.#",
      "#.###...#.#.#.#",
      "#.....#.#.#...#",
      "#.##.##.#.#####",
      "#.#.....#.#...#",
      "#.#####.#B#..D#",
      "#K......#...#E#",
      "###############"
    ]
  },
  {
    "id": 2,
    "name": "Lavender Dreams",
    "timeLimit": 120,
    "enemySpeed": 1.7,
    "detectionRange": 4.2,
    "theme": {
      "name": "Lavender Dreams",
      "primary": "#c084fc",
      "accent": "#8b5cf6",
      "wallBg": "#160d2e",
      "wallBorder": "#c084fc",
      "floorBg": "#080514",
      "glow": "rgba(192, 132, 252, 0.4)",
      "keyColor": "#f472b6",
      "swatches": [
        "#c084fc",
        "#8b5cf6",
        "#f472b6"
      ]
    },
    "map": [
      "###################",
      "#P..#...#...#.....#",
      "###.#.#.###...###.#",
      "#.#...#...#...#...#",
      "#.##.####.###.#.#.#",
      "#.#.....#.B.#.#.#.#",
      "#.#.#.#####.###.###",
      "#.#.#.....#...#R..#",
      "#.#.#####.###.###.#",
      "#.#...#.#...#.#...#",
      "#.###.#.###.#.#.###",
      "#R...K..#...#.#K..#",
      "#.#######.###.#D#.#",
      "#.#..S#...#...#E#.#",
      "#.##....###.#####.#",
      "#.#...#...#.......#",
      "#.#.#.###.#######.#",
      "#...#...#.........#",
      "###################"
    ]
  },
  {
    "id": 3,
    "name": "Mint Circuit",
    "timeLimit": 140,
    "enemySpeed": 1.9,
    "detectionRange": 4.5,
    "theme": {
      "name": "Mint Circuit",
      "primary": "#00ff88",
      "accent": "#2dd4bf",
      "wallBg": "#061f18",
      "wallBorder": "#00ff88",
      "floorBg": "#020f0c",
      "glow": "rgba(0, 255, 136, 0.4)",
      "keyColor": "#a7f3d0",
      "swatches": [
        "#00ff88",
        "#2dd4bf",
        "#f0fdf4"
      ]
    },
    "map": [
      "#######################",
      "#P..#.......#.........#",
      "###.#.#####...##.##.#S#",
      "#.#.#.....#.......#.#.#",
      "#.#.#.#############.#.#",
      "#...#.#.....#.......#.#",
      "#.###.#.###.#.#######.#",
      "#...#.#.#.#.#.#.......#",
      "###.###.#.#...###.#####",
      "#.#.....#.#.#...#.#..K#",
      "#.#######.#.#.#.#.#.###",
      "#.....#...K.#.#.#.#...#",
      "#.###.#.#######...#.#R#",
      "#...#.#.#.......#.#.#.#",
      "###.#.#.#####.###.###.#",
      "#...#...#..F#.#.R.#...#",
      "#.#######.#.#.#.###B#.#",
      "#.#...#...#...#.....#.#",
      "#.#.#.###.###########.#",
      "#...#...#.#.......#...#",
      "##.####.#.#.###..##.###",
      "#.........#...#.....DE#",
      "#######################"
    ]
  },
  {
    "id": 4,
    "name": "Sunset Neon",
    "timeLimit": 165,
    "enemySpeed": 2,
    "detectionRange": 4.8,
    "theme": {
      "name": "Sunset Neon",
      "primary": "#fb923c",
      "accent": "#f87171",
      "wallBg": "#290f07",
      "wallBorder": "#fb923c",
      "floorBg": "#120603",
      "glow": "rgba(251, 146, 60, 0.4)",
      "keyColor": "#fde047",
      "swatches": [
        "#fb923c",
        "#f87171",
        "#fb7185"
      ]
    },
    "map": [
      "###########################",
      "#P....#.......#...........#",
      "#####.#...###.#.#.##.####.#",
      "#...#.#.#.#...#.#.....#.#.#",
      "###...###.#.#########.#.#.#",
      "#...#.....#.#.......#S#...#",
      "#.#########.#.#####.#.#.###",
      "#.........#.#...#.#...#...#",
      "#.###.###...###...#######.#",
      "#...#.#.#.#.....#...K.#...#",
      "###.#.#.#.########.#..#.###",
      "#...#.#...#...........#.#R#",
      "#####...###.#########.#.#.#",
      "#....K#.#...#.#...#...#...#",
      "#.#####.#.###.#.#.#.#####.#",
      "#.#.#.R...#...#.#.......#.#",
      "#.#.#.#######.#.#########.#",
      "#.#...#...#...#.#.#.......#",
      "#R#####.#.#.###.#.#.#######",
      "#...#...#.#.....#.#.......#",
      "###.#.###.#.#####.#######.#",
      "#...#...#.#.............#.#",
      "#.#.###.#.##.##########.#.#",
      "#B#...#.#.#..F#..K..#ED.#.#",
      "#.#####.#.#.#.#.###.#####.#",
      "#.......#...#.....#.......#",
      "###########################"
    ]
  },
  {
    "id": 5,
    "name": "Arctic Pulse",
    "timeLimit": 190,
    "enemySpeed": 2.1,
    "detectionRange": 5.1,
    "theme": {
      "name": "Arctic Pulse",
      "primary": "#38bdf8",
      "accent": "#06b6d4",
      "wallBg": "#091929",
      "wallBorder": "#38bdf8",
      "floorBg": "#040b12",
      "glow": "rgba(56, 189, 248, 0.45)",
      "keyColor": "#e0f2fe",
      "swatches": [
        "#38bdf8",
        "#94a3b8",
        "#06b6d4"
      ]
    },
    "map": [
      "###############################",
      "#P..#.....#.B.....#...#.......#",
      "###.#.###.####.##.#.#.#.####..#",
      "#.#...#.#.......#.#.#...#.#...#",
      "#.#####.#######.#.#.#####.#...#",
      "#.........#...#.#.......#.#.#.#",
      "#.##.##.#.#.#.#.#######.#.#.#.#",
      "#.#...#.#.R.#.#.#.....#...#.#.#",
      "#.#.#.#.#####.#.#.###.###.#.#.#",
      "#...#.#...#...#...#.#...#.#.#.#",
      "#####.###.#########.##..#.#.###",
      "#...#...#.......#.#.....#.#...#",
      "#.#.##..#####...#.#.#####.###.#",
      "#.#.....#...#.#...#.....#.#...#",
      "#.#########...#.#######.###.#.#",
      "#.#...#K....#.#.#.....#.#...#.#",
      "#.#.#.#.#.#.....#.#.#.#.#.###.#",
      "#...#.#.#.#.#.#.#.#K#.#...#.#.#",
      "#####.###.#.#.###.#.####.##.#.#",
      "#...#...#.#.#R#...#.#.......#.#",
      "###.###.#.###.#.###.#.#####.#.#",
      "#.....#.#...#...#.#..S#.#.K.#.#",
      "#.#####.#.#.#####F#####.#..##.#",
      "#.#.R.#.#.#...........#.#.....#",
      "#.#.#.#.#######.####..#.#######",
      "#...#.#.........#.....#.....#.#",
      "#.###.###########.#######.#...#",
      "#.#.#...#...#...#.#.....#.#...#",
      "#.#.###.#.#.#.#.#.###.#...###.#",
      "#.....#...#...#.......#...#ED.#",
      "###############################"
    ]
  },
  {
    "id": 6,
    "name": "Crimson Cyber",
    "timeLimit": 220,
    "enemySpeed": 2.2,
    "detectionRange": 5.3,
    "theme": {
      "name": "Crimson Cyber",
      "primary": "#ff0055",
      "accent": "#fb7185",
      "wallBg": "#290610",
      "wallBorder": "#ff0055",
      "floorBg": "#120307",
      "glow": "rgba(255, 0, 85, 0.45)",
      "keyColor": "#fda4af",
      "swatches": [
        "#ff0055",
        "#fb7185",
        "#f43f5e"
      ]
    },
    "map": [
      "###################################",
      "#P....#...#.........#...#.........#",
      "#####.#.#.###.#####.###.#.###.#####",
      "#...#...#...#.#...#...#...#.#..K..#",
      "#.#.#######.#.###.###.#R###.#####.#",
      "#.#...#...#.#...#.....#.#.....#...#",
      "#.#.###.#...#.#.#.#####.#.#####.#.#",
      "#.#.#...#..R#.#.#.....#...#.....#.#",
      "#.###.#########.#####.#####.#####.#",
      "#...#.....#.....#...#...#...#...#.#",
      "###.#####.#R#.###.#.###...###.###.#",
      "#...#.....#.#.#...#...#.#.#.......#",
      "#.#.#.##.####.#.####.##.#...##.####",
      "#.#.#.#...K...#.......#...#.....#.#",
      "#.###.#####.######.#..##.######.#.#",
      "#...#...#...#.........#.S.#...#...#",
      "#.#.##..#.###.#.#####.#.#.#.#####.#",
      "#.#.....#.#...#.....#.#.#.#.#...#.#",
      "#.#######.#.#####.#.#...#.#.#.#.#.#",
      "#...#.....#.#...#.#.#...#...#.#...#",
      "##..###.#####.#.###.###.#####.#####",
      "#...#B..#.....#.....#.#.#...#.#...#",
      "#.###.###.###########.#.#.#.#.###.#",
      "#...#...#.K...#.#.....#.#.#...#...#",
      "###...#....##.#.#.#.###.#.#####.#.#",
      "#...#.#.#...#.#...#..R..#.#...K.#.#",
      "#.#####.#####....########.#####.###",
      "#.......#.....#.....#...#.....#...#",
      "####.####.######.####.#.#####.###.#",
      "#.........#.F.....#...#.....#.....#",
      "#..######.#.####..#.#####..######.#",
      "#.....#.#...#.....#.#...#.....#...#",
      "#####.#.#####.#####.#...#####.#.###",
      "#...........#.........#.....#...DE#",
      "###################################"
    ]
  },
  {
    "id": 7,
    "name": "Solar Amber",
    "timeLimit": 250,
    "enemySpeed": 2.3,
    "detectionRange": 5.5,
    "theme": {
      "name": "Solar Amber",
      "primary": "#ffb703",
      "accent": "#f59e0b",
      "wallBg": "#291d06",
      "wallBorder": "#ffb703",
      "floorBg": "#120d03",
      "glow": "rgba(255, 183, 3, 0.45)",
      "keyColor": "#fef08a",
      "swatches": [
        "#ffb703",
        "#f59e0b",
        "#fbbf24"
      ]
    },
    "map": [
      "#######################################",
      "#P..#.....#.....#.....................#",
      "###.#.###.#.#.###.###..##########.#####",
      "#...#.#.#...#.#...#.#...#...#...#.#..B#",
      "#.###.#.##.##.#.###.###.#.#.#.###.#.#.#",
      "#.#.#...#...#.#.#S....#.#.#.#.R...#.#.#",
      "#.#.#.###.#.#.#.#.#.#.#.#.#.#######.#.#",
      "#.#...#...#...#.#.#.#.#...#...#.....#.#",
      "#.##.##..###.##.#.#.#########.#.#####.#",
      "#.....#.........#.#.#.........#...K.#.#",
      "#####.#.####.######...######.######.#.#",
      "#.....#...........#.#.R...........#.#.#",
      "#.##########.####.#.######.######.#.#.#",
      "#.........#.....#.#...#.....#...#.#.#.#",
      "#########.#K###...#...#.###...#.#.#.#.#",
      "#...#.#...#...#.....#.#.#.#.F.#.#...#.#",
      "#.#.#.#.###.#########.#.#.#####.#####.#",
      "#.#...#.#...#.....#.#.#.#.....#...#...#",
      "#.#####.#.###.###.#.#.#.#####.###.#.###",
      "#.#.....#...#.#.#.#...#...#...#.#.#...#",
      "#.#.#####.###.#.#.###.###.#.#.#...###.#",
      "#.#.#.....#...#.R...#.#.#.#.#...#.#...#",
      "#.#.#######.#.#####.#...#.#.#####.#..##",
      "#.#.....#...#.#...#.#...#.#.#...#.#...#",
      "#.#####.#.###.#.#.#.###.#.#.#.#.#.###.#",
      "#.....#.#.#...#.#.#...#.#.#...#.#.#...#",
      "#.###.#.#.#.###...###.###.#.###.#.#.#.#",
      "#.#.#.K.#.#...#.#.#.#.#...#.#.#.#...#.#",
      "#.#.#####.##.##.#.#.#.#.###.#.#.#####.#",
      "#.......#.....#.#.#...#.#.#.#.#.....#.#",
      "#######.#.###.#R#.###.#.#.#.#.#####.#.#",
      "#.#.....#...#...#...#...#.#.#...#.#...#",
      "#.#.#######.#######.#####.#.#.#.#.#####",
      "#.#.......#.......#.#.....#.#.#...#ED.#",
      "#.#######.####.##.#.#.###.#.#.###.###.#",
      "#.......#.......#.#.#.#.#.#.#.#.#...#.#",
      "#.#############.###.#.#.#.#.#.#.###.#.#",
      "#...................#..K#.....#.......#",
      "#######################################"
    ]
  },
  {
    "id": 8,
    "name": "Electric Violet",
    "timeLimit": 280,
    "enemySpeed": 2.4,
    "detectionRange": 5.8,
    "theme": {
      "name": "Electric Violet",
      "primary": "#a855f7",
      "accent": "#d946ef",
      "wallBg": "#1c0b29",
      "wallBorder": "#a855f7",
      "floorBg": "#0c0512",
      "glow": "rgba(168, 85, 247, 0.45)",
      "keyColor": "#f0abfc",
      "swatches": [
        "#a855f7",
        "#d946ef",
        "#e879f9"
      ]
    },
    "map": [
      "###########################################",
      "#P......F.....#.........#.....#...........#",
      "#############.#.#######.#.##..#.###.#####.#",
      "#...#.......#.#.#.....#...#...#...#.#...#.#",
      "#.#...#.#####.#...###.#####.#######.#.###.#",
      "#.#...#.......#...#...#.....#...#...#.#...#",
      "#.########.########.###.#####.#...###B#.###",
      "#.....#.#.......K...#...#.....#.#.#...#.#R#",
      "#####.#.#..####.#####.###.#####.#.#.#.#...#",
      "#...#.#.....#...#...#.....#.....#.#.#.#...#",
      "#.#.#.###.###.###.#########.#####.#.#####.#",
      "#.#R#...#.#...#.......#...#.#.....#.#.....#",
      "###.###.#.#.#######.###.#.#.#.#.###.#.#####",
      "#...#...#.#...#.....#...#...#.#.#...#.#...#",
      "#.###.###.###.#.#####.#######...#.#.#.#.###",
      "#.....#...#...#...#...#.......#.#.#...#...#",
      "#.#####.###.###.#.#.###.#######.#####.###.#",
      "#...#...#...#...#...#.#...#...#....S#.#...#",
      "###.#.###.###.#######.###.#.#######.#...#.#",
      "#...#.#...#...#.....#.....#.#.......#...#.#",
      "#.#####.###.#####.###R#####...########.##.#",
      "#.#...#.#.......#.......#...#...#...R...#.#",
      "#.#.#.#.#######.#######.###.###.###.#.###.#",
      "#.#.#.#.......#.#.....#...#...#...#.#...#.#",
      "#.#.#.#..####.#...###.###...#.###.#####.#.#",
      "#...#.#...#.K.#...#...#.#.#.#.#.#.#.....#.#",
      "#####.#.###.#######.###.#.#.#.#.#.#.#####.#",
      "#...#.#.#...#...#...#.......#...#.#.......#",
      "#.###.###.###.###.###K.##########.#.#######",
      "#...#...#.#.#.....#.......#.......#...#...#",
      "#.#.###.#.#.#.#########.###.#########.#.###",
      "#.#...#...#.#.#.....#...#...#.#.......#...#",
      "#.###.#####.#.###.#.#####.###.#.#########.#",
      "#.#.#...#...#.....#.#.....#...#.#...#.....#",
      "#.#.#.###.#.##.####.#.##.##.#.#.#.#.###.#.#",
      "#...#.....#.....#...#.#.....#.#...#...#.#.#",
      "###.#########.###.###.#.#####.#######.#.#.#",
      "#.#.#.......#.....#...#...#.........#...#.#",
      "#.#.#######.#########.#.#.###############.#",
      "#.#.........K.......#.#.#.#...K.#.....#.R.#",
      "#.########.#######..#.#.#.#..##.#.###.#..##",
      "#.....................#.#.....#.....#...DE#",
      "###########################################"
    ]
  },
  {
    "id": 9,
    "name": "Acid Matrix",
    "timeLimit": 310,
    "enemySpeed": 2.5,
    "detectionRange": 6,
    "theme": {
      "name": "Acid Matrix",
      "primary": "#10b981",
      "accent": "#34d399",
      "wallBg": "#062118",
      "wallBorder": "#10b981",
      "floorBg": "#020d09",
      "glow": "rgba(16, 185, 129, 0.45)",
      "keyColor": "#6ee7b7",
      "swatches": [
        "#10b981",
        "#34d399",
        "#a7f3d0"
      ]
    },
    "map": [
      "###############################################",
      "#P..#...........#...#.........#.......#.......#",
      "###.#######.###.#.#.#.#######.#.###.#B###.###.#",
      "#...#...#...#.....#...#.....#.#...#.#.#...#.#.#",
      "#.###.#.#.#####.###########.#.#####.#.#.###...#",
      "#.#...#.#.....#.#.........#.....#...#.#.#...#.#",
      "#.#.#.#.#####.#.#.#######.#####.#.###...#.#.#.#",
      "#.#.#.#...#...#.#.#.....#.....#...#.#...#.#...#",
      "#.###.###.#.###.#R#.###.#####.#####.#####.#####",
      "#.....#.#.#.#...#...#.......#...#.#.....#.....#",
      "#######.#.#.#########.########..#.#.#.#######.#",
      "#.#.......#...#.....#...#...#...#.#.#.........#",
      "#.#.##.####.#.#.###...###.#...###.#.####.######",
      "#...#.....#.#.#...#.#.#...#...#...#.#.....#...#",
      "#.#####.#.###.###.#.#.#.#######.#.#.#.###.###.#",
      "#.#...#.#...#K#...#...#.#.R.#.#.#...#.#.....#.#",
      "#.#.#.#.###...#.#######R....#.#.#####.#####.#.#",
      "#...#...#...#.........#.#.#...#.....#...#...#.#",
      "#########.###########.#.#.###.#####.#.#.###.#.#",
      "#...#...#...#...#.....#.#...#.#.....#.#...#...#",
      "#.#.#.#.###.#.#.#.#####.#.#.###.#####.###.###.#",
      "#.#.#.#...#...#.#.#...#.#.#.....#.......#.#.#.#",
      "#.#.#.#.#######.#.#.#.#.###.######.##.###...#.#",
      "#.#.#.#....S..#.#...#.#...#.#.......#.#...#...#",
      "#.###.#####.###.#####.###.#.#.#####.###.###.###",
      "#.#...#...#...#.#...#.#...#.#.#......K..#...#.#",
      "#...###.#.###.#.#.###.#.###.#.###########.###.#",
      "#.#R#...#...#.K.#.#...#.#.....#...#.....#...#.#",
      "#.#.#.########.##.#.###.#######.#F#####.###.#.#",
      "#...#.............#.#.#.........#.....#...#...#",
      "#.###..######.#####.#.###########.###.#.#.###.#",
      "#...#...#...#...........#.......#.#...#.#.....#",
      "###.#.###.#.####.####.###.####..#.#.###.#######",
      "#.#.#.#...#...#.....#.#...#.....#.#...#...#...#",
      "#.#.###.#####.#.###.###.###.#########.###.#...#",
      "#.#.#...#...#..K#...#...#...#.........#..K#.#.#",
      "#...#.###.#######.###.###.###.#########.###.#.#",
      "#...#.#.......#...#...#.......#...#...#.#...#.#",
      "#.###...#####.#.#####.#########.###.#.#.#.###.#",
      "#.....#.#...#...#...#...#.....#.....#...#...#.#",
      "####.##.###.#####.#.#.#.#####.#.##.########.#.#",
      "#.#...#.........#.#.#.#.....#...#.R.......#.#.#",
      "#.#.#.####.####.#.#.#######.###.###.###.#.#.#.#",
      "#.#.#.#.......#.#.#.#.....#...#...#.#...#.#.#.#",
      "#.#.#.#.###..##.#...#.###.###.###.###.###.#.#D#",
      "#...#.....#.......#...#.......#.......#.....#E#",
      "###############################################"
    ]
  },
  {
    "id": 10,
    "name": "Quantum Core",
    "timeLimit": 350,
    "enemySpeed": 2.6,
    "detectionRange": 6.2,
    "theme": {
      "name": "Quantum Core",
      "primary": "#e11d48",
      "accent": "#f43f5e",
      "wallBg": "#24060f",
      "wallBorder": "#e11d48",
      "floorBg": "#100307",
      "glow": "rgba(225, 29, 72, 0.5)",
      "keyColor": "#fda4af",
      "swatches": [
        "#e11d48",
        "#f43f5e",
        "#fb7185"
      ]
    },
    "map": [
      "###################################################",
      "#P..#.......#.........#...#.............#.........#",
      "###.###.#.#.#...#####.#.#.###.#.####.##.#####.##..#",
      "#.#...#.#.#.#.#.#..K#.#.#...#.#.#.....#.......#...#",
      "#.###.###.#.###.#.#.#.#.##..###.#.###.#########.###",
      "#...#.#...#.....#.#.#...#...#...#.#..R#.....#...#.#",
      "#.###.#.#########.#######.###.###.#.###.#.###.###.#",
      "#.....#.#...........#...#.#...#...#.#...#...#.#...#",
      "#.#####.#.#########.#.#.#.#.###.###.#..####.#...#.#",
      "#.....#.#.#.......#...#.#...#.....#.#..B#.#...#.#.#",
      "#####.#.#.###.###.#####.###########.###.#.#####.#.#",
      "#...#...#...#...#.#.#.......#...#...#...#.#.....#.#",
      "#...#######.#.#.#...#.#####.#.#.#.###.###.#.###...#",
      "#.#.......#.#.#.#...#.....#...#...#...#.#.....#.#.#",
      "#.###.#####.###.###.#####.#######.#.###...#####.#.#",
      "#R..#.....#.....#.#...#.#...#...#.#.#.....#.#...#.#",
      "###.#####.#######.###.#.###.#...#.#.#..####.#.###.#",
      "#.#.....#.#.............#K..#.#...#.#.....#.#.#...#",
      "#.#####...#.###########.#.#####.###.#####.#...##.##",
      "#.....#.#...#...#.....#.#.....#...#.....#...#.....#",
      "#.###.#.#######.#.###.#######.#.#######.#########.#",
      "#...#.#...#...#.#.#...........#.#.....#.......#...#",
      "###...###.#.#.#.#.#############.#.###.#######.#.#.#",
      "#...#.#.#...#...#.........#.....#.#.#.#.....#...#.#",
      "#.###.#.######..#########.#######.#.#.#.###.#####.#",
      "#.#.#.....#.....#.......#.#.......#.#...#.#...#.#.#",
      "#.#.#.#####..####.#.#####...#######.#####.#.#.#.#.#",
      "#.#...#...#...#...#.#.....#.#...........#.#.#...#.#",
      "#.#.###.#.###.#####.#..#.##.#.#####.###.#.#.#####.#",
      "#.#.#...#.....#...#.#R.....R#...#...#...#.#.......#",
      "#.###.#########.#.#.#############.###.###.#########",
      "#.#...#.....#R..#...#...........#...#.........#...#",
      "#.#.#######.#.#.##.##.#####.#.#.##..#########.#.#R#",
      "#...#.....#...#.#.....#...#.#.#.#...#...#...#...#.#",
      "#.###.###.#####.#K#####.#.###.#.#.###...###.#####.#",
      "#.....#.#.....#...#.....#.....#...#...#...#.#.....#",
      "##.####.#####.#####.#################.###.#.#.#####",
      "#.....#.......#...#.....#.............#.#.#.#.#K..#",
      "#.#.###.#######.#...###.###.##..#######.#.#.#.#.###",
      "#.#...#...#.....#.#...#.#...#...#.....#.....#.#...#",
      "#####.###.#.#####.#####.#.#####.#.###.#######.#.#.#",
      "#.......#.#.#.........#.#.....#.#...#.......#.#.#.#",
      "#F.##.###.#.#########.#.#.###.#.###.#######.#.###.#",
      "#...#.#...#.......#...#.#...#.#.#...#...#...#.....#",
      "#.#K###.###..####.#.###.##..#.###.###.###.#.####..#",
      "#.#...#.#.....#...#...#.#.S.#.....#...#...#...#...#",
      "#.###.#.#######.#####.#.#.#########.#.#.#######.###",
      "#...#.#.........#.....#.#.#.....#...#.#.#.....#...#",
      "###.#.###########.#####.#.###.#.###...#...###.###.#",
      "#...#...K...............#.....#.....#.#...DE#.....#",
      "###################################################"
    ]
  }
];

  // ==========================================
  // GAME ENGINE STATE
  // ==========================================
  const audio = new CyberAudio();

  const state = {
    screen: 'WELCOME', // WELCOME, PLAYING, PAUSED, LEVEL_CLEAR, GAME_OVER, VICTORY, INSTRUCTIONS, LEVEL_SELECT, SETTINGS
    currentLevelIdx: 0,
    unlockedLevel: parseInt(localStorage.getItem('cyber_escape_max_level') || '1', 10),
    highScore: parseInt(localStorage.getItem('cyber_escape_high_score') || '0', 10),
    shakeEnabled: localStorage.getItem('cyber_escape_shake') !== 'false',
    particlesEnabled: localStorage.getItem('cyber_escape_particles') !== 'false',
    score: 0,
    levelScore: 0,
    lives: 3,
    timeLeft: 90,
    lastTime: 0,
    keysCollected: 0,
    totalKeys: 0,
    doorsUnlocked: false,
    invincibleTimer: 0,
    shieldActive: false,
    speedBoostTimer: 0,
    freezeTimer: 0,
    particles: [],
    floatingTexts: [],
    player: {
      x: 1.5,
      y: 1.5,
      radius: 0.26, // Refined collision radius for smooth corner gliding and corridor passage
      angle: 0
    },
    grid: [],
    gridCols: 0,
    gridRows: 0,
    cellSize: 38,
    viewportW: 800,
    viewportH: 600,
    camera: {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0
    },
    keys: [],
    doors: [],
    exit: { x: 0, y: 0 },
    powerups: [],
    enemies: [],
    input: {
      up: false,
      down: false,
      left: false,
      right: false
    }
  };

  // DOM Elements
  const cinemaCanvas = document.getElementById('cinema-canvas');
  const cinemaCtx = cinemaCanvas.getContext('2d');
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const canvasWrapper = document.getElementById('canvas-wrapper');
  const menuContainer = document.getElementById('menu-container');
  const mobileControls = document.getElementById('mobile-controls');
  const damageFlash = document.getElementById('damage-flash');
  const gameAlertBanner = document.getElementById('game-alert-banner');
  const hud = document.getElementById('hud');

  // HUD Elements
  const hudLevel = document.getElementById('hud-level');
  const hudThemeName = document.getElementById('hud-theme-name');
  const hudTime = document.getElementById('hud-time');
  const hudScore = document.getElementById('hud-score');
  const hudKeys = document.getElementById('hud-keys');
  const hudLivesContainer = document.getElementById('hud-lives');
  const activePowerupsContainer = document.getElementById('active-powerups');
  const btnPause = document.getElementById('btn-pause');
  const btnRestart = document.getElementById('btn-restart');
  const btnSound = document.getElementById('btn-sound');
  const btnHelp = document.getElementById('btn-help');
  const minimapCanvas = document.getElementById('minimap-canvas');
  const minimapCtx = minimapCanvas ? minimapCanvas.getContext('2d') : null;
  const minimapPanel = document.getElementById('minimap-panel');
  const btnToggleMinimap = document.getElementById('btn-toggle-minimap');
  const minimapKeysStatus = document.getElementById('minimap-keys-status');

  // Overlays
  const screenWelcome = document.getElementById('screen-welcome');
  const screenLevelSelect = document.getElementById('screen-level-select');
  const screenInstructions = document.getElementById('screen-instructions');
  const screenSettings = document.getElementById('screen-settings');
  const screenPause = document.getElementById('screen-pause');
  const screenLevelClear = document.getElementById('screen-level-clear');
  const screenGameOver = document.getElementById('screen-game-over');
  const screenVictory = document.getElementById('screen-victory');

  // Buttons in Screens
  const btnStartGame = document.getElementById('btn-start-game');
  const btnOpenLevelSelect = document.getElementById('btn-open-level-select');
  const btnCloseLevelSelect = document.getElementById('btn-close-level-select');
  const btnHowToPlay = document.getElementById('btn-how-to-play');
  const btnCloseInstructions = document.getElementById('btn-close-instructions');
  const btnOpenSettings = document.getElementById('btn-open-settings');
  const btnCloseSettings = document.getElementById('btn-close-settings');
  const btnMenuSound = document.getElementById('btn-menu-sound');
  const menuSoundLabel = document.getElementById('menu-sound-label');
  const btnResume = document.getElementById('btn-resume');
  const btnRestartModal = document.getElementById('btn-restart-modal');
  const btnMenuFromPause = document.getElementById('btn-menu-from-pause');
  const btnNextLevel = document.getElementById('btn-next-level');
  const btnTryAgain = document.getElementById('btn-try-again');
  const btnMenuFromOver = document.getElementById('btn-menu-from-over');
  const btnPlayAgainVictory = document.getElementById('btn-play-again-victory');
  const levelSelectGrid = document.getElementById('level-select-grid');
  const welcomeHighScoreEl = document.getElementById('welcome-high-score');
  const welcomeMaxSectorEl = document.getElementById('welcome-max-sector');

  // Settings Toggles
  const settingToggleSound = document.getElementById('setting-toggle-sound');
  const settingToggleShake = document.getElementById('setting-toggle-shake');
  const settingToggleParticles = document.getElementById('setting-toggle-particles');
  const btnResetProgress = document.getElementById('btn-reset-progress');

  // ==========================================
  // CINEMATIC BACKGROUND CANVAS WORLD
  // ==========================================
  const cinemaWorld = {
    stars: [],
    drones: [],
    rainDrops: [],
    symbols: ['01', 'λ', '⌬', '⌖', '⚡', '◈', '00', '10', '§'],
    floatingGlyphs: [],
    buildings: [],
    gridOffset: 0
  };

  function initCinemaWorld() {
    const w = cinemaCanvas.width = window.innerWidth;
    const h = cinemaCanvas.height = window.innerHeight;

    cinemaWorld.stars = [];
    for (let i = 0; i < 90; i++) {
      cinemaWorld.stars.push({
        x: Math.random() * w,
        y: Math.random() * (h * 0.65),
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.01
      });
    }

    cinemaWorld.drones = [
      { x: w * 0.2, y: h * 0.25, vx: 0.8, color: '#ff0055' },
      { x: w * 0.8, y: h * 0.18, vx: -0.6, color: '#00f3ff' }
    ];

    cinemaWorld.rainDrops = [];
    const rainCount = Math.floor(w / 35);
    for (let i = 0; i < rainCount; i++) {
      cinemaWorld.rainDrops.push({
        x: Math.random() * w,
        y: Math.random() * h,
        speed: Math.random() * 3 + 2,
        length: Math.random() * 20 + 10,
        alpha: Math.random() * 0.35 + 0.1
      });
    }

    cinemaWorld.floatingGlyphs = [];
    for (let i = 0; i < 18; i++) {
      cinemaWorld.floatingGlyphs.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vy: -(Math.random() * 0.6 + 0.2),
        text: cinemaWorld.symbols[Math.floor(Math.random() * cinemaWorld.symbols.length)],
        alpha: Math.random() * 0.5 + 0.2,
        size: Math.floor(Math.random() * 10 + 11)
      });
    }

    cinemaWorld.buildings = [];
    const bCount = Math.ceil(w / 40) + 4;
    for (let i = 0; i < bCount; i++) {
      cinemaWorld.buildings.push({
        x: i * 38 - 20,
        w: Math.random() * 25 + 30,
        h: Math.random() * 180 + 100,
        hasAntenna: Math.random() < 0.4,
        windowRows: Math.floor(Math.random() * 8 + 4),
        windowCols: Math.floor(Math.random() * 3 + 2)
      });
    }
  }

  window.addEventListener('resize', () => {
    initCinemaWorld();
    resizeCanvas();
  });
  initCinemaWorld();

  function renderCinemaBackground() {
    const w = cinemaCanvas.width;
    const h = cinemaCanvas.height;
    cinemaCtx.clearRect(0, 0, w, h);

    const horizonY = h * 0.58;

    // 1. Deep Night Sky with Atmospheric Violet Gradient
    const skyGrad = cinemaCtx.createLinearGradient(0, 0, 0, horizonY);
    skyGrad.addColorStop(0, '#03050c');
    skyGrad.addColorStop(0.5, '#070c22');
    skyGrad.addColorStop(1, '#1b0f38');
    cinemaCtx.fillStyle = skyGrad;
    cinemaCtx.fillRect(0, 0, w, horizonY);

    // 2. Stars
    cinemaWorld.stars.forEach(s => {
      s.alpha += Math.sin(performance.now() * 0.003 * s.twinkleSpeed) * 0.02;
      cinemaCtx.fillStyle = `rgba(200, 235, 255, ${Math.max(0.1, Math.min(1, s.alpha))})`;
      cinemaCtx.beginPath();
      cinemaCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      cinemaCtx.fill();
    });

    // 3. Faint Holographic Sky Grid
    cinemaCtx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
    cinemaCtx.lineWidth = 1;
    cinemaCtx.beginPath();
    for (let x = 0; x < w; x += 120) {
      cinemaCtx.moveTo(x, 0);
      cinemaCtx.lineTo(x, horizonY);
    }
    for (let y = 0; y < horizonY; y += 80) {
      cinemaCtx.moveTo(0, y);
      cinemaCtx.lineTo(w, y);
    }
    cinemaCtx.stroke();

    // 4. Layered Cyber City Skyline
    cinemaCtx.fillStyle = '#080d24';
    cinemaWorld.buildings.forEach((b, idx) => {
      if (idx % 2 === 0) {
        cinemaCtx.fillRect(b.x - 10, horizonY - b.h * 0.7, b.w * 1.2, b.h * 0.7);
      }
    });

    cinemaWorld.buildings.forEach(b => {
      const bH = b.h;
      const bY = horizonY - bH;
      cinemaCtx.fillStyle = '#050714';
      cinemaCtx.fillRect(b.x, bY, b.w, bH);

      cinemaCtx.strokeStyle = 'rgba(0, 243, 255, 0.25)';
      cinemaCtx.lineWidth = 1;
      cinemaCtx.strokeRect(b.x, bY, b.w, bH);

      if (b.hasAntenna) {
        const ax = b.x + b.w / 2;
        cinemaCtx.strokeStyle = 'rgba(0, 243, 255, 0.4)';
        cinemaCtx.beginPath();
        cinemaCtx.moveTo(ax, bY);
        cinemaCtx.lineTo(ax, bY - 18);
        cinemaCtx.stroke();

        const beaconFlash = (Math.sin(performance.now() * 0.005 + b.x) + 1) / 2;
        cinemaCtx.fillStyle = `rgba(255, 0, 85, ${beaconFlash})`;
        cinemaCtx.beginPath();
        cinemaCtx.arc(ax, bY - 18, 2, 0, Math.PI * 2);
        cinemaCtx.fill();
      }

      const winW = (b.w - 8) / b.windowCols;
      const winH = (bH - 12) / b.windowRows;
      for (let r = 0; r < b.windowRows; r++) {
        for (let c = 0; c < b.windowCols; c++) {
          const isLit = (Math.sin(b.x + r * 3 + c * 7) > 0.1);
          if (isLit) {
            cinemaCtx.fillStyle = (c % 2 === 0) ? 'rgba(0, 243, 255, 0.35)' : 'rgba(189, 0, 255, 0.3)';
            cinemaCtx.fillRect(b.x + 4 + c * winW, bY + 6 + r * winH, winW - 2, winH - 2);
          }
        }
      }
    });

    // 5. Mysterious Escape Portal at Horizon
    const portalX = w * 0.5; // Centered at horizon
    const portalY = horizonY - 24;
    const portalTime = performance.now() * 0.002;

    cinemaCtx.save();
    const colGrad = cinemaCtx.createLinearGradient(portalX, portalY, portalX, 0);
    colGrad.addColorStop(0, 'rgba(0, 243, 255, 0.3)');
    colGrad.addColorStop(0.6, 'rgba(189, 0, 255, 0.15)');
    colGrad.addColorStop(1, 'transparent');
    cinemaCtx.fillStyle = colGrad;
    cinemaCtx.fillRect(portalX - 40, 0, 80, portalY);

    for (let i = 0; i < 4; i++) {
      cinemaCtx.beginPath();
      const rX = 35 + i * 16;
      const rY = 16 + i * 7;
      const rot = portalTime * (i % 2 === 0 ? 1 : -1.2);
      cinemaCtx.ellipse(portalX, portalY, rX, rY, rot, 0, Math.PI * 2);
      cinemaCtx.strokeStyle = i % 2 === 0 ? 'rgba(0, 243, 255, 0.8)' : 'rgba(189, 0, 255, 0.8)';
      cinemaCtx.lineWidth = 2.5;
      cinemaCtx.shadowColor = i % 2 === 0 ? '#00f3ff' : '#bd00ff';
      cinemaCtx.shadowBlur = 15;
      cinemaCtx.stroke();
    }
    cinemaCtx.shadowBlur = 0;
    cinemaCtx.restore();

    // 6. Receding 3D Perspective Digital Grid Floor
    const floorGrad = cinemaCtx.createLinearGradient(0, horizonY, 0, h);
    floorGrad.addColorStop(0, '#0a0f28');
    floorGrad.addColorStop(0.4, '#060a1d');
    floorGrad.addColorStop(1, '#02040b');
    cinemaCtx.fillStyle = floorGrad;
    cinemaCtx.fillRect(0, horizonY, w, h - horizonY);

    const vpX = portalX;
    cinemaCtx.strokeStyle = 'rgba(0, 243, 255, 0.22)';
    cinemaCtx.lineWidth = 1;
    cinemaCtx.beginPath();
    const fanLines = 28;
    for (let i = -fanLines; i <= fanLines; i++) {
      cinemaCtx.moveTo(vpX, horizonY);
      const bottomX = vpX + i * (w / fanLines) * 2;
      cinemaCtx.lineTo(bottomX, h);
    }
    cinemaCtx.stroke();

    cinemaWorld.gridOffset = (cinemaWorld.gridOffset + 0.35) % 1;
    cinemaCtx.strokeStyle = 'rgba(189, 0, 255, 0.3)';
    cinemaCtx.beginPath();
    for (let i = 0; i < 18; i++) {
      const t = (i + cinemaWorld.gridOffset) / 18;
      const py = horizonY + Math.pow(t, 2.2) * (h - horizonY);
      cinemaCtx.moveTo(0, py);
      cinemaCtx.lineTo(w, py);
    }
    cinemaCtx.stroke();

    cinemaCtx.strokeStyle = 'rgba(0, 243, 255, 0.6)';
    cinemaCtx.shadowColor = '#00f3ff';
    cinemaCtx.shadowBlur = 10;
    cinemaCtx.lineWidth = 2;
    cinemaCtx.beginPath();
    cinemaCtx.moveTo(0, horizonY);
    cinemaCtx.lineTo(w, horizonY);
    cinemaCtx.stroke();
    cinemaCtx.shadowBlur = 0;

    // 7. Distant Sky Drones
    cinemaWorld.drones.forEach(d => {
      d.x += d.vx;
      if (d.x > w + 40) d.x = -40;
      if (d.x < -40) d.x = w + 40;
      cinemaCtx.fillStyle = '#fff';
      cinemaCtx.fillRect(d.x - 4, d.y - 1, 8, 2);
      const flash = (Math.sin(performance.now() * 0.008 + d.x) > 0);
      if (flash) {
        cinemaCtx.fillStyle = d.color;
        cinemaCtx.shadowColor = d.color;
        cinemaCtx.shadowBlur = 8;
        cinemaCtx.beginPath();
        cinemaCtx.arc(d.x, d.y, 2, 0, Math.PI * 2);
        cinemaCtx.fill();
        cinemaCtx.shadowBlur = 0;
      }
    });

    // 8. Digital Rain Streams & Runes
    if (state.particlesEnabled) {
      cinemaWorld.rainDrops.forEach(r => {
        r.y += r.speed;
        if (r.y > h) { r.y = -20; r.x = Math.random() * w; }
        cinemaCtx.strokeStyle = `rgba(0, 243, 255, ${r.alpha})`;
        cinemaCtx.lineWidth = 1;
        cinemaCtx.beginPath();
        cinemaCtx.moveTo(r.x, r.y);
        cinemaCtx.lineTo(r.x, r.y + r.length);
        cinemaCtx.stroke();
      });

      cinemaWorld.floatingGlyphs.forEach(g => {
        g.y += g.vy;
        if (g.y < -30) { g.y = h + 20; g.x = Math.random() * w; }
        cinemaCtx.font = `bold ${g.size}px monospace`;
        cinemaCtx.fillStyle = `rgba(0, 243, 255, ${g.alpha})`;
        cinemaCtx.fillText(g.text, g.x, g.y);
      });
    }
  }

  // ==========================================
  // LEVEL PARSER & THEME APPLIER
  // ==========================================
  function applyLevelTheme(theme) {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-accent', theme.accent);
    root.style.setProperty('--theme-wall', theme.wallBg);
    root.style.setProperty('--theme-wall-border', theme.wallBorder);
    root.style.setProperty('--theme-floor', theme.floorBg);
    root.style.setProperty('--theme-glow', theme.glow);
    if (hudThemeName) {
      hudThemeName.textContent = theme.name;
    }
  }

  function loadLevel(levelIndex) {
    if (levelIndex < 0 || levelIndex >= LEVELS.length) return;
    state.currentLevelIdx = levelIndex;
    const levelData = LEVELS[levelIndex];

    applyLevelTheme(levelData.theme);

    state.gridRows = levelData.map.length;
    state.gridCols = levelData.map[0].length;
    state.grid = [];
    state.keys = [];
    state.doors = [];
    state.powerups = [];
    state.enemies = [];
    state.particles = [];
    state.floatingTexts = [];
    state.doorsUnlocked = false;
    state.keysCollected = 0;
    state.timeLeft = levelData.timeLimit;
    state.levelScore = 0;
    state.speedBoostTimer = 0;
    state.freezeTimer = 0;
    state.invincibleTimer = 2.5;
    audio.lastBeepSecond = -1;

    for (let r = 0; r < state.gridRows; r++) {
      const rowArr = [];
      const rowStr = levelData.map[r];
      for (let c = 0; c < state.gridCols; c++) {
        const char = rowStr[c] || '#';
        if (char === '#') {
          rowArr.push(1);
        } else {
          rowArr.push(0);
          if (char === 'P') {
            state.player.x = c + 0.5;
            state.player.y = r + 0.5;
            state.player.angle = Math.PI / 2;
            state.player.walkCycle = 0;
            state.player.isMoving = false;
          } else if (char === 'K') {
            state.keys.push({ x: c + 0.5, y: r + 0.5, collected: false, angle: Math.random() * Math.PI });
          } else if (char === 'D') {
            state.doors.push({ x: c, y: r });
          } else if (char === 'E') {
            state.exit = { x: c + 0.5, y: r + 0.5 };
          } else if (char === 'S') {
            state.powerups.push({ type: 'shield', x: c + 0.5, y: r + 0.5, collected: false });
          } else if (char === 'B') {
            state.powerups.push({ type: 'speed', x: c + 0.5, y: r + 0.5, collected: false });
          } else if (char === 'F') {
            state.powerups.push({ type: 'freeze', x: c + 0.5, y: r + 0.5, collected: false });
          } else if (char === 'R') {
            const enemyIdx = state.enemies.length;
            // Primary enemy is Cyber Police Officer, alternating with Cartoon Security Drones
            const enemyType = (enemyIdx === 0 || (enemyIdx % 2 === 0)) ? 'police' : 'drone';
            state.enemies.push({
              id: enemyIdx,
              type: enemyType,
              x: c + 0.5,
              y: r + 0.5,
              homeX: c + 0.5,
              homeY: r + 0.5,
              dir: Math.floor(Math.random() * 4),
              facingAngle: [ -Math.PI / 2, 0, Math.PI / 2, Math.PI ][Math.floor(Math.random() * 4)],
              speed: enemyType === 'police' ? levelData.enemySpeed : levelData.enemySpeed * 0.88,
              alert: false,
              state: 'patrol',
              path: [],
              pathTimer: 0,
              walkCycle: 0
            });
          }
        }
      }
      state.grid.push(rowArr);
    }

    state.totalKeys = state.keys.length;
    resizeCanvas();
    updateCamera(0, true);
    updateHUD();

    canvas.classList.remove('canvas-fade-in');
    void canvas.offsetWidth;
    canvas.classList.add('canvas-fade-in');
  }

  function getAvailableGameDimensions() {
    const container = document.getElementById('game-container');
    const wrapper = document.getElementById('canvas-wrapper');
    const hudEl = document.getElementById('hud');
    const mobileEl = document.getElementById('mobile-controls');

    // Visual viewport gives true dimensions excluding browser toolbars / virtual keyboards
    const vv = window.visualViewport;
    const viewportH = (vv && vv.height > 100) ? vv.height : window.innerHeight;
    const viewportW = (vv && vv.width > 100) ? vv.width : window.innerWidth;

    const totalH = (container && container.clientHeight > 100)
      ? Math.min(container.clientHeight, viewportH)
      : viewportH;

    const totalW = (container && container.clientWidth > 100)
      ? Math.min(container.clientWidth, viewportW)
      : viewportW;

    const isMobile = window.innerWidth <= 1024 ||
      window.matchMedia('(pointer: coarse)').matches ||
      ('ontouchstart' in window);

    // Height reserved for mobile D-pad controls (44px * 2 rows + 6px gap + safe-area padding ~102px)
    // In short landscape screens, controls are ~80px
    const controlsH = isMobile ? (totalH <= 480 ? 80 : 102) : 0;

    // HUD height: accurately measured if rendered, or safe fallback
    let hudH = 50;
    if (hudEl && !hudEl.classList.contains('hidden') && hudEl.offsetHeight > 0) {
      hudH = hudEl.offsetHeight;
    } else if (isMobile) {
      hudH = totalW < 500 ? 64 : 50;
    }

    const paddingReserve = 10;

    // Calculate maximum allowable height that leaves full room for mobile controls and HUD
    const maxSafeH = Math.max(120, totalH - hudH - controlsH - paddingReserve);
    const maxSafeW = Math.max(160, totalW - 14);

    let availW = maxSafeW;
    let availH = maxSafeH;

    if (wrapper && wrapper.clientWidth > 50 && wrapper.clientHeight > 50) {
      availW = Math.min(wrapper.clientWidth - 4, maxSafeW);
      availH = Math.min(wrapper.clientHeight - 4, maxSafeH);
    }

    return {
      width: Math.max(160, Math.floor(availW)),
      height: Math.max(120, Math.floor(availH))
    };
  }

  function resizeCanvas() {
    if (!state.gridCols || !state.gridRows) return;

    // Fixed gameplay viewport: Calculate available container dimensions
    // Leaves room for compact HUD and keeps entire maze visible simultaneously
    const { width: availableW, height: availableH } = getAvailableGameDimensions();

    // Scale entire maze proportionally so all walls, keys, doors, enemies, and exit fit on screen
    const fitCellW = Math.floor(availableW / state.gridCols);
    const fitCellH = Math.floor(availableH / state.gridRows);
    const cellSize = Math.max(5, Math.min(fitCellW, fitCellH));

    state.cellSize = cellSize;

    const targetW = state.gridCols * state.cellSize;
    const targetH = state.gridRows * state.cellSize;

    state.viewportW = targetW;
    state.viewportH = targetH;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = targetW * dpr;
    canvas.height = targetH * dpr;
    canvas.style.width = targetW + 'px';
    canvas.style.height = targetH + 'px';

    ctx.resetTransform?.();
    ctx.scale(dpr, dpr);

    // Fixed maze viewport: zero camera offset, maze never scrolls or pans
    state.camera.x = 0;
    state.camera.y = 0;
  }

  function updateCamera(dt, instant = false) {
    // Fixed gameplay viewport: Entire maze remains static on screen without viewport movement
    state.camera.x = 0;
    state.camera.y = 0;
  }

  // ==========================================
  // PATHFINDING FOR BOT TRACKING
  // ==========================================
  function findPathBFS(startGridX, startGridY, targetGridX, targetGridY) {
    if (startGridX === targetGridX && startGridY === targetGridY) return [];

    const queue = [{ x: startGridX, y: startGridY, path: [] }];
    const visited = new Set();
    visited.add(`${startGridX},${startGridY}`);

    const directions = [
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 }
    ];

    let steps = 0;
    while (queue.length > 0 && steps < 300) {
      steps++;
      const current = queue.shift();

      if (current.x === targetGridX && current.y === targetGridY) {
        return current.path;
      }

      for (const d of directions) {
        const nx = current.x + d.dx;
        const ny = current.y + d.dy;
        const key = `${nx},${ny}`;

        if (
          nx >= 0 && nx < state.gridCols &&
          ny >= 0 && ny < state.gridRows &&
          !visited.has(key)
        ) {
          const isWall = state.grid[ny][nx] === 1;
          const isLockedDoor = !state.doorsUnlocked && state.doors.some(door => door.x === nx && door.y === ny);

          if (!isWall && !isLockedDoor) {
            visited.add(key);
            queue.push({
              x: nx,
              y: ny,
              path: [...current.path, { x: nx + 0.5, y: ny + 0.5 }]
            });
          }
        }
      }
    }
    return [];
  }

  function hasLineOfSight(x1, y1, x2, y2) {
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const steps = Math.ceil(dist * 4);
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const testX = Math.floor(x1 + (x2 - x1) * t);
      const testY = Math.floor(y1 + (y2 - y1) * t);
      if (testX >= 0 && testX < state.gridCols && testY >= 0 && testY < state.gridRows) {
        if (state.grid[testY][testX] === 1) return false;
        if (!state.doorsUnlocked && state.doors.some(d => d.x === testX && d.y === testY)) return false;
      }
    }
    return true;
  }

  // ==========================================
  // PARTICLES & EFFECTS
  // ==========================================
  function spawnParticles(x, y, count, color, speedMultiplier = 1) {
    if (!state.particlesEnabled) return;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 2 + 1) * speedMultiplier;
      state.particles.push({
        x: x * state.cellSize,
        y: y * state.cellSize,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: color,
        life: 1.0,
        decay: Math.random() * 0.03 + 0.02,
        size: Math.random() * 3 + 2
      });
    }
  }

  function addFloatingText(x, y, text, color) {
    state.floatingTexts.push({
      x: x * state.cellSize,
      y: y * state.cellSize,
      text: text,
      color: color,
      life: 1.0,
      decay: 0.02
    });
  }

  function triggerScreenShake() {
    if (!state.shakeEnabled) return;
    canvas.classList.remove('screen-shake');
    void canvas.offsetWidth;
    canvas.classList.add('screen-shake');
    setTimeout(() => {
      canvas.classList.remove('screen-shake');
    }, 350);
  }

  function triggerDamageFlash() {
    damageFlash.classList.add('active');
    setTimeout(() => {
      damageFlash.classList.remove('active');
    }, 200);
  }

  // ==========================================
  // COLLISION DETECTION WITH CORNER-GLIDE
  // ==========================================
  function checkWallCollision(x, y, radius) {
    const minTileX = Math.floor(x - radius);
    const maxTileX = Math.floor(x + radius);
    const minTileY = Math.floor(y - radius);
    const maxTileY = Math.floor(y + radius);

    for (let ty = minTileY; ty <= maxTileY; ty++) {
      for (let tx = minTileX; tx <= maxTileX; tx++) {
        if (tx < 0 || tx >= state.gridCols || ty < 0 || ty >= state.gridRows) {
          return true;
        }
        if (state.grid[ty][tx] === 1) {
          const nearestX = Math.max(tx, Math.min(x, tx + 1));
          const nearestY = Math.max(ty, Math.min(y, ty + 1));
          const distSq = (x - nearestX) ** 2 + (y - nearestY) ** 2;
          if (distSq < radius * radius) {
            return true;
          }
        }
        if (!state.doorsUnlocked && state.doors.some(d => d.x === tx && d.y === ty)) {
          const nearestX = Math.max(tx, Math.min(x, tx + 1));
          const nearestY = Math.max(ty, Math.min(y, ty + 1));
          const distSq = (x - nearestX) ** 2 + (y - nearestY) ** 2;
          if (distSq < radius * radius) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // ==========================================
  // GAMEPLAY UPDATE LOOP
  // ==========================================
  function update(dt) {
    if (state.screen !== 'PLAYING') return;

    // Countdown Timer with Warning Alarm
    state.timeLeft -= dt;
    const secondsLeft = Math.ceil(state.timeLeft);

    if (secondsLeft <= 10 && secondsLeft > 0) {
      audio.playWarningBeep(secondsLeft);
    }

    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      handleGameOver("TIMER EXPIRED — QUANTUM LOCKDOWN");
      return;
    }

    // Power-up Timers
    if (state.speedBoostTimer > 0) {
      state.speedBoostTimer = Math.max(0, state.speedBoostTimer - dt);
    }
    if (state.freezeTimer > 0) {
      state.freezeTimer = Math.max(0, state.freezeTimer - dt);
    }
    if (state.invincibleTimer > 0) {
      state.invincibleTimer = Math.max(0, state.invincibleTimer - dt);
    }

    // Responsive Movement with Corner-Glide
    const baseSpeed = state.speedBoostTimer > 0 ? 5.6 : 3.6;
    let moveX = 0;
    let moveY = 0;

    if (state.input.up) moveY -= 1;
    if (state.input.down) moveY += 1;
    if (state.input.left) moveX -= 1;
    if (state.input.right) moveX += 1;

    if (moveX !== 0 && moveY !== 0) {
      moveX /= Math.SQRT2;
      moveY /= Math.SQRT2;
    }

    if (moveX !== 0 || moveY !== 0) {
      state.player.angle = Math.atan2(moveY, moveX);
      state.player.walkCycle += dt * 8;
      state.player.isMoving = true;
      const targetSpeed = baseSpeed * dt;
      const colRadius = state.player.radius;

      // Safe Corner-Glide: When moving along an axis, gently center on corridor axis ONLY if unblocked
      if (moveX !== 0 && moveY === 0) {
        const targetCenterY = Math.floor(state.player.y) + 0.5;
        const diffY = targetCenterY - state.player.y;
        if (Math.abs(diffY) > 0.02) {
          const testY = state.player.y + Math.sign(diffY) * Math.min(Math.abs(diffY), targetSpeed * 0.4);
          if (!checkWallCollision(state.player.x, testY, colRadius)) {
            state.player.y = testY;
          }
        }
      } else if (moveY !== 0 && moveX === 0) {
        const targetCenterX = Math.floor(state.player.x) + 0.5;
        const diffX = targetCenterX - state.player.x;
        if (Math.abs(diffX) > 0.02) {
          const testX = state.player.x + Math.sign(diffX) * Math.min(Math.abs(diffX), targetSpeed * 0.4);
          if (!checkWallCollision(testX, state.player.y, colRadius)) {
            state.player.x = testX;
          }
        }
      }

      // X-Axis Movement with wall check
      const newX = state.player.x + moveX * targetSpeed;
      if (!checkWallCollision(newX, state.player.y, colRadius)) {
        state.player.x = newX;
      }

      // Y-Axis Movement with wall check
      const newY = state.player.y + moveY * targetSpeed;
      if (!checkWallCollision(state.player.x, newY, colRadius)) {
        state.player.y = newY;
      }

      // Unstuck failsafe: if player ever overlaps a wall boundary, separate towards cell center
      if (checkWallCollision(state.player.x, state.player.y, colRadius)) {
        const cx = Math.floor(state.player.x) + 0.5;
        const cy = Math.floor(state.player.y) + 0.5;
        if (!checkWallCollision(cx, cy, colRadius)) {
          state.player.x = cx;
          state.player.y = cy;
        }
      }

      const levelTheme = LEVELS[state.currentLevelIdx].theme;
      if (Math.random() < (state.speedBoostTimer > 0 ? 0.7 : 0.25)) {
        spawnParticles(state.player.x, state.player.y, 1, state.speedBoostTimer > 0 ? '#ffb703' : levelTheme.accent, 0.4);
      }
    } else {
      state.player.isMoving = false;
    }

    // Key Collection
    const levelTheme = LEVELS[state.currentLevelIdx].theme;
    state.keys.forEach(k => {
      if (!k.collected) {
        const dist = Math.hypot(state.player.x - k.x, state.player.y - k.y);
        if (dist < state.player.radius + 0.38) {
          k.collected = true;
          state.keysCollected++;
          state.score += 250;
          state.levelScore += 250;
          audio.playKey();
          spawnParticles(k.x, k.y, 18, levelTheme.keyColor, 1.6);
          addFloatingText(k.x, k.y, '+250 KEY', levelTheme.keyColor);

          // All keys gathered -> disarm laser gates
          if (state.keysCollected >= state.totalKeys && !state.doorsUnlocked) {
            state.doorsUnlocked = true;
            audio.playDoorOpen();
            state.doors.forEach(d => {
              spawnParticles(d.x + 0.5, d.y + 0.5, 30, '#00ff88', 2.0);
              addFloatingText(d.x + 0.5, d.y + 0.5, 'GATE DISARMED', '#00ff88');
            });
            spawnParticles(state.exit.x, state.exit.y, 40, '#00ff88', 2.5);
            addFloatingText(state.exit.x, state.exit.y, 'PORTAL ACTIVE! ESCAPE!', '#00ff88');
            showGameAlert('★ ALL KEYS COLLECTED! ACCESS PORTAL UNLOCKED! ESCAPE! ★');
          }
        }
      }
    });

    // Power-up Pickups
    state.powerups.forEach(p => {
      if (!p.collected) {
        const dist = Math.hypot(state.player.x - p.x, state.player.y - p.y);
        if (dist < state.player.radius + 0.38) {
          p.collected = true;
          audio.playPowerup();
          state.score += 200;
          state.levelScore += 200;

          if (p.type === 'shield') {
            state.shieldActive = true;
            spawnParticles(p.x, p.y, 20, '#00f3ff', 1.8);
            addFloatingText(p.x, p.y, 'SHIELD ARMED!', '#00f3ff');
          } else if (p.type === 'speed') {
            state.speedBoostTimer = 7.0;
            spawnParticles(p.x, p.y, 20, '#ffb703', 2.0);
            addFloatingText(p.x, p.y, 'OVERDRIVE SPEED!', '#ffb703');
          } else if (p.type === 'freeze') {
            state.freezeTimer = 6.0;
            audio.playFreeze();
            spawnParticles(p.x, p.y, 20, '#70f3ff', 1.8);
            addFloatingText(p.x, p.y, 'SENTINELS FROZEN!', '#70f3ff');
          }
        }
      }
    });

    // Reliable Win Condition & Exit Reach
    if (state.doorsUnlocked || state.keysCollected >= state.totalKeys) {
      const distToExit = Math.hypot(state.player.x - state.exit.x, state.player.y - state.exit.y);
      const sameCell = Math.floor(state.player.x) === Math.floor(state.exit.x) &&
                       Math.floor(state.player.y) === Math.floor(state.exit.y);
      if (distToExit < 0.85 || sameCell) {
        handleLevelCleared();
        return;
      }
    }

    // Security Robots & Cyber Police AI
    const isFrozen = state.freezeTimer > 0;
    const levelData = LEVELS[state.currentLevelIdx];

    state.enemies.forEach(bot => {
      if (isFrozen) {
        bot.state = 'frozen';
        return;
      }

      const distToPlayer = Math.hypot(state.player.x - bot.x, state.player.y - bot.y);
      const isPolice = bot.type === 'police';
      const detectRange = isPolice ? levelData.detectionRange : Math.min(3.2, levelData.detectionRange * 0.75);
      const inDetection = distToPlayer <= detectRange && hasLineOfSight(bot.x, bot.y, state.player.x, state.player.y);

      if (inDetection) {
        if (!bot.alert) {
          bot.alert = true;
          if (isPolice) {
            audio.playPoliceAlert();
            showGameAlert('🚨 POLICE DETECTED! RUN, CYBER THIEF!');
            addFloatingText(bot.x, bot.y, '🚨 POLICE CHASE!', '#ff0055');
          } else {
            addFloatingText(bot.x, bot.y, '🤖 BOT ALERT!', '#ffb703');
          }
        }
        bot.state = 'chase';
        bot.pathTimer -= dt;

        if (bot.pathTimer <= 0 || bot.path.length === 0) {
          bot.path = findPathBFS(
            Math.floor(bot.x),
            Math.floor(bot.y),
            Math.floor(state.player.x),
            Math.floor(state.player.y)
          );
          bot.pathTimer = isPolice ? 0.32 : 0.5;
        }

        if (bot.path.length > 0) {
          const nextTarget = bot.path[0];
          const angleToTarget = Math.atan2(nextTarget.y - bot.y, nextTarget.x - bot.x);
          bot.facingAngle = angleToTarget;
          bot.walkCycle += dt * (isPolice ? 8 : 5);
          const step = bot.speed * (isPolice ? 1.15 : 1.0) * dt;

          const mx = Math.cos(angleToTarget) * step;
          const my = Math.sin(angleToTarget) * step;

          if (!checkWallCollision(bot.x + mx, bot.y, 0.3)) bot.x += mx;
          if (!checkWallCollision(bot.x, bot.y + my, 0.3)) bot.y += my;

          if (Math.hypot(nextTarget.x - bot.x, nextTarget.y - bot.y) < 0.2) {
            bot.path.shift();
          }
        }
      } else {
        bot.state = 'patrol';
        bot.alert = false;
        bot.path = [];
        bot.walkCycle += dt * (isPolice ? 5 : 4);

        const dirDeltas = [
          { dx: 0, dy: -1 },
          { dx: 1, dy: 0 },
          { dx: 0, dy: 1 },
          { dx: -1, dy: 0 }
        ];

        bot.facingAngle = [ -Math.PI / 2, 0, Math.PI / 2, Math.PI ][bot.dir];
        const curDelta = dirDeltas[bot.dir];
        const step = bot.speed * dt;
        const nextX = bot.x + curDelta.dx * step;
        const nextY = bot.y + curDelta.dy * step;

        if (!checkWallCollision(nextX, nextY, 0.3)) {
          bot.x = nextX;
          bot.y = nextY;
          if (Math.random() < 0.02) {
            const availableDirs = [0, 1, 2, 3].filter(d => {
              const testDelta = dirDeltas[d];
              return !checkWallCollision(bot.x + testDelta.dx * 0.5, bot.y + testDelta.dy * 0.5, 0.3);
            });
            if (availableDirs.length > 1) {
              bot.dir = availableDirs[Math.floor(Math.random() * availableDirs.length)];
            }
          }
        } else {
          const availableDirs = [0, 1, 2, 3].filter(d => {
            const testDelta = dirDeltas[d];
            return !checkWallCollision(bot.x + testDelta.dx * 0.5, bot.y + testDelta.dy * 0.5, 0.3);
          });
          if (availableDirs.length > 0) {
            bot.dir = availableDirs[Math.floor(Math.random() * availableDirs.length)];
          } else {
            bot.dir = (bot.dir + 2) % 4;
          }
        }
      }

      // Enemy vs Player Collision
      if (state.invincibleTimer <= 0) {
        const colDist = Math.hypot(state.player.x - bot.x, state.player.y - bot.y);
        if (colDist < state.player.radius + 0.35) {
          if (state.shieldActive) {
            state.shieldActive = false;
            audio.playShieldDeflect();
            triggerScreenShake();
            spawnParticles(state.player.x, state.player.y, 25, '#00f3ff', 2.5);
            addFloatingText(state.player.x, state.player.y, 'SHIELD DEFLECTED!', '#00f3ff');
            bot.x = bot.homeX;
            bot.y = bot.homeY;
            bot.alert = false;
            state.invincibleTimer = 1.5;
          } else {
            handlePlayerHit(bot.type);
          }
        }
      }
    });

    // Update Particles
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) {
        state.particles.splice(i, 1);
      }
    }

    // Update Floating Text
    for (let i = state.floatingTexts.length - 1; i >= 0; i--) {
      const ft = state.floatingTexts[i];
      ft.y -= 0.6;
      ft.life -= ft.decay;
      if (ft.life <= 0) {
        state.floatingTexts.splice(i, 1);
      }
    }

    updateCamera(dt, false);
    updateHUD();
  }

  // ==========================================
  // PROGRESSION & WINNING LOGIC
  // ==========================================
  function handlePlayerHit(attackerType = 'police') {
    state.lives--;
    audio.playDamage();
    triggerScreenShake();
    triggerDamageFlash();
    spawnParticles(state.player.x, state.player.y, 35, '#ff0055', 2.5);
    
    const hitLabel = attackerType === 'police' ? '🚨 BUSTED! -1 INTEGRITY' : '🤖 SHOCKED! -1 INTEGRITY';
    addFloatingText(state.player.x, state.player.y, hitLabel, '#ff0055');

    // Reset police chasing alert state
    state.enemies.forEach(bot => {
      bot.alert = false;
      bot.state = 'patrol';
      bot.path = [];
    });

    if (state.lives <= 0) {
      handleGameOver(attackerType === 'police' ? "APPREHENDED BY CYBER POLICE" : "SYSTEM INTEGRITY OVERLOAD");
    } else {
      const levelData = LEVELS[state.currentLevelIdx];
      for (let r = 0; r < levelData.map.length; r++) {
        for (let c = 0; c < levelData.map[r].length; c++) {
          if (levelData.map[r][c] === 'P') {
            state.player.x = c + 0.5;
            state.player.y = r + 0.5;
          }
        }
      }
      state.player.angle = Math.PI / 2;
      state.player.walkCycle = 0;
      state.player.isMoving = false;
      state.invincibleTimer = 3.0; // 3.0s safe respawn damage shield protection!
      updateHUD();
    }
  }

  function handleLevelCleared() {
    audio.playLevelClear();

    const timeBonus = Math.floor(state.timeLeft) * 25;
    const livesBonus = state.lives * 300;
    const levelBonus = 1000 * (state.currentLevelIdx + 1);
    const totalBonus = timeBonus + livesBonus + levelBonus;

    state.score += totalBonus;
    saveHighScores();

    document.getElementById('clear-lvl-num').textContent = state.currentLevelIdx + 1;
    document.getElementById('clear-time-left').textContent = `${Math.ceil(state.timeLeft)}s (+${timeBonus})`;
    document.getElementById('clear-lives-left').textContent = `${state.lives} (+${livesBonus})`;
    document.getElementById('clear-score-total').textContent = state.score.toLocaleString();

    if (state.currentLevelIdx + 1 >= state.unlockedLevel) {
      state.unlockedLevel = Math.min(LEVELS.length, state.currentLevelIdx + 2);
      localStorage.setItem('cyber_escape_max_level', state.unlockedLevel.toString());
    }

    const nextIdx = state.currentLevelIdx + 1;
    const nextSectorPreview = document.getElementById('next-sector-preview');
    if (nextIdx < LEVELS.length) {
      nextSectorPreview.style.display = 'flex';
      const nextLvl = LEVELS[nextIdx];
      document.getElementById('preview-sector-name').textContent = `Sector ${nextIdx + 1}: ${nextLvl.name}`;
      document.getElementById('preview-sector-time').textContent = `${nextLvl.timeLimit}s Limit`;
      
      const swatchContainer = document.getElementById('preview-swatches');
      swatchContainer.innerHTML = '';
      nextLvl.theme.swatches.forEach(color => {
        const circle = document.createElement('div');
        circle.className = 'swatch-circle';
        circle.style.backgroundColor = color;
        swatchContainer.appendChild(circle);
      });
      btnNextLevel.textContent = 'PROCEED TO NEXT SECTOR ▶';
    } else {
      nextSectorPreview.style.display = 'none';
      btnNextLevel.textContent = 'VIEW GRAND ESCAPE VICTORY 🏆';
    }

    setScreen('LEVEL_CLEAR');
  }

  function handleGameOver(reasonText) {
    audio.playGameOver();
    saveHighScores();

    document.getElementById('game-over-reason').textContent = reasonText;
    document.getElementById('over-final-score').textContent = state.score.toLocaleString();
    document.getElementById('over-high-score').textContent = state.highScore.toLocaleString();

    const newRecordTag = document.getElementById('new-record-tag');
    if (state.score >= state.highScore && state.score > 0) {
      newRecordTag.style.display = 'inline-block';
    } else {
      newRecordTag.style.display = 'none';
    }

    setScreen('GAME_OVER');
  }

  function handleVictory() {
    audio.playVictory();
    saveHighScores();

    document.getElementById('vic-final-score').textContent = state.score.toLocaleString();
    document.getElementById('vic-high-score').textContent = state.highScore.toLocaleString();

    setScreen('VICTORY');
  }

  function saveHighScores() {
    if (state.score > state.highScore) {
      state.highScore = state.score;
      localStorage.setItem('cyber_escape_high_score', state.highScore.toString());
    }
  }

  // ==========================================
  // HUD UI UPDATER
  // ==========================================
  function updateHUD() {
    hudLevel.textContent = `${state.currentLevelIdx + 1 < 10 ? '0' : ''}${state.currentLevelIdx + 1} / 10`;
    hudScore.textContent = state.score.toLocaleString();

    const seconds = Math.max(0, Math.ceil(state.timeLeft));
    hudTime.textContent = `${seconds}s`;
    hudTime.className = 'timer-pill';
    if (seconds <= 10) {
      hudTime.classList.add('urgent');
    } else if (seconds <= 20) {
      hudTime.classList.add('warning');
    } else {
      hudTime.classList.add('normal');
    }

    hudKeys.textContent = `${state.keysCollected} / ${state.totalKeys}`;

    hudLivesContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const heart = document.createElement('div');
      heart.className = `heart-node ${i < state.lives ? '' : 'lost'}`;
      hudLivesContainer.appendChild(heart);
    }

    activePowerupsContainer.innerHTML = '';
    if (state.shieldActive) {
      const shieldBadge = document.createElement('div');
      shieldBadge.className = 'powerup-pill shield';
      shieldBadge.textContent = '🛡️ SHIELD';
      activePowerupsContainer.appendChild(shieldBadge);
    }
    if (state.speedBoostTimer > 0) {
      const speedBadge = document.createElement('div');
      speedBadge.className = 'powerup-pill speed';
      speedBadge.textContent = `⚡ SPEED ${Math.ceil(state.speedBoostTimer)}s`;
      activePowerupsContainer.appendChild(speedBadge);
    }
    if (state.freezeTimer > 0) {
      const freezeBadge = document.createElement('div');
      freezeBadge.className = 'powerup-pill freeze';
      freezeBadge.textContent = `❄️ FREEZE ${Math.ceil(state.freezeTimer)}s`;
      activePowerupsContainer.appendChild(freezeBadge);
    }
  }

  // ==========================================
  // CARTOON ADVENTURE RENDERING HELPERS
  // ==========================================

  function drawCartoonWall(ctx, px, py, cs, wallBg, wallBorder, r, c, grid, gridCols, gridRows) {
    // 1. Base Wall Block with 2.5D top bevel highlight and bottom shadow
    ctx.fillStyle = wallBg;
    ctx.fillRect(px, py, cs, cs);

    // Beveled top highlight for dimensional toy/cartoon block feel
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(px, py, cs, Math.max(2, cs * 0.22));

    // Dark bottom drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
    ctx.fillRect(px, py + cs - Math.max(2, cs * 0.18), cs, Math.max(2, cs * 0.18));

    // 2. Neon perimeter borders where wall meets floor corridors
    ctx.strokeStyle = wallBorder;
    ctx.lineWidth = Math.max(1, 1.8);

    if (r > 0 && grid[r - 1][c] === 0) {
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + cs, py); ctx.stroke();
    }
    if (r < gridRows - 1 && grid[r + 1][c] === 0) {
      ctx.beginPath(); ctx.moveTo(px, py + cs); ctx.lineTo(px + cs, py + cs); ctx.stroke();
    }
    if (c > 0 && grid[r][c - 1] === 0) {
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + cs); ctx.stroke();
    }
    if (c < gridCols - 1 && grid[r][c + 1] === 0) {
      ctx.beginPath(); ctx.moveTo(px + cs, py); ctx.lineTo(px + cs, py + cs); ctx.stroke();
    }

    // Micro cyber circuit dot in wall center if cell is large enough
    if (cs >= 18 && (r + c) % 3 === 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.arc(px + cs * 0.5, py + cs * 0.5, Math.max(1, cs * 0.08), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawCartoonFloor(ctx, px, py, cs, floorBg) {
    ctx.fillStyle = floorBg;
    ctx.fillRect(px, py, cs, cs);

    // Subtle digital tile grid dot
    if (cs >= 12) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fillRect(px + cs / 2 - 1, py + cs / 2 - 1, 2, 2);
    }
  }

  function drawSecurityGate(ctx, px, py, cs, isUnlocked) {
    const scale = cs / 40;
    if (!isUnlocked) {
      // 1. Vertical Security Gate Posts with warning hazard stripes
      const postW = Math.max(2, cs * 0.2);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(px, py, postW, cs);
      ctx.fillRect(px + cs - postW, py, postW, cs);

      ctx.strokeStyle = '#ff0055';
      ctx.lineWidth = Math.max(1, 1.2 * scale);
      ctx.strokeRect(px, py, postW, cs);
      ctx.strokeRect(px + cs - postW, py, postW, cs);

      // Warning hazard stripes
      if (cs >= 14) {
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(px + 1, py + cs * 0.25, postW - 2, cs * 0.15);
        ctx.fillRect(px + 1, py + cs * 0.65, postW - 2, cs * 0.15);
        ctx.fillRect(px + cs - postW + 1, py + cs * 0.25, postW - 2, cs * 0.15);
        ctx.fillRect(px + cs - postW + 1, py + cs * 0.65, postW - 2, cs * 0.15);
      }

      // 2. High-Voltage Glowing Laser Barrier Beams
      const time = performance.now() * 0.007;
      ctx.strokeStyle = '#ff0055';
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 8 * scale;
      ctx.lineWidth = Math.max(1.5, 2.5 * scale);

      for (let i = 0; i < 3; i++) {
        const ly = py + cs * (0.28 + i * 0.22);
        ctx.beginPath();
        ctx.moveTo(px + postW, ly + Math.sin(time + i * 1.5) * (cs * 0.06));
        ctx.lineTo(px + cs - postW, ly - Math.sin(time + i * 1.5) * (cs * 0.06));
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // 3. Cartoon Padlock in Center
      const lockX = px + cs * 0.5;
      const lockY = py + cs * 0.5;
      const lockSize = Math.max(3, cs * 0.14);

      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = Math.max(1, 1.2 * scale);
      ctx.beginPath();
      ctx.arc(lockX, lockY - lockSize * 0.5, lockSize * 0.7, Math.PI, 0);
      ctx.stroke();

      ctx.fillRect(lockX - lockSize, lockY - lockSize * 0.4, lockSize * 2, lockSize * 1.6);
      ctx.strokeRect(lockX - lockSize, lockY - lockSize * 0.4, lockSize * 2, lockSize * 1.6);
    } else {
      // Unlocked gate with open emerald pathway
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 2, py + 2, cs - 4, cs - 4);
    }
  }

  function drawExitPortal(ctx, exitPx, exitPy, cs, isUnlocked, primaryThemeColor) {
    const scale = cs / 40;
    const time = performance.now() * 0.003;

    ctx.save();
    ctx.translate(exitPx, exitPy);

    if (isUnlocked) {
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 18 * scale;

      // Rotating Vortex Energy Rings
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const ringR = cs * (0.42 - i * 0.09);
        const ringAngle = time * (i % 2 === 0 ? 2.5 : -2.5);
        ctx.arc(0, 0, ringR, ringAngle, ringAngle + Math.PI * 1.6);
        ctx.strokeStyle = i === 0 ? '#00ff88' : primaryThemeColor;
        ctx.lineWidth = Math.max(1.5, 2.5 * scale);
        ctx.stroke();
      }

      // Glowing Emerald Core
      ctx.fillStyle = '#00ff88';
      ctx.beginPath();
      ctx.arc(0, 0, cs * 0.16, 0, Math.PI * 2);
      ctx.fill();

      // Floating Swirling Sparkles
      for (let i = 0; i < 4; i++) {
        const spA = time * 2.5 + (i * Math.PI / 2);
        const spDist = cs * 0.34;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(Math.cos(spA) * spDist, Math.sin(spA) * spDist, Math.max(1, 1.6 * scale), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Animated "ESCAPE" label
      if (cs >= 22) {
        ctx.fillStyle = '#00ff88';
        ctx.font = `bold ${Math.floor(8 * scale)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('ESCAPE', 0, -cs * 0.48);
      }
    } else {
      // Inactive Sealed Portal
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = Math.max(1, 1.8 * scale);
      ctx.beginPath();
      ctx.arc(0, 0, cs * 0.38, 0, Math.PI * 2);
      ctx.stroke();

      if (cs >= 18) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.font = `bold ${Math.floor(9 * scale)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SEALED', 0, 0);
      }
    }
    ctx.restore();
  }

  function drawCartoonKey(ctx, kx, ky, cs, angle, themeKeyColor) {
    ctx.save();
    ctx.translate(kx, ky);
    const scale = cs / 40;
    const time = performance.now() * 0.003;

    ctx.rotate(angle);

    // Glowing key aura
    ctx.shadowColor = themeKeyColor;
    ctx.shadowBlur = 12 * scale;

    // Golden Cartoon Key
    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = Math.max(1, 1.4 * scale);

    // Key Bow (Head)
    ctx.beginPath();
    ctx.arc(0, -cs * 0.18, cs * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Key Hole
    ctx.fillStyle = '#050814';
    ctx.beginPath();
    ctx.arc(0, -cs * 0.18, cs * 0.06, 0, Math.PI * 2);
    ctx.fill();

    // Key Shaft
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-cs * 0.04, -cs * 0.06, cs * 0.08, cs * 0.32);

    // Key Notches
    ctx.fillRect(cs * 0.04, cs * 0.08, cs * 0.1, cs * 0.06);
    ctx.fillRect(cs * 0.04, cs * 0.18, cs * 0.08, cs * 0.06);

    ctx.shadowBlur = 0;

    // Orbiting Animated Star Sparkles
    const sparklePhase = Math.sin(time * 3);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cs * 0.28 * sparklePhase, -cs * 0.22, Math.max(1, 2 * scale), 0, Math.PI * 2);
    ctx.arc(-cs * 0.26 * sparklePhase, cs * 0.18, Math.max(1, 1.8 * scale), 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawCyberThief(ctx, cx, cy, cs, angle, walkCycle, isMoving, isInvincible, shieldActive, speedActive) {
    ctx.save();
    ctx.translate(cx, cy);

    const scale = cs / 40;
    const r = cs * 0.42;

    // 1. Invincible Damage Protection Flashing Aura
    if (isInvincible) {
      const pulse = Math.sin(performance.now() * 0.02);
      if (pulse > -0.2) {
        ctx.strokeStyle = '#00f3ff';
        ctx.lineWidth = Math.max(1.5, 2 * scale);
        ctx.setLineDash([4 * scale, 3 * scale]);
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // 2. Holographic Shield Bubble
    if (shieldActive) {
      ctx.strokeStyle = '#00f3ff';
      ctx.shadowColor = '#00f3ff';
      ctx.shadowBlur = 12 * scale;
      ctx.lineWidth = Math.max(2, 2.6 * scale);
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // 3. Speed Overdrive Aura
    if (speedActive) {
      ctx.strokeStyle = '#ffb703';
      ctx.shadowColor = '#ffb703';
      ctx.shadowBlur = 10 * scale;
      ctx.lineWidth = Math.max(1.5, 2 * scale);
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Determine direction components
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const isFacingUp = sinA < -0.4;
    const isFacingDown = sinA > 0.4;
    const isFacingLeft = cosA < -0.4;
    const isFacingRight = cosA > 0.4;

    const legSwing = isMoving ? Math.sin(walkCycle * 8) * (r * 0.28) : 0;
    const bobbing = isMoving ? Math.abs(Math.sin(walkCycle * 8)) * (r * 0.1) : Math.sin(performance.now() * 0.003) * (r * 0.05);

    // 4. Futuristic Sneakers (with glowing cyan soles)
    const footY = r * 0.45 - bobbing;
    const footSpacing = r * 0.36;

    // Left Foot
    ctx.save();
    ctx.translate(-footSpacing + (isFacingLeft ? -legSwing : (isFacingRight ? legSwing : 0)), footY + (isFacingDown || isFacingUp ? legSwing : 0));
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.24, r * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#00f3ff';
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 4 * scale;
    ctx.fillRect(-r * 0.22, r * 0.08, r * 0.44, Math.max(1.5, 2 * scale));
    ctx.shadowBlur = 0;
    ctx.restore();

    // Right Foot
    ctx.save();
    ctx.translate(footSpacing + (isFacingLeft ? legSwing : (isFacingRight ? -legSwing : 0)), footY + (isFacingDown || isFacingUp ? -legSwing : 0));
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.24, r * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#00f3ff';
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 4 * scale;
    ctx.fillRect(-r * 0.22, r * 0.08, r * 0.44, Math.max(1.5, 2 * scale));
    ctx.shadowBlur = 0;
    ctx.restore();

    // 5. Tech Backpack containing Stolen Digital Data
    const bpOffset = isFacingUp ? r * 0.3 : (isFacingDown ? -r * 0.32 : 0);
    const bpSideOffset = isFacingLeft ? r * 0.32 : (isFacingRight ? -r * 0.32 : 0);

    ctx.save();
    ctx.translate(bpSideOffset, -bobbing + bpOffset);
    ctx.fillStyle = '#312e81';
    ctx.strokeStyle = '#4338ca';
    ctx.lineWidth = Math.max(1, 1.5 * scale);
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(-r * 0.32, -r * 0.28, r * 0.64, r * 0.48, 4 * scale) : ctx.rect(-r * 0.32, -r * 0.28, r * 0.64, r * 0.48);
    ctx.fill();
    ctx.stroke();

    // Stolen Glowing Cyan Digital Data Packets
    const dataGlow = 0.5 + Math.sin(performance.now() * 0.008) * 0.5;
    ctx.fillStyle = '#00f3ff';
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = (6 + dataGlow * 4) * scale;
    ctx.fillRect(-r * 0.2, -r * 0.18, r * 0.16, r * 0.16);
    ctx.fillRect(r * 0.04, -r * 0.18, r * 0.16, r * 0.16);
    ctx.shadowBlur = 0;
    ctx.restore();

    // 6. Cartoon Thief Purple Hoodie Torso
    ctx.save();
    ctx.translate(0, -bobbing);
    ctx.fillStyle = '#581c87';
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = Math.max(1.2, 1.8 * scale);
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 4 * scale;

    ctx.beginPath();
    ctx.arc(0, 0, r * 0.68, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Hoodie Front Trim
    ctx.strokeStyle = '#7e22ce';
    ctx.lineWidth = Math.max(1, 1.5 * scale);
    ctx.beginPath();
    ctx.arc(0, r * 0.2, r * 0.38, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();

    // 7. Tech Gloves
    const handOffset = isMoving ? Math.sin(walkCycle * 8) * (r * 0.15) : 0;
    // Left glove
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(-r * 0.72, handOffset, r * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#00f3ff';
    ctx.beginPath();
    ctx.arc(-r * 0.72, handOffset, r * 0.06, 0, Math.PI * 2);
    ctx.fill();

    // Right glove
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(r * 0.72, -handOffset, r * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#00f3ff';
    ctx.beginPath();
    ctx.arc(r * 0.72, -handOffset, r * 0.06, 0, Math.PI * 2);
    ctx.fill();

    // 8. Thief Head & Face
    if (!isFacingUp) {
      const faceX = cosA * (r * 0.18);
      const faceY = (sinA * 0.2 - 0.1) * r;

      // Face skin
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.ellipse(faceX, faceY, r * 0.44, r * 0.36, 0, 0, Math.PI * 2);
      ctx.fill();

      // Black Bandit Eye Mask
      ctx.fillStyle = '#09090b';
      ctx.beginPath();
      ctx.ellipse(faceX, faceY - r * 0.04, r * 0.42, r * 0.18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Expressive Cartoon Eyes
      const eyeSpacing = r * 0.18;
      const lookX = cosA * (r * 0.06);
      const lookY = sinA * (r * 0.05);

      // Left Eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(faceX - eyeSpacing, faceY - r * 0.05, r * 0.11, r * 0.13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#00f3ff';
      ctx.beginPath();
      ctx.arc(faceX - eyeSpacing + lookX, faceY - r * 0.05 + lookY, r * 0.07, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(faceX - eyeSpacing + lookX, faceY - r * 0.05 + lookY, r * 0.04, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(faceX - eyeSpacing + lookX - r * 0.02, faceY - r * 0.05 + lookY - r * 0.03, r * 0.025, 0, Math.PI * 2);
      ctx.fill();

      // Right Eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(faceX + eyeSpacing, faceY - r * 0.05, r * 0.11, r * 0.13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#00f3ff';
      ctx.beginPath();
      ctx.arc(faceX + eyeSpacing + lookX, faceY - r * 0.05 + lookY, r * 0.07, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(faceX + eyeSpacing + lookX, faceY - r * 0.05 + lookY, r * 0.04, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(faceX + eyeSpacing + lookX - r * 0.02, faceY - r * 0.05 + lookY - r * 0.03, r * 0.025, 0, Math.PI * 2);
      ctx.fill();

      // Friendly Mischievous Smirk
      ctx.strokeStyle = '#7c2d12';
      ctx.lineWidth = Math.max(1, 1.4 * scale);
      ctx.beginPath();
      ctx.arc(faceX + r * 0.04, faceY + r * 0.14, r * 0.12, 0.1 * Math.PI, 0.7 * Math.PI);
      ctx.stroke();
    } else {
      // Back of the Hood
      ctx.fillStyle = '#6b21a8';
      ctx.beginPath();
      ctx.arc(0, -r * 0.12, r * 0.42, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#3b0764';
      ctx.lineWidth = Math.max(1, 1.5 * scale);
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.5);
      ctx.lineTo(0, r * 0.1);
      ctx.stroke();
    }

    // Cute Hood Ears/Corners
    ctx.fillStyle = '#7e22ce';
    ctx.beginPath();
    ctx.moveTo(-r * 0.45, -r * 0.5);
    ctx.lineTo(-r * 0.25, -r * 0.75);
    ctx.lineTo(-r * 0.1, -r * 0.55);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(r * 0.45, -r * 0.5);
    ctx.lineTo(r * 0.25, -r * 0.75);
    ctx.lineTo(r * 0.1, -r * 0.55);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
    ctx.restore();
  }

  function drawCyberPolice(ctx, cx, cy, cs, facingAngle, walkCycle, isChasing, isFrozen) {
    ctx.save();
    ctx.translate(cx, cy);

    const scale = cs / 40;
    const r = cs * 0.44;

    // 1. Dynamic Scanning Light Cone on Maze Floor
    if (!isFrozen) {
      const coneAngle = 0.52;
      const coneLength = cs * (isChasing ? 2.8 : 2.2);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, coneLength, facingAngle - coneAngle, facingAngle + coneAngle);
      ctx.closePath();

      if (isChasing) {
        // Urgent flashing red chase scanner cone
        const redAlpha = 0.22 + Math.sin(performance.now() * 0.015) * 0.1;
        ctx.fillStyle = `rgba(255, 0, 85, ${redAlpha})`;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 0, 85, 0.7)';
        ctx.lineWidth = Math.max(1, 1.5 * scale);
        ctx.stroke();
      } else {
        // Soft cyan-blue patrol scanner cone
        const scanPulse = 0.12 + Math.sin(performance.now() * 0.005) * 0.05;
        ctx.fillStyle = `rgba(0, 243, 255, ${scanPulse})`;
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = Math.max(1, 1.2 * scale);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 2. Alert Beacon above Head when Chasing
    if (isChasing && !isFrozen) {
      ctx.save();
      const alertBounce = Math.sin(performance.now() * 0.02) * (r * 0.15);
      ctx.translate(0, -r * 1.3 + alertBounce);

      const beaconColor = Math.sin(performance.now() * 0.03) > 0 ? '#ff0055' : '#00f3ff';
      ctx.fillStyle = beaconColor;
      ctx.shadowColor = beaconColor;
      ctx.shadowBlur = 10 * scale;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(10, Math.floor(13 * scale))}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🚨', 0, 0);
      ctx.restore();
    }

    // 3. Stride / Footstep animation
    const cosA = Math.cos(facingAngle);
    const sinA = Math.sin(facingAngle);
    const legSwing = Math.sin(walkCycle * 7) * (r * 0.25);
    const bobbing = Math.abs(Math.sin(walkCycle * 7)) * (r * 0.08);

    ctx.save();
    ctx.translate(0, -bobbing);

    // Boots
    const bootSpacing = r * 0.35;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(-bootSpacing + cosA * legSwing, r * 0.48 + sinA * legSwing, r * 0.2, r * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(bootSpacing - cosA * legSwing, r * 0.48 - sinA * legSwing, r * 0.2, r * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. Futuristic Blue Police Uniform Torso
    const suitColor = isFrozen ? '#1e293b' : (isChasing ? '#1d4ed8' : '#1e40af');
    ctx.fillStyle = suitColor;
    ctx.strokeStyle = isFrozen ? '#70f3ff' : (isChasing ? '#ff0055' : '#38bdf8');
    ctx.lineWidth = Math.max(1.5, 2 * scale);
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 4 * scale;

    ctx.beginPath();
    ctx.arc(0, 0, r * 0.72, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Gold Police Belt
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-r * 0.6, r * 0.18, r * 1.2, r * 0.22);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-r * 0.16, r * 0.15, r * 0.32, r * 0.28);

    // Shiny Gold Police Badge on Chest
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 3 * scale;
    ctx.beginPath();
    ctx.moveTo(r * 0.18, -r * 0.18);
    ctx.lineTo(r * 0.38, -r * 0.18);
    ctx.lineTo(r * 0.38, -r * 0.02);
    ctx.lineTo(r * 0.28, r * 0.08);
    ctx.lineTo(r * 0.18, -r * 0.02);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Epaulets (Gold shoulder pads)
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-r * 0.72, -r * 0.25, r * 0.26, r * 0.12);
    ctx.fillRect(r * 0.46, -r * 0.25, r * 0.26, r * 0.12);

    // 5. Head & Cap
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(cosA * (r * 0.15), -r * 0.12 + sinA * (r * 0.1), r * 0.42, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Police Visor / Determined Eyes
    ctx.fillStyle = isChasing ? '#ff0055' : '#00f3ff';
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 6 * scale;
    ctx.beginPath();
    ctx.ellipse(cosA * (r * 0.15), -r * 0.16 + sinA * (r * 0.1), r * 0.38, r * 0.14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // White Determined Pupil Glints
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cosA * (r * 0.15) - r * 0.18, -r * 0.18 + sinA * (r * 0.1), r * 0.12, r * 0.05);
    ctx.fillRect(cosA * (r * 0.15) + r * 0.06, -r * 0.18 + sinA * (r * 0.1), r * 0.12, r * 0.05);

    // Police Cap
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.ellipse(cosA * (r * 0.12), -r * 0.38 + sinA * (r * 0.08), r * 0.52, r * 0.26, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cap Brim
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.ellipse(cosA * (r * 0.18), -r * 0.28 + sinA * (r * 0.1), r * 0.48, r * 0.14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cap Gold Badge
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(cosA * (r * 0.12), -r * 0.42 + sinA * (r * 0.08), r * 0.09, 0, Math.PI * 2);
    ctx.fill();

    // Frost overlay if frozen
    if (isFrozen) {
      ctx.fillStyle = 'rgba(112, 243, 255, 0.45)';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
    ctx.restore();
  }

  function drawSecurityDrone(ctx, cx, cy, cs, facingAngle, hoverTime, isFrozen) {
    ctx.save();
    ctx.translate(cx, cy);

    const scale = cs / 40;
    const r = cs * 0.38;

    const hoverY = isFrozen ? 0 : Math.sin(hoverTime * 5) * (r * 0.16);
    ctx.translate(0, hoverY);

    // 1. Dual Hover Thrusters with flickering flames
    if (!isFrozen) {
      const jetFlicker = Math.sin(hoverTime * 25) * (r * 0.15) + (r * 0.3);
      ctx.fillStyle = '#f97316';
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 6 * scale;
      ctx.beginPath();
      ctx.ellipse(-r * 0.4, r * 0.52, r * 0.1, jetFlicker, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(r * 0.4, r * 0.52, r * 0.1, jetFlicker, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Thruster pods
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-r * 0.52, r * 0.35, r * 0.24, r * 0.18);
    ctx.fillRect(r * 0.28, r * 0.35, r * 0.24, r * 0.18);

    // 2. Top Antenna with Blinking LED Beacon
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = Math.max(1.2, 1.8 * scale);
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.55);
    ctx.lineTo(0, -r * 0.95);
    ctx.stroke();

    const ledGlow = isFrozen ? '#70f3ff' : (Math.sin(hoverTime * 8) > 0 ? '#ff0055' : '#f59e0b');
    ctx.fillStyle = ledGlow;
    ctx.shadowColor = ledGlow;
    ctx.shadowBlur = 6 * scale;
    ctx.beginPath();
    ctx.arc(0, -r * 0.98, r * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 3. Spherical Metal Chassis
    ctx.fillStyle = isFrozen ? '#0f172a' : '#334155';
    ctx.strokeStyle = isFrozen ? '#70f3ff' : '#f97316';
    ctx.lineWidth = Math.max(1.5, 2 * scale);
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 5 * scale;

    ctx.beginPath();
    ctx.arc(0, 0, r * 0.68, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Hazard Stripes
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.68, 0.8 * Math.PI, 1.2 * Math.PI);
    ctx.arc(0, 0, r * 0.68, -0.2 * Math.PI, 0.2 * Math.PI);
    ctx.fill();

    // 4. Center Cyclops Radar Eye
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.38, 0, Math.PI * 2);
    ctx.fill();

    const eyeColor = isFrozen ? '#70f3ff' : '#f59e0b';
    ctx.fillStyle = eyeColor;
    ctx.shadowColor = eyeColor;
    ctx.shadowBlur = 8 * scale;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.24, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    const scanX = isFrozen ? 0 : Math.sin(hoverTime * 3) * (r * 0.1);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(scanX, 0, r * 0.08, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // ==========================================
  // IN-GAME MAZE RENDERING
  // ==========================================
  function draw() {
    const cs = state.cellSize;
    const levelTheme = LEVELS[state.currentLevelIdx].theme;
    ctx.clearRect(0, 0, state.viewportW, state.viewportH);

    ctx.save();
    // Zero camera translation: the entire maze is fixed and visible simultaneously!
    ctx.translate(-Math.round(state.camera.x), -Math.round(state.camera.y));

    // 1. Maze Walls & Floor (Complete grid)
    for (let r = 0; r < state.gridRows; r++) {
      for (let c = 0; c < state.gridCols; c++) {
        const isWall = state.grid[r][c] === 1;
        const px = c * cs;
        const py = r * cs;

        if (isWall) {
          drawCartoonWall(ctx, px, py, cs, levelTheme.wallBg, levelTheme.wallBorder, r, c, state.grid, state.gridCols, state.gridRows);
        } else {
          drawCartoonFloor(ctx, px, py, cs, levelTheme.floorBg);
        }
      }
    }

    // 2. Holographic Laser Security Gates
    state.doors.forEach(d => {
      drawSecurityGate(ctx, d.x * cs, d.y * cs, cs, state.doorsUnlocked);
    });

    // 3. Glowing Cartoon Exit Portal
    drawExitPortal(ctx, state.exit.x * cs, state.exit.y * cs, cs, state.doorsUnlocked, levelTheme.primary);

    // 4. Encrypted Energy Keys with Sparkles
    state.keys.forEach(k => {
      if (!k.collected) {
        const ky = k.y * cs + Math.sin(performance.now() * 0.005 + k.angle) * (cs * 0.08);
        drawCartoonKey(ctx, k.x * cs, ky, cs, performance.now() * 0.0025 + k.angle, levelTheme.keyColor);
      }
    });

    // 5. Power-ups
    state.powerups.forEach(p => {
      if (!p.collected) {
        const px = p.x * cs;
        const py = p.y * cs + Math.sin(performance.now() * 0.004) * (cs * 0.08);
        ctx.save();
        ctx.translate(px, py);

        let color = '#00f3ff';
        let icon = '🛡️';
        if (p.type === 'speed') { color = '#ffb703'; icon = '⚡'; }
        if (p.type === 'freeze') { color = '#70f3ff'; icon = '❄️'; }

        ctx.shadowColor = color;
        ctx.shadowBlur = 12;

        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(1.5, 2 * (cs / 40));
        ctx.beginPath();
        ctx.arc(0, 0, cs * 0.36, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fill();

        ctx.font = `${Math.floor(cs * 0.42)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(icon, 0, 0);

        ctx.restore();
        ctx.shadowBlur = 0;
      }
    });

    // 6. Cyber Police Officers & Security Drones
    const nowTime = performance.now() * 0.001;
    state.enemies.forEach(bot => {
      const bx = bot.x * cs;
      const by = bot.y * cs;
      const isFrozen = state.freezeTimer > 0;

      if (bot.type === 'police') {
        drawCyberPolice(ctx, bx, by, cs, bot.facingAngle, bot.walkCycle, bot.alert, isFrozen);
      } else {
        drawSecurityDrone(ctx, bx, by, cs, bot.facingAngle, nowTime, isFrozen);
      }
    });

    // 7. Main Character — Cyber Thief
    drawCyberThief(
      ctx,
      state.player.x * cs,
      state.player.y * cs,
      cs,
      state.player.angle,
      state.player.walkCycle,
      state.player.isMoving,
      state.invincibleTimer > 0,
      state.shieldActive,
      state.speedBoostTimer > 0
    );

    // 8. Particles
    if (state.particlesEnabled) {
      state.particles.forEach(p => {
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    // 9. Floating Combat & Score Texts
    state.floatingTexts.forEach(ft => {
      ctx.save();
      ctx.fillStyle = ft.color;
      ctx.globalAlpha = Math.max(0, ft.life);
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = 8;
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });

    ctx.restore();

    // 10. Update Tactical Minimap Radar
    drawMinimap();
  }

  function drawMinimap() {
    if (!minimapCanvas || !minimapCtx || !state.gridCols || !state.gridRows) return;
    if (minimapPanel && minimapPanel.classList.contains('collapsed')) return;

    const mw = minimapCanvas.width;
    const mh = minimapCanvas.height;
    minimapCtx.clearRect(0, 0, mw, mh);

    // Dark sleek radar background
    minimapCtx.fillStyle = 'rgba(3, 7, 18, 0.95)';
    minimapCtx.fillRect(0, 0, mw, mh);

    const pad = 6;
    const availW = mw - pad * 2;
    const availH = mh - pad * 2;

    const cellScale = Math.min(availW / state.gridCols, availH / state.gridRows);
    const offsetX = pad + (availW - state.gridCols * cellScale) / 2;
    const offsetY = pad + (availH - state.gridRows * cellScale) / 2;

    // Draw walls
    minimapCtx.fillStyle = 'rgba(255, 255, 255, 0.14)';
    for (let r = 0; r < state.gridRows; r++) {
      for (let c = 0; c < state.gridCols; c++) {
        if (state.grid[r][c] === 1) {
          minimapCtx.fillRect(offsetX + c * cellScale, offsetY + r * cellScale, Math.max(1, cellScale), Math.max(1, cellScale));
        }
      }
    }

    // Draw Exit
    const exitX = offsetX + state.exit.x * cellScale;
    const exitY = offsetY + state.exit.y * cellScale;
    minimapCtx.fillStyle = state.doorsUnlocked ? '#00ff88' : 'rgba(255, 0, 85, 0.7)';
    minimapCtx.beginPath();
    minimapCtx.arc(exitX, exitY, Math.max(2, cellScale * 0.9), 0, Math.PI * 2);
    minimapCtx.fill();

    // Draw Doors
    state.doors.forEach(d => {
      minimapCtx.fillStyle = state.doorsUnlocked ? 'rgba(0, 255, 136, 0.5)' : '#ff0055';
      minimapCtx.fillRect(offsetX + d.x * cellScale, offsetY + d.y * cellScale, Math.max(2, cellScale), Math.max(2, cellScale));
    });

    // Draw Keys
    state.keys.forEach(k => {
      if (!k.collected) {
        minimapCtx.fillStyle = '#ffb703';
        minimapCtx.beginPath();
        minimapCtx.arc(offsetX + k.x * cellScale, offsetY + k.y * cellScale, Math.max(2, cellScale * 0.7), 0, Math.PI * 2);
        minimapCtx.fill();
      }
    });

    // Draw Power-ups
    state.powerups.forEach(p => {
      if (!p.collected) {
        minimapCtx.fillStyle = p.type === 'shield' ? '#00f3ff' : (p.type === 'speed' ? '#ffb703' : '#70f3ff');
        minimapCtx.beginPath();
        minimapCtx.arc(offsetX + p.x * cellScale, offsetY + p.y * cellScale, Math.max(1.5, cellScale * 0.6), 0, Math.PI * 2);
        minimapCtx.fill();
      }
    });

    // Draw Enemies (Police vs Security Drones)
    state.enemies.forEach(b => {
      if (b.type === 'police') {
        minimapCtx.fillStyle = b.alert ? '#ff0055' : '#38bdf8';
        minimapCtx.beginPath();
        minimapCtx.arc(offsetX + b.x * cellScale, offsetY + b.y * cellScale, Math.max(2.2, cellScale * 0.8), 0, Math.PI * 2);
        minimapCtx.fill();
      } else {
        minimapCtx.fillStyle = '#f97316';
        minimapCtx.beginPath();
        minimapCtx.arc(offsetX + b.x * cellScale, offsetY + b.y * cellScale, Math.max(1.8, cellScale * 0.65), 0, Math.PI * 2);
        minimapCtx.fill();
      }
    });

    // Draw Cyber Thief (Player)
    const pX = offsetX + state.player.x * cellScale;
    const pY = offsetY + state.player.y * cellScale;
    minimapCtx.fillStyle = '#a855f7';
    minimapCtx.shadowColor = '#00f3ff';
    minimapCtx.shadowBlur = 4;
    minimapCtx.beginPath();
    minimapCtx.arc(pX, pY, Math.max(2.5, cellScale * 0.85), 0, Math.PI * 2);
    minimapCtx.fill();
    minimapCtx.strokeStyle = '#00f3ff';
    minimapCtx.lineWidth = 1;
    minimapCtx.stroke();
    minimapCtx.shadowBlur = 0;

    if (minimapKeysStatus) {
      minimapKeysStatus.textContent = `KEYS: ${state.keysCollected}/${state.totalKeys}`;
    }
  }

  // ==========================================
  // MAIN ANIMATION LOOP
  // ==========================================
  function gameLoop(timestamp) {
    if (!state.lastTime) state.lastTime = timestamp;
    const dt = Math.min((timestamp - state.lastTime) / 1000, 0.1);
    state.lastTime = timestamp;

    // Render cinematic cyber-world background
    renderCinemaBackground();

    // Render active game maze ONLY when playing or paused
    if (state.screen === 'PLAYING') {
      update(dt);
      draw();
    } else if (state.screen === 'PAUSED' || state.screen === 'LEVEL_CLEAR') {
      draw();
    }

    requestAnimationFrame(gameLoop);
  }

  // ==========================================
  // STATE MANAGEMENT & SCREEN CONTROLLER
  // ==========================================
  let alertTimer = null;
  function showGameAlert(text) {
    if (!gameAlertBanner) return;
    gameAlertBanner.textContent = text;
    gameAlertBanner.classList.remove('hidden');
    clearTimeout(alertTimer);
    alertTimer = setTimeout(() => {
      gameAlertBanner.classList.add('hidden');
    }, 3800);
  }

  function hideAllOverlays() {
    [
      screenWelcome,
      screenLevelSelect,
      screenInstructions,
      screenSettings,
      screenPause,
      screenLevelClear,
      screenGameOver,
      screenVictory
    ].forEach(el => el && el.classList.add('hidden'));
  }

  function setScreen(newScreen) {
    state.screen = newScreen;
    hideAllOverlays();

    // Menu States: Show menu layer, completely hide gameplay canvas arena, HUD, and mobile D-pad
    const isMenuState = ['WELCOME', 'LEVEL_SELECT', 'INSTRUCTIONS', 'SETTINGS'].includes(newScreen);
    if (isMenuState) {
      if (menuContainer) menuContainer.classList.remove('hidden');
      if (canvasWrapper) canvasWrapper.classList.add('hidden');
      if (canvas) canvas.classList.add('hidden');
      if (hud) hud.classList.add('hidden');
      if (mobileControls) mobileControls.classList.add('hidden');
      if (gameAlertBanner) gameAlertBanner.classList.add('hidden');
    } else {
      if (menuContainer) menuContainer.classList.add('hidden');
      if (canvasWrapper) canvasWrapper.classList.remove('hidden');
      if (canvas) canvas.classList.remove('hidden');
      if (hud) hud.classList.remove('hidden');
      if (mobileControls) mobileControls.classList.remove('hidden');
      resizeCanvas();
      requestAnimationFrame(() => resizeCanvas());
    }

    if (newScreen === 'WELCOME') {
      screenWelcome.classList.remove('hidden');
    } else if (newScreen === 'LEVEL_SELECT') {
      renderLevelSelector();
      screenLevelSelect.classList.remove('hidden');
    } else if (newScreen === 'INSTRUCTIONS') {
      screenInstructions.classList.remove('hidden');
    } else if (newScreen === 'SETTINGS') {
      screenSettings.classList.remove('hidden');
    } else if (newScreen === 'PAUSED') {
      screenPause.classList.remove('hidden');
    } else if (newScreen === 'LEVEL_CLEAR') {
      screenLevelClear.classList.remove('hidden');
    } else if (newScreen === 'GAME_OVER') {
      screenGameOver.classList.remove('hidden');
    } else if (newScreen === 'VICTORY') {
      screenVictory.classList.remove('hidden');
    }
  }

  function startNewGame(levelIdx = 0) {
    audio.init();
    state.lives = 3;
    state.score = 0;
    state.shieldActive = false;
    // Switch to gameplay arena first so container has its active display dimensions
    setScreen('PLAYING');
    loadLevel(levelIdx);
    requestAnimationFrame(() => {
      resizeCanvas();
    });
  }

  function renderLevelSelector() {
    levelSelectGrid.innerHTML = '';
    for (let i = 0; i < LEVELS.length; i++) {
      const chip = document.createElement('div');
      const isUnlocked = (i + 1) <= state.unlockedLevel;
      chip.className = `lvl-chip ${isUnlocked ? 'unlocked' : 'locked'} ${i === state.currentLevelIdx ? 'active' : ''}`;
      chip.textContent = i + 1;
      chip.title = `${LEVELS[i].name} (${LEVELS[i].timeLimit}s)`;
      if (isUnlocked) {
        chip.addEventListener('click', () => {
          startNewGame(i);
        });
      }
      levelSelectGrid.appendChild(chip);
    }
  }

  function updateSoundUI() {
    const isEnabled = audio.enabled;
    btnSound.textContent = isEnabled ? '🔊 SOUND' : '🔇 MUTED';
    menuSoundLabel.textContent = isEnabled ? '🔊 SOUND: ON' : '🔇 SOUND: OFF';
    settingToggleSound.textContent = isEnabled ? 'ENABLED' : 'MUTED';
    if (isEnabled) {
      settingToggleSound.classList.add('active');
    } else {
      settingToggleSound.classList.remove('active');
    }
  }

  function toggleSound() {
    audio.toggle();
    updateSoundUI();
  }

  // ==========================================
  // INPUT HANDLING (KEYBOARD & TOUCH)
  // ==========================================
  function handleKeyDown(e) {
    audio.init();

    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
      state.input.up = true;
      e.preventDefault();
    }
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
      state.input.down = true;
      e.preventDefault();
    }
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      state.input.left = true;
      e.preventDefault();
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      state.input.right = true;
      e.preventDefault();
    }

    if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
      if (state.screen === 'PLAYING') {
        setScreen('PAUSED');
      } else if (state.screen === 'PAUSED') {
        setScreen('PLAYING');
      }
    }

    if (e.key === 'm' || e.key === 'M') {
      if (minimapPanel) {
        minimapPanel.classList.toggle('collapsed');
        if (btnToggleMinimap) {
          btnToggleMinimap.textContent = minimapPanel.classList.contains('collapsed') ? '+' : '−';
        }
      }
    }

    if (e.key === 'r' || e.key === 'R') {
      if (state.screen === 'PLAYING') {
        loadLevel(state.currentLevelIdx);
        requestAnimationFrame(() => {
          resizeCanvas();
        });
      }
    }
  }

  function handleKeyUp(e) {
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') state.input.up = false;
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') state.input.down = false;
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') state.input.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') state.input.right = false;
  }

  function setupTouchControls() {
    const controlsContainer = document.getElementById('mobile-controls');
    const buttons = {
      up: document.getElementById('dpad-up'),
      down: document.getElementById('dpad-down'),
      left: document.getElementById('dpad-left'),
      right: document.getElementById('dpad-right')
    };

    const setDirection = (direction, active) => {
      state.input[direction] = active;
      const btn = buttons[direction];
      if (btn) {
        if (active) btn.classList.add('pressed');
        else btn.classList.remove('pressed');
      }
    };

    const resetInputs = () => {
      setDirection('up', false);
      setDirection('down', false);
      setDirection('left', false);
      setDirection('right', false);
    };

    Object.entries(buttons).forEach(([dir, btn]) => {
      if (!btn) return;

      const handlePress = (ev) => {
        if (ev.cancelable) ev.preventDefault();
        audio.init();
        setDirection(dir, true);
      };

      const handleRelease = (ev) => {
        if (ev && ev.cancelable) ev.preventDefault();
        setDirection(dir, false);
      };

      btn.addEventListener('pointerdown', handlePress);
      btn.addEventListener('pointerup', handleRelease);
      btn.addEventListener('pointercancel', handleRelease);
      btn.addEventListener('pointerleave', handleRelease);

      btn.addEventListener('touchstart', handlePress, { passive: false });
      btn.addEventListener('touchend', handleRelease, { passive: false });
      btn.addEventListener('touchcancel', handleRelease, { passive: false });

      btn.addEventListener('contextmenu', (e) => e.preventDefault());
    });

    // Touch sliding/dragging across virtual D-pad buttons
    if (controlsContainer) {
      controlsContainer.addEventListener('touchmove', (ev) => {
        if (ev.cancelable) ev.preventDefault();
        const activeDirs = { up: false, down: false, left: false, right: false };
        for (let i = 0; i < ev.touches.length; i++) {
          const t = ev.touches[i];
          const el = document.elementFromPoint(t.clientX, t.clientY);
          if (el) {
            const btn = el.closest('.dpad-btn');
            if (btn) {
              if (btn.id === 'dpad-up') activeDirs.up = true;
              if (btn.id === 'dpad-down') activeDirs.down = true;
              if (btn.id === 'dpad-left') activeDirs.left = true;
              if (btn.id === 'dpad-right') activeDirs.right = true;
            }
          }
        }
        setDirection('up', activeDirs.up);
        setDirection('down', activeDirs.down);
        setDirection('left', activeDirs.left);
        setDirection('right', activeDirs.right);
      }, { passive: false });
    }

    // Comprehensive release listeners to prevent stuck movement keys
    window.addEventListener('blur', resetInputs);
    window.addEventListener('pointerup', (e) => {
      if (e.buttons === 0) resetInputs();
    });
    window.addEventListener('touchend', (e) => {
      if (e.touches.length === 0) resetInputs();
    });
    window.addEventListener('touchcancel', (e) => {
      if (e.touches.length === 0) resetInputs();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) resetInputs();
    });
  }

  // ==========================================
  // EVENT LISTENERS & SETUP
  // ==========================================
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  // Welcome Screen actions
  btnStartGame.addEventListener('click', () => {
    startNewGame(0);
  });

  btnOpenLevelSelect.addEventListener('click', () => {
    setScreen('LEVEL_SELECT');
  });

  btnCloseLevelSelect.addEventListener('click', () => {
    setScreen('WELCOME');
  });

  btnHowToPlay.addEventListener('click', () => {
    setScreen('INSTRUCTIONS');
  });

  btnCloseInstructions.addEventListener('click', () => {
    if (state.screen === 'PLAYING' || state.screen === 'PAUSED') {
      setScreen('PLAYING');
    } else {
      setScreen('WELCOME');
    }
  });

  btnOpenSettings.addEventListener('click', () => {
    setScreen('SETTINGS');
  });

  btnCloseSettings.addEventListener('click', () => {
    setScreen('WELCOME');
  });

  btnMenuSound.addEventListener('click', toggleSound);

  // Settings Toggles
  settingToggleSound.addEventListener('click', toggleSound);

  settingToggleShake.addEventListener('click', () => {
    state.shakeEnabled = !state.shakeEnabled;
    localStorage.setItem('cyber_escape_shake', state.shakeEnabled ? 'true' : 'false');
    settingToggleShake.textContent = state.shakeEnabled ? 'ENABLED' : 'DISABLED';
    if (state.shakeEnabled) {
      settingToggleShake.classList.add('active');
    } else {
      settingToggleShake.classList.remove('active');
    }
  });

  settingToggleParticles.addEventListener('click', () => {
    state.particlesEnabled = !state.particlesEnabled;
    localStorage.setItem('cyber_escape_particles', state.particlesEnabled ? 'true' : 'false');
    settingToggleParticles.textContent = state.particlesEnabled ? 'ENABLED' : 'DISABLED';
    if (state.particlesEnabled) {
      settingToggleParticles.classList.add('active');
    } else {
      settingToggleParticles.classList.remove('active');
    }
  });

  btnResetProgress.addEventListener('click', () => {
    if (confirm("Reset all unlocked sectors and high score records?")) {
      localStorage.removeItem('cyber_escape_max_level');
      localStorage.removeItem('cyber_escape_high_score');
      state.unlockedLevel = 1;
      state.highScore = 0;
      welcomeHighScoreEl.textContent = '0';
      welcomeMaxSectorEl.textContent = 'Sector 01 / 10';
      renderLevelSelector();
      alert("System memory wiped. All sectors reset to Sector 01.");
    }
  });

  // HUD and In-Game Controls
  btnPause.addEventListener('click', () => {
    if (state.screen === 'PLAYING') {
      setScreen('PAUSED');
    }
  });

  btnResume.addEventListener('click', () => {
    setScreen('PLAYING');
  });

  btnRestart.addEventListener('click', () => {
    if (state.screen === 'PLAYING') {
      loadLevel(state.currentLevelIdx);
      requestAnimationFrame(() => {
        resizeCanvas();
      });
    }
  });

  btnRestartModal.addEventListener('click', () => {
    startNewGame(state.currentLevelIdx);
  });

  btnMenuFromPause.addEventListener('click', () => {
    setScreen('WELCOME');
    welcomeHighScoreEl.textContent = state.highScore.toLocaleString();
    welcomeMaxSectorEl.textContent = `Sector ${state.unlockedLevel < 10 ? '0' : ''}${state.unlockedLevel} / 10`;
    renderLevelSelector();
  });

  btnNextLevel.addEventListener('click', () => {
    if (state.currentLevelIdx + 1 < LEVELS.length) {
      setScreen('PLAYING');
      loadLevel(state.currentLevelIdx + 1);
      requestAnimationFrame(() => {
        resizeCanvas();
      });
    } else {
      handleVictory();
    }
  });

  btnTryAgain.addEventListener('click', () => {
    startNewGame(state.currentLevelIdx);
  });

  btnMenuFromOver.addEventListener('click', () => {
    setScreen('WELCOME');
    welcomeHighScoreEl.textContent = state.highScore.toLocaleString();
    welcomeMaxSectorEl.textContent = `Sector ${state.unlockedLevel < 10 ? '0' : ''}${state.unlockedLevel} / 10`;
    renderLevelSelector();
  });

  btnPlayAgainVictory.addEventListener('click', () => {
    startNewGame(0);
  });

  btnSound.addEventListener('click', toggleSound);

  btnHelp.addEventListener('click', () => {
    setScreen('INSTRUCTIONS');
  });

  if (btnToggleMinimap && minimapPanel) {
    btnToggleMinimap.addEventListener('click', () => {
      minimapPanel.classList.toggle('collapsed');
      btnToggleMinimap.textContent = minimapPanel.classList.contains('collapsed') ? '+' : '−';
    });
  }

  const handleWindowResize = () => {
    if (state.screen === 'PLAYING' || state.screen === 'PAUSED' || state.screen === 'LEVEL_CLEAR') {
      resizeCanvas();
      updateCamera(0, true);
    }
  };

  window.addEventListener('resize', handleWindowResize);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleWindowResize);
  }

  // Initial State Bootstrap: Start on clean WELCOME screen with maze completely hidden!
  welcomeHighScoreEl.textContent = state.highScore.toLocaleString();
  welcomeMaxSectorEl.textContent = `Sector ${state.unlockedLevel < 10 ? '0' : ''}${state.unlockedLevel} / 10`;
  updateSoundUI();
  settingToggleShake.textContent = state.shakeEnabled ? 'ENABLED' : 'DISABLED';
  if (state.shakeEnabled) settingToggleShake.classList.add('active');
  settingToggleParticles.textContent = state.particlesEnabled ? 'ENABLED' : 'DISABLED';
  if (state.particlesEnabled) settingToggleParticles.classList.add('active');

  renderLevelSelector();
  setupTouchControls();

  // Set initial screen state: clean welcome screen, maze hidden
  setScreen('WELCOME');

  requestAnimationFrame(gameLoop);

})();

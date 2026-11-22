/**
 * "MÈO NÉ GAI" - NÂNG CẤP TOÀN DIỆN
 * Cơ chế: Sinh tồn phản xạ + Kỹ năng Lướt + Vật phẩm ăn điểm & Power-up + Tia Laser + SFX
 */

// Canvas & Constants
const CANVAS_SIZE = 720;
const SPIKE_WALL_WIDTH = 48;
const CAT_RADIUS = 21;
const BASE_SPEED = 240;

// 6 Skin mèo chuẩn từ Figma
const CAT_SKINS = [
  {
    id: 'tabby',
    name: 'Mèo mướp vàng',
    body: '#ffbd59',
    accent: '#c97432',
    secondary: '#f28f3b',
    face: '#2d3047',
    swatch: 'repeating-linear-gradient(115deg, #ffbd59 0 7px, #c97432 7px 10px)'
  },
  {
    id: 'calico',
    name: 'Mèo tam thể',
    body: '#f5ead5',
    accent: '#e78b3d',
    secondary: '#3b3945',
    face: '#2d3047',
    swatch: 'conic-gradient(#f5ead5 0 28%, #e78b3d 28% 58%, #3b3945 58% 76%, #f5ead5 76%)'
  },
  {
    id: 'black',
    name: 'Mèo đen',
    body: '#292a38',
    accent: '#171822',
    secondary: '#3b3d50',
    face: '#ffd66b',
    swatch: 'linear-gradient(145deg, #3b3d50, #171822)'
  },
  {
    id: 'tuxedo',
    name: 'Mèo tuxedo',
    body: '#30313e',
    accent: '#f6f3ed',
    secondary: '#181922',
    face: '#f6f3ed',
    swatch: 'linear-gradient(135deg, #30313e 0 48%, #f6f3ed 48% 68%, #30313e 68%)'
  },
  {
    id: 'siamese',
    name: 'Mèo Xiêm',
    body: '#ead7b9',
    accent: '#574648',
    secondary: '#9e806a',
    face: '#66c6df',
    swatch: 'radial-gradient(circle, #574648 0 33%, #ead7b9 35% 100%)'
  },
  {
    id: 'gray',
    name: 'Mèo mướp xám',
    body: '#aeb3bd',
    accent: '#636976',
    secondary: '#848a96',
    face: '#252735',
    swatch: 'repeating-linear-gradient(115deg, #aeb3bd 0 7px, #636976 7px 10px)'
  }
];

// 8 Thế giới / Vòng chơi theo mốc 800 điểm
const STAGE_MAPS = [
  {
    stage: 1,
    name: 'Nông trại',
    icon: '🌾',
    tag: 'VÒNG 1/8',
    scoreReq: 0,
    bgGrad: ['#fffbeb', '#fef3c7'],
    gridColor: 'rgba(180, 83, 9, 0.08)',
    wallColor: '#5c3a21',
    spikeColor: '#b45309',
    obstacleName: 'Bó rơm vàng',
    obstacleType: 'haybale',
    isDarknessMode: false
  },
  {
    stage: 2,
    name: 'Bãi cỏ',
    icon: '🌿',
    tag: 'VÒNG 2/8',
    scoreReq: 800,
    bgGrad: ['#f0fdf4', '#dcfce7'],
    gridColor: 'rgba(21, 128, 61, 0.08)',
    wallColor: '#14532d',
    spikeColor: '#22c55e',
    obstacleName: 'Nấm độc & Bụi gai rừng',
    obstacleType: 'mushroom',
    isDarknessMode: false
  },
  {
    stage: 3,
    name: 'Trên mặt biển',
    icon: '🌊',
    tag: 'VÒNG 3/8',
    scoreReq: 1600,
    bgGrad: ['#e0f2fe', '#bae6fd'],
    gridColor: 'rgba(2, 132, 199, 0.08)',
    wallColor: '#075985',
    spikeColor: '#0284c7',
    obstacleName: 'Phao cứu sinh & Lốc xoáy',
    obstacleType: 'buoy',
    isDarknessMode: false
  },
  {
    stage: 4,
    name: 'Đáy đại dương',
    icon: '🐙',
    tag: 'VÒNG 4/8',
    scoreReq: 2400,
    bgGrad: ['#0f172a', '#1e293b'],
    gridColor: 'rgba(56, 189, 248, 0.12)',
    wallColor: '#0b1120',
    spikeColor: '#06b6d4',
    obstacleName: 'Sứa điện phát sáng',
    obstacleType: 'jellyfish',
    isDarknessMode: false
  },
  {
    stage: 5,
    name: 'Thế giới kẹo ngọt',
    icon: '🍭',
    tag: 'VÒNG 5/8',
    scoreReq: 3200,
    bgGrad: ['#fff1f2', '#ffe4e6'],
    gridColor: 'rgba(244, 63, 94, 0.08)',
    wallColor: '#881337',
    spikeColor: '#f43f5e',
    obstacleName: 'Kẹo xoay & Donut đường',
    obstacleType: 'candy',
    isDarknessMode: false
  },
  {
    stage: 6,
    name: 'Vũ trụ',
    icon: '🚀',
    tag: 'VÒNG 6/8',
    scoreReq: 4000,
    bgGrad: ['#09090b', '#18181b'],
    gridColor: 'rgba(168, 85, 247, 0.14)',
    wallColor: '#1e1035',
    spikeColor: '#a855f7',
    obstacleName: 'Thiên thạch lửa rực cháy',
    obstacleType: 'meteor',
    isDarknessMode: false
  },
  {
    stage: 7,
    name: 'Thế giới khổng lồ',
    icon: '🗿',
    tag: 'VÒNG 7/8',
    scoreReq: 4800,
    bgGrad: ['#1c1917', '#292524'],
    gridColor: 'rgba(234, 179, 8, 0.12)',
    wallColor: '#451a03',
    spikeColor: '#eab308',
    obstacleName: 'Búa tạ khổng lồ & Cột thạch',
    obstacleType: 'hammer',
    isDarknessMode: false
  },
  {
    stage: 8,
    name: 'Toàn bóng tối',
    icon: '🌑',
    tag: 'VÒNG 8/8',
    scoreReq: 5600,
    bgGrad: ['#030307', '#090714'],
    gridColor: 'rgba(239, 68, 68, 0.15)',
    wallColor: '#11050a',
    spikeColor: '#dc2626',
    obstacleName: 'Mắt quỷ bóng đêm hư không',
    obstacleType: 'shadowEye',
    isDarknessMode: true
  }
];

// Danh sách 8 Đại Boss tương ứng với 8 Thế giới
const STAGE_BOSSES = [
  {
    stage: 1,
    type: 'scarecrow',
    name: 'QUÁI VẬT NGƯỜI RƠM',
    tag: 'BOSS VÒNG 1: NÔNG TRẠI',
    icon: '🌾🎃',
    bodyColor: '#92400e',
    accentColor: '#f59e0b',
    bulletColor: '#f59e0b',
    eyeColor: '#ef4444',
    radius: 46,
    baseHp: 450,
    attackInterval: 4.8,
    shootInterval: 3.5,
    bulletCount: 7,
    title: 'Ác mộng cánh đồng lúa mì'
  },
  {
    stage: 2,
    type: 'flower',
    name: 'QUÁI VẬT BÔNG HOA',
    tag: 'BOSS VÒNG 2: BÃI CỎ',
    icon: '🌸🌻',
    bodyColor: '#15803d',
    accentColor: '#ec4899',
    bulletColor: '#22c55e',
    eyeColor: '#a855f7',
    radius: 46,
    baseHp: 520,
    attackInterval: 4.5,
    shootInterval: 3.2,
    bulletCount: 8,
    title: 'Đóa hoa ăn thịt khổng lồ'
  },
  {
    stage: 3,
    type: 'squid',
    name: 'MỰC KHỔNG LỒ KRAKEN',
    tag: 'BOSS VÒNG 3: MẶT BIỂN',
    icon: '🦑🌊',
    bodyColor: '#ea580c',
    accentColor: '#38bdf8',
    bulletColor: '#0284c7',
    eyeColor: '#facc15',
    radius: 48,
    baseHp: 600,
    attackInterval: 4.2,
    shootInterval: 3.0,
    bulletCount: 8,
    title: 'Quái vật xúc tu đại dương'
  },
  {
    stage: 4,
    type: 'shark',
    name: 'CÁ MẬP BIỂN SÂU',
    tag: 'BOSS VÒNG 4: ĐÁY ĐẠI DƯƠNG',
    icon: '🦈🐙',
    bodyColor: '#0f172a',
    accentColor: '#06b6d4',
    bulletColor: '#06b6d4',
    eyeColor: '#ef4444',
    radius: 50,
    baseHp: 680,
    attackInterval: 3.8,
    shootInterval: 2.8,
    bulletCount: 9,
    title: 'Bạo chúa đáy vực thẳm'
  },
  {
    stage: 5,
    type: 'gingerbread',
    name: 'QUÁI VẬT BÁNH GỪNG',
    tag: 'BOSS VÒNG 5: ĐỒ NGỌT',
    icon: '🍪🍭',
    bodyColor: '#92400e',
    accentColor: '#f43f5e',
    bulletColor: '#f43f5e',
    eyeColor: '#22c55e',
    radius: 46,
    baseHp: 750,
    attackInterval: 4.0,
    shootInterval: 2.7,
    bulletCount: 9,
    title: 'Người bánh quy đột biến'
  },
  {
    stage: 6,
    type: 'alien',
    name: 'NGƯỜI NGOÀI HÀNH TINH',
    tag: 'BOSS VÒNG 6: VŨ TRỤ',
    icon: '👽🚀',
    bodyColor: '#581c87',
    accentColor: '#c084fc',
    bulletColor: '#a855f7',
    eyeColor: '#38bdf8',
    radius: 46,
    baseHp: 820,
    attackInterval: 3.6,
    shootInterval: 2.5,
    bulletCount: 10,
    title: 'Chúa tể thiên hà bí ẩn'
  },
  {
    stage: 7,
    type: 'robot',
    name: 'ROBOT TITAN KHỔNG LỒ',
    tag: 'BOSS VÒNG 7: KHỔNG LỒ',
    icon: '🤖🗿',
    bodyColor: '#292524',
    accentColor: '#eab308',
    bulletColor: '#eab308',
    eyeColor: '#ef4444',
    radius: 52,
    baseHp: 900,
    attackInterval: 3.5,
    shootInterval: 2.4,
    bulletCount: 10,
    title: 'Pháo đài cơ khí hủy diệt'
  },
  {
    stage: 8,
    type: 'lightBeam',
    name: 'THỰC THỂ TIA SÁNG',
    tag: 'BOSS VÒNG 8: TOÀN BÓNG TỐI',
    icon: '⚡✨',
    bodyColor: '#ffffff',
    accentColor: '#fbbf24',
    bulletColor: '#fef08a',
    eyeColor: '#38bdf8',
    radius: 48,
    baseHp: 1000,
    attackInterval: 3.2,
    shootInterval: 2.2,
    bulletCount: 12,
    title: 'Tia sáng thánh quang xua tan bóng tối'
  }
];

// Helper: Vẽ hình chữ nhật bo góc
function drawRoundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x, y, width, height, radius);
  } else {
    ctx.rect(x, y, width, height);
  }
  ctx.fill();
}

// Game State Class
class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    // DOM Elements
    this.scoreValEl = document.getElementById('scoreVal');
    this.highScoreValEl = document.getElementById('highScoreVal');
    this.currentSkinLabelEl = document.getElementById('currentSkinLabel');
    this.skinOptionsContainer = document.getElementById('skinOptionsContainer');
    this.gameOverlayEl = document.getElementById('gameOverlay');
    this.overlayCardEl = document.getElementById('overlayCard');
    this.overlayLabelEl = document.getElementById('overlayLabel');
    this.overlayTitleEl = document.getElementById('overlayTitle');
    this.overlayDescEl = document.getElementById('overlayDesc');
    this.overlayHintEl = document.getElementById('overlayHint');
    this.overlayCatMarkEl = document.getElementById('overlayCatMark');
    this.startBtn = document.getElementById('startBtn');
    this.startBtnText = document.getElementById('startBtnText');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.fullscreenBtn = document.getElementById('fullscreenBtn');
    this.dashHudEl = document.getElementById('dashHud');
    this.dashBarFillEl = document.getElementById('dashBarFill');
    this.activePowerupsEl = document.getElementById('activePowerups');
    this.mobileDashBtn = document.getElementById('mobileDashBtn');
    this.joystickContainer = document.getElementById('joystickContainer');
    this.joystickBase = document.getElementById('joystickBase');
    this.joystickKnob = document.getElementById('joystickKnob');
    this.dpadContainer = document.getElementById('dpadContainer');
    this.ctrlModeToggleBtn = document.getElementById('ctrlModeToggleBtn');
    this.ctrlModeIcon = document.getElementById('ctrlModeIcon');
    this.ctrlModeText = document.getElementById('ctrlModeText');
    this.bossHudEl = document.getElementById('bossHud');
    this.bossNameEl = document.getElementById('bossName');
    this.bossHpTextEl = document.getElementById('bossHpText');
    this.bossHpFillEl = document.getElementById('bossHpFill');
    this.livesIconsContainer = document.getElementById('livesIconsContainer');

    // Stage & Stars DOM Elements
    this.stageBadgeEl = document.getElementById('stageBadge');
    this.stageIconEl = document.getElementById('stageIcon');
    this.stageTagEl = document.getElementById('stageTag');
    this.stageNameEl = document.getElementById('stageName');
    this.starsBoxEl = document.getElementById('starsBox');
    this.starsValEl = document.getElementById('starsVal');
    this.mapBannerEl = document.getElementById('mapBanner');
    this.mapBannerIconEl = document.getElementById('mapBannerIcon');
    this.mapBannerTitleEl = document.getElementById('mapBannerTitle');
    this.victoryOverlayEl = document.getElementById('victoryOverlay');
    this.vicTotalStarsEl = document.getElementById('vicTotalStars');
    this.vicScoreEl = document.getElementById('vicScore');
    this.continueEndlessBtn = document.getElementById('continueEndlessBtn');
    this.restartCampaignBtn = document.getElementById('restartCampaignBtn');

    // Stage Progression & Honorary Stars
    this.stars = Number(localStorage.getItem('meo-ne-gai-stars') || 0);
    if (this.starsValEl) this.starsValEl.textContent = `⭐ ${this.stars}`;
    this.currentStage = 1;
    this.currentMap = STAGE_MAPS[0];
    this.bannerTimer = null;
    this.victoryAwarded = false;
    this.stageBossSpawned = [false, false, false, false, false, false, false, false];

    // Settings Modal Elements
    this.settingsBtn = document.getElementById('settingsBtn');
    this.overlaySettingsBtn = document.getElementById('overlaySettingsBtn');
    this.settingsModal = document.getElementById('settingsModal');
    this.closeSettingsBtn = document.getElementById('closeSettingsBtn');
    this.saveSettingsBtn = document.getElementById('saveSettingsBtn');
    this.resetDefaultsBtn = document.getElementById('resetDefaultsBtn');

    // Configurable Game Settings (Loaded from LocalStorage)
    this.defaultSettings = {
      lives: 3,
      difficulty: 'normal', // 'easy', 'normal', 'hard', 'nightmare'
      hazardCount: 3,
      bossCount: 1,
      bossSpawnTime: 60, // Seconds until Boss spawns
      controlMode: 'joystick', // 'joystick' or 'dpad'
      haptic: 'on' // 'on' or 'off'
    };
    this.settings = this.loadSettings();

    // Virtual Joystick & D-Pad Pointer IDs for Multi-Touch
    this.joystickVector = { x: 0, y: 0 };
    this.joystickPointerId = null;
    this.dpadPointerId = null;

    // Persistent Skin & High Score
    const savedSkinId = localStorage.getItem('meo-ne-gai-style') || 'tabby';
    this.currentSkin = CAT_SKINS.find(s => s.id === savedSkinId) || CAT_SKINS[0];
    this.highScore = Number(localStorage.getItem('meo-ne-gai-best') || 0);
    this.highScoreValEl.textContent = String(this.highScore).padStart(3, '0');

    // Game Core State
    this.gameState = 'ready'; // 'ready', 'playing', 'gameover'
    this.score = 0;
    this.bonusScore = 0;
    this.elapsedTime = 0;
    this.lastTime = 0;
    this.newRecordTriggered = false;

    // Cat Player
    this.cat = {
      x: CANVAS_SIZE / 2,
      y: CANVAS_SIZE / 2,
      vx: 0,
      vy: 0,
      radius: CAT_RADIUS,
      facingX: 0,
      facingY: 0,
      lives: this.settings.lives,
      maxLives: this.settings.lives,
      invulnerableTimer: 0, // i-frame after hit
      isDashing: false,
      dashTimer: 0,
      dashDuration: 0.22, // 220ms
      dashCooldown: 2.2,  // 2.2s
      dashCooldownTimer: 0,
      hasShield: false,
      slowMoTimer: 0,
      catnipTimer: 0
    };

    // Movement keys & Input States (Action based, completely immune to IME/Telex/focus bugs)
    this.keyState = { up: false, down: false, left: false, right: false };
    this.dpadState = { up: false, down: false, left: false, right: false };
    this.keys = new Set();

    // Game Entities
    this.hazards = [];
    this.pickups = [];
    this.lasers = [];
    this.particles = [];
    this.dashGhosts = [];
    this.floatingTexts = [];

    // Screen Shake
    this.screenShakeTime = 0;
    this.screenShakeIntensity = 0;

    // Timers for events
    this.pickupSpawnTimer = 3;
    this.laserSpawnTimer = 16;
    this.extraHazardSpawned = false;

    // Multi-Boss System
    this.bosses = [];
    this.bossSpawned = false;
    this.bossDefeated = false;
    this.bullets = [];
    this.bossBullets = [];
    this.catShootTimer = 0;

    this.initUI();
    this.initSettingsModal();
    this.initControls();
    this.resetEntities();

    // Start render loop
    requestAnimationFrame(this.loop.bind(this));
  }

  loadSettings() {
    try {
      const raw = localStorage.getItem('meo-ne-gai-settings');
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...this.defaultSettings, ...parsed };
      }
    } catch (_) {}
    return { ...this.defaultSettings };
  }

  saveSettings() {
    try {
      localStorage.setItem('meo-ne-gai-settings', JSON.stringify(this.settings));
    } catch (_) {}
  }

  initUI() {
    // Render Skin Pickers
    this.skinOptionsContainer.innerHTML = '';
    CAT_SKINS.forEach(skin => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'color-option';
      btn.style.setProperty('--swatch-color', skin.swatch);
      btn.setAttribute('aria-label', skin.name);
      btn.setAttribute('title', skin.name);
      btn.setAttribute('aria-pressed', skin.id === this.currentSkin.id ? 'true' : 'false');
      btn.onclick = () => this.selectSkin(skin);
      this.skinOptionsContainer.appendChild(btn);
    });

    this.updateSkinUI();

    // Sound Toggle Button
    if (sound.muted) {
      this.soundToggleBtn.classList.add('muted');
      this.soundToggleBtn.querySelector('.sound-icon').textContent = '🔇';
    }
    this.soundToggleBtn.onclick = () => {
      const muted = sound.toggleMute();
      this.soundToggleBtn.classList.toggle('muted', muted);
      this.soundToggleBtn.querySelector('.sound-icon').textContent = muted ? '🔇' : '🔊';
    };

    // Start/Retry Button
    this.startBtn.onclick = () => this.startGame();

    // Fullscreen Toggle Button
    if (this.fullscreenBtn) {
      this.fullscreenBtn.onclick = () => this.toggleFullscreen();
    }
    document.addEventListener('fullscreenchange', () => this.updateFullscreenUI());
    document.addEventListener('webkitfullscreenchange', () => this.updateFullscreenUI());
    document.addEventListener('mozfullscreenchange', () => this.updateFullscreenUI());
    document.addEventListener('MSFullscreenChange', () => this.updateFullscreenUI());
    this.updateFullscreenUI();

    // Mobile Control Mode Switcher Pill Button
    if (this.ctrlModeToggleBtn) {
      this.ctrlModeToggleBtn.onclick = () => {
        const nextMode = (this.settings.controlMode === 'joystick') ? 'dpad' : 'joystick';
        this.settings.controlMode = nextMode;
        this.applyControlModeUI();
        this.saveSettings();
        sound.playPickup('fish');
        this.vibrate(20);
        this.addFloatingText(nextMode === 'joystick' ? 'CHẾ ĐỘ CẦN GẠT 360°' : 'CHẾ ĐỘ PHÍM CHỮ THẬP', CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 40, '#a855f7');
      };
    }
    this.applyControlModeUI();

    // Victory Screen Action Buttons
    if (this.continueEndlessBtn) {
      this.continueEndlessBtn.onclick = () => {
        if (this.victoryOverlayEl) this.victoryOverlayEl.classList.add('hidden');
        sound.playMeow();
        this.addFloatingText('CHẾ ĐỘ VÔ TẬN KÍCH HOẠT! 🚀', this.cat.x, this.cat.y - 35, '#fbbf24');
      };
    }
    if (this.restartCampaignBtn) {
      this.restartCampaignBtn.onclick = () => {
        if (this.victoryOverlayEl) this.victoryOverlayEl.classList.add('hidden');
        this.startGame();
      };
    }
  }

  vibrate(pattern) {
    if (this.settings.haptic === 'off') return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (_) {}
    }
  }

  toggleFullscreen() {
    const doc = document;
    const docEl = document.documentElement;
    const isFs = doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement;
    if (!isFs) {
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch(() => {});
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    }
  }

  updateFullscreenUI() {
    const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
    if (this.fullscreenBtn) {
      this.fullscreenBtn.classList.toggle('active', isFs);
      const icon = this.fullscreenBtn.querySelector('.fs-icon');
      const text = this.fullscreenBtn.querySelector('.fs-text');
      if (icon) icon.textContent = isFs ? '🗗' : '⛶';
      if (text) text.textContent = isFs ? 'Thu nhỏ' : 'Toàn màn hình';
    }
  }

  applyControlModeUI() {
    const mode = this.settings.controlMode || 'joystick';
    if (mode === 'joystick') {
      if (this.joystickContainer) this.joystickContainer.classList.remove('hidden');
      if (this.dpadContainer) this.dpadContainer.classList.add('hidden');
      if (this.ctrlModeIcon) this.ctrlModeIcon.textContent = '🕹️';
      if (this.ctrlModeText) this.ctrlModeText.textContent = 'Cần gạt';
    } else {
      if (this.joystickContainer) this.joystickContainer.classList.add('hidden');
      if (this.dpadContainer) this.dpadContainer.classList.remove('hidden');
      if (this.ctrlModeIcon) this.ctrlModeIcon.textContent = '🎛️';
      if (this.ctrlModeText) this.ctrlModeText.textContent = 'D-Pad';
    }
    this.resetJoystick();
    this.clearAllInputs();
  }

  resetJoystick() {
    this.joystickVector = { x: 0, y: 0 };
    this.joystickPointerId = null;
    if (this.joystickKnob) {
      this.joystickKnob.classList.remove('active');
      this.joystickKnob.style.transform = 'translate(0px, 0px)';
    }
  }

  selectSkin(skin) {
    this.currentSkin = skin;
    localStorage.setItem('meo-ne-gai-style', skin.id);
    this.updateSkinUI();
    sound.playMeow();
  }

  updateSkinUI() {
    this.currentSkinLabelEl.textContent = `Kiểu mèo · ${this.currentSkin.name}`;
    const buttons = this.skinOptionsContainer.querySelectorAll('.color-option');
    buttons.forEach((btn, idx) => {
      btn.setAttribute('aria-pressed', CAT_SKINS[idx].id === this.currentSkin.id ? 'true' : 'false');
    });

    // Update avatar mark in overlay
    this.overlayCatMarkEl.style.setProperty('--cat-color', this.currentSkin.body);
    this.overlayCatMarkEl.style.setProperty('--cat-pattern', this.currentSkin.swatch);
  }

  updateLivesHUD() {
    if (!this.livesIconsContainer) return;
    this.livesIconsContainer.innerHTML = '';
    const total = this.settings.lives;
    const current = Math.max(0, this.cat.lives);
    for (let i = 0; i < total; i++) {
      const span = document.createElement('span');
      span.className = i < current ? 'heart active' : 'heart lost';
      span.textContent = i < current ? '❤️' : '🤍';
      this.livesIconsContainer.appendChild(span);
    }
  }

  initSettingsModal() {
    if (!this.settingsModal) return;

    // Open Modal
    const openModal = () => {
      this.syncSettingsUI();
      this.settingsModal.classList.remove('hidden');
    };
    if (this.settingsBtn) this.settingsBtn.onclick = openModal;
    if (this.overlaySettingsBtn) this.overlaySettingsBtn.onclick = openModal;

    // Close Modal
    const closeModal = () => {
      this.settingsModal.classList.add('hidden');
    };
    if (this.closeSettingsBtn) this.closeSettingsBtn.onclick = closeModal;
    this.settingsModal.addEventListener('click', e => {
      if (e.target === this.settingsModal) closeModal();
    });

    // 1. Lives Presets & Slider
    const livesBtns = document.querySelectorAll('#livesPresetGroup .opt-btn');
    const customLivesContainer = document.getElementById('customLivesContainer');
    const livesSlider = document.getElementById('livesSlider');
    const livesSliderVal = document.getElementById('livesSliderVal');

    livesBtns.forEach(btn => {
      btn.onclick = () => {
        livesBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const val = btn.getAttribute('data-val');
        if (val === 'custom') {
          if (customLivesContainer) customLivesContainer.style.display = 'flex';
          this.settings.lives = Number(livesSlider.value);
        } else {
          if (customLivesContainer) customLivesContainer.style.display = 'none';
          this.settings.lives = Number(val);
          if (livesSlider) livesSlider.value = val;
          if (livesSliderVal) livesSliderVal.textContent = val;
        }
      };
    });

    if (livesSlider) {
      livesSlider.oninput = () => {
        const v = Number(livesSlider.value);
        if (livesSliderVal) livesSliderVal.textContent = v;
        this.settings.lives = v;
      };
    }

    // 2. Difficulty Cards & Custom Controls
    const diffCards = document.querySelectorAll('#difficultyPresetGroup .diff-card');
    const hazardsSlider = document.getElementById('hazardsSlider');
    const hazardsSliderVal = document.getElementById('hazardsSliderVal');
    const bossCountBtns = document.querySelectorAll('#bossCountGroup .mini-btn');

    diffCards.forEach(card => {
      card.onclick = () => {
        diffCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const diff = card.getAttribute('data-diff');
        this.settings.difficulty = diff;

        if (diff === 'easy') {
          this.settings.hazardCount = 2;
          this.settings.bossCount = 1;
        } else if (diff === 'normal') {
          this.settings.hazardCount = 3;
          this.settings.bossCount = 1;
        } else if (diff === 'hard') {
          this.settings.hazardCount = 5;
          this.settings.bossCount = 2;
        } else if (diff === 'nightmare') {
          this.settings.hazardCount = 7;
          this.settings.bossCount = 3;
        }

        if (hazardsSlider) hazardsSlider.value = this.settings.hazardCount;
        if (hazardsSliderVal) hazardsSliderVal.textContent = this.settings.hazardCount;
        bossCountBtns.forEach(b => {
          b.classList.toggle('active', Number(b.getAttribute('data-count')) === this.settings.bossCount);
        });
      };
    });

    if (hazardsSlider) {
      hazardsSlider.oninput = () => {
        const v = Number(hazardsSlider.value);
        if (hazardsSliderVal) hazardsSliderVal.textContent = v;
        this.settings.hazardCount = v;
        diffCards.forEach(c => c.classList.remove('active'));
      };
    }

    bossCountBtns.forEach(btn => {
      btn.onclick = () => {
        bossCountBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.settings.bossCount = Number(btn.getAttribute('data-count'));
        diffCards.forEach(c => c.classList.remove('active'));
      };
    });

    // 3. Boss Spawn Presets & Slider
    const spawnBtns = document.querySelectorAll('#bossSpawnPresetGroup .opt-btn');
    const spawnSlider = document.getElementById('bossSpawnSlider');
    const spawnSliderVal = document.getElementById('bossSpawnSliderVal');
    const bossScoreEquiv = document.getElementById('bossScoreEquiv');

    spawnBtns.forEach(btn => {
      btn.onclick = () => {
        spawnBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const t = Number(btn.getAttribute('data-time'));
        this.settings.bossSpawnTime = t;
        if (spawnSlider) spawnSlider.value = t;
        if (spawnSliderVal) spawnSliderVal.textContent = t;
        if (bossScoreEquiv) bossScoreEquiv.textContent = t * 10;
      };
    });

    if (spawnSlider) {
      spawnSlider.oninput = () => {
        const t = Number(spawnSlider.value);
        if (spawnSliderVal) spawnSliderVal.textContent = t;
        if (bossScoreEquiv) bossScoreEquiv.textContent = t * 10;
        this.settings.bossSpawnTime = t;
        spawnBtns.forEach(b => {
          b.classList.toggle('active', Number(b.getAttribute('data-time')) === t);
        });
      };
    }

    // 4. Mobile Controls & Haptics Presets
    const mobileCtrlBtns = document.querySelectorAll('#mobileCtrlPresetGroup .opt-btn');
    mobileCtrlBtns.forEach(btn => {
      btn.onclick = () => {
        mobileCtrlBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.settings.controlMode = btn.getAttribute('data-ctrl');
      };
    });

    const hapticBtns = document.querySelectorAll('#hapticPresetGroup .opt-btn');
    hapticBtns.forEach(btn => {
      btn.onclick = () => {
        hapticBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.settings.haptic = btn.getAttribute('data-haptic');
      };
    });

    // Reset Defaults Button
    if (this.resetDefaultsBtn) {
      this.resetDefaultsBtn.onclick = () => {
        this.settings = { ...this.defaultSettings };
        this.syncSettingsUI();
        this.applyControlModeUI();
        sound.playMeow();
      };
    }

    // Save & Apply Button
    if (this.saveSettingsBtn) {
      this.saveSettingsBtn.onclick = () => {
        this.saveSettings();
        this.applyControlModeUI();
        closeModal();
        if (this.gameState !== 'playing') {
          this.resetEntities();
        } else {
          this.updateLivesHUD();
        }
        this.addFloatingText('ĐÃ LƯU CÀI ĐẶT!', CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 40, '#10b981');
        sound.playPickup('fish');
      };
    }
  }

  syncSettingsUI() {
    // Sync Lives UI
    const livesBtns = document.querySelectorAll('#livesPresetGroup .opt-btn');
    const customLivesContainer = document.getElementById('customLivesContainer');
    const livesSlider = document.getElementById('livesSlider');
    const livesSliderVal = document.getElementById('livesSliderVal');

    if (livesSlider) livesSlider.value = this.settings.lives;
    if (livesSliderVal) livesSliderVal.textContent = this.settings.lives;

    let matchedLife = false;
    livesBtns.forEach(b => {
      const val = b.getAttribute('data-val');
      if (val !== 'custom' && Number(val) === this.settings.lives) {
        b.classList.add('active');
        matchedLife = true;
      } else {
        b.classList.remove('active');
      }
    });

    if (!matchedLife) {
      const customBtn = document.querySelector('#livesPresetGroup .opt-btn[data-val="custom"]');
      if (customBtn) customBtn.classList.add('active');
      if (customLivesContainer) customLivesContainer.style.display = 'flex';
    } else {
      if (customLivesContainer) customLivesContainer.style.display = 'none';
    }

    // Sync Difficulty UI
    const diffCards = document.querySelectorAll('#difficultyPresetGroup .diff-card');
    const hazardsSlider = document.getElementById('hazardsSlider');
    const hazardsSliderVal = document.getElementById('hazardsSliderVal');
    const bossCountBtns = document.querySelectorAll('#bossCountGroup .mini-btn');

    diffCards.forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-diff') === this.settings.difficulty);
    });
    if (hazardsSlider) hazardsSlider.value = this.settings.hazardCount;
    if (hazardsSliderVal) hazardsSliderVal.textContent = this.settings.hazardCount;
    bossCountBtns.forEach(b => {
      b.classList.toggle('active', Number(b.getAttribute('data-count')) === this.settings.bossCount);
    });

    // Sync Boss Spawn Time UI
    const spawnBtns = document.querySelectorAll('#bossSpawnPresetGroup .opt-btn');
    const spawnSlider = document.getElementById('bossSpawnSlider');
    const spawnSliderVal = document.getElementById('bossSpawnSliderVal');
    const bossScoreEquiv = document.getElementById('bossScoreEquiv');

    const t = this.settings.bossSpawnTime;
    if (spawnSlider) spawnSlider.value = t;
    if (spawnSliderVal) spawnSliderVal.textContent = t;
    if (bossScoreEquiv) bossScoreEquiv.textContent = t * 10;
    spawnBtns.forEach(b => {
      b.classList.toggle('active', Number(b.getAttribute('data-time')) === t);
    });

    // Sync Mobile Controls & Haptic UI
    const mobileCtrlBtns = document.querySelectorAll('#mobileCtrlPresetGroup .opt-btn');
    mobileCtrlBtns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-ctrl') === (this.settings.controlMode || 'joystick'));
    });

    const hapticBtns = document.querySelectorAll('#hapticPresetGroup .opt-btn');
    hapticBtns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-haptic') === (this.settings.haptic || 'on'));
    });
  }

  clearAllInputs() {
    this.keyState = { up: false, down: false, left: false, right: false };
    this.dpadState = { up: false, down: false, left: false, right: false };
    this.resetJoystick();
    this.dpadPointerId = null;
    if (this.keys) this.keys.clear();
    ['btnUp', 'btnDown', 'btnLeft', 'btnRight'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.classList.remove('pressed');
    });
  }

  isUpActive() {
    return this.keyState.up || this.dpadState.up;
  }

  isDownActive() {
    return this.keyState.down || this.dpadState.down;
  }

  isLeftActive() {
    return this.keyState.left || this.dpadState.left;
  }

  isRightActive() {
    return this.keyState.right || this.dpadState.right;
  }

  initControls() {
    const isUp = (code, key) => code === 'arrowup' || code === 'keyw' || key === 'arrowup' || key === 'w' || key === 'ư';
    const isDown = (code, key) => code === 'arrowdown' || code === 'keys' || key === 'arrowdown' || key === 's';
    const isLeft = (code, key) => code === 'arrowleft' || code === 'keya' || key === 'arrowleft' || key === 'a';
    const isRight = (code, key) => code === 'arrowright' || code === 'keyd' || key === 'arrowright' || key === 'd' || key === 'đ';

    // Keyboard Keydown
    window.addEventListener('keydown', e => {
      sound.ensureContext();
      const code = (e.code || '').toLowerCase();
      const key = (e.key || '').toLowerCase();

      if (isUp(code, key)) { e.preventDefault(); this.keyState.up = true; }
      if (isDown(code, key)) { e.preventDefault(); this.keyState.down = true; }
      if (isLeft(code, key)) { e.preventDefault(); this.keyState.left = true; }
      if (isRight(code, key)) { e.preventDefault(); this.keyState.right = true; }

      if (key === ' ' || key === 'shift' || code === 'space' || code === 'shiftleft' || code === 'shiftright') {
        e.preventDefault();
        if (this.gameState === 'playing') {
          this.triggerDash();
        } else {
          this.startGame();
        }
      } else if (key === 'enter' || code === 'enter') {
        e.preventDefault();
        if (this.gameState !== 'playing') {
          this.startGame();
        }
      }
    });

    // Keyboard Keyup (Guaranteed release)
    window.addEventListener('keyup', e => {
      const code = (e.code || '').toLowerCase();
      const key = (e.key || '').toLowerCase();

      if (isUp(code, key)) { this.keyState.up = false; }
      if (isDown(code, key)) { this.keyState.down = false; }
      if (isLeft(code, key)) { this.keyState.left = false; }
      if (isRight(code, key)) { this.keyState.right = false; }
    });

    // Clear all inputs on blur or visibility change
    window.addEventListener('blur', () => this.clearAllInputs());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.clearAllInputs();
    });

    // --- 1. Virtual Analog Joystick (360° Touch / Mouse Drag) ---
    if (this.joystickBase && this.joystickKnob) {
      const handleJoyStart = ev => {
        ev.preventDefault();
        sound.ensureContext();
        this.joystickPointerId = ev.pointerId;
        try { this.joystickBase.setPointerCapture(ev.pointerId); } catch (_) {}
        this.joystickKnob.classList.add('active');
        this.updateJoystickPosition(ev.clientX, ev.clientY);
        this.vibrate(15);
      };

      const handleJoyMove = ev => {
        if (this.joystickPointerId === null || ev.pointerId !== this.joystickPointerId) return;
        ev.preventDefault();
        this.updateJoystickPosition(ev.clientX, ev.clientY);
      };

      const handleJoyEnd = ev => {
        if (ev && ev.pointerId !== undefined && this.joystickPointerId !== null && ev.pointerId !== this.joystickPointerId) return;
        this.resetJoystick();
      };

      this.joystickBase.addEventListener('pointerdown', handleJoyStart);
      this.joystickBase.addEventListener('pointermove', handleJoyMove);
      this.joystickBase.addEventListener('pointerup', handleJoyEnd);
      this.joystickBase.addEventListener('pointercancel', handleJoyEnd);
    }

    // --- 2. Upgraded D-Pad (Multi-direction & Continuous Touch Slide) ---
    if (this.dpadContainer) {
      const updateDpadFromPoint = (clientX, clientY) => {
        const el = document.elementFromPoint(clientX, clientY);
        const targetBtn = el ? el.closest('.direction') : null;
        const targetId = targetBtn ? targetBtn.id : null;

        this.dpadState.up = (targetId === 'btnUp');
        this.dpadState.down = (targetId === 'btnDown');
        this.dpadState.left = (targetId === 'btnLeft');
        this.dpadState.right = (targetId === 'btnRight');

        ['btnUp', 'btnDown', 'btnLeft', 'btnRight'].forEach(id => {
          const btn = document.getElementById(id);
          if (btn) btn.classList.toggle('pressed', id === targetId);
        });
      };

      const handleDpadStart = ev => {
        ev.preventDefault();
        sound.ensureContext();
        this.dpadPointerId = ev.pointerId;
        try { this.dpadContainer.setPointerCapture(ev.pointerId); } catch (_) {}
        updateDpadFromPoint(ev.clientX, ev.clientY);
        this.vibrate(15);
      };

      const handleDpadMove = ev => {
        if (this.dpadPointerId === null || ev.pointerId !== this.dpadPointerId) return;
        ev.preventDefault();
        updateDpadFromPoint(ev.clientX, ev.clientY);
      };

      const handleDpadEnd = ev => {
        if (ev && ev.pointerId !== undefined && this.dpadPointerId !== null && ev.pointerId !== this.dpadPointerId) return;
        this.dpadPointerId = null;
        this.dpadState.up = false;
        this.dpadState.down = false;
        this.dpadState.left = false;
        this.dpadState.right = false;
        ['btnUp', 'btnDown', 'btnLeft', 'btnRight'].forEach(id => {
          const btn = document.getElementById(id);
          if (btn) btn.classList.remove('pressed');
        });
      };

      this.dpadContainer.addEventListener('pointerdown', handleDpadStart);
      this.dpadContainer.addEventListener('pointermove', handleDpadMove);
      this.dpadContainer.addEventListener('pointerup', handleDpadEnd);
      this.dpadContainer.addEventListener('pointercancel', handleDpadEnd);
    }

    // Global pointer release: ONLY release the specific control that matches the lifted finger!
    // (Crucial: prevents lifting the Dash button from interrupting continuous Joystick or D-Pad movement)
    window.addEventListener('pointerup', ev => {
      if (this.joystickPointerId !== null && ev.pointerId === this.joystickPointerId) {
        this.resetJoystick();
      }
      if (this.dpadPointerId !== null && ev.pointerId === this.dpadPointerId) {
        this.dpadPointerId = null;
        this.dpadState.up = false;
        this.dpadState.down = false;
        this.dpadState.left = false;
        this.dpadState.right = false;
        ['btnUp', 'btnDown', 'btnLeft', 'btnRight'].forEach(id => {
          const btn = document.getElementById(id);
          if (btn) btn.classList.remove('pressed');
        });
      }
    });

    window.addEventListener('pointercancel', ev => {
      if (this.joystickPointerId !== null && ev.pointerId === this.joystickPointerId) {
        this.resetJoystick();
      }
      if (this.dpadPointerId !== null && ev.pointerId === this.dpadPointerId) {
        this.dpadPointerId = null;
        this.dpadState.up = false;
        this.dpadState.down = false;
        this.dpadState.left = false;
        this.dpadState.right = false;
        ['btnUp', 'btnDown', 'btnLeft', 'btnRight'].forEach(id => {
          const btn = document.getElementById(id);
          if (btn) btn.classList.remove('pressed');
        });
      }
    });

    // Mobile Dash Button (Isolated multi-touch so tapping dash never interferes with direction controls)
    if (this.mobileDashBtn) {
      this.mobileDashBtn.addEventListener('focus', () => this.mobileDashBtn.blur());
      this.mobileDashBtn.addEventListener('pointerdown', ev => {
        ev.preventDefault();
        ev.stopPropagation();
        sound.ensureContext();
        this.vibrate(25);
        if (this.gameState === 'playing') {
          this.triggerDash();
        } else {
          this.startGame();
        }
      });
      this.mobileDashBtn.addEventListener('pointerup', ev => {
        ev.preventDefault();
        ev.stopPropagation();
      });
      this.mobileDashBtn.addEventListener('pointercancel', ev => {
        ev.preventDefault();
        ev.stopPropagation();
      });
    }
  }

  updateJoystickPosition(clientX, clientY) {
    if (!this.joystickBase || !this.joystickKnob) return;
    const rect = this.joystickBase.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);
    const maxRadius = Math.max(20, (rect.width / 2) - 14); // ~40-44px
    const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(dist, maxRadius);
    const clampedX = Math.cos(angle) * clampedDist;
    const clampedY = Math.sin(angle) * clampedDist;

    this.joystickKnob.style.transform = `translate(${clampedX}px, ${clampedY}px)`;

    const deadZone = 6;
    if (dist < deadZone) {
      this.joystickVector = { x: 0, y: 0 };
    } else {
      const mag = Math.min(1, dist / maxRadius);
      this.joystickVector = {
        x: Math.cos(angle) * mag,
        y: Math.sin(angle) * mag
      };
    }
  }

  resetEntities() {
    this.clearAllInputs();
    this.cat.x = CANVAS_SIZE / 2;
    this.cat.y = CANVAS_SIZE / 2;
    this.cat.vx = 0;
    this.cat.vy = 0;
    this.cat.radius = CAT_RADIUS;
    this.cat.lives = this.settings.lives;
    this.cat.maxLives = this.settings.lives;
    this.cat.invulnerableTimer = 0;
    this.cat.isDashing = false;
    this.cat.dashTimer = 0;
    this.cat.dashCooldownTimer = 0;
    this.cat.hasShield = false;
    this.cat.slowMoTimer = 0;
    this.cat.catnipTimer = 0;
    this.updateLivesHUD();

    this.score = 0;
    this.bonusScore = 0;
    this.elapsedTime = 0;
    this.newRecordTriggered = false;
    this.scoreValEl.textContent = '000';

    // Reset 8-Stage Map Progression
    this.currentStage = 1;
    this.currentMap = STAGE_MAPS[0];
    this.victoryAwarded = false;
    if (this.stageIconEl) this.stageIconEl.textContent = this.currentMap.icon;
    if (this.stageTagEl) this.stageTagEl.textContent = this.currentMap.tag;
    if (this.stageNameEl) this.stageNameEl.textContent = this.currentMap.name;
    if (this.mapBannerEl) this.mapBannerEl.classList.add('hidden');
    if (this.victoryOverlayEl) this.victoryOverlayEl.classList.add('hidden');

    this.createHazards();

    this.pickups = [];
    this.lasers = [];
    this.particles = [];
    this.dashGhosts = [];
    this.floatingTexts = [];

    this.pickupSpawnTimer = 2.5;
    this.laserSpawnTimer = this.settings.difficulty === 'easy' ? 24 : (this.settings.difficulty === 'hard' ? 10 : (this.settings.difficulty === 'nightmare' ? 7 : 15));
    this.extraHazardSpawned = false;

    // Reset Multi-Boss Battle across 8 Stages
    this.bosses = [];
    this.bossSpawned = false;
    this.bossDefeated = false;
    this.bullets = [];
    this.bossBullets = [];
    this.catShootTimer = 0;
    this.stageBossSpawned = [false, false, false, false, false, false, false, false];
    if (this.bossHudEl) this.bossHudEl.classList.add('hidden');
  }

  createHazards() {
    const count = this.settings.hazardCount || 3;
    let speedScale = 1.0;
    if (this.settings.difficulty === 'easy') speedScale = 0.8;
    else if (this.settings.difficulty === 'hard') speedScale = 1.25;
    else if (this.settings.difficulty === 'nightmare') speedScale = 1.5;

    const map = this.currentMap || STAGE_MAPS[0];

    this.hazards = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i;
      const dist = 180 + (i % 2) * 55;
      const x = CANVAS_SIZE / 2 + Math.cos(angle) * dist - 28;
      const y = CANVAS_SIZE / 2 + Math.sin(angle) * dist - 28;
      const vx = (Math.cos(angle + Math.PI / 2) * 125 + (Math.random() - 0.5) * 35) * speedScale;
      const vy = (Math.sin(angle + Math.PI / 2) * 125 + (Math.random() - 0.5) * 35) * speedScale;

      this.hazards.push({
        x, y,
        vx, vy,
        size: 50 + (i % 3) * 6,
        angle: i * 0.45,
        spinSpeed: (i % 2 === 0 ? 2.5 : -2.8) * speedScale,
        color: map.spikeColor,
        obstacleType: map.obstacleType
      });
    }
  }

  // --- 8-Stage Map Progression Engine ---
  advanceToStage(stageNum) {
    if (this.currentStage === stageNum) return;
    this.currentStage = stageNum;
    this.currentMap = STAGE_MAPS[stageNum - 1] || STAGE_MAPS[0];

    // Update Stage Badge in Header
    if (this.stageIconEl) this.stageIconEl.textContent = this.currentMap.icon;
    if (this.stageTagEl) this.stageTagEl.textContent = this.currentMap.tag;
    if (this.stageNameEl) this.stageNameEl.textContent = this.currentMap.name;

    // Morph existing hazards to new map's themed obstacles
    this.hazards.forEach(h => {
      h.color = this.currentMap.spikeColor;
      h.obstacleType = this.currentMap.obstacleType;
    });

    // Dọn sạch boss và đạn của vòng cũ khi bước sang vòng mới
    this.bosses = [];
    this.bossBullets = [];
    if (this.bossHudEl) this.bossHudEl.classList.add('hidden');

    // SFX & Haptics & Screen Shake
    sound.playMapClear();
    this.vibrate([100, 60, 140]);
    this.shakeScreen(0.35, 12);

    // Floating text notification
    this.addFloatingText(`TIẾN VÀO ${this.currentMap.name.toUpperCase()}!`, this.cat.x, this.cat.y - 45, this.currentMap.spikeColor);

    // Show Map Transition Banner
    this.showMapBanner(this.currentMap);

    // Celebratory Particle Burst
    for (let i = 0; i < 35; i++) {
      this.particles.push({
        x: CANVAS_SIZE / 2 + (Math.random() - 0.5) * 200,
        y: CANVAS_SIZE / 2 + (Math.random() - 0.5) * 200,
        vx: (Math.random() - 0.5) * 320,
        vy: (Math.random() - 0.5) * 320,
        color: this.currentMap.spikeColor,
        life: 1.6,
        radius: 4.5
      });
    }
  }

  showMapBanner(map) {
    if (!this.mapBannerEl) return;
    // Don't show transition banner if victory screen is already open
    if (this.victoryOverlayEl && !this.victoryOverlayEl.classList.contains('hidden')) return;

    if (this.mapBannerIconEl) this.mapBannerIconEl.textContent = map.icon;
    if (this.mapBannerTitleEl) this.mapBannerTitleEl.textContent = `${map.tag}: ${map.name.toUpperCase()}`;

    this.mapBannerEl.classList.remove('hidden');
    void this.mapBannerEl.offsetWidth; // Force CSS reflow to re-trigger slide-in animation

    if (this.bannerTimer) clearTimeout(this.bannerTimer);
    this.bannerTimer = setTimeout(() => {
      if (this.mapBannerEl) this.mapBannerEl.classList.add('hidden');
    }, 3200);
  }

  checkVictoryCondition() {
    if (this.score >= 6400 && !this.victoryAwarded) {
      this.victoryAwarded = true;
      this.stars += 1;
      localStorage.setItem('meo-ne-gai-stars', String(this.stars));
      if (this.starsValEl) this.starsValEl.textContent = `⭐ ${this.stars}`;
      if (this.vicTotalStarsEl) this.vicTotalStarsEl.textContent = `⭐ ${this.stars}`;
      if (this.vicScoreEl) this.vicScoreEl.textContent = String(this.score);

      // Hide map transition banner when victory modal opens to prevent overlap
      if (this.mapBannerEl) this.mapBannerEl.classList.add('hidden');

      sound.playVictoryFanfare();
      this.vibrate([150, 80, 200, 100, 300]);
      this.shakeScreen(0.5, 18);

      if (this.victoryOverlayEl) {
        this.victoryOverlayEl.classList.remove('hidden');
      }

      // Grand Golden Confetti Explosion
      for (let i = 0; i < 65; i++) {
        this.particles.push({
          x: CANVAS_SIZE / 2,
          y: CANVAS_SIZE / 2,
          vx: (Math.random() - 0.5) * 460,
          vy: (Math.random() - 0.5) * 460,
          color: ['#fbbf24', '#f59e0b', '#38bdf8', '#a855f7', '#ec4899', '#22c55e'][Math.floor(Math.random() * 6)],
          life: 2.8,
          radius: 5.5
        });
      }
    }
  }

  drawDarknessOverlay(ctx) {
    ctx.save();
    const radInner = 75;
    const radOuter = 230;
    const grad = ctx.createRadialGradient(this.cat.x, this.cat.y, radInner, this.cat.x, this.cat.y, radOuter);
    grad.addColorStop(0, 'rgba(3, 3, 7, 0)');
    grad.addColorStop(0.55, 'rgba(3, 3, 7, 0.75)');
    grad.addColorStop(1, 'rgba(3, 3, 7, 0.96)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Subtle dark red flashlight ring
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.28)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.cat.x, this.cat.y, radOuter, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  takeDamage(source) {
    if (this.cat.isDashing || this.cat.invulnerableTimer > 0) return;

    if (this.cat.hasShield) {
      this.cat.hasShield = false;
      this.cat.invulnerableTimer = 1.0; // 1s bất tử khi vỡ khiên để tránh mất tim dồn dập
      sound.playShieldBreak();
      this.vibrate(30);
      this.shakeScreen(0.25, 12);
      this.addFloatingText('KHIÊN BẢO HỘ VỠ!', this.cat.x, this.cat.y - 25, '#38bdf8');
      return;
    }

    this.cat.lives -= 1;
    this.updateLivesHUD();
    sound.playHurt();
    this.vibrate([45, 30, 45]);
    this.shakeScreen(0.35, 16);

    // Heart break particles
    for (let i = 0; i < 15; i++) {
      this.particles.push({
        x: this.cat.x,
        y: this.cat.y - 10,
        vx: (Math.random() - 0.5) * 180,
        vy: (Math.random() - 0.5) * 180 - 40,
        color: '#ef4444',
        life: 0.6,
        radius: 3.5
      });
    }

    if (this.cat.lives > 0) {
      this.cat.invulnerableTimer = 1.6; // 1.6s i-frame
      this.addFloatingText(`-1 ❤️ (Còn ${this.cat.lives})`, this.cat.x, this.cat.y - 28, '#ef4444');
    } else {
      this.gameOver();
    }
  }

  startGame() {
    sound.ensureContext();
    this.keys.clear();
    this.resetEntities();
    this.gameState = 'playing';
    this.gameOverlayEl.classList.add('hidden');
    sound.playMeow();
    sound.startBGM();
  }

  gameOver() {
    this.gameState = 'gameover';
    sound.stopBGM();
    sound.playHurt();
    this.vibrate([150, 70, 200]);
    this.shakeScreen(0.4, 15);

    // Update High Score
    const finalScore = this.score;
    if (finalScore > this.highScore) {
      this.highScore = finalScore;
      localStorage.setItem('meo-ne-gai-best', String(this.highScore));
      this.highScoreValEl.textContent = String(this.highScore).padStart(3, '0');
    }

    // Modal UI
    this.overlayLabelEl.textContent = 'ÔI KHÔNG! MÈO ĐÃ VA PHẢI';
    this.overlayLabelEl.style.color = '#ef4444';
    this.overlayTitleEl.textContent = `${finalScore} điểm`;
    this.overlayDescEl.innerHTML = `Kỷ lục hiện tại của bạn là <strong>${this.highScore}</strong> điểm. Thử thêm lần nữa nhé!`;
    this.startBtnText.textContent = 'Chơi lại';
    this.overlayHintEl.textContent = 'Nhấn Enter hoặc phím cách để chơi lại';

    this.gameOverlayEl.classList.remove('hidden');
  }

  triggerDash() {
    if (this.cat.dashCooldownTimer > 0 || this.cat.isDashing) return;
    this.cat.isDashing = true;
    this.cat.dashTimer = this.cat.dashDuration;
    this.cat.dashCooldownTimer = this.cat.dashCooldown;
    sound.playDash();
    this.vibrate(25);
    this.shakeScreen(0.12, 4);

    // Create immediate ghost
    this.dashGhosts.push({
      x: this.cat.x,
      y: this.cat.y,
      skin: this.currentSkin,
      alpha: 0.65,
      radius: this.cat.radius
    });

    this.addFloatingText('LƯỚT NHANH!', this.cat.x, this.cat.y - 28, '#38bdf8');
  }

  shakeScreen(duration, intensity) {
    this.screenShakeTime = duration;
    this.screenShakeIntensity = intensity;
  }

  addFloatingText(text, x, y, color = '#ffbd59') {
    this.floatingTexts.push({
      text,
      x,
      y,
      color,
      alpha: 1,
      vy: -55
    });
  }

  spawnPickup() {
    if (this.pickups.length >= 3) return;

    const types = ['fish', 'fish', 'pate', 'shield', 'slowmo', 'catnip'];
    const chosenType = types[Math.floor(Math.random() * types.length)];

    const margin = SPIKE_WALL_WIDTH + 60;
    const x = margin + Math.random() * (CANVAS_SIZE - margin * 2);
    const y = margin + Math.random() * (CANVAS_SIZE - margin * 2);

    this.pickups.push({
      type: chosenType,
      x,
      y,
      radius: 18,
      life: 11, // Tồn tại 11 giây
      bobPhase: Math.random() * Math.PI * 2
    });
  }

  spawnLaser() {
    // Laser quét ngang hoặc dọc
    const isHorizontal = Math.random() > 0.5;
    const minPos = SPIKE_WALL_WIDTH + 50;
    const maxPos = CANVAS_SIZE - SPIKE_WALL_WIDTH - 50;
    const pos = minPos + Math.random() * (maxPos - minPos);

    this.lasers.push({
      isHorizontal,
      pos,
      state: 'warning', // 'warning' -> 'firing'
      timer: 1.4,       // 1.4s cảnh báo
      fireDuration: 0.45,
      thickness: 18
    });

    sound.playLaserWarning();
  }

  applyPowerup(type) {
    this.vibrate(18);
    if (type === 'fish') {
      this.bonusScore += 50;
      sound.playPickup('fish');
      this.addFloatingText('+50 Cá hồi!', this.cat.x, this.cat.y - 25, '#fbbf24');
    } else if (type === 'pate') {
      this.bonusScore += 100;
      sound.playPickup('pate');
      this.addFloatingText('+100 Pate thơm ngon!', this.cat.x, this.cat.y - 25, '#f43f5e');
    } else if (type === 'shield') {
      this.cat.hasShield = true;
      sound.playPowerup('shield');
      this.addFloatingText('KHIÊN BẢO HỘ!', this.cat.x, this.cat.y - 25, '#38bdf8');
    } else if (type === 'slowmo') {
      this.cat.slowMoTimer = 5.0;
      sound.playPowerup('slowmo');
      this.addFloatingText('LÀM CHẬM 5S!', this.cat.x, this.cat.y - 25, '#c084fc');
    } else if (type === 'catnip') {
      this.cat.catnipTimer = 6.0;
      sound.playPowerup('catnip');
      this.addFloatingText('CỎ MÈO HƯNG PHẤN!', this.cat.x, this.cat.y - 25, '#4ade80');
    }
  }

  // --- 8-Stage Boss Battle System (Mỗi map có Đại Boss đặc trưng) ---
  spawnStageBoss(stageNum) {
    const bossData = STAGE_BOSSES[stageNum - 1] || STAGE_BOSSES[0];
    this.stageBossSpawned[stageNum - 1] = true;
    this.bossSpawned = true;

    sound.playBossAlert();
    this.vibrate([120, 60, 120]);
    this.shakeScreen(0.5, 20);

    const diffScale = this.settings.difficulty === 'easy' ? 0.75 : (this.settings.difficulty === 'hard' ? 1.25 : (this.settings.difficulty === 'nightmare' ? 1.5 : 1.0));
    const hp = Math.round(bossData.baseHp * diffScale);

    this.addFloatingText(`⚠️ ${bossData.name} XUẤT HIỆN!`, CANVAS_SIZE / 2, 170, bossData.accentColor);
    this.addFloatingText('MÈO KÍCH HOẠT SÚNG PLASMA BẮN TRẢ!', this.cat.x, this.cat.y - 35, '#38bdf8');

    // Tạo Boss tương ứng của map
    const newBoss = {
      id: Date.now(),
      stage: stageNum,
      type: bossData.type,
      name: bossData.name,
      icon: bossData.icon,
      x: CANVAS_SIZE / 2,
      y: 155,
      vx: (Math.random() > 0.5 ? 140 : -140) * diffScale,
      vy: 85 * diffScale,
      radius: bossData.radius,
      maxHp: hp,
      hp: hp,
      hitFlash: 0,
      attackTimer: bossData.attackInterval,
      isCharging: false,
      chargeTimer: 0,
      chargeTargetX: 0,
      chargeTargetY: 0,
      shootTimer: bossData.shootInterval,
      animTime: 0,
      bulletCount: bossData.bulletCount,
      data: bossData,
      theme: {
        body: bossData.bodyColor,
        accent: bossData.accentColor,
        bullet: bossData.bulletColor,
        eye: bossData.eyeColor
      }
    };

    this.bosses = [newBoss];

    if (this.bossHudEl) {
      this.bossHudEl.classList.remove('hidden');
      this.updateBossHUD();
    }
  }

  // Fallback for manual trigger
  spawnBosses() {
    this.spawnStageBoss(this.currentStage);
  }

  updateBossHUD() {
    if (!this.bossHpFillEl || !this.bossHpTextEl || !this.bosses) return;
    const aliveBosses = this.bosses.filter(b => b.hp > 0);
    if (aliveBosses.length === 0) {
      if (this.bossHudEl) this.bossHudEl.classList.add('hidden');
      return;
    }
    const currentBoss = aliveBosses[0];
    const totalHp = Math.max(0, aliveBosses.reduce((sum, b) => sum + b.hp, 0));
    const totalMaxHp = this.bosses.reduce((sum, b) => sum + b.maxHp, 0);

    if (this.bossNameEl) {
      this.bossNameEl.textContent = `${currentBoss.icon || '⚠️'} ${currentBoss.name} (VÒNG ${currentBoss.stage || this.currentStage})`;
    }
    this.bossHpTextEl.textContent = `${totalHp} / ${totalMaxHp}`;
    const pct = Math.max(0, Math.min(100, (totalHp / totalMaxHp) * 100));
    this.bossHpFillEl.style.width = `${pct}%`;
  }

  updateBosses(dt) {
    if (!this.bosses || this.bosses.length === 0) return;

    for (let b of this.bosses) {
      if (b.hp <= 0) continue;
      b.animTime += dt;
      if (b.hitFlash > 0) b.hitFlash -= dt;

      // Movement
      if (b.isCharging) {
        b.chargeTimer -= dt;
        const angle = Math.atan2(b.chargeTargetY - b.y, b.chargeTargetX - b.x);
        b.x += Math.cos(angle) * 360 * dt;
        b.y += Math.sin(angle) * 360 * dt;

        if (Math.random() > 0.4) {
          this.particles.push({
            x: b.x,
            y: b.y,
            vx: (Math.random() - 0.5) * 80,
            vy: (Math.random() - 0.5) * 80,
            color: b.theme.body,
            life: 0.28,
            radius: 4
          });
        }

        if (b.chargeTimer <= 0) {
          b.isCharging = false;
        }
      } else {
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        const minX = SPIKE_WALL_WIDTH + b.radius + 12;
        const maxX = CANVAS_SIZE - SPIKE_WALL_WIDTH - b.radius - 12;
        const minY = SPIKE_WALL_WIDTH + b.radius + 12;
        const maxY = CANVAS_SIZE - SPIKE_WALL_WIDTH - b.radius - 12;

        if (b.x <= minX) { b.vx = Math.abs(b.vx); b.x = minX; }
        else if (b.x >= maxX) { b.vx = -Math.abs(b.vx); b.x = maxX; }

        if (b.y <= minY) { b.vy = Math.abs(b.vy); b.y = minY; }
        else if (b.y >= maxY) { b.vy = -Math.abs(b.vy); b.y = maxY; }

        // Charge attack countdown
        b.attackTimer -= dt;
        if (b.attackTimer <= 0) {
          b.attackTimer = 5.2;
          b.isCharging = true;
          b.chargeTimer = 1.1;
          b.chargeTargetX = this.cat.x;
          b.chargeTargetY = this.cat.y;
          this.addFloatingText(`${b.name} LAO TỚI!`, b.x, b.y - 45, '#ef4444');
          sound.playLaserWarning();
          this.shakeScreen(0.18, 5);
        }

        // Shoot radial spike shards
        b.shootTimer -= dt;
        if (b.shootTimer <= 0) {
          b.shootTimer = 3.8;
          this.spawnBossBullets(b);
        }
      }

      // Check Collision between Boss and Cat
      const distToCat = Math.hypot(this.cat.x - b.x, this.cat.y - b.y);
      if (distToCat < this.cat.radius + b.radius) {
        if (!this.cat.isDashing && this.cat.invulnerableTimer <= 0) {
          this.takeDamage(b.name);
          b.vx *= -1;
          b.vy *= -1;
        }
      }
    }
  }

  spawnBossBullets(boss) {
    sound.playLaserFire();
    const count = boss.bulletCount || 8;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + Math.random() * 0.2;
      this.bossBullets.push({
        x: boss.x,
        y: boss.y,
        vx: Math.cos(angle) * 195,
        vy: Math.sin(angle) * 195,
        radius: 7,
        color: (boss.theme && boss.theme.bullet) ? boss.theme.bullet : '#f43f5e'
      });
    }
  }

  updateCatShooting(dt) {
    if (!this.bosses || this.bosses.length === 0) return;
    const aliveBosses = this.bosses.filter(b => b.hp > 0);
    if (aliveBosses.length === 0) return;

    // Find nearest alive boss
    let targetBoss = aliveBosses[0];
    let minDist = Math.hypot(targetBoss.x - this.cat.x, targetBoss.y - this.cat.y);
    for (let i = 1; i < aliveBosses.length; i++) {
      const d = Math.hypot(aliveBosses[i].x - this.cat.x, aliveBosses[i].y - this.cat.y);
      if (d < minDist) {
        minDist = d;
        targetBoss = aliveBosses[i];
      }
    }

    this.catShootTimer -= dt;
    if (this.catShootTimer <= 0) {
      this.catShootTimer = 0.15; // ~6.6 bullets / sec
      const angle = Math.atan2(targetBoss.y - this.cat.y, targetBoss.x - this.cat.x);
      const bulletSpeed = 800;
      this.bullets.push({
        x: this.cat.x + Math.cos(angle) * 20,
        y: this.cat.y + Math.sin(angle) * 20,
        vx: Math.cos(angle) * bulletSpeed,
        vy: Math.sin(angle) * bulletSpeed,
        radius: 4.5,
        color: '#38bdf8'
      });
      sound.playGunFire();

      // Muzzle spark
      this.particles.push({
        x: this.cat.x + Math.cos(angle) * 22,
        y: this.cat.y + Math.sin(angle) * 22,
        vx: Math.cos(angle) * 80 + (Math.random() - 0.5) * 40,
        vy: Math.sin(angle) * 80 + (Math.random() - 0.5) * 40,
        color: '#7dd3fc',
        life: 0.12,
        radius: 3
      });
    }
  }

  updateBullets(dt) {
    // Update Cat Bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      let hitAny = false;
      if (this.bosses && this.bosses.length > 0) {
        for (let boss of this.bosses) {
          if (boss.hp <= 0) continue;
          const dist = Math.hypot(b.x - boss.x, b.y - boss.y);
          if (dist < boss.radius + b.radius) {
            const isCrit = Math.random() < 0.25;
            const dmg = isCrit ? 30 : 15;
            boss.hp -= dmg;
            boss.hitFlash = 0.08;
            sound.playBossHit();

            this.addFloatingText(isCrit ? `BẮN TRÚNG! -${dmg}` : `-${dmg}`, b.x, b.y - 15, isCrit ? '#f59e0b' : '#38bdf8');

            for (let p = 0; p < 4; p++) {
              this.particles.push({
                x: b.x,
                y: b.y,
                vx: (Math.random() - 0.5) * 160,
                vy: (Math.random() - 0.5) * 160,
                color: isCrit ? '#fde047' : '#38bdf8',
                life: 0.25,
                radius: 3
              });
            }

            this.updateBossHUD();

            if (boss.hp <= 0) {
              sound.playBossDefeated();
              this.shakeScreen(0.4, 16);
              this.addFloatingText(`💥 HẠ GỤC ${boss.name}!`, boss.x, boss.y, '#fbbf24');
              // Drop loot for this boss
              this.pickups.push({ type: 'pate', x: boss.x - 25, y: boss.y, radius: 18, life: 15, bobPhase: 0 });
              this.pickups.push({ type: 'fish', x: boss.x + 25, y: boss.y, radius: 18, life: 15, bobPhase: 1 });

              // Check if all bosses defeated
              const allDead = this.bosses.every(bs => bs.hp <= 0);
              if (allDead) {
                this.defeatBosses();
              }
            }

            hitAny = true;
            break;
          }
        }
      }

      if (hitAny || b.x < 0 || b.x > CANVAS_SIZE || b.y < 0 || b.y > CANVAS_SIZE) {
        this.bullets.splice(i, 1);
      }
    }

    // Update Boss Bullets
    for (let i = this.bossBullets.length - 1; i >= 0; i--) {
      const bb = this.bossBullets[i];
      bb.x += bb.vx * dt;
      bb.y += bb.vy * dt;

      const dist = Math.hypot(bb.x - this.cat.x, bb.y - this.cat.y);
      if (dist < this.cat.radius + bb.radius) {
        if (!this.cat.isDashing && this.cat.invulnerableTimer <= 0) {
          this.takeDamage('Đạn Boss');
          this.bossBullets.splice(i, 1);
          continue;
        }
      }

      if (bb.x < SPIKE_WALL_WIDTH || bb.x > CANVAS_SIZE - SPIKE_WALL_WIDTH ||
          bb.y < SPIKE_WALL_WIDTH || bb.y > CANVAS_SIZE - SPIKE_WALL_WIDTH) {
        this.bossBullets.splice(i, 1);
      }
    }
  }

  defeatBosses() {
    sound.playBossDefeated();
    this.vibrate([80, 40, 80, 40, 150]);
    this.shakeScreen(0.6, 24);
    this.bossDefeated = true;
    const bonus = 1000 * (this.bosses.length || 1);
    this.bonusScore += bonus;
    this.addFloatingText(`🏆 TOÀN THẮNG ĐẠI BOSS! +${bonus} ĐIỂM!`, CANVAS_SIZE / 2, 220, '#fbbf24');

    if (this.bossHudEl) {
      this.bossHudEl.classList.add('hidden');
    }

    // Grand Fireworks
    for (let i = 0; i < 60; i++) {
      this.particles.push({
        x: CANVAS_SIZE / 2 + (Math.random() - 0.5) * 300,
        y: 160 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 500,
        vy: (Math.random() - 0.5) * 500,
        color: ['#ef4444', '#f97316', '#fbbf24', '#38bdf8', '#c084fc', '#10b981'][Math.floor(Math.random() * 6)],
        life: 1.6,
        radius: 5
      });
    }

    this.pickups.push({ type: 'shield', x: CANVAS_SIZE / 2, y: 150, radius: 18, life: 18, bobPhase: 2 });
    this.bossBullets = [];
  }

  // --- Main Update Loop ---
  update(dt) {
    if (this.gameState !== 'playing') return;

    this.elapsedTime += dt;
    this.score = Math.floor(this.elapsedTime * 10) + this.bonusScore;
    this.scoreValEl.textContent = String(this.score).padStart(3, '0');

    // 8-Stage Map Progression (Every 800 pts advances to next map)
    const targetStage = Math.min(8, Math.floor(this.score / 800) + 1);
    if (targetStage !== this.currentStage) {
      this.advanceToStage(targetStage);
    }

    // Grand 8-Map Victory Check (At 6400+ points)
    this.checkVictoryCondition();

    // New High Score fanfare check
    if (this.score > this.highScore && this.highScore > 50 && !this.newRecordTriggered) {
      this.newRecordTriggered = true;
      sound.playNewRecord();
      this.addFloatingText('KỶ LỤC MỚI!', this.cat.x, this.cat.y - 45, '#f59e0b');
      // Sparkle particles
      for (let i = 0; i < 25; i++) {
        this.particles.push({
          x: this.cat.x,
          y: this.cat.y,
          vx: (Math.random() - 0.5) * 280,
          vy: (Math.random() - 0.5) * 280,
          color: ['#fbbf24', '#f43f5e', '#38bdf8', '#a855f7'][Math.floor(Math.random() * 4)],
          life: 1.2,
          radius: 4
        });
      }
    }

    // Check Boss Spawn for Current Stage (Spawns at stageReq + 250 pts)
    const currentStageIdx = this.currentStage - 1;
    const stageReq = (STAGE_MAPS[currentStageIdx] ? STAGE_MAPS[currentStageIdx].scoreReq : 0);
    const triggerScore = stageReq + 250;

    if (!this.stageBossSpawned[currentStageIdx] && this.score >= triggerScore) {
      this.spawnStageBoss(this.currentStage);
    }

    // Cat Invulnerability i-frame Countdown
    if (this.cat.invulnerableTimer > 0) {
      this.cat.invulnerableTimer -= dt;
      if (this.cat.invulnerableTimer < 0) this.cat.invulnerableTimer = 0;
    }

    // Powerup Timers
    if (this.cat.slowMoTimer > 0) this.cat.slowMoTimer -= dt;
    if (this.cat.catnipTimer > 0) {
      this.cat.catnipTimer -= dt;
      this.cat.radius = CAT_RADIUS * 0.72; // Thu nhỏ mèo
    } else {
      this.cat.radius = CAT_RADIUS;
    }

    // Update In-game Powerup HUD Badges
    this.updatePowerupHUD();

    // Dash Timers
    if (this.cat.dashTimer > 0) {
      this.cat.dashTimer -= dt;
      if (this.cat.dashTimer <= 0) {
        this.cat.isDashing = false;
      }
      // Add dash ghosts
      if (Math.random() > 0.3) {
        this.dashGhosts.push({
          x: this.cat.x,
          y: this.cat.y,
          skin: this.currentSkin,
          alpha: 0.5,
          radius: this.cat.radius
        });
      }
    }

    if (this.cat.dashCooldownTimer > 0) {
      this.cat.dashCooldownTimer -= dt;
      if (this.cat.dashCooldownTimer < 0) this.cat.dashCooldownTimer = 0;
    }

    // Update Dash HUD
    const cdRatio = 1 - (this.cat.dashCooldownTimer / this.cat.dashCooldown);
    this.dashBarFillEl.style.width = `${Math.min(100, Math.max(0, cdRatio * 100))}%`;
    if (this.cat.dashCooldownTimer <= 0) {
      this.dashHudEl.classList.add('ready');
      if (this.mobileDashBtn) this.mobileDashBtn.classList.remove('cooldown');
    } else {
      this.dashHudEl.classList.remove('ready');
      if (this.mobileDashBtn) this.mobileDashBtn.classList.add('cooldown');
    }

    // Cat Movement (Guaranteed instant release with zero stuck keys, Analog Joystick + D-Pad)
    let dx = 0;
    let dy = 0;
    const jx = this.joystickVector ? this.joystickVector.x : 0;
    const jy = this.joystickVector ? this.joystickVector.y : 0;
    const joyMag = Math.hypot(jx, jy);

    if (joyMag > 0.08) {
      dx = jx;
      dy = jy;
    } else {
      if (this.isLeftActive()) dx -= 1;
      if (this.isRightActive()) dx += 1;
      if (this.isUpActive()) dy -= 1;
      if (this.isDownActive()) dy += 1;

      if (dx !== 0 && dy !== 0) {
        dx *= 0.7071;
        dy *= 0.7071;
      }
    }

    let speed = BASE_SPEED;
    if (this.cat.catnipTimer > 0) speed *= 1.35;
    if (this.cat.isDashing) speed *= 2.6;

    this.cat.x += dx * speed * dt;
    this.cat.y += dy * speed * dt;

    if (dx !== 0 || dy !== 0) {
      this.cat.facingX = dx;
      this.cat.facingY = dy;
      // Add foot dust particles
      if (Math.random() > 0.5) {
        this.particles.push({
          x: this.cat.x + (Math.random() - 0.5) * 16,
          y: this.cat.y + 24,
          vx: -dx * 40 + (Math.random() - 0.5) * 20,
          vy: -dy * 40 - Math.random() * 20,
          color: 'rgba(255, 255, 255, 0.45)',
          life: 0.35,
          radius: 3
        });
      }
    }

    // Boundary Spikes Collision & Hard Arena Barrier
    // Kích thước thực tế của sprite mèo tính từ tâm (x, y):
    // - Đỉnh tai mèo: vươn lên trên 31px (y - 31)
    // - Đáy chân & bóng mèo: vươn xuống dưới 36px (y + 36)
    // - Mép trái (tai / râu): vươn sang trái 25px (x - 25)
    // - Mép phải (đuôi / râu): vươn sang phải 34px (x + 34)
    // Tường gai bao quanh: 48px viền tường + 22px chóp gai = 70px từ mép canvas.
    const minSafeX = 70 + 25 + 6;                  // 101px
    const maxSafeX = (CANVAS_SIZE - 70) - 34 - 6;  // 610px
    const minSafeY = 70 + 31 + 6;                  // 107px
    const maxSafeY = (CANVAS_SIZE - 70) - 36 - 8;  // 606px (chặn cứng mép dưới, tuyệt đối không lọt chân/bóng ra ngoài)

    let hitSpikes = false;

    // 1. Chặn cứng tức thời (Hard Clamping): Bất kể đang lướt hay bất tử, mèo KHÔNG THỂ vượt qua biên an toàn
    if (this.cat.x <= minSafeX) {
      hitSpikes = true;
      this.cat.x = minSafeX;
    } else if (this.cat.x >= maxSafeX) {
      hitSpikes = true;
      this.cat.x = maxSafeX;
    }

    if (this.cat.y <= minSafeY) {
      hitSpikes = true;
      this.cat.y = minSafeY;
    } else if (this.cat.y >= maxSafeY) {
      hitSpikes = true;
      this.cat.y = maxSafeY;
    }

    // 2. Phản hồi va chạm khi chạm rìa gai:
    if (hitSpikes) {
      // Đẩy lùi mèo an toàn vào sâu trong sân đấu 24px để thoát khỏi rìa gai nhọn
      if (this.cat.x <= minSafeX) this.cat.x = minSafeX + 24;
      if (this.cat.x >= maxSafeX) this.cat.x = maxSafeX - 24;
      if (this.cat.y <= minSafeY) this.cat.y = minSafeY + 24;
      if (this.cat.y >= maxSafeY) this.cat.y = maxSafeY - 24;

      // Xử lý mất máu (miễn nhiễm khi đang lướt hoặc trong thời gian i-frame)
      if (!this.cat.isDashing && this.cat.invulnerableTimer <= 0) {
        this.takeDamage('Gai tường');
      }
    }

    // Difficulty scaling & Hazard speed
    let speedMultiplier = Math.min(1.85, 1 + this.elapsedTime / 36);
    if (this.cat.slowMoTimer > 0) speedMultiplier *= 0.5;

    // Update Hazards & Check Collisions
    const wallBoundMin = SPIKE_WALL_WIDTH + 14;
    for (let h of this.hazards) {
      h.x += h.vx * speedMultiplier * dt;
      h.y += h.vy * speedMultiplier * dt;
      h.angle += h.spinSpeed * speedMultiplier * dt;

      const wallBoundMax = CANVAS_SIZE - SPIKE_WALL_WIDTH - 14 - h.size;

      // Bounce against walls
      if (h.x <= wallBoundMin) {
        h.vx = Math.abs(h.vx);
        h.x = wallBoundMin;
      } else if (h.x >= wallBoundMax) {
        h.vx = -Math.abs(h.vx);
        h.x = wallBoundMax;
      }

      if (h.y <= wallBoundMin) {
        h.vy = Math.abs(h.vy);
        h.y = wallBoundMin;
      } else if (h.y >= wallBoundMax) {
        h.vy = -Math.abs(h.vy);
        h.y = wallBoundMax;
      }

      // Check Collision with Cat (Rotated Box vs Circle)
      const hCenter = { x: h.x + h.size / 2, y: h.y + h.size / 2 };
      const cosA = Math.cos(-h.angle);
      const sinA = Math.sin(-h.angle);
      const relX = this.cat.x - hCenter.x;
      const relY = this.cat.y - hCenter.y;
      const localCatX = relX * cosA - relY * sinA;
      const localCatY = relX * sinA + relY * cosA;

      const halfSize = h.size / 2;
      const nearestX = Math.max(-halfSize, Math.min(halfSize, localCatX));
      const nearestY = Math.max(-halfSize, Math.min(halfSize, localCatY));

      const distSq = (localCatX - nearestX) ** 2 + (localCatY - nearestY) ** 2;

      // Near-miss check
      const dangerDistSq = (this.cat.radius + 15) ** 2;
      if (distSq < dangerDistSq && distSq > this.cat.radius ** 2 && !h.nearMissed) {
        h.nearMissed = true;
        this.bonusScore += 15;
        sound.playNearMiss();
        this.addFloatingText('NÉ SÁT! +15', this.cat.x, this.cat.y - 30, '#38bdf8');
        setTimeout(() => { h.nearMissed = false; }, 1800);
      }

      // True Collision
      if (distSq < this.cat.radius ** 2) {
        if (!this.cat.isDashing && this.cat.invulnerableTimer <= 0) {
          this.takeDamage('Khối neon');
          h.vx *= -1.2;
          h.vy *= -1.2;
        }
      }
    }

    // Pickups Spawn & Update
    this.pickupSpawnTimer -= dt;
    if (this.pickupSpawnTimer <= 0) {
      this.spawnPickup();
      this.pickupSpawnTimer = 4.5 + Math.random() * 3.5;
    }

    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const p = this.pickups[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.pickups.splice(i, 1);
        continue;
      }

      // Check cat pickup collection
      const dist = Math.hypot(this.cat.x - p.x, this.cat.y - p.y);
      if (dist < this.cat.radius + p.radius) {
        this.applyPowerup(p.type);
        this.pickups.splice(i, 1);
      }
    }

    // Laser Spawner & Update
    if (this.elapsedTime >= 15) {
      this.laserSpawnTimer -= dt;
      if (this.laserSpawnTimer <= 0) {
        this.spawnLaser();
        const laserInterval = this.settings.difficulty === 'easy' ? 22 : (this.settings.difficulty === 'hard' ? 9 : (this.settings.difficulty === 'nightmare' ? 6 : 14));
        this.laserSpawnTimer = laserInterval + Math.random() * 4;
      }
    }

    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const laser = this.lasers[i];
      if (laser.state === 'warning') {
        laser.timer -= dt;
        if (laser.timer <= 0) {
          laser.state = 'firing';
          laser.timer = laser.fireDuration;
          sound.playLaserFire();
          this.shakeScreen(0.18, 5);
        }
      } else if (laser.state === 'firing') {
        laser.timer -= dt;
        // Laser Collision with Cat
        if (!this.cat.isDashing && this.cat.invulnerableTimer <= 0) {
          let hit = false;
          if (laser.isHorizontal) {
            hit = Math.abs(this.cat.y - laser.pos) < laser.thickness / 2 + this.cat.radius;
          } else {
            hit = Math.abs(this.cat.x - laser.pos) < laser.thickness / 2 + this.cat.radius;
          }

          if (hit) {
            this.takeDamage('Tia Laser');
          }
        }

        if (laser.timer <= 0) {
          this.lasers.splice(i, 1);
        }
      }
    }

    // Dash Ghosts Fade
    for (let i = this.dashGhosts.length - 1; i >= 0; i--) {
      const g = this.dashGhosts[i];
      g.alpha -= dt * 3.5;
      if (g.alpha <= 0) this.dashGhosts.splice(i, 1);
    }

    // Particles Update
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.life -= dt;
      if (pt.life <= 0) this.particles.splice(i, 1);
    }

    // Floating Texts Update
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy * dt;
      ft.alpha -= dt * 1.3;
      if (ft.alpha <= 0) this.floatingTexts.splice(i, 1);
    }

    // Multi-Boss & Weapon Updates
    if (this.bosses && this.bosses.length > 0) {
      this.updateBosses(dt);
      this.updateCatShooting(dt);
    }
    this.updateBullets(dt);

    // Screen Shake Fade
    if (this.screenShakeTime > 0) {
      this.screenShakeTime -= dt;
    }
  }

  updatePowerupHUD() {
    this.activePowerupsEl.innerHTML = '';
    if (this.cat.hasShield) {
      const pill = document.createElement('div');
      pill.className = 'powerup-pill shield';
      pill.innerHTML = '🛡️ Khiên';
      this.activePowerupsEl.appendChild(pill);
    }
    if (this.cat.slowMoTimer > 0) {
      const pill = document.createElement('div');
      pill.className = 'powerup-pill slowmo';
      pill.innerHTML = `⏱️ ${Math.ceil(this.cat.slowMoTimer)}s`;
      this.activePowerupsEl.appendChild(pill);
    }
    if (this.cat.catnipTimer > 0) {
      const pill = document.createElement('div');
      pill.className = 'powerup-pill catnip';
      pill.innerHTML = `🌿 ${Math.ceil(this.cat.catnipTimer)}s`;
      this.activePowerupsEl.appendChild(pill);
    }
  }

  // --- Rendering ---
  draw() {
    const ctx = this.ctx;
    ctx.save();

    // Apply Screen Shake
    if (this.screenShakeTime > 0) {
      const shakeX = (Math.random() - 0.5) * this.screenShakeIntensity;
      const shakeY = (Math.random() - 0.5) * this.screenShakeIntensity;
      ctx.translate(shakeX, shakeY);
    }

    // Background Gradient (Dynamic according to 8 maps)
    const bgGradient = ctx.createLinearGradient(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    if (this.cat.slowMoTimer > 0) {
      bgGradient.addColorStop(0, '#e0f2fe');
      bgGradient.addColorStop(1, '#ede9fe');
    } else if (this.currentMap && this.currentMap.bgGrad) {
      bgGradient.addColorStop(0, this.currentMap.bgGrad[0]);
      bgGradient.addColorStop(1, this.currentMap.bgGrad[1]);
    } else {
      bgGradient.addColorStop(0, '#f7f0ff');
      bgGradient.addColorStop(1, '#dff8f5');
    }
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Floor Grid (Dynamic color per map)
    ctx.strokeStyle = (this.currentMap && this.currentMap.gridColor) ? this.currentMap.gridColor : 'rgba(45, 48, 71, 0.055)';
    ctx.lineWidth = 1;
    for (let p = SPIKE_WALL_WIDTH; p < CANVAS_SIZE - SPIKE_WALL_WIDTH; p += 48) {
      ctx.beginPath();
      ctx.moveTo(p, SPIKE_WALL_WIDTH);
      ctx.lineTo(p, CANVAS_SIZE - SPIKE_WALL_WIDTH);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(SPIKE_WALL_WIDTH, p);
      ctx.lineTo(CANVAS_SIZE - SPIKE_WALL_WIDTH, p);
      ctx.stroke();
    }

    // Draw Boundary Spikes
    this.drawSpikes(ctx);

    // Draw Lasers
    this.drawLasers(ctx);

    // Draw Pickups
    this.drawPickups(ctx);

    // Draw Dash Ghosts
    this.drawDashGhosts(ctx);

    // Draw Hazards
    this.drawHazards(ctx);

    // Draw Particles
    this.drawParticles(ctx);

    // Draw Aiming Sight Line
    if (this.bosses && this.bosses.length > 0) {
      this.drawAimLine(ctx);
    }

    // Draw Multi-Bosses
    if (this.bosses && this.bosses.length > 0) {
      this.drawBosses(ctx);
    }

    // Draw Bullets
    this.drawBullets(ctx);

    // Draw Cat Character
    this.drawCat(
      ctx,
      this.cat.x,
      this.cat.y,
      this.currentSkin,
      performance.now(),
      this.cat.radius,
      this.cat.hasShield,
      this.cat.isDashing
    );

    // Darkness Mode Fog-of-War Spotlight (Stage 8: Thế giới toàn bóng tối)
    if (this.currentMap && this.currentMap.isDarknessMode) {
      this.drawDarknessOverlay(ctx);
    }

    // Draw Floating Texts
    this.drawFloatingTexts(ctx);

    ctx.restore();
  }

  drawSpikes(ctx) {
    const w = SPIKE_WALL_WIDTH;
    const C = CANVAS_SIZE;
    const map = this.currentMap || STAGE_MAPS[0];

    // Outer Dark Wall Borders (styled per map)
    ctx.fillStyle = map.wallColor || '#17182b';
    ctx.fillRect(0, 0, C, w);
    ctx.fillRect(0, C - w, C, w);
    ctx.fillRect(0, 0, w, C);
    ctx.fillRect(C - w, 0, w, C);

    // Wall border accent stroke
    ctx.strokeStyle = map.spikeColor || '#ff4f64';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(w, w, C - 2 * w, C - 2 * w);

    // Themed Spikes
    ctx.fillStyle = map.spikeColor || '#ff4f64';
    for (let t = w + 12; t < C - w; t += 36) {
      // Top wall
      ctx.beginPath();
      ctx.moveTo(t, w);
      ctx.lineTo(t + 12, w + 22);
      ctx.lineTo(t + 24, w);
      ctx.fill();

      // Bottom wall
      ctx.beginPath();
      ctx.moveTo(t, C - w);
      ctx.lineTo(t + 12, C - w - 22);
      ctx.lineTo(t + 24, C - w);
      ctx.fill();

      // Left wall
      ctx.beginPath();
      ctx.moveTo(w, t);
      ctx.lineTo(w + 22, t + 12);
      ctx.lineTo(w, t + 24);
      ctx.fill();

      // Right wall
      ctx.beginPath();
      ctx.moveTo(C - w, t);
      ctx.lineTo(C - w - 22, t + 12);
      ctx.lineTo(C - w, t + 24);
      ctx.fill();
    }
  }

  drawAimLine(ctx) {
    if (!this.bosses || this.bosses.length === 0) return;
    const aliveBosses = this.bosses.filter(b => b.hp > 0);
    if (aliveBosses.length === 0) return;

    let target = aliveBosses[0];
    let minDist = Math.hypot(target.x - this.cat.x, target.y - this.cat.y);
    for (let i = 1; i < aliveBosses.length; i++) {
      const d = Math.hypot(aliveBosses[i].x - this.cat.x, aliveBosses[i].y - this.cat.y);
      if (d < minDist) {
        minDist = d;
        target = aliveBosses[i];
      }
    }

    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(this.cat.x, this.cat.y);
    ctx.lineTo(target.x, target.y);
    ctx.stroke();
    ctx.restore();
  }

  drawBullets(ctx) {
    // Cat Plasma Bullets
    this.bullets.forEach(b => {
      ctx.save();
      ctx.fillStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();

      // Tail trail
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x - b.vx * 0.03, b.y - b.vy * 0.03);
      ctx.stroke();
      ctx.restore();
    });

    // Boss Spike Bullets
    this.bossBullets.forEach(bb => {
      ctx.save();
      ctx.fillStyle = bb.color;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(bb.x, bb.y, bb.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  drawBosses(ctx) {
    if (!this.bosses || this.bosses.length === 0) return;
    this.bosses.forEach(b => {
      if (b.hp <= 0) return;
      ctx.save();
      ctx.translate(b.x, b.y);

      const isHit = b.hitFlash > 0;

      // Drop Shadow (except for divine light beam)
      if (b.type !== 'lightBeam') {
        ctx.fillStyle = 'rgba(18, 20, 35, 0.28)';
        ctx.beginPath();
        ctx.ellipse(0, b.radius + 14, b.radius * 1.05, 12, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- 1. SCARECROW (Quái vật người rơm 🌾🎃) ---
      if (b.type === 'scarecrow') {
        // Wooden Post & Crossbar
        ctx.fillStyle = '#78350f';
        drawRoundRect(ctx, -5, -b.radius * 0.2, 10, b.radius * 1.35, 4);
        drawRoundRect(ctx, -b.radius * 0.85, -b.radius * 0.1, b.radius * 1.7, 8, 4);

        // Ragged Straw Cape
        ctx.fillStyle = isHit ? '#ffffff' : (b.isCharging ? '#dc2626' : '#92400e');
        ctx.beginPath();
        ctx.moveTo(0, -b.radius * 0.1);
        ctx.lineTo(-b.radius * 0.65, b.radius * 0.75);
        ctx.lineTo(b.radius * 0.65, b.radius * 0.75);
        ctx.closePath();
        ctx.fill();

        // Straw Hand Tufts
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        for (let s of [-1, 1]) {
          const ax = s * b.radius * 0.85;
          ctx.beginPath();
          ctx.moveTo(ax, -b.radius * 0.05);
          ctx.lineTo(ax + s * 14, b.radius * 0.2 + Math.sin(b.animTime * 8) * 4);
          ctx.stroke();
        }

        // Pumpkin Head
        ctx.fillStyle = isHit ? '#ffffff' : (b.isCharging ? '#ef4444' : '#ea580c');
        ctx.beginPath();
        ctx.arc(0, -b.radius * 0.45, b.radius * 0.48, 0, Math.PI * 2);
        ctx.fill();

        // Pumpkin Ridges
        ctx.strokeStyle = '#c2410c';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(0, -b.radius * 0.45, b.radius * 0.25, b.radius * 0.46, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Pointed Hat
        ctx.fillStyle = '#451a03';
        ctx.beginPath();
        ctx.moveTo(-b.radius * 0.65, -b.radius * 0.7);
        ctx.lineTo(b.radius * 0.65, -b.radius * 0.7);
        ctx.lineTo(0, -b.radius * 1.25);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-b.radius * 0.75, -b.radius * 0.68);
        ctx.lineTo(b.radius * 0.75, -b.radius * 0.68);
        ctx.stroke();

        // Glowing Fiery Eyes & Grin
        const pGlow = b.isCharging ? '#ef4444' : '#fef08a';
        ctx.fillStyle = pGlow;
        ctx.shadowColor = pGlow;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(-15, -b.radius * 0.55); ctx.lineTo(-7, -b.radius * 0.55); ctx.lineTo(-11, -b.radius * 0.42); ctx.closePath();
        ctx.moveTo(15, -b.radius * 0.55); ctx.lineTo(7, -b.radius * 0.55); ctx.lineTo(11, -b.radius * 0.42); ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-13, -b.radius * 0.32); ctx.lineTo(-8, -b.radius * 0.24); ctx.lineTo(-3, -b.radius * 0.32);
        ctx.lineTo(3, -b.radius * 0.24); ctx.lineTo(8, -b.radius * 0.32); ctx.lineTo(13, -b.radius * 0.24);
        ctx.stroke();
        ctx.shadowBlur = 0;

      // --- 2. FLOWER TITAN (Quái vật bông hoa 🌸🌻) ---
      } else if (b.type === 'flower') {
        const pCount = 8;
        const breath = Math.sin(b.animTime * 5) * 3;
        // 8 Giant Petals
        for (let i = 0; i < pCount; i++) {
          const pAng = (Math.PI * 2 / pCount) * i + b.animTime * 0.4;
          const px = Math.cos(pAng) * (b.radius * 0.65 + breath);
          const py = Math.sin(pAng) * (b.radius * 0.65 + breath);
          ctx.fillStyle = isHit ? '#ffffff' : (i % 2 === 0 ? '#f43f5e' : '#ec4899');
          ctx.beginPath();
          ctx.arc(px, py, b.radius * 0.42, 0, Math.PI * 2);
          ctx.fill();
        }

        // Vine Leaves
        ctx.fillStyle = '#15803d';
        for (let s of [-1, 1]) {
          ctx.beginPath();
          ctx.ellipse(s * (b.radius + 6), 10 + Math.sin(b.animTime * 4) * 5, 16, 8, s * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Central Carnivorous Maw
        ctx.fillStyle = isHit ? '#ffffff' : '#4c0519';
        ctx.beginPath();
        ctx.arc(0, 0, b.radius * 0.52, 0, Math.PI * 2);
        ctx.fill();

        // 8 Fangs
        ctx.fillStyle = '#fef08a';
        for (let i = 0; i < 8; i++) {
          const fa = (Math.PI / 4) * i;
          ctx.beginPath();
          ctx.moveTo(Math.cos(fa) * (b.radius * 0.5), Math.sin(fa) * (b.radius * 0.5));
          ctx.lineTo(Math.cos(fa - 0.2) * (b.radius * 0.48), Math.sin(fa - 0.2) * (b.radius * 0.48));
          ctx.lineTo(Math.cos(fa) * (b.radius * 0.25), Math.sin(fa) * (b.radius * 0.25));
          ctx.closePath();
          ctx.fill();
        }

        // Toxic Green Core Eye
        const tox = b.isCharging ? '#ef4444' : '#22c55e';
        ctx.fillStyle = tox;
        ctx.shadowColor = tox;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

      // --- 3. GIANT KRAKEN SQUID (Mực khổng lồ Kraken 🦑🌊) ---
      } else if (b.type === 'squid') {
        // Tentacles
        ctx.strokeStyle = isHit ? '#ffffff' : '#c2410c';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        for (let i = -2; i <= 3; i++) {
          const tx = i * 14;
          const sway = Math.sin(b.animTime * 5 + i * 1.2) * 15;
          ctx.beginPath();
          ctx.moveTo(tx * 0.7, b.radius * 0.4);
          ctx.quadraticCurveTo(tx + sway, b.radius * 1.1, tx * 0.5 + sway * 1.3, b.radius * 1.6);
          ctx.stroke();

          // Sucker
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(tx * 0.7 + sway * 0.5, b.radius * 0.9, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Mantle
        ctx.fillStyle = isHit ? '#ffffff' : (b.isCharging ? '#dc2626' : '#ea580c');
        ctx.beginPath();
        ctx.moveTo(0, -b.radius * 1.15);
        ctx.quadraticCurveTo(-b.radius * 0.9, -b.radius * 0.2, -b.radius * 0.65, b.radius * 0.45);
        ctx.quadraticCurveTo(0, b.radius * 0.55, b.radius * 0.65, b.radius * 0.45);
        ctx.quadraticCurveTo(b.radius * 0.9, -b.radius * 0.2, 0, -b.radius * 1.15);
        ctx.closePath();
        ctx.fill();

        // Top Fin
        ctx.fillStyle = '#c2410c';
        ctx.beginPath();
        ctx.moveTo(0, -b.radius * 1.15);
        ctx.lineTo(-b.radius * 0.55, -b.radius * 0.7);
        ctx.lineTo(b.radius * 0.55, -b.radius * 0.7);
        ctx.closePath();
        ctx.fill();

        // Eyes
        [-17, 17].forEach(ex => {
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(ex, b.radius * 0.1, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.ellipse(ex, b.radius * 0.1, 7, 3, 0, 0, Math.PI * 2);
          ctx.fill();
        });

      // --- 4. ABYSSAL SHARK (Cá mập biển sâu 🦈🐙) ---
      } else if (b.type === 'shark') {
        // Body
        ctx.fillStyle = isHit ? '#ffffff' : (b.isCharging ? '#991b1b' : '#1e293b');
        ctx.beginPath();
        ctx.ellipse(0, 0, b.radius * 1.15, b.radius * 0.72, 0, 0, Math.PI * 2);
        ctx.fill();

        // Underbelly
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.ellipse(0, b.radius * 0.25, b.radius * 0.85, b.radius * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();

        // Dorsal Fin
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(-10, -b.radius * 0.6);
        ctx.quadraticCurveTo(0, -b.radius * 1.3, 14, -b.radius * 1.3);
        ctx.lineTo(8, -b.radius * 0.6);
        ctx.closePath();
        ctx.fill();

        // Pectoral Fins
        for (let s of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(s * b.radius * 0.7, 0);
          ctx.lineTo(s * (b.radius * 1.22), b.radius * 0.38);
          ctx.lineTo(s * b.radius * 0.5, b.radius * 0.38);
          ctx.closePath();
          ctx.fill();
        }

        // Glowing Gills
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2.5;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(-14 - i * 6, -10);
          ctx.lineTo(-12 - i * 6, 8);
          ctx.stroke();
        }

        // Eyes
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(b.radius * 0.55, -8, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Serrated Teeth
        ctx.fillStyle = '#f8fafc';
        for (let i = -16; i <= 24; i += 7) {
          ctx.beginPath();
          ctx.moveTo(i, 12); ctx.lineTo(i + 3.5, 20); ctx.lineTo(i + 7, 12);
          ctx.closePath();
          ctx.fill();
        }

      // --- 5. GINGERBREAD TITAN (Quái vật bánh quy gừng 🍪🍭) ---
      } else if (b.type === 'gingerbread') {
        // Cookie Body
        ctx.fillStyle = isHit ? '#ffffff' : (b.isCharging ? '#78350f' : '#b45309');
        drawRoundRect(ctx, -b.radius * 0.7, -b.radius * 0.8, b.radius * 1.4, b.radius * 1.6, 26);

        // Cookie Ears
        ctx.beginPath();
        ctx.arc(-b.radius * 0.5, -b.radius * 0.75, 14, 0, Math.PI * 2);
        ctx.arc(b.radius * 0.5, -b.radius * 0.75, 14, 0, Math.PI * 2);
        ctx.fill();

        // Icing Wavy Border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.25) {
          const wave = Math.sin(a * 10) * 2;
          const r = b.radius * 0.66 + wave;
          const ix = Math.cos(a) * r;
          const iy = Math.sin(a) * (r * 0.9);
          if (a === 0) ctx.moveTo(ix, iy); else ctx.lineTo(ix, iy);
        }
        ctx.closePath();
        ctx.stroke();

        // Green Gumdrop Eyes
        [-14, 14].forEach(gx => {
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.arc(gx, -14, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(gx, -14, 2.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // Licorice Smile
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(0, 4, 14, 0.2, Math.PI - 0.2);
        ctx.stroke();

        // Buttons
        [15, 28].forEach(by => {
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(0, by, 5, 0, Math.PI * 2);
          ctx.fill();
        });

        // Candy Cane Club in hand
        ctx.save();
        ctx.translate(b.radius * 0.85, 0);
        ctx.rotate(0.4 + Math.sin(b.animTime * 6) * 0.3);
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(0, 20); ctx.lineTo(0, -20); ctx.arc(-8, -20, 8, 0, Math.PI, true); ctx.stroke();
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(0, 15); ctx.lineTo(0, 5); ctx.moveTo(0, -5); ctx.lineTo(0, -15); ctx.stroke();
        ctx.restore();

      // --- 6. ALIEN COSMIC OVERLORD (Người ngoài hành tinh 👽🚀) ---
      } else if (b.type === 'alien') {
        // UFO Base Plate
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.ellipse(0, b.radius * 0.45, b.radius * 1.25, b.radius * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();

        // Neon Lights
        const ufoColors = ['#a855f7', '#38bdf8', '#facc15', '#22c55e'];
        for (let i = 0; i < 6; i++) {
          const lAng = (Math.PI / 3) * i + b.animTime * 2;
          const lx = Math.cos(lAng) * (b.radius * 1.05);
          const ly = b.radius * 0.45 + Math.sin(lAng) * (b.radius * 0.35);
          ctx.fillStyle = ufoColors[(i + Math.floor(b.animTime * 4)) % ufoColors.length];
          ctx.beginPath();
          ctx.arc(lx, ly, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Cockpit Dome
        ctx.fillStyle = 'rgba(56, 189, 248, 0.28)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, b.radius * 0.75, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Alien Head
        ctx.fillStyle = isHit ? '#ffffff' : (b.isCharging ? '#9333ea' : '#7e22ce');
        ctx.beginPath();
        ctx.moveTo(0, -b.radius * 0.75);
        ctx.bezierCurveTo(-b.radius * 0.65, -b.radius * 0.75, -b.radius * 0.6, -b.radius * 0.1, -b.radius * 0.25, b.radius * 0.2);
        ctx.lineTo(b.radius * 0.25, b.radius * 0.2);
        ctx.bezierCurveTo(b.radius * 0.6, -b.radius * 0.1, b.radius * 0.65, -b.radius * 0.75, 0, -b.radius * 0.75);
        ctx.fill();

        // Cosmic Eyes
        [-13, 13].forEach((ax, idx) => {
          ctx.fillStyle = '#09090b';
          ctx.beginPath();
          ctx.ellipse(ax, -b.radius * 0.35, 11, 7, (idx === 0 ? -0.35 : 0.35), 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(ax - 2, -b.radius * 0.38, 2.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // Antenna
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, -b.radius * 0.75);
        ctx.lineTo(0, -b.radius * 1.05);
        ctx.stroke();
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(0, -b.radius * 1.08, 4.5, 0, Math.PI * 2);
        ctx.fill();

      // --- 7. COLOSSAL TITAN MECH (Robot titan khổng lồ 🤖🗿) ---
      } else if (b.type === 'robot') {
        // Chassis
        ctx.fillStyle = isHit ? '#ffffff' : (b.isCharging ? '#7f1d1d' : '#292524');
        drawRoundRect(ctx, -b.radius * 0.95, -b.radius * 0.85, b.radius * 1.9, b.radius * 1.7, 16);

        // Shoulder Missile Pods
        ctx.fillStyle = '#44403c';
        drawRoundRect(ctx, -b.radius - 16, -b.radius * 0.65, 18, 40, 6);
        drawRoundRect(ctx, b.radius - 2, -b.radius * 0.65, 18, 40, 6);
        ctx.fillStyle = '#ef4444';
        for (let my of [-b.radius * 0.45, -b.radius * 0.2, b.radius * 0.05]) {
          ctx.beginPath();
          ctx.arc(-b.radius - 7, my, 3.5, 0, Math.PI * 2);
          ctx.arc(b.radius + 7, my, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Steam Vents
        ctx.fillStyle = '#78716c';
        drawRoundRect(ctx, -22, -b.radius - 12, 12, 14, 4);
        drawRoundRect(ctx, 10, -b.radius - 12, 12, 14, 4);

        // Gold Runic Lines
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-b.radius * 0.6, 12); ctx.lineTo(b.radius * 0.6, 12);
        ctx.moveTo(0, -b.radius * 0.35); ctx.lineTo(0, b.radius * 0.55);
        ctx.stroke();

        // Cyclops Eye
        ctx.fillStyle = '#0f172a';
        drawRoundRect(ctx, -28, -16, 56, 16, 8);
        const sweep = Math.sin(b.animTime * 7) * 18;
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(sweep, -8, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

      // --- 8. RADIANT DIVINE BEAM (Thực thể tia sáng thần thánh ⚡✨) ---
      } else if (b.type === 'lightBeam') {
        const auraCount = 8;
        const spin = b.animTime * 1.8;

        // Rotating Divine Holy Rays
        for (let i = 0; i < auraCount; i++) {
          const rayAng = (Math.PI * 2 / auraCount) * i + spin;
          const rayLen = b.radius * (1.3 + Math.sin(b.animTime * 8 + i) * 0.35);
          ctx.strokeStyle = (i % 2 === 0 ? '#fef08a' : 'rgba(255, 255, 255, 0.9)');
          ctx.lineWidth = (i % 2 === 0 ? 5 : 3);
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(rayAng) * rayLen, Math.sin(rayAng) * rayLen);
          ctx.stroke();
        }

        // Diamond Cross Ray Star
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 28;
        ctx.beginPath();
        const starLen = b.radius * 1.5;
        ctx.moveTo(0, -starLen); ctx.lineTo(12, 0); ctx.lineTo(0, starLen); ctx.lineTo(-12, 0); ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-starLen, 0); ctx.lineTo(0, 12); ctx.lineTo(starLen, 0); ctx.lineTo(0, -12); ctx.closePath();
        ctx.fill();

        // Core Sun
        ctx.fillStyle = isHit ? '#ffffff' : '#fef9c3';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 35;
        ctx.beginPath();
        ctx.arc(0, 0, b.radius * 0.65, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Golden Halo Eye
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = b.isCharging ? '#ef4444' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Name & Health Bar directly above boss head
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 9px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(b.name, 0, -b.radius - 32);

      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      drawRoundRect(ctx, -35, -b.radius - 28, 70, 7, 3);
      const hpRatio = Math.max(0, b.hp / b.maxHp);
      ctx.fillStyle = b.hp < 150 ? '#ef4444' : '#10b981';
      drawRoundRect(ctx, -34, -b.radius - 27, 68 * hpRatio, 5, 2);

      ctx.restore();
    });
  }

  drawHazards(ctx) {
    this.hazards.forEach(h => {
      ctx.save();
      ctx.translate(h.x + h.size / 2, h.y + h.size / 2);
      ctx.rotate(h.angle);

      const s = h.size;
      const type = h.obstacleType || 'haybale';

      if (type === 'haybale') {
        // --- 1. Nông trại: Bó rơm vàng óng cuộn tròn ---
        // Shadow
        ctx.fillStyle = 'rgba(74, 44, 23, 0.22)';
        ctx.beginPath();
        ctx.arc(4, 6, s / 2, 0, Math.PI * 2);
        ctx.fill();

        // Haybale body
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
        ctx.fill();

        // Straw texture rings
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, s / 2 - 6, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, s / 2 - 14, 0, Math.PI * 2);
        ctx.stroke();

        // Straw spokes
        ctx.strokeStyle = '#fef3c7';
        ctx.lineWidth = 2;
        for (let a = 0; a < 8; a++) {
          const ang = (Math.PI / 4) * a;
          ctx.beginPath();
          ctx.moveTo(Math.cos(ang) * 4, Math.sin(ang) * 4);
          ctx.lineTo(Math.cos(ang) * (s / 2 - 3), Math.sin(ang) * (s / 2 - 3));
          ctx.stroke();
        }

        // Center tied red knot
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();

      } else if (type === 'mushroom') {
        // --- 2. Bãi cỏ: Cây nấm độc tán đỏ chấm bi trắng ---
        // Shadow
        ctx.fillStyle = 'rgba(20, 83, 45, 0.25)';
        ctx.beginPath();
        ctx.ellipse(3, 5, s / 2, s / 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Mushroom Red Cap
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(0, -2, s / 2, Math.PI, 0, false);
        ctx.closePath();
        ctx.fill();

        // White spots on mushroom cap
        ctx.fillStyle = '#ffffff';
        [[-s / 4, -s / 4], [0, -s / 3], [s / 4, -s / 4], [-s / 6, -s / 8], [s / 6, -s / 8]].forEach(([dx, dy]) => {
          ctx.beginPath();
          ctx.arc(dx, dy, 3.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // Mushroom stem
        ctx.fillStyle = '#fef08a';
        drawRoundRect(ctx, -s / 6, -2, s / 3, s / 2.5, 4);

        // Toxic green spores orbiting
        ctx.fillStyle = '#22c55e';
        for (let i = 0; i < 4; i++) {
          const sporeAng = h.angle * 2 + (Math.PI / 2) * i;
          const sporeX = Math.cos(sporeAng) * (s / 2 + 5);
          const sporeY = Math.sin(sporeAng) * (s / 2 + 5);
          ctx.beginPath();
          ctx.arc(sporeX, sporeY, 3, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (type === 'buoy') {
        // --- 3. Trên mặt biển: Phao cứu sinh tròn sọc trắng đỏ xoay ---
        // Shadow
        ctx.fillStyle = 'rgba(2, 132, 199, 0.25)';
        ctx.beginPath();
        ctx.arc(4, 5, s / 2, 0, Math.PI * 2);
        ctx.fill();

        // Outer white ring
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
        ctx.fill();

        // 4 Red Stripes
        ctx.fillStyle = '#ef4444';
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, s / 2, (Math.PI / 2) * i - 0.28, (Math.PI / 2) * i + 0.28);
          ctx.closePath();
          ctx.fill();
        }

        // Inner hollow hole
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(0, 0, s / 4, 0, Math.PI * 2);
        ctx.fill();

        // Water ripple ring
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, s / 4, 0, Math.PI * 2);
        ctx.stroke();

      } else if (type === 'jellyfish') {
        // --- 4. Đáy đại dương: Sứa điện phát sáng neon ---
        // Glow
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 12;

        // Jellyfish Bell (dome)
        const domeGrad = ctx.createRadialGradient(0, -4, 2, 0, -4, s / 2);
        domeGrad.addColorStop(0, '#cffafe');
        domeGrad.addColorStop(0.6, '#06b6d4');
        domeGrad.addColorStop(1, '#0e7490');
        ctx.fillStyle = domeGrad;
        ctx.beginPath();
        ctx.arc(0, -4, s / 2 - 2, Math.PI, 0, false);
        ctx.closePath();
        ctx.fill();

        // Electric tentacles dangling
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#67e8f9';
        ctx.lineWidth = 2.5;
        for (let i = -2; i <= 2; i++) {
          const tx = i * 6;
          const wav = Math.sin(h.angle * 3 + i) * 6;
          ctx.beginPath();
          ctx.moveTo(tx, -2);
          ctx.quadraticCurveTo(tx + wav, s / 4, tx - wav / 2, s / 2);
          ctx.stroke();
        }

        // Bioluminescent Core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, -8, 4, 0, Math.PI * 2);
        ctx.fill();

      } else if (type === 'candy') {
        // --- 5. Thế giới kẹo ngọt: Kẹo mút xoắn ốc hồng pastel ---
        // Shadow
        ctx.fillStyle = 'rgba(136, 19, 55, 0.22)';
        ctx.beginPath();
        ctx.arc(4, 5, s / 2, 0, Math.PI * 2);
        ctx.fill();

        // Candy Base Pink
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
        ctx.fill();

        // Spiral candy swirls
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        for (let r = 2; r < s / 2 - 2; r += 0.8) {
          const theta = r * 0.45;
          const cx = Math.cos(theta) * r;
          const cy = Math.sin(theta) * r;
          if (r === 2) ctx.moveTo(cx, cy);
          else ctx.lineTo(cx, cy);
        }
        ctx.stroke();

        // Sugary sparkles
        ctx.fillStyle = '#fbcfe8';
        for (let i = 0; i < 4; i++) {
          const sa = (Math.PI / 2) * i + h.angle;
          ctx.beginPath();
          ctx.arc(Math.cos(sa) * (s / 3), Math.sin(sa) * (s / 3), 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (type === 'meteor') {
        // --- 6. Vũ trụ: Thiên thạch lửa rực cháy ---
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 14;

        // Rocky irregular polygon
        ctx.fillStyle = '#7c3aed';
        ctx.beginPath();
        const numPts = 8;
        for (let i = 0; i < numPts; i++) {
          const a = (Math.PI * 2 / numPts) * i;
          const r = (s / 2 - 4) + ((i % 2 === 0) ? 4 : -4);
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();

        // Fiery molten veins
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(-4, -4, 6, 0, Math.PI * 2);
        ctx.arc(6, 4, 4.5, 0, Math.PI * 2);
        ctx.arc(-2, 7, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(-4, -4, 3, 0, Math.PI * 2);
        ctx.fill();

      } else if (type === 'hammer') {
        // --- 7. Thế giới khổng lồ: Búa tạ titan & Khối đá cổ ---
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        drawRoundRect(ctx, -s / 2 + 5, -s / 2 + 7, s, s, 10);

        // Heavy dark iron stone
        ctx.fillStyle = '#292524';
        drawRoundRect(ctx, -s / 2, -s / 2, s, s, 10);

        // Gold Runic engravings
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-s / 3, 0);
        ctx.lineTo(s / 3, 0);
        ctx.moveTo(0, -s / 3);
        ctx.lineTo(0, s / 3);
        ctx.stroke();

        // Corner iron bolts
        ctx.fillStyle = '#facc15';
        [[-s / 3, -s / 3], [s / 3, -s / 3], [-s / 3, s / 3], [s / 3, s / 3]].forEach(([bx, by]) => {
          ctx.beginPath();
          ctx.arc(bx, by, 3, 0, Math.PI * 2);
          ctx.fill();
        });

      } else if (type === 'shadowEye') {
        // --- 8. Thế giới toàn bóng tối: Mắt quỷ hư không rực sáng ---
        ctx.shadowColor = '#dc2626';
        ctx.shadowBlur = 16;

        ctx.fillStyle = '#0a0a0f';
        ctx.beginPath();
        ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
        ctx.fill();

        // Red sclera
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.ellipse(0, 0, s / 2 - 5, s / 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Slit Pupil
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.ellipse(0, 0, 3, s / 3.2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eye reflection gleam
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-4, -4, 2.5, 0, Math.PI * 2);
        ctx.fill();

      } else {
        // Fallback default
        ctx.fillStyle = h.color;
        drawRoundRect(ctx, -s / 2, -s / 2, s, s, 12);
      }

      ctx.restore();
    });
  }

  drawPickups(ctx) {
    const time = performance.now();
    this.pickups.forEach(p => {
      ctx.save();
      const bob = Math.sin(time / 200 + p.bobPhase) * 4;
      ctx.translate(p.x, p.y + bob);

      // Pulsing Glow
      const glowAlpha = 0.35 + Math.sin(time / 150) * 0.15;
      ctx.fillStyle = p.type === 'fish' ? `rgba(251, 191, 36, ${glowAlpha})` :
                      p.type === 'pate' ? `rgba(244, 63, 94, ${glowAlpha})` :
                      p.type === 'shield' ? `rgba(56, 189, 248, ${glowAlpha})` :
                      p.type === 'slowmo' ? `rgba(168, 85, 247, ${glowAlpha})` :
                      `rgba(34, 197, 94, ${glowAlpha})`;

      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.fill();

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.beginPath();
      ctx.ellipse(0, 16 - bob, 14, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Icon & Item rendering
      if (p.type === 'fish') {
        // Golden Fish
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.ellipse(0, 0, 14, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        // Tail
        ctx.beginPath();
        ctx.moveTo(10, 0); ctx.lineTo(19, -8); ctx.lineTo(19, 8); ctx.closePath();
        ctx.fill();
        // Eye
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-7, -2, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-8, -2, 1.2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'pate') {
        // Red Pate Can
        ctx.fillStyle = '#e11d48';
        drawRoundRect(ctx, -12, -8, 24, 16, 5);
        ctx.fillStyle = '#fecdd3';
        drawRoundRect(ctx, -10, -6, 20, 6, 2);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 8px Be Vietnam Pro';
        ctx.textAlign = 'center';
        ctx.fillText('PATE', 0, 5);
      } else if (p.type === 'shield') {
        // Shield Orb
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(0, 0, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🛡️', 0, 4);
      } else if (p.type === 'slowmo') {
        // Clock / Hourglass
        ctx.fillStyle = '#9333ea';
        ctx.beginPath();
        ctx.arc(0, 0, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⏱️', 0, 4);
      } else {
        // Catnip Leaf
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.arc(0, 0, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🌿', 0, 4);
      }

      ctx.restore();
    });
  }

  drawLasers(ctx) {
    this.lasers.forEach(laser => {
      ctx.save();
      if (laser.state === 'warning') {
        // Flashing Warning Line
        const flash = Math.sin(performance.now() / 60) > 0;
        ctx.strokeStyle = flash ? 'rgba(239, 68, 68, 0.9)' : 'rgba(239, 68, 68, 0.25)';
        ctx.lineWidth = 3;
        ctx.setLineDash([12, 8]);

        ctx.beginPath();
        if (laser.isHorizontal) {
          ctx.moveTo(SPIKE_WALL_WIDTH, laser.pos);
          ctx.lineTo(CANVAS_SIZE - SPIKE_WALL_WIDTH, laser.pos);
        } else {
          ctx.moveTo(laser.pos, SPIKE_WALL_WIDTH);
          ctx.lineTo(laser.pos, CANVAS_SIZE - SPIKE_WALL_WIDTH);
        }
        ctx.stroke();
      } else {
        // Blazing Energy Beam
        ctx.setLineDash([]);
        // Outer Red Glow
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.lineWidth = laser.thickness;
        ctx.beginPath();
        if (laser.isHorizontal) {
          ctx.moveTo(SPIKE_WALL_WIDTH, laser.pos);
          ctx.lineTo(CANVAS_SIZE - SPIKE_WALL_WIDTH, laser.pos);
        } else {
          ctx.moveTo(laser.pos, SPIKE_WALL_WIDTH);
          ctx.lineTo(laser.pos, CANVAS_SIZE - SPIKE_WALL_WIDTH);
        }
        ctx.stroke();

        // Inner White Core
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = laser.thickness * 0.45;
        ctx.stroke();
      }
      ctx.restore();
    });
  }

  drawDashGhosts(ctx) {
    this.dashGhosts.forEach(g => {
      ctx.save();
      ctx.globalAlpha = g.alpha;
      this.drawCat(ctx, g.x, g.y, g.skin, 0, g.radius, false, true);
      ctx.restore();
    });
  }

  drawParticles(ctx) {
    this.particles.forEach(pt => {
      ctx.save();
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  drawFloatingTexts(ctx) {
    ctx.save();
    ctx.font = '800 15px "Be Vietnam Pro"';
    ctx.textAlign = 'center';
    this.floatingTexts.forEach(ft => {
      ctx.fillStyle = `rgba(0, 0, 0, ${ft.alpha * 0.4})`;
      ctx.fillText(ft.text, ft.x + 1, ft.y + 1);
      ctx.fillStyle = ft.color;
      ctx.globalAlpha = ft.alpha;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.globalAlpha = 1;
    });
    ctx.restore();
  }

  drawCat(ctx, x, y, skin, time, radius, shieldActive, isDashing) {
    ctx.save();

    // Damage Invulnerability Flicker (i-frame)
    if (this.cat.invulnerableTimer > 0) {
      if (Math.sin(this.cat.invulnerableTimer * 28) > 0) {
        ctx.globalAlpha = 0.35;
      }
    }

    const scale = radius / CAT_RADIUS;
    ctx.translate(x, y + Math.sin(time / 190) * 1.3);
    if (this.cat.facingX < 0) ctx.rotate(-0.06);
    else if (this.cat.facingX > 0) ctx.rotate(0.06);
    ctx.scale(scale, scale);

    // Dash Aura
    if (isDashing) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 8, 38, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Shadow
    ctx.fillStyle = 'rgba(18, 20, 35, 0.24)';
    ctx.beginPath();
    ctx.ellipse(2, 29, 28, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tail (Swaying Bezier)
    const sway = Math.sin(time / 220) * 4;
    ctx.strokeStyle = skin.id === 'siamese' ? skin.accent : skin.body;
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(13, 17);
    ctx.bezierCurveTo(31 + sway, 22, 34 + sway, 6, 27 + sway, -2);
    ctx.stroke();

    ctx.strokeStyle = skin.secondary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(27 + sway, -2);
    ctx.lineTo(30 + sway, 4);
    ctx.stroke();

    // Body
    ctx.fillStyle = skin.body;
    ctx.beginPath();
    ctx.ellipse(0, 17, 18, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body patterns
    if (skin.id === 'tuxedo') {
      ctx.fillStyle = skin.accent;
      ctx.beginPath();
      ctx.ellipse(0, 20, 9, 15, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (skin.id === 'calico') {
      ctx.fillStyle = skin.accent;
      ctx.beginPath();
      ctx.ellipse(8, 18, 9, 11, 0.4, 0, Math.PI * 2);
      ctx.fill();
    } else if (skin.id === 'tabby' || skin.id === 'gray') {
      ctx.strokeStyle = skin.accent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-13, 12); ctx.lineTo(-7, 14);
      ctx.moveTo(13, 12); ctx.lineTo(7, 14);
      ctx.stroke();
    }

    // Paws
    ctx.fillStyle = skin.id === 'tuxedo' ? skin.accent : skin.body;
    ctx.beginPath();
    ctx.ellipse(-10, 30, 8, 5, -0.12, 0, Math.PI * 2);
    ctx.ellipse(10, 30, 8, 5, 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = skin.body;
    ctx.beginPath();
    ctx.moveTo(-18, -12);
    ctx.lineTo(-15, -31);
    ctx.lineTo(-4, -20);
    ctx.quadraticCurveTo(0, -22, 4, -20);
    ctx.lineTo(16, -31);
    ctx.lineTo(19, -11);
    ctx.quadraticCurveTo(24, -4, 22, 7);
    ctx.quadraticCurveTo(18, 24, 0, 25);
    ctx.quadraticCurveTo(-18, 24, -22, 7);
    ctx.quadraticCurveTo(-24, -4, -18, -12);
    ctx.fill();

    // Head patterns with clipping
    ctx.save();
    ctx.clip();
    if (skin.id === 'tabby' || skin.id === 'gray') {
      ctx.strokeStyle = skin.accent;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-10, -19); ctx.lineTo(-7, -10);
      ctx.moveTo(0, -21); ctx.lineTo(0, -10);
      ctx.moveTo(10, -19); ctx.lineTo(7, -10);
      ctx.moveTo(-21, 10); ctx.lineTo(-13, 7);
      ctx.moveTo(21, 10); ctx.lineTo(13, 7);
      ctx.stroke();
    } else if (skin.id === 'calico') {
      ctx.fillStyle = skin.accent;
      ctx.beginPath();
      ctx.ellipse(-13, -14, 13, 16, -0.45, 0, Math.PI * 2);
      ctx.ellipse(14, 15, 12, 11, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = skin.secondary;
      ctx.beginPath();
      ctx.ellipse(14, -15, 11, 14, 0.4, 0, Math.PI * 2);
      ctx.ellipse(-17, 15, 9, 12, -0.4, 0, Math.PI * 2);
      ctx.fill();
    } else if (skin.id === 'tuxedo') {
      ctx.fillStyle = skin.accent;
      ctx.beginPath();
      ctx.moveTo(-8, -20);
      ctx.quadraticCurveTo(0, -14, 8, -20);
      ctx.lineTo(11, 15);
      ctx.quadraticCurveTo(0, 27, -11, 15);
      ctx.closePath();
      ctx.fill();
    } else if (skin.id === 'siamese') {
      ctx.fillStyle = skin.accent;
      ctx.beginPath();
      ctx.ellipse(0, -1, 15, 18, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (skin.id === 'black') {
      ctx.fillStyle = skin.secondary;
      ctx.beginPath();
      ctx.ellipse(-12, -12, 9, 13, -0.45, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Inner ears
    ctx.fillStyle = skin.id === 'siamese' ? skin.accent : skin.secondary;
    ctx.beginPath();
    ctx.moveTo(-14, -17); ctx.lineTo(-14, -26); ctx.lineTo(-8, -20); ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(14, -17); ctx.lineTo(14, -26); ctx.lineTo(8, -20); ctx.closePath();
    ctx.fill();

    // Eyes Whites / Shadow
    ctx.fillStyle = skin.id === 'black' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.34)';
    ctx.beginPath();
    ctx.ellipse(-6, 8, 8, 7, -0.15, 0, Math.PI * 2);
    ctx.ellipse(6, 8, 8, 7, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = skin.face;
    ctx.beginPath();
    ctx.ellipse(-9, 0, 4, 5.5, 0, 0, Math.PI * 2);
    ctx.ellipse(9, 0, 4, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye Highlights
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.beginPath();
    ctx.arc(-8, -2, 1.35, 0, Math.PI * 2);
    ctx.arc(10, -2, 1.35, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = skin.id === 'black' ? '#d8878f' : '#d96f78';
    ctx.beginPath();
    ctx.moveTo(-3.5, 7);
    ctx.quadraticCurveTo(0, 10.5, 3.5, 7);
    ctx.quadraticCurveTo(0, 5.5, -3.5, 7);
    ctx.fill();

    // Mouth & Whiskers
    ctx.strokeStyle = skin.face;
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 9); ctx.quadraticCurveTo(-3, 13, -7, 11);
    ctx.moveTo(0, 9); ctx.quadraticCurveTo(3, 13, 7, 11);
    ctx.moveTo(-11, 8); ctx.lineTo(-26, 5);
    ctx.moveTo(-11, 11); ctx.lineTo(-27, 13);
    ctx.moveTo(11, 8); ctx.lineTo(26, 5);
    ctx.moveTo(11, 11); ctx.lineTo(27, 13);
    ctx.stroke();

    // Blush
    ctx.fillStyle = 'rgba(240, 111, 128, 0.32)';
    ctx.beginPath();
    ctx.ellipse(-15, 7, 4, 2, 0, 0, Math.PI * 2);
    ctx.ellipse(15, 7, 4, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Gun Weapon (Equipped when Boss appears or after Boss defeated)
    const hasActiveBosses = (this.bosses && this.bosses.some(b => b.hp > 0)) || this.bossDefeated;
    if (hasActiveBosses) {
      ctx.save();
      let gunAngle = 0;
      const alive = this.bosses ? this.bosses.filter(b => b.hp > 0) : [];
      if (alive.length > 0) {
        let target = alive[0];
        let minDist = Math.hypot(target.x - x, target.y - y);
        for (let i = 1; i < alive.length; i++) {
          const d = Math.hypot(alive[i].x - x, alive[i].y - y);
          if (d < minDist) { minDist = d; target = alive[i]; }
        }
        gunAngle = Math.atan2(target.y - y, target.x - x);
      }
      ctx.translate(14, 18);
      ctx.rotate(gunAngle * 0.45);
      // Gun Stock & Handle
      ctx.fillStyle = '#0f172a';
      drawRoundRect(ctx, 0, -4, 18, 9, 3);
      // Gun Barrel (Neon Cyan)
      ctx.fillStyle = '#38bdf8';
      drawRoundRect(ctx, 12, -3, 14, 6, 2);
      // Energy Core
      ctx.fillStyle = '#f43f5e';
      drawRoundRect(ctx, 5, -6, 6, 4, 1);
      ctx.restore();
    }

    // Shield Bubble Visual
    if (shieldActive) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.lineWidth = 3;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
      ctx.beginPath();
      ctx.arc(0, 6, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Reflection
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-12, -8, 8, -Math.PI / 2, 0);
      ctx.stroke();
    }

    ctx.restore();
  }

  // --- Main Animation Frame ---
  loop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.034);
    this.lastTime = timestamp;

    this.update(dt);
    this.draw();

    requestAnimationFrame(this.loop.bind(this));
  }
}

// Instantiate game when DOM ready
window.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
});

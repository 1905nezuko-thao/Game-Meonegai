import React, { useState, useEffect, useRef, useCallback } from 'react';

const CANVAS_SIZE = 720;
const SPIKE_WALL_WIDTH = 48;
const CAT_RADIUS = 21;
const BASE_SPEED = 240;

interface CatSkin {
  id: string;
  name: string;
  body: string;
  accent: string;
  secondary: string;
  face: string;
  swatch: string;
}

const CAT_SKINS: CatSkin[] = [
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

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<'ready' | 'playing' | 'gameover'>('ready');
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('meo-ne-gai-best') || 0));
  const [currentSkin, setCurrentSkin] = useState<CatSkin>(() => {
    const saved = localStorage.getItem('meo-ne-gai-style');
    return CAT_SKINS.find(s => s.id === saved) || CAT_SKINS[0];
  });
  const [dashReady, setDashReady] = useState(true);
  const [hasShield, setHasShield] = useState(false);
  const [slowMoSec, setSlowMoSec] = useState(0);
  const [catnipSec, setCatnipSec] = useState(0);
  const [bossHp, setBossHp] = useState<{ hp: number; maxHp: number; name: string } | null>(null);

  // Configurable Settings State
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem('meo-ne-gai-settings');
      if (raw) return { lives: 3, difficulty: 'normal', hazardCount: 3, bossCount: 1, bossSpawnTime: 60, controlMode: 'joystick', haptic: 'on', ...JSON.parse(raw) };
    } catch (_) {}
    return { lives: 3, difficulty: 'normal', hazardCount: 3, bossCount: 1, bossSpawnTime: 60, controlMode: 'joystick', haptic: 'on' };
  });
  const [currentLives, setCurrentLives] = useState(settings.lives);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [joyKnob, setJoyKnob] = useState({ x: 0, y: 0 });
  const [isJoyActive, setIsJoyActive] = useState(false);

  const keysRef = useRef<Set<string>>(new Set());
  const skinRef = useRef<CatSkin>(currentSkin);
  skinRef.current = currentSkin;
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const joystickVectorRef = useRef({ x: 0, y: 0 });
  const joyPointerIdRef = useRef<number | null>(null);

  const triggerDashRef = useRef<() => void>(() => {});

  const vibrate = useCallback((pattern: number | number[]) => {
    if (settingsRef.current.haptic === 'off') return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (_) {}
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    const doc = document as any;
    const docEl = document.documentElement as any;
    const isFs = doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement;
    if (!isFs) {
      if (docEl.requestFullscreen) docEl.requestFullscreen().catch(() => {});
      else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen();
    } else {
      if (doc.exitFullscreen) doc.exitFullscreen().catch(() => {});
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      const doc = document as any;
      setIsFullscreen(!!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const handleJoyStart = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    joyPointerIdRef.current = e.pointerId;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setIsJoyActive(true);
    updateJoyPos(e.clientX, e.clientY, e.currentTarget);
    vibrate(15);
  };

  const handleJoyMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (joyPointerIdRef.current === null || e.pointerId !== joyPointerIdRef.current) return;
    e.preventDefault();
    updateJoyPos(e.clientX, e.clientY, e.currentTarget);
  };

  const handleJoyEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (joyPointerIdRef.current !== null && e.pointerId === joyPointerIdRef.current) {
      joyPointerIdRef.current = null;
      setIsJoyActive(false);
      setJoyKnob({ x: 0, y: 0 });
      joystickVectorRef.current = { x: 0, y: 0 };
    }
  };

  const updateJoyPos = (clientX: number, clientY: number, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    const maxRadius = Math.max(20, rect.width / 2 - 14);
    const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(dist, maxRadius);
    const clampedX = Math.cos(angle) * clampedDist;
    const clampedY = Math.sin(angle) * clampedDist;

    setJoyKnob({ x: clampedX, y: clampedY });
    if (dist < 6) {
      joystickVectorRef.current = { x: 0, y: 0 };
    } else {
      const mag = Math.min(1, dist / maxRadius);
      joystickVectorRef.current = {
        x: Math.cos(angle) * mag,
        y: Math.sin(angle) * mag
      };
    }
  };

  const startGame = useCallback(() => {
    stateRef.current = 'playing';
    setGameState('playing');
    setScore(0);
    setCurrentLives(settingsRef.current.lives);
  }, []);

  const selectSkin = (skin: CatSkin) => {
    setCurrentSkin(skin);
    localStorage.setItem('meo-ne-gai-style', skin.id);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cat = {
      x: CANVAS_SIZE / 2,
      y: CANVAS_SIZE / 2,
      radius: CAT_RADIUS,
      isDashing: false,
      dashTimer: 0,
      dashCooldownTimer: 0,
      hasShield: false,
      slowMoTimer: 0,
      catnipTimer: 0
    };

    let hazards = [
      { x: 128, y: 142, vx: 130, vy: 100, size: 58, angle: 0, spin: 2.5, color: '#8b5cf6' },
      { x: 532, y: 506, vx: -110, vy: 142, size: 64, angle: 0.5, spin: -2.8, color: '#06b6d4' }
    ];

    let pickups: Array<{ type: string; x: number; y: number; radius: number; life: number; bob: number }> = [];
    let lasers: Array<{ isHorizontal: boolean; pos: number; state: 'warning' | 'firing'; timer: number; thickness: number }> = [];
    let floatingTexts: Array<{ text: string; x: number; y: number; color: string; alpha: number; vy: number }> = [];
    let particles: Array<{ x: number; y: number; vx: number; vy: number; color: string; life: number; radius: number }> = [];

    let lastTime = performance.now();
    let elapsed = 0;
    let bonus = 0;
    let pickupSpawnTimer = 3;
    let laserSpawnTimer = 16;
    let extraHazard = false;
    let animId = 0;

    let boss: any = null;
    let bossSpawned = false;
    let bullets: any[] = [];
    let bossBullets: any[] = [];
    let catShootTimer = 0;

    const resetGame = () => {
      keysRef.current.clear();
      setBossHp(null);
      boss = null;
      bossSpawned = false;
      bullets = [];
      bossBullets = [];
      catShootTimer = 0;
      cat = {
        x: CANVAS_SIZE / 2,
        y: CANVAS_SIZE / 2,
        radius: CAT_RADIUS,
        isDashing: false,
        dashTimer: 0,
        dashCooldownTimer: 0,
        hasShield: false,
        slowMoTimer: 0,
        catnipTimer: 0
      };
      hazards = [
        { x: 128, y: 142, vx: 130, vy: 100, size: 58, angle: 0, spin: 2.5, color: '#8b5cf6' },
        { x: 532, y: 506, vx: -110, vy: 142, size: 64, angle: 0.5, spin: -2.8, color: '#06b6d4' }
      ];
      pickups = [];
      lasers = [];
      floatingTexts = [];
      particles = [];
      elapsed = 0;
      bonus = 0;
      pickupSpawnTimer = 3;
      laserSpawnTimer = 16;
      extraHazard = false;
    };

    const triggerDash = () => {
      if (cat.dashCooldownTimer > 0 || cat.isDashing) return;
      cat.isDashing = true;
      cat.dashTimer = 0.22;
      cat.dashCooldownTimer = 2.2;
      floatingTexts.push({ text: 'LƯỚT!', x: cat.x, y: cat.y - 25, color: '#38bdf8', alpha: 1, vy: -50 });
    };
    triggerDashRef.current = triggerDash;

    const onGameOver = () => {
      const finalScore = Math.floor(elapsed * 10) + bonus;
      setScore(finalScore);
      setHighScore(prev => {
        const next = Math.max(prev, finalScore);
        localStorage.setItem('meo-ne-gai-best', String(next));
        return next;
      });
      stateRef.current = 'gameover';
      setGameState('gameover');
    };

    let prevState = stateRef.current;

    const loop = (time: number) => {
      const currentState = stateRef.current;
      if (currentState === 'playing' && prevState !== 'playing') {
        resetGame();
      }
      prevState = currentState;

      const dt = Math.min((time - lastTime) / 1000, 0.034);
      lastTime = time;

      if (currentState === 'playing') {
        elapsed += dt;
        const currentScore = Math.floor(elapsed * 10) + bonus;
        setScore(currentScore);

        // Boss Spawn at 600+
        if (currentScore >= 600 && !bossSpawned) {
          bossSpawned = true;
          boss = {
            x: CANVAS_SIZE / 2,
            y: 150,
            vx: 145,
            vy: 95,
            radius: 46,
            maxHp: 600,
            hp: 600,
            hitFlash: 0,
            attackTimer: 4.5,
            isCharging: false,
            chargeTimer: 0,
            chargeTargetX: 0,
            chargeTargetY: 0,
            shootTimer: 2.8,
            animTime: 0
          };
          setBossHp({ hp: 600, maxHp: 600 });
          floatingTexts.push({ text: '⚠️ ĐẠI BOSS XUẤT HIỆN!', x: CANVAS_SIZE / 2, y: 170, color: '#ef4444', alpha: 1, vy: -40 });
          floatingTexts.push({ text: 'MÈO CẦM SÚNG BẮN BOSS!', x: cat.x, y: cat.y - 35, color: '#38bdf8', alpha: 1, vy: -40 });
        }

        // Power-up timers
        if (cat.slowMoTimer > 0) cat.slowMoTimer -= dt;
        if (cat.catnipTimer > 0) {
          cat.catnipTimer -= dt;
          cat.radius = CAT_RADIUS * 0.72;
        } else {
          cat.radius = CAT_RADIUS;
        }

        setHasShield(cat.hasShield);
        setSlowMoSec(Math.ceil(cat.slowMoTimer));
        setCatnipSec(Math.ceil(cat.catnipTimer));

        // Dash timers
        if (cat.dashTimer > 0) {
          cat.dashTimer -= dt;
          if (cat.dashTimer <= 0) cat.isDashing = false;
        }
        if (cat.dashCooldownTimer > 0) {
          cat.dashCooldownTimer -= dt;
        }
        setDashReady(cat.dashCooldownTimer <= 0);

        // Cat movement (Supports both Virtual Joystick & Keyboard/D-Pad)
        let dx = 0;
        let dy = 0;
        const jv = joystickVectorRef.current;
        if (jv && (Math.abs(jv.x) > 0.08 || Math.abs(jv.y) > 0.08)) {
          dx = jv.x;
          dy = jv.y;
        } else {
          const k = keysRef.current;
          if (k.has('arrowleft') || k.has('keya') || k.has('a')) dx -= 1;
          if (k.has('arrowright') || k.has('keyd') || k.has('d') || k.has('đ')) dx += 1;
          if (k.has('arrowup') || k.has('keyw') || k.has('w') || k.has('ư')) dy -= 1;
          if (k.has('arrowdown') || k.has('keys') || k.has('s')) dy += 1;

          if (dx && dy) { dx *= 0.7071; dy *= 0.7071; }
        }

        let spd = BASE_SPEED;
        if (cat.catnipTimer > 0) spd *= 1.35;
        if (cat.isDashing) spd *= 2.6;

        cat.x += dx * spd * dt;
        cat.y += dy * spd * dt;

        // Boundaries
        const minSafe = SPIKE_WALL_WIDTH + cat.radius + 4;
        const maxSafe = CANVAS_SIZE - SPIKE_WALL_WIDTH - cat.radius - 4;
        if (!cat.isDashing) {
          if (cat.x < minSafe || cat.x > maxSafe || cat.y < minSafe || cat.y > maxSafe) {
            if (cat.hasShield) {
              cat.hasShield = false;
              cat.x = Math.max(minSafe + 10, Math.min(maxSafe - 10, cat.x));
              cat.y = Math.max(minSafe + 10, Math.min(maxSafe - 10, cat.y));
              floatingTexts.push({ text: 'KHIÊN ĐỠ GAI!', x: cat.x, y: cat.y - 25, color: '#38bdf8', alpha: 1, vy: -50 });
            } else {
              onGameOver();
            }
          }
        }

        // Difficulty scaling
        let hazardMul = Math.min(1.85, 1 + elapsed / 36);
        if (cat.slowMoTimer > 0) hazardMul *= 0.5;

        // Extra hazard at 32s
        if (elapsed >= 32 && !extraHazard) {
          extraHazard = true;
          hazards.push({ x: 360, y: 160, vx: 150, vy: -120, size: 52, angle: 0, spin: 3.4, color: '#f59e0b' });
        }

        // Hazards update
        const wallMin = SPIKE_WALL_WIDTH + 14;
        hazards.forEach(h => {
          h.x += h.vx * hazardMul * dt;
          h.y += h.vy * hazardMul * dt;
          h.angle += h.spin * hazardMul * dt;

          const wallMax = CANVAS_SIZE - SPIKE_WALL_WIDTH - 14 - h.size;
          if (h.x <= wallMin) { h.vx = Math.abs(h.vx); h.x = wallMin; }
          else if (h.x >= wallMax) { h.vx = -Math.abs(h.vx); h.x = wallMax; }
          if (h.y <= wallMin) { h.vy = Math.abs(h.vy); h.y = wallMin; }
          else if (h.y >= wallMax) { h.vy = -Math.abs(h.vy); h.y = wallMax; }

          // Collision
          const hCenter = { x: h.x + h.size / 2, y: h.y + h.size / 2 };
          const cosA = Math.cos(-h.angle);
          const sinA = Math.sin(-h.angle);
          const relX = cat.x - hCenter.x;
          const relY = cat.y - hCenter.y;
          const localX = relX * cosA - relY * sinA;
          const localY = relX * sinA + relY * cosA;

          const half = h.size / 2;
          const nearX = Math.max(-half, Math.min(half, localX));
          const nearY = Math.max(-half, Math.min(half, localY));
          const distSq = (localX - nearX) ** 2 + (localY - nearY) ** 2;

          if (distSq < cat.radius ** 2) {
            if (!cat.isDashing) {
              if (cat.hasShield) {
                cat.hasShield = false;
                h.vx *= -1.2;
                h.vy *= -1.2;
                floatingTexts.push({ text: 'KHIÊN VỠ!', x: cat.x, y: cat.y - 25, color: '#38bdf8', alpha: 1, vy: -50 });
              } else {
                onGameOver();
              }
            }
          }
        });

        // Pickups
        pickupSpawnTimer -= dt;
        if (pickupSpawnTimer <= 0 && pickups.length < 3) {
          const types = ['fish', 'fish', 'pate', 'shield', 'slowmo', 'catnip'];
          const margin = SPIKE_WALL_WIDTH + 60;
          pickups.push({
            type: types[Math.floor(Math.random() * types.length)],
            x: margin + Math.random() * (CANVAS_SIZE - margin * 2),
            y: margin + Math.random() * (CANVAS_SIZE - margin * 2),
            radius: 18,
            life: 10,
            bob: Math.random() * 6.28
          });
          pickupSpawnTimer = 4.5;
        }

        for (let i = pickups.length - 1; i >= 0; i--) {
          const p = pickups[i];
          p.life -= dt;
          if (p.life <= 0) { pickups.splice(i, 1); continue; }
          if (Math.hypot(cat.x - p.x, cat.y - p.y) < cat.radius + p.radius) {
            if (p.type === 'fish') { bonus += 50; floatingTexts.push({ text: '+50 Cá!', x: cat.x, y: cat.y - 25, color: '#fbbf24', alpha: 1, vy: -50 }); }
            else if (p.type === 'pate') { bonus += 100; floatingTexts.push({ text: '+100 Pate!', x: cat.x, y: cat.y - 25, color: '#f43f5e', alpha: 1, vy: -50 }); }
            else if (p.type === 'shield') { cat.hasShield = true; floatingTexts.push({ text: 'KHIÊN!', x: cat.x, y: cat.y - 25, color: '#38bdf8', alpha: 1, vy: -50 }); }
            else if (p.type === 'slowmo') { cat.slowMoTimer = 5; floatingTexts.push({ text: 'LÀM CHẬM!', x: cat.x, y: cat.y - 25, color: '#c084fc', alpha: 1, vy: -50 }); }
            else if (p.type === 'catnip') { cat.catnipTimer = 6; floatingTexts.push({ text: 'CỎ MÈO!', x: cat.x, y: cat.y - 25, color: '#4ade80', alpha: 1, vy: -50 }); }
            pickups.splice(i, 1);
          }
        }

        // Laser
        if (elapsed >= 15) {
          laserSpawnTimer -= dt;
          if (laserSpawnTimer <= 0) {
            lasers.push({
              isHorizontal: Math.random() > 0.5,
              pos: SPIKE_WALL_WIDTH + 60 + Math.random() * (CANVAS_SIZE - SPIKE_WALL_WIDTH * 2 - 120),
              state: 'warning',
              timer: 1.4,
              thickness: 18
            });
            laserSpawnTimer = 10;
          }
        }

        for (let i = lasers.length - 1; i >= 0; i--) {
          const l = lasers[i];
          l.timer -= dt;
          if (l.state === 'warning' && l.timer <= 0) {
            l.state = 'firing';
            l.timer = 0.45;
          } else if (l.state === 'firing') {
            const hit = l.isHorizontal ? Math.abs(cat.y - l.pos) < l.thickness / 2 + cat.radius : Math.abs(cat.x - l.pos) < l.thickness / 2 + cat.radius;
            if (hit && !cat.isDashing) {
              if (cat.hasShield) { cat.hasShield = false; }
              else { onGameOver(); }
            }
            if (l.timer <= 0) lasers.splice(i, 1);
          }
        }

        // Boss Battle Updates
        if (boss) {
          boss.animTime += dt;
          if (boss.hitFlash > 0) boss.hitFlash -= dt;

          if (boss.isCharging) {
            boss.chargeTimer -= dt;
            const a = Math.atan2(boss.chargeTargetY - boss.y, boss.chargeTargetX - boss.x);
            boss.x += Math.cos(a) * 360 * dt;
            boss.y += Math.sin(a) * 360 * dt;
            if (boss.chargeTimer <= 0) boss.isCharging = false;
          } else {
            boss.x += boss.vx * dt;
            boss.y += boss.vy * dt;
            const minX = SPIKE_WALL_WIDTH + boss.radius + 12;
            const maxX = CANVAS_SIZE - SPIKE_WALL_WIDTH - boss.radius - 12;
            const minY = SPIKE_WALL_WIDTH + boss.radius + 12;
            const maxY = CANVAS_SIZE - SPIKE_WALL_WIDTH - boss.radius - 12;
            if (boss.x <= minX) { boss.vx = Math.abs(boss.vx); boss.x = minX; }
            else if (boss.x >= maxX) { boss.vx = -Math.abs(boss.vx); boss.x = maxX; }
            if (boss.y <= minY) { boss.vy = Math.abs(boss.vy); boss.y = minY; }
            else if (boss.y >= maxY) { boss.vy = -Math.abs(boss.vy); boss.y = maxY; }

            boss.attackTimer -= dt;
            if (boss.attackTimer <= 0) {
              boss.attackTimer = 5;
              boss.isCharging = true;
              boss.chargeTimer = 1.1;
              boss.chargeTargetX = cat.x;
              boss.chargeTargetY = cat.y;
              floatingTexts.push({ text: 'BOSS LAO TỚI!', x: boss.x, y: boss.y - 40, color: '#ef4444', alpha: 1, vy: -30 });
            }

            boss.shootTimer -= dt;
            if (boss.shootTimer <= 0) {
              boss.shootTimer = 3.6;
              for (let i = 0; i < 6; i++) {
                const ang = (Math.PI * 2 / 6) * i;
                bossBullets.push({ x: boss.x, y: boss.y, vx: Math.cos(ang) * 190, vy: Math.sin(ang) * 190, radius: 7, color: '#f43f5e' });
              }
            }
          }

          // Cat shooting at boss
          catShootTimer -= dt;
          if (catShootTimer <= 0) {
            catShootTimer = 0.16;
            const ang = Math.atan2(boss.y - cat.y, boss.x - cat.x);
            bullets.push({ x: cat.x + Math.cos(ang) * 20, y: cat.y + Math.sin(ang) * 20, vx: Math.cos(ang) * 780, vy: Math.sin(ang) * 780, radius: 4.5, color: '#38bdf8' });
          }

          // Cat collision with boss
          if (Math.hypot(cat.x - boss.x, cat.y - boss.y) < cat.radius + boss.radius) {
            if (!cat.isDashing) {
              if (cat.hasShield) { cat.hasShield = false; boss.vx *= -1; boss.vy *= -1; }
              else onGameOver();
            }
          }
        }

        // Bullets update
        for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          b.x += b.vx * dt;
          b.y += b.vy * dt;
          if (boss && Math.hypot(b.x - boss.x, b.y - boss.y) < boss.radius + b.radius) {
            boss.hp -= 15;
            boss.hitFlash = 0.08;
            setBossHp({ hp: Math.max(0, boss.hp), maxHp: boss.maxHp });
            floatingTexts.push({ text: '-15', x: b.x, y: b.y - 15, color: '#38bdf8', alpha: 1, vy: -40 });
            if (boss.hp <= 0) {
              bonus += 1000;
              setBossHp(null);
              floatingTexts.push({ text: '💥 HẠ GỤC BOSS! +1000Đ', x: CANVAS_SIZE / 2, y: 220, color: '#fbbf24', alpha: 1, vy: -40 });
              boss = null;
              bossBullets = [];
            }
            bullets.splice(i, 1);
            continue;
          }
          if (b.x < 0 || b.x > CANVAS_SIZE || b.y < 0 || b.y > CANVAS_SIZE) bullets.splice(i, 1);
        }

        // Boss bullets update
        for (let i = bossBullets.length - 1; i >= 0; i--) {
          const bb = bossBullets[i];
          bb.x += bb.vx * dt;
          bb.y += bb.vy * dt;
          if (Math.hypot(bb.x - cat.x, bb.y - cat.y) < cat.radius + bb.radius) {
            if (!cat.isDashing) {
              if (cat.hasShield) { cat.hasShield = false; }
              else onGameOver();
            }
            bossBullets.splice(i, 1);
            continue;
          }
          if (bb.x < SPIKE_WALL_WIDTH || bb.x > CANVAS_SIZE - SPIKE_WALL_WIDTH || bb.y < SPIKE_WALL_WIDTH || bb.y > CANVAS_SIZE - SPIKE_WALL_WIDTH) {
            bossBullets.splice(i, 1);
          }
        }

        // Texts fade
        for (let i = floatingTexts.length - 1; i >= 0; i--) {
          const ft = floatingTexts[i];
          ft.y += ft.vy * dt;
          ft.alpha -= dt * 1.3;
          if (ft.alpha <= 0) floatingTexts.splice(i, 1);
        }
      }

      // DRAW
      ctx.fillStyle = cat.slowMoTimer > 0 ? '#e0f2fe' : '#f7f0ff';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Spikes
      const w = SPIKE_WALL_WIDTH;
      const C = CANVAS_SIZE;
      ctx.fillStyle = '#17182b';
      ctx.fillRect(0, 0, C, w); ctx.fillRect(0, C - w, C, w);
      ctx.fillRect(0, 0, w, C); ctx.fillRect(C - w, 0, w, C);
      ctx.fillStyle = '#ff4f64';
      for (let t = w + 12; t < C - w; t += 36) {
        ctx.beginPath(); ctx.moveTo(t, w); ctx.lineTo(t + 12, w + 22); ctx.lineTo(t + 24, w); ctx.fill();
        ctx.beginPath(); ctx.moveTo(t, C - w); ctx.lineTo(t + 12, C - w - 22); ctx.lineTo(t + 24, C - w); ctx.fill();
        ctx.beginPath(); ctx.moveTo(w, t); ctx.lineTo(w + 22, t + 12); ctx.lineTo(w, t + 24); ctx.fill();
        ctx.beginPath(); ctx.moveTo(C - w, t); ctx.lineTo(C - w - 22, t + 12); ctx.lineTo(C - w, t + 24); ctx.fill();
      }

      // Lasers
      lasers.forEach(l => {
        ctx.save();
        ctx.strokeStyle = l.state === 'warning' ? 'rgba(239, 68, 68, 0.6)' : 'rgba(239, 68, 68, 0.95)';
        ctx.lineWidth = l.state === 'warning' ? 3 : l.thickness;
        if (l.state === 'warning') ctx.setLineDash([12, 8]);
        ctx.beginPath();
        if (l.isHorizontal) { ctx.moveTo(w, l.pos); ctx.lineTo(C - w, l.pos); }
        else { ctx.moveTo(l.pos, w); ctx.lineTo(l.pos, C - w); }
        ctx.stroke();
        ctx.restore();
      });

      // Pickups
      pickups.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y + Math.sin(time / 200 + p.bob) * 4);
        ctx.fillStyle = p.type === 'fish' ? '#f59e0b' : p.type === 'pate' ? '#e11d48' : '#0284c7';
        ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(p.type === 'fish' ? '🐟' : p.type === 'pate' ? '🥫' : p.type === 'shield' ? '🛡️' : '⚡', 0, 4);
        ctx.restore();
      });

      // Hazards
      hazards.forEach(h => {
        ctx.save();
        ctx.translate(h.x + h.size / 2, h.y + h.size / 2);
        ctx.rotate(h.angle);
        ctx.fillStyle = h.color;
        ctx.beginPath(); ctx.roundRect(-h.size / 2, -h.size / 2, h.size, h.size, 12); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath(); ctx.roundRect(-h.size / 2 + 6, -h.size / 2 + 6, h.size - 12, 8, 4); ctx.fill();
        ctx.restore();
      });

      // Aim Sight Line
      if (boss) {
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(cat.x, cat.y);
        ctx.lineTo(boss.x, boss.y);
        ctx.stroke();
        ctx.restore();
      }

      // Draw Bullets
      bullets.forEach(b => {
        ctx.save();
        ctx.fillStyle = b.color;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
      bossBullets.forEach(bb => {
        ctx.save();
        ctx.fillStyle = bb.color;
        ctx.beginPath(); ctx.arc(bb.x, bb.y, bb.radius, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });

      // Draw Boss
      if (boss) {
        ctx.save();
        ctx.translate(boss.x, boss.y);
        ctx.fillStyle = boss.hitFlash > 0 ? '#fff' : (boss.isCharging ? '#ef4444' : '#1e1b4b');
        ctx.beginPath(); ctx.roundRect(-boss.radius, -boss.radius * 0.8, boss.radius * 2, boss.radius * 1.6, 20); ctx.fill();
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath(); ctx.roundRect(-24, -12, 48, 12, 6); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(0, -6, 3, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // Cat
      const skin = skinRef.current;
      ctx.save();
      const sc = cat.radius / CAT_RADIUS;
      ctx.translate(cat.x, cat.y);
      ctx.scale(sc, sc);

      ctx.fillStyle = 'rgba(18, 20, 35, 0.24)';
      ctx.beginPath(); ctx.ellipse(2, 29, 28, 7, 0, 0, Math.PI * 2); ctx.fill();

      // Cat Body
      ctx.fillStyle = skin.body;
      ctx.beginPath(); ctx.ellipse(0, 17, 18, 20, 0, 0, Math.PI * 2); ctx.fill();

      // Head
      ctx.beginPath();
      ctx.moveTo(-18, -12); ctx.lineTo(-15, -31); ctx.lineTo(-4, -20);
      ctx.quadraticCurveTo(0, -22, 4, -20);
      ctx.lineTo(16, -31); ctx.lineTo(19, -11);
      ctx.quadraticCurveTo(24, -4, 22, 7); ctx.quadraticCurveTo(18, 24, 0, 25);
      ctx.quadraticCurveTo(-18, 24, -22, 7); ctx.quadraticCurveTo(-24, -4, -18, -12);
      ctx.fill();

      // Ears
      ctx.fillStyle = skin.secondary;
      ctx.beginPath(); ctx.moveTo(-14, -17); ctx.lineTo(-14, -26); ctx.lineTo(-8, -20); ctx.fill();
      ctx.beginPath(); ctx.moveTo(14, -17); ctx.lineTo(14, -26); ctx.lineTo(8, -20); ctx.fill();

      // Eyes
      ctx.fillStyle = skin.face;
      ctx.beginPath(); ctx.ellipse(-9, 0, 4, 5.5, 0, 0, Math.PI * 2); ctx.ellipse(9, 0, 4, 5.5, 0, 0, Math.PI * 2); ctx.fill();

      // Nose & Whiskers
      ctx.fillStyle = '#d96f78';
      ctx.beginPath(); ctx.arc(0, 7, 3, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = skin.face; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-10, 8); ctx.lineTo(-24, 6);
      ctx.moveTo(10, 8); ctx.lineTo(24, 6);
      ctx.stroke();

      // Gun Weapon
      if (boss || bossSpawned) {
        ctx.save();
        let gunAngle = 0;
        if (boss) gunAngle = Math.atan2(boss.y - cat.y, boss.x - cat.x);
        ctx.translate(14, 18);
        ctx.rotate(gunAngle * 0.45);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, -4, 18, 9);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(12, -3, 14, 6);
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(5, -6, 6, 4);
        ctx.restore();
      }

      // Shield Bubble
      if (cat.hasShield) {
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, 6, 36, 0, Math.PI * 2); ctx.stroke();
      }

      ctx.restore();

      // Floating texts
      floatingTexts.forEach(ft => {
        ctx.save();
        ctx.font = 'bold 15px sans-serif';
        ctx.fillStyle = ft.color;
        ctx.globalAlpha = ft.alpha;
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    const onKeyDown = (e: KeyboardEvent) => {
      const code = e.code ? e.code.toLowerCase() : '';
      const key = e.key ? e.key.toLowerCase() : '';
      if (code) keysRef.current.add(code);
      if (key) keysRef.current.add(key);

      if (e.key === ' ' || e.key === 'Shift' || code === 'space') {
        e.preventDefault();
        if (stateRef.current === 'playing') triggerDashRef.current();
        else startGame();
      } else if (e.key === 'Enter' || code === 'enter') {
        if (stateRef.current !== 'playing') startGame();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const code = e.code ? e.code.toLowerCase() : '';
      const key = e.key ? e.key.toLowerCase() : '';
      if (code) keysRef.current.delete(code);
      if (key) keysRef.current.delete(key);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [startGame]);

  return (
    <main className="game-shell" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f3f0f9', fontFamily: 'Be Vietnam Pro, sans-serif' }}>
      <section style={{ background: '#fcfafff0', borderRadius: '32px', width: 'min(100%, 920px)', padding: '24px 32px', boxShadow: '0 28px 80px rgba(49, 43, 83, 0.17)' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '18px' }}>
          <div>
            <p style={{ color: '#745cf5', fontSize: '11px', fontWeight: 800, letterSpacing: '0.16em', margin: 0 }}>THỬ THÁCH PHẢN XẠ · NÂNG CẤP</p>
            <h1 style={{ color: '#25263d', fontSize: '32px', fontWeight: 800, margin: 0 }}>Mèo né gai</h1>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              style={{
                background: '#f0edf8', border: '1px solid #e2ddf2', borderRadius: '12px',
                padding: '8px 12px', fontSize: '11px', fontWeight: 700, color: '#55536e', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              ⚙️ Tùy chọn
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              style={{
                background: isFullscreen ? '#745cf5' : '#f0edf8',
                color: isFullscreen ? '#fff' : '#55536e',
                border: '1px solid #e2ddf2',
                borderRadius: '12px',
                padding: '8px 12px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Toàn màn hình"
            >
              <span>{isFullscreen ? '🗗' : '⛶'}</span>
              <span>{isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}</span>
            </button>

            <div style={{ display: 'grid', gap: '6px' }}>
              <span style={{ fontSize: '9px', fontWeight: 700, color: '#88869c' }}>Kiểu mèo · {currentSkin.name}</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {CAT_SKINS.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => selectSkin(s)}
                    style={{
                      background: s.swatch,
                      width: '24px', height: '24px',
                      borderRadius: '50%',
                      border: '3px solid #fff',
                      outline: currentSkin.id === s.id ? '2px solid #5c48d8' : '1px solid #dedbe8',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ background: '#f0edf8', borderRadius: '14px', padding: '8px 14px', minWidth: '85px', textAlign: 'center' }}>
                <span style={{ fontSize: '10px', color: '#88869c', fontWeight: 700, display: 'block' }}>ĐIỂM</span>
                <strong style={{ fontSize: '20px' }}>{String(score).padStart(3, '0')}</strong>
              </div>
              <div style={{ background: '#f0edf8', borderRadius: '14px', padding: '8px 14px', minWidth: '85px', textAlign: 'center' }}>
                <span style={{ fontSize: '10px', color: '#88869c', fontWeight: 700, display: 'block' }}>KỶ LỤC</span>
                <strong style={{ fontSize: '20px' }}>{String(highScore).padStart(3, '0')}</strong>
              </div>
            </div>
          </div>
        </header>

        <div style={{ position: 'relative', width: 'min(100%, 680px)', margin: '0 auto', borderRadius: '24px', overflow: 'hidden', border: '6px solid #25263d' }}>
          <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} style={{ width: '100%', height: 'auto', display: 'block' }} />

          {/* Active Badges */}
          <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', pointerEvents: 'none' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ background: 'rgba(20,25,43,0.85)', borderRadius: '12px', padding: '6px 10px', color: '#fff', fontSize: '12px', display: 'flex', gap: '3px' }}>
                {Array.from({ length: settings.lives }).map((_, i) => (
                  <span key={i}>{i < currentLives ? '❤️' : '🤍'}</span>
                ))}
              </div>
              <div style={{ background: 'rgba(20,25,43,0.85)', borderRadius: '12px', padding: '6px 10px', color: '#fff', fontSize: '10px', fontWeight: 700 }}>
                ⚡ LƯỚT (SPACE): {dashReady ? 'SẴN SÀNG' : 'ĐANG HỒI...'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {hasShield && <span style={{ background: '#0284c7', color: '#fff', padding: '4px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 700 }}>🛡️ Khiên</span>}
              {slowMoSec > 0 && <span style={{ background: '#9333ea', color: '#fff', padding: '4px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 700 }}>⏱️ {slowMoSec}s</span>}
              {catnipSec > 0 && <span style={{ background: '#16a34a', color: '#fff', padding: '4px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 700 }}>🌿 {catnipSec}s</span>}
            </div>
          </div>

          {/* Boss HP Bar */}
          {bossHp && (
            <div style={{ position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(20,16,38,0.92)', borderRadius: '16px', padding: '6px 14px', width: 'min(90%, 400px)', border: '1px solid #ef4444', boxShadow: '0 0 15px rgba(239,68,68,0.4)', zIndex: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ background: '#ef4444', color: '#fff', fontSize: '8px', fontWeight: 900, padding: '2px 5px', borderRadius: '4px' }}>⚠️ ĐẠI BOSS</span>
                <span style={{ color: '#fca5a5', fontSize: '11px', fontWeight: 800 }}>{bossHp.name || 'CHÓ ROBOT CYBER'}</span>
                <span style={{ color: '#fff', fontSize: '10px', fontWeight: 800 }}>{bossHp.hp} / {bossHp.maxHp}</span>
              </div>
              <div style={{ width: '100%', height: '7px', background: 'rgba(255,255,255,0.15)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.max(0, (bossHp.hp / bossHp.maxHp) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #ef4444, #f97316)', transition: 'width 0.1s' }} />
              </div>
            </div>
          )}

          {gameState !== 'playing' && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,22,38,0.7)', backdropFilter: 'blur(5px)', display: 'grid', placeItems: 'center', padding: '24px' }}>
              <div style={{ background: '#fff', borderRadius: '26px', padding: '30px', textAlign: 'center', maxWidth: '380px' }}>
                <p style={{ color: '#745cf5', fontWeight: 800, fontSize: '11px', margin: '0 0 6px' }}>
                  {gameState === 'ready' ? 'SẴN SÀNG CHƯA?' : 'ÔI KHÔNG! MÈO ĐÃ VA PHẢI'}
                </p>
                <h2 style={{ fontSize: '28px', margin: '0 0 10px' }}>
                  {gameState === 'ready' ? 'Đừng chạm vào gai!' : `${score} điểm`}
                </h2>
                <p style={{ color: '#737187', fontSize: '13px', lineHeight: 1.6 }}>
                  {gameState === 'ready'
                    ? 'Di chuyển chú mèo, né tránh các khối lập phương neon, ăn cá hồi & pate để tăng điểm, và nhấn Space để lướt né đòn!'
                    : `Kỷ lục hiện tại của bạn là ${highScore} điểm. Thử thêm lần nữa nhé!`}
                </p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <button
                    type="button"
                    onClick={startGame}
                    style={{
                      background: '#745cf5', color: '#fff', border: 'none', borderRadius: '14px',
                      padding: '14px 20px', flex: 1, fontSize: '14px', fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    {gameState === 'ready' ? 'Bắt đầu chơi →' : 'Chơi lại →'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSettings(true)}
                    style={{
                      background: '#f0edf8', color: '#55536e', border: '1px solid #dedbe8', borderRadius: '14px',
                      padding: '14px 16px', fontSize: '13px', fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    ⚙️ Tùy chọn
                  </button>
                </div>
                <small style={{ color: '#aaa8b7', display: 'block', marginTop: '10px', fontSize: '11px' }}>
                  Nhấn Enter hoặc phím cách
                </small>
              </div>
            </div>
          )}
        </div>

        {/* Settings Modal Dialog */}
        {showSettings && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,12,22,0.78)', backdropFilter: 'blur(10px)', display: 'grid', placeItems: 'center', padding: '16px', zIndex: 100 }}>
            <div style={{ background: '#171b2d', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '26px', width: 'min(100%, 520px)', maxHeight: '90vh', overflowY: 'auto', padding: '24px', color: '#fff', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                <div>
                  <span style={{ background: 'rgba(116,92,245,0.25)', color: '#a78bfa', fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>TÙY BIẾN GAMEPLAY</span>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '4px 0 0' }}>⚙️ Bảng Tùy Chọn Trò Chơi</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#cbd5e1', width: '32px', height: '32px', borderRadius: '50%', fontSize: '15px', cursor: 'pointer' }}
                >✕</button>
              </div>

              {/* 1. Số lượng tim */}
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <strong style={{ fontSize: '14px' }}>❤️ 1. Số Lượng Tim (Mạng Sống): {settings.lives} tim</strong>
                <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Mỗi lần va chạm gai/đạn mất 1 tim (có 1.6s chớp nháy bất tử)</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 3, 5].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSettings(s => ({ ...s, lives: v }))}
                      style={{
                        flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)',
                        background: settings.lives === v ? '#745cf5' : 'rgba(255,255,255,0.06)',
                        color: '#fff', fontWeight: 700, cursor: 'pointer'
                      }}
                    >
                      {v} Tim {v === 3 && '(Chuẩn)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Độ khó */}
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <strong style={{ fontSize: '14px' }}>⚡ 2. Độ Khó (Chướng Ngại Vật & Boss)</strong>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { id: 'easy', label: '🟢 Dễ', sub: '2 Khối · 1 Boss (400HP)', h: 2, b: 1 },
                    { id: 'normal', label: '🟡 Vừa', sub: '3 Khối · 1 Boss (600HP)', h: 3, b: 1 },
                    { id: 'hard', label: '🔴 Khó', sub: '5 Khối · 2 Boss (Song đấu)', h: 5, b: 2 },
                    { id: 'nightmare', label: '🟣 Ác mộng', sub: '7 Khối · 3 Boss (Hỗn chiến)', h: 7, b: 3 }
                  ].map(d => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSettings(s => ({ ...s, difficulty: d.id, hazardCount: d.h, bossCount: d.b }))}
                      style={{
                        padding: '10px', borderRadius: '12px', textAlign: 'left',
                        background: settings.difficulty === d.id ? 'rgba(168,85,247,0.25)' : 'rgba(255,255,255,0.06)',
                        border: settings.difficulty === d.id ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.1)',
                        color: '#fff', cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: '12px' }}>{d.label}</div>
                      <small style={{ color: '#94a3b8', fontSize: '10px' }}>{d.sub}</small>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Thời gian boss xuất hiện */}
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <strong style={{ fontSize: '14px' }}>⏱️ 3. Thời Gian Boss Xuất Hiện: {settings.bossSpawnTime}s (~{settings.bossSpawnTime * 10}đ)</strong>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[15, 30, 60, 90].map(sec => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setSettings(s => ({ ...s, bossSpawnTime: sec }))}
                      style={{
                        flex: 1, padding: '10px', borderRadius: '10px',
                        background: settings.bossSpawnTime === sec ? '#745cf5' : 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700, cursor: 'pointer'
                      }}
                    >
                      {sec}s {sec === 15 ? '🔥' : sec === 60 ? '⭐' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Tùy Chọn Di Động & Cảm Ứng */}
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <strong style={{ fontSize: '14px' }}>📱 4. Tùy Chọn Di Động & Cảm Ứng</strong>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setSettings(s => ({ ...s, controlMode: 'joystick' }))}
                    style={{
                      padding: '10px',
                      background: settings.controlMode === 'joystick' ? '#745cf5' : 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '12px', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    🕹️ Cần gạt 360°
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettings(s => ({ ...s, controlMode: 'dpad' }))}
                    style={{
                      padding: '10px',
                      background: settings.controlMode === 'dpad' ? '#745cf5' : 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '12px', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    🎛️ Phím chữ thập (D-Pad)
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setSettings(s => ({ ...s, haptic: 'on' }))}
                    style={{
                      padding: '10px',
                      background: settings.haptic === 'on' ? '#10b981' : 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '12px', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    📳 Rung phản hồi (Bật)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettings(s => ({ ...s, haptic: 'off' }))}
                    style={{
                      padding: '10px',
                      background: settings.haptic === 'off' ? '#ef4444' : 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '12px', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    📴 Tắt rung
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const def = { lives: 3, difficulty: 'normal', hazardCount: 3, bossCount: 1, bossSpawnTime: 60, controlMode: 'joystick', haptic: 'on' };
                    setSettings(def);
                    localStorage.setItem('meo-ne-gai-settings', JSON.stringify(def));
                  }}
                  style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px', color: '#cbd5e1', fontWeight: 700, cursor: 'pointer' }}
                >
                  🔄 Mặc định
                </button>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('meo-ne-gai-settings', JSON.stringify(settings));
                    setCurrentLives(settings.lives);
                    setShowSettings(false);
                  }}
                  style={{ flex: 2, padding: '12px', background: '#745cf5', border: 'none', borderRadius: '14px', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  💾 Áp dụng & Lưu
                </button>
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Mobile & Tablet Controls Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '0 8px' }}>
          {/* Left: Joystick or D-Pad */}
          <div>
            {settings.controlMode === 'joystick' ? (
              <div
                onPointerDown={handleJoyStart}
                onPointerMove={handleJoyMove}
                onPointerUp={handleJoyEnd}
                onPointerCancel={handleJoyEnd}
                style={{
                  width: '110px', height: '110px', borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(116,92,245,0.18) 0%, rgba(20,25,43,0.9) 75%)',
                  border: '2px solid rgba(116,92,245,0.5)',
                  boxShadow: 'inset 0 0 16px rgba(116,92,245,0.35)',
                  position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  touchAction: 'none', cursor: 'pointer'
                }}
              >
                <div
                  style={{
                    width: '46px', height: '46px', borderRadius: '50%',
                    background: isJoyActive ? 'linear-gradient(135deg, #c084fc, #9333ea)' : 'linear-gradient(135deg, #a78bfa, #745cf5)',
                    border: '2px solid #fff',
                    boxShadow: '0 4px 14px rgba(116,92,245,0.65)',
                    position: 'absolute', pointerEvents: 'none',
                    transform: `translate(${joyKnob.x}px, ${joyKnob.y}px)`,
                    transition: isJoyActive ? 'none' : 'transform 0.05s ease-out'
                  }}
                />
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 38px)', gridTemplateRows: 'repeat(3, 38px)', gap: '4px' }}>
                <button
                  type="button"
                  onPointerDown={() => { keysRef.current.add('w'); vibrate(15); }}
                  onPointerUp={() => keysRef.current.delete('w')}
                  onPointerCancel={() => keysRef.current.delete('w')}
                  style={{ gridArea: '1 / 2', background: '#fff', border: '1px solid #dedbe8', borderRadius: '10px', fontWeight: 800, fontSize: '16px', cursor: 'pointer' }}
                >↑</button>
                <button
                  type="button"
                  onPointerDown={() => { keysRef.current.add('a'); vibrate(15); }}
                  onPointerUp={() => keysRef.current.delete('a')}
                  onPointerCancel={() => keysRef.current.delete('a')}
                  style={{ gridArea: '2 / 1', background: '#fff', border: '1px solid #dedbe8', borderRadius: '10px', fontWeight: 800, fontSize: '16px', cursor: 'pointer' }}
                >←</button>
                <button
                  type="button"
                  onPointerDown={() => { keysRef.current.add('s'); vibrate(15); }}
                  onPointerUp={() => keysRef.current.delete('s')}
                  onPointerCancel={() => keysRef.current.delete('s')}
                  style={{ gridArea: '3 / 2', background: '#fff', border: '1px solid #dedbe8', borderRadius: '10px', fontWeight: 800, fontSize: '16px', cursor: 'pointer' }}
                >↓</button>
                <button
                  type="button"
                  onPointerDown={() => { keysRef.current.add('d'); vibrate(15); }}
                  onPointerUp={() => keysRef.current.delete('d')}
                  onPointerCancel={() => keysRef.current.delete('d')}
                  style={{ gridArea: '2 / 3', background: '#fff', border: '1px solid #dedbe8', borderRadius: '10px', fontWeight: 800, fontSize: '16px', cursor: 'pointer' }}
                >→</button>
              </div>
            )}
          </div>

          {/* Middle Switcher Pill */}
          <div>
            <button
              type="button"
              onClick={() => {
                const next = settings.controlMode === 'joystick' ? 'dpad' : 'joystick';
                setSettings(s => ({ ...s, controlMode: next }));
                vibrate(20);
              }}
              style={{
                background: '#fff', border: '1px solid #dedbe8', borderRadius: '20px',
                padding: '8px 14px', fontSize: '11px', fontWeight: 700, color: '#55536e', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
              }}
            >
              <span>{settings.controlMode === 'joystick' ? '🕹️ Cần gạt' : '🎛️ D-Pad'}</span>
            </button>
          </div>

          {/* Right Dash Button */}
          <div>
            <button
              type="button"
              onPointerDown={() => {
                vibrate(25);
                if (stateRef.current === 'playing') triggerDashRef.current();
                else startGame();
              }}
              style={{
                width: '68px', height: '68px', borderRadius: '50%',
                background: dashReady ? 'linear-gradient(135deg, #f59e0b, #ea580c)' : '#4b5563',
                color: '#fff', border: '3px solid rgba(255,255,255,0.7)',
                boxShadow: dashReady ? '0 0 16px rgba(245,158,11,0.6)' : 'none',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '11px', cursor: 'pointer', touchAction: 'none'
              }}
            >
              <span style={{ fontSize: '18px', lineHeight: 1 }}>⚡</span>
              <span>LƯỚT</span>
            </button>
          </div>
        </div>

        <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '12px', color: '#7f7d91' }}>
          <div>
            <strong>Mẹo cao thủ:</strong> Ăn 🐟 +50đ, 🥫 +100đ, 🛡️ Khiên. Nhấn <strong>Space / Shift</strong> để lướt!
          </div>
          <div>
            Di chuyển: <kbd style={{ background: '#fff', border: '1px solid #dedbe8', padding: '2px 6px', borderRadius: '4px' }}>WASD</kbd> hoặc <kbd style={{ background: '#fff', border: '1px solid #dedbe8', padding: '2px 6px', borderRadius: '4px' }}>← ↑ ↓ →</kbd>
          </div>
        </footer>
      </section>
    </main>
  );
}

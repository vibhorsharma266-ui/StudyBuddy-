/**
 * ==============================================================================
 * StudyBuddy — Modern Student Productivity Hub
 * Pure Vanilla JavaScript Application (ES6+)
 * Fully functional, client-side, with LocalStorage persistence and Web Audio
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// 1. DEFAULT DATA & STATE
// ------------------------------------------------------------------------------

// Helper: Safe Local Date (YYYY-MM-DD) avoiding UTC offset skew
function getLocalDateString(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const DEFAULT_SETTINGS = {
  username: "Alex Rivera",
  school: "Computer Science Major",
  dailyGoalHours: 4,
  pomoDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  theme: "dark"
};

const DEFAULT_TASKS = [
  {
    id: "task-1",
    title: "Complete Discrete Mathematics Problem Set 4",
    subject: "Mathematics",
    priority: "high",
    dueDate: getLocalDateString(new Date(Date.now() + 86400000)),
    pomodoros: 3,
    completed: false,
    createdAt: Date.now() - 3600000 * 5
  },
  {
    id: "task-2",
    title: "Implement Dijkstra's Algorithm in Python",
    subject: "Computer Science",
    priority: "high",
    dueDate: getLocalDateString(),
    pomodoros: 4,
    completed: true,
    createdAt: Date.now() - 3600000 * 24
  },
  {
    id: "task-3",
    title: "Review Quantum Mechanics lecture notes (Ch. 6)",
    subject: "Physics",
    priority: "medium",
    dueDate: getLocalDateString(new Date(Date.now() + 86400000 * 2)),
    pomodoros: 2,
    completed: true,
    createdAt: Date.now() - 3600000 * 12
  },
  {
    id: "task-4",
    title: "Draft thesis proposal for AI Ethics research",
    subject: "Literature",
    priority: "medium",
    dueDate: getLocalDateString(new Date(Date.now() + 86400000 * 3)),
    pomodoros: 3,
    completed: false,
    createdAt: Date.now() - 3600000 * 8
  },
  {
    id: "task-5",
    title: "Flashcard review for Operating Systems final",
    subject: "Computer Science",
    priority: "low",
    dueDate: getLocalDateString(new Date(Date.now() + 86400000 * 4)),
    pomodoros: 2,
    completed: false,
    createdAt: Date.now() - 3600000 * 2
  }
];

const DEFAULT_SESSIONS = [
  {
    id: "session-1",
    title: "Data Structures & Graph Algorithms",
    subject: "Computer Science",
    tagColor: "indigo",
    startTime: "09:00",
    endTime: "10:30",
    notes: "Deep dive into shortest path trees and priority queues.",
    date: getLocalDateString()
  },
  {
    id: "session-2",
    title: "Multivariable Calculus Problem Solving",
    subject: "Mathematics",
    tagColor: "purple",
    startTime: "11:00",
    endTime: "12:30",
    notes: "Solve exercise 14.3 to 14.7 on double integrals.",
    date: getLocalDateString()
  },
  {
    id: "session-3",
    title: "Thermodynamics & Heat Engines",
    subject: "Physics",
    tagColor: "emerald",
    startTime: "14:00",
    endTime: "15:30",
    notes: "Review Carnot cycle efficiency and entropy equations.",
    date: getLocalDateString()
  },
  {
    id: "session-4",
    title: "Academic Paper Reading & Annotations",
    subject: "Literature",
    tagColor: "amber",
    startTime: "16:30",
    endTime: "17:30",
    notes: "Annotate background literature and outline abstract.",
    date: getLocalDateString()
  }
];

const DEFAULT_NOTES = [
  {
    id: "note-1",
    title: "Time Complexities Cheat Sheet",
    content: "• Binary Search: O(log n)\n• QuickSort: O(n log n) avg, O(n²) worst\n• MergeSort: O(n log n) guaranteed\n• Hash Map: O(1) avg lookup",
    updatedAt: Date.now() - 3600000 * 4
  },
  {
    id: "note-2",
    title: "Calculus Formula Reminders",
    content: "∫ e^(ax) dx = (1/a) e^(ax) + C\nIntegration by parts: ∫ u dv = uv - ∫ v du\nTaylor Series: f(x) = Σ [f^(n)(a) / n!] (x - a)^n",
    updatedAt: Date.now() - 3600000 * 20
  },
  {
    id: "note-3",
    title: "Weekly Study Strategy",
    content: "1. Finish hard coding assignments before 1 PM.\n2. Dedicate 2 Pomodoros every evening to revision.\n3. Take full rest on Sunday afternoons.",
    updatedAt: Date.now() - 3600000 * 48
  }
];

const QUOTES = [
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "Focus is a muscle. The more you practice deep work, the stronger it becomes.", author: "Cal Newport" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Continuous effort—not strength or intelligence—is the key to unlocking our potential.", author: "Winston Churchill" }
];

// ------------------------------------------------------------------------------
// 2. STATE STORAGE & RETRIEVAL
// ------------------------------------------------------------------------------

class AppState {
  constructor() {
    this.settings = this.load("studybuddy_settings", DEFAULT_SETTINGS);
    this.tasks = this.load("studybuddy_tasks", DEFAULT_TASKS);
    this.sessions = this.load("studybuddy_sessions", DEFAULT_SESSIONS);
    this.notes = this.load("studybuddy_notes", DEFAULT_NOTES);
    this.todayFocusMinutes = this.load("studybuddy_focus_minutes", 105); // 1h 45m initial default
    this.streak = this.load("studybuddy_streak", 5);
    this.lastActiveDate = this.load("studybuddy_last_date", getLocalDateString());

    this.currentView = "dashboard";
    this.selectedPlannerDate = new Date();
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn(`Error reading localStorage for ${key}`, e);
      return fallback;
    }
  }

  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Error saving to localStorage for ${key}`, e);
    }
  }

  saveAll() {
    this.save("studybuddy_settings", this.settings);
    this.save("studybuddy_tasks", this.tasks);
    this.save("studybuddy_sessions", this.sessions);
    this.save("studybuddy_notes", this.notes);
    this.save("studybuddy_focus_minutes", this.todayFocusMinutes);
    this.save("studybuddy_streak", this.streak);
    this.save("studybuddy_last_date", this.lastActiveDate);
  }

  resetDefaults() {
    localStorage.clear();
    this.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    this.tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
    this.sessions = JSON.parse(JSON.stringify(DEFAULT_SESSIONS));
    this.notes = JSON.parse(JSON.stringify(DEFAULT_NOTES));
    this.todayFocusMinutes = 105;
    this.streak = 5;
    this.lastActiveDate = getLocalDateString();
    this.saveAll();
  }
}

const state = new AppState();

// ------------------------------------------------------------------------------
// 3. SYNTHESIZED WEB AUDIO & AMBIENT SOUND GENERATOR
// ------------------------------------------------------------------------------

class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.currentSound = "none";
    this.volume = 0.4;
    this.gainNode = null;
    this.activeNodes = [];
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.audioCtx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    }
  }

  stopAmbient() {
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
    this.currentSound = "none";
    this.updateSoundUI();
  }

  playAmbient(type) {
    this.init();
    this.stopAmbient();

    if (type === "none") return;

    this.currentSound = type;
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    this.gainNode.connect(this.audioCtx.destination);

    if (type === "rain") {
      this.createRainSound();
    } else if (type === "whitenoise") {
      this.createWhiteNoise();
    } else if (type === "waves") {
      this.createOceanWaves();
    } else if (type === "drone") {
      this.createDeepDrone();
    }

    this.updateSoundUI();
  }

  createWhiteNoise() {
    const bufferSize = this.audioCtx.sampleRate * 2;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;

    // Filter to make gentle
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1000;

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    whiteNoise.start();

    this.activeNodes.push(whiteNoise, filter);
  }

  createRainSound() {
    const bufferSize = this.audioCtx.sampleRate * 2;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    // Pink noise generation
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const rainSource = this.audioCtx.createBufferSource();
    rainSource.buffer = buffer;
    rainSource.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 850;

    rainSource.connect(filter);
    filter.connect(this.gainNode);
    rainSource.start();

    this.activeNodes.push(rainSource, filter);
  }

  createOceanWaves() {
    const bufferSize = this.audioCtx.sampleRate * 4;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 450;
    filter.Q.value = 3;

    // LFO to modulate wave crests
    const lfo = this.audioCtx.createOscillator();
    lfo.frequency.value = 0.15; // wave cycle every ~6.5 seconds

    const lfoGain = this.audioCtx.createGain();
    lfoGain.gain.value = 350;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(this.gainNode);

    noise.start();
    lfo.start();

    this.activeNodes.push(noise, filter, lfo, lfoGain);
  }

  createDeepDrone() {
    const freqs = [110, 164.81, 220]; // A2, E3, A3
    freqs.forEach(f => {
      const osc = this.audioCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f;

      const subGain = this.audioCtx.createGain();
      subGain.gain.value = 0.25;

      osc.connect(subGain);
      subGain.connect(this.gainNode);
      osc.start();

      this.activeNodes.push(osc, subGain);
    });
  }

  playCompletionChime() {
    try {
      this.init();
      const now = this.audioCtx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio

      notes.forEach((freq, index) => {
        const osc = this.audioCtx.createOscillator();
        const noteGain = this.audioCtx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + index * 0.12);

        noteGain.gain.setValueAtTime(0, now + index * 0.12);
        noteGain.gain.linearRampToValueAtTime(0.2, now + index * 0.12 + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.12 + 0.8);

        osc.connect(noteGain);
        noteGain.connect(this.audioCtx.destination);

        osc.start(now + index * 0.12);
        osc.stop(now + index * 0.12 + 0.85);
      });
    } catch (e) {
      console.warn("Chime failed", e);
    }
  }

  updateSoundUI() {
    const label = document.getElementById("current-sound-label");
    const nameMap = {
      none: "Ambience: Off",
      rain: "Ambience: Rain",
      whitenoise: "Ambience: Breeze",
      waves: "Ambience: Waves",
      drone: "Ambience: Drone"
    };
    if (label) {
      label.textContent = nameMap[this.currentSound] || "Ambience: Off";
    }

    // Dropdown active states
    document.querySelectorAll(".sound-option").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.sound === this.currentSound);
    });

    // Quick pills in timer view
    document.querySelectorAll(".sound-pill").forEach(pill => {
      pill.classList.toggle("active", pill.dataset.preset === this.currentSound);
    });
  }
}

const sounds = new SoundManager();

// ------------------------------------------------------------------------------
// 4. CONFETTI CELEBRATION ENGINE (Pure Canvas)
// ------------------------------------------------------------------------------

class ConfettiEngine {
  constructor() {
    this.canvas = document.getElementById("confetti-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.animating = false;
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(count = 70) {
    const colors = ["#6366f1", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#38bdf8"];
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 3;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 4 + Math.random() * 8;
      this.particles.push({
        x: startX + (Math.random() * 80 - 40),
        y: startY + (Math.random() * 40 - 20),
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        radius: 3 + Math.random() * 4,
        tilt: Math.random() * 10,
        tiltAngle: 0,
        tiltAngleIncremental: 0.05 + Math.random() * 0.1,
        life: 1,
        decay: 0.012 + Math.random() * 0.015
      });
    }

    if (!this.animating) {
      this.animating = true;
      this.loop();
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // gravity
      p.tiltAngle += p.tiltAngleIncremental;
      p.life -= p.decay;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.beginPath();
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.life;
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.loop());
    } else {
      this.animating = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

const confetti = new ConfettiEngine();

// ------------------------------------------------------------------------------
// 5. TOAST NOTIFICATIONS
// ------------------------------------------------------------------------------

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: "fa-solid fa-circle-check",
    info: "fa-solid fa-circle-info",
    warning: "fa-solid fa-triangle-exclamation"
  };

  toast.innerHTML = `
    <i class="${iconMap[type] || iconMap.info}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// ------------------------------------------------------------------------------
// 6. POMODORO TIMER CONTROLLER
// ------------------------------------------------------------------------------

class TimerController {
  constructor() {
    this.mode = "pomodoro"; // pomodoro | shortBreak | longBreak
    this.totalSeconds = state.settings.pomoDuration * 60;
    this.remainingSeconds = this.totalSeconds;
    this.isRunning = false;
    this.interval = null;
    this.cycleCount = 1;
    this.maxCycles = 4;
    this.currentFocusGoal = "Deep Work & Problem Solving";

    this.svgCircumference = 2 * Math.PI * 145; // r=145 -> ~911
    this.initElements();
  }

  initElements() {
    this.display = document.getElementById("timer-display");
    this.statusSub = document.getElementById("timer-mode-label");
    this.toggleBtn = document.getElementById("timer-toggle-btn");
    this.toggleText = document.getElementById("timer-toggle-text");
    this.playIcon = document.getElementById("timer-play-icon");
    this.resetBtn = document.getElementById("timer-reset-btn");
    this.skipBtn = document.getElementById("timer-skip-btn");
    this.svgCircle = document.getElementById("timer-svg-circle");
    this.focusLabel = document.getElementById("timer-focus-label");
    this.cycleText = document.getElementById("cycle-text");
    this.liveDot = document.getElementById("timer-live-dot");

    if (this.svgCircle) {
      this.svgCircle.style.strokeDasharray = this.svgCircumference;
      this.svgCircle.style.strokeDashoffset = "0";
    }

    this.bindEvents();
    this.updateDisplay();
  }

  bindEvents() {
    // Mode switch buttons
    document.querySelectorAll(".timer-mode-selector .mode-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.setMode(btn.dataset.mode);
      });
    });

    if (this.toggleBtn) {
      this.toggleBtn.addEventListener("click", () => this.toggle());
    }

    if (this.resetBtn) {
      this.resetBtn.addEventListener("click", () => this.reset());
    }

    if (this.skipBtn) {
      this.skipBtn.addEventListener("click", () => this.skip());
    }

    // Hero quick launch button
    const heroBtn = document.getElementById("hero-start-timer-btn");
    if (heroBtn) {
      heroBtn.addEventListener("click", () => {
        switchView("timer");
        if (!this.isRunning) this.start();
      });
    }

    // Edit focus goal prompt
    const editGoalBtn = document.getElementById("edit-focus-tag-btn");
    if (editGoalBtn) {
      editGoalBtn.addEventListener("click", () => {
        const newGoal = prompt("What are you focusing on in this session?", this.currentFocusGoal);
        if (newGoal && newGoal.trim()) {
          this.currentFocusGoal = newGoal.trim();
          this.focusLabel.textContent = this.currentFocusGoal;
          showToast(`Target set to: ${this.currentFocusGoal}`, "info");
        }
      });
    }
  }

  setMode(mode) {
    this.pause();
    this.mode = mode;

    let mins = state.settings.pomoDuration;
    if (mode === "shortBreak") mins = state.settings.shortBreakDuration;
    if (mode === "longBreak") mins = state.settings.longBreakDuration;

    this.totalSeconds = mins * 60;
    this.remainingSeconds = this.totalSeconds;

    // Update active button
    document.querySelectorAll(".timer-mode-selector .mode-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.mode === mode);
    });

    const labelMap = {
      pomodoro: "FOCUS TIME",
      shortBreak: "SHORT BREAK",
      longBreak: "LONG BREAK"
    };
    if (this.statusSub) this.statusSub.textContent = labelMap[mode];

    // Theme color adjustments on circle
    if (this.svgCircle) {
      if (mode === "pomodoro") this.svgCircle.style.color = "var(--primary)";
      else if (mode === "shortBreak") this.svgCircle.style.color = "var(--emerald)";
      else if (mode === "longBreak") this.svgCircle.style.color = "var(--purple)";
    }

    this.updateDisplay();
  }

  toggle() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    sounds.init();

    if (this.toggleText) this.toggleText.textContent = "Pause Focus";
    if (this.playIcon) this.playIcon.className = "fa-solid fa-pause";
    if (this.liveDot) this.liveDot.classList.add("running");

    this.interval = setInterval(() => {
      this.remainingSeconds--;

      // Log focus time if in pomodoro mode
      if (this.mode === "pomodoro") {
        if (this.remainingSeconds % 60 === 0) {
          state.todayFocusMinutes += 1;
          state.save("studybuddy_focus_minutes", state.todayFocusMinutes);
          renderDashboard();
        }
      }

      if (this.remainingSeconds <= 0) {
        this.completeSession();
      } else {
        this.updateDisplay();
      }
    }, 1000);

    this.updateDisplay();
    showToast(`Timer started: ${this.currentFocusGoal}`, "info");
  }

  pause() {
    if (!this.isRunning) return;
    this.isRunning = false;
    clearInterval(this.interval);

    if (this.toggleText) this.toggleText.textContent = "Resume Focus";
    if (this.playIcon) this.playIcon.className = "fa-solid fa-play";
    if (this.liveDot) this.liveDot.classList.remove("running");
  }

  reset() {
    this.pause();
    this.remainingSeconds = this.totalSeconds;
    if (this.toggleText) this.toggleText.textContent = "Start Focus";
    this.updateDisplay();
    showToast("Timer reset to beginning", "info");
  }

  skip() {
    this.pause();
    if (this.mode === "pomodoro") {
      if (this.cycleCount % this.maxCycles === 0) {
        this.setMode("longBreak");
      } else {
        this.setMode("shortBreak");
      }
    } else {
      this.cycleCount = (this.cycleCount % this.maxCycles) + 1;
      this.setMode("pomodoro");
    }
    this.updateCycleDots();
    showToast("Skipped to next session", "info");
  }

  completeSession() {
    this.pause();
    sounds.playCompletionChime();
    confetti.burst(80);

    if (this.mode === "pomodoro") {
      showToast("🎉 Pomodoro Finished! Time for a well-deserved break.", "success");
      if (this.cycleCount % this.maxCycles === 0) {
        this.setMode("longBreak");
      } else {
        this.setMode("shortBreak");
      }
    } else {
      showToast("⚡ Break over! Ready to focus again?", "info");
      this.cycleCount = (this.cycleCount % this.maxCycles) + 1;
      this.setMode("pomodoro");
    }

    this.updateCycleDots();
    renderDashboard();
  }

  updateDisplay() {
    const mins = Math.floor(this.remainingSeconds / 60);
    const secs = this.remainingSeconds % 60;
    const formatted = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

    if (this.display) this.display.textContent = formatted;

    // Document title ticker
    if (this.isRunning) {
      document.title = `(${formatted}) StudyBuddy Focus`;
    } else {
      document.title = "StudyBuddy — Modern Student Productivity Hub";
    }

    // Circular SVG Progress calculation (drains smoothly as time counts down)
    if (this.svgCircle && this.totalSeconds > 0) {
      const fraction = this.remainingSeconds / this.totalSeconds;
      const offset = this.svgCircumference * (1 - fraction);
      this.svgCircle.style.strokeDashoffset = offset;
    }
  }

  updateCycleDots() {
    const dotsContainer = document.getElementById("cycle-dots");
    if (!dotsContainer) return;

    dotsContainer.innerHTML = "";
    for (let i = 1; i <= this.maxCycles; i++) {
      const dot = document.createElement("span");
      dot.className = "dot";
      if (i < this.cycleCount) dot.classList.add("done");
      else if (i === this.cycleCount) dot.classList.add("current");
      dotsContainer.appendChild(dot);
    }

    if (this.cycleText) {
      this.cycleText.textContent = `${this.cycleCount} of ${this.maxCycles} pomodoros`;
    }
  }

  setFocusTask(taskTitle) {
    this.currentFocusGoal = taskTitle;
    if (this.focusLabel) this.focusLabel.textContent = taskTitle;
    this.setMode("pomodoro");
  }
}

let timerController;

// ------------------------------------------------------------------------------
// 7. TASK MANAGER LOGIC
// ------------------------------------------------------------------------------

class TaskManager {
  constructor() {
    this.filterStatus = "all"; // all | pending | completed
    this.filterPriority = "all";
    this.searchQuery = "";
    this.init();
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Search input
    const searchInput = document.getElementById("tasks-search-input");
    const clearBtn = document.getElementById("clear-search-btn");
    if (searchInput) {
      searchInput.addEventListener("input", e => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        clearBtn.style.display = this.searchQuery ? "block" : "none";
        this.render();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        this.searchQuery = "";
        clearBtn.style.display = "none";
        this.render();
      });
    }

    // Segmented filter buttons (All / Pending / Completed)
    document.querySelectorAll(".segmented-control .seg-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".segmented-control .seg-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.filterStatus = btn.dataset.filter;
        this.render();
      });
    });

    // Priority filter dropdown
    const prioritySelect = document.getElementById("tasks-priority-filter");
    if (prioritySelect) {
      prioritySelect.addEventListener("change", e => {
        this.filterPriority = e.target.value;
        this.render();
      });
    }

    // Open Add Task Modal
    const addTaskBtn = document.getElementById("open-add-task-modal-btn");
    if (addTaskBtn) {
      addTaskBtn.addEventListener("click", () => openTaskModal());
    }

    // Task Form Submit
    const form = document.getElementById("task-form");
    if (form) {
      form.addEventListener("submit", e => {
        e.preventDefault();
        this.saveTaskFromModal();
      });
    }
  }

  saveTaskFromModal() {
    const idInput = document.getElementById("task-id");
    const title = document.getElementById("task-title").value.trim();
    const subject = document.getElementById("task-subject").value;
    const priority = document.getElementById("task-priority").value;
    const dueDate = document.getElementById("task-due-date").value;
    const pomodoros = parseInt(document.getElementById("task-pomodoros").value, 10) || 1;

    if (!title) return;

    if (idInput.value) {
      // Edit existing
      const existing = state.tasks.find(t => t.id === idInput.value);
      if (existing) {
        existing.title = title;
        existing.subject = subject;
        existing.priority = priority;
        existing.dueDate = dueDate;
        existing.pomodoros = pomodoros;
        showToast("Task updated successfully!", "success");
      }
    } else {
      // Create new
      const newTask = {
        id: "task-" + Date.now(),
        title,
        subject,
        priority,
        dueDate,
        pomodoros,
        completed: false,
        createdAt: Date.now()
      };
      state.tasks.unshift(newTask);
      showToast("New task created!", "success");
    }

    state.save("studybuddy_tasks", state.tasks);
    closeModals();
    this.render();
    renderDashboard();
    updateBadges();
  }

  toggleTask(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.completed = !task.completed;
    state.save("studybuddy_tasks", state.tasks);

    if (task.completed) {
      sounds.init();
      confetti.burst(40);
      showToast(`Completed: "${task.title}"`, "success");
    }

    this.render();
    renderDashboard();
    updateBadges();
  }

  deleteTask(taskId) {
    if (confirm("Are you sure you want to delete this task?")) {
      state.tasks = state.tasks.filter(t => t.id !== taskId);
      state.save("studybuddy_tasks", state.tasks);
      this.render();
      renderDashboard();
      updateBadges();
      showToast("Task deleted", "info");
    }
  }

  editTask(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;
    openTaskModal(task);
  }

  launchTaskInTimer(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;
    timerController.setFocusTask(task.title);
    switchView("timer");
    timerController.start();
  }

  render() {
    const container = document.getElementById("tasks-list-container");
    if (!container) return;

    let filtered = state.tasks;

    // Status filter
    if (this.filterStatus === "pending") filtered = filtered.filter(t => !t.completed);
    if (this.filterStatus === "completed") filtered = filtered.filter(t => t.completed);

    // Priority filter
    if (this.filterPriority !== "all") {
      filtered = filtered.filter(t => t.priority.toLowerCase() === this.filterPriority.toLowerCase());
    }

    // Search query
    if (this.searchQuery) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(this.searchQuery) ||
        t.subject.toLowerCase().includes(this.searchQuery)
      );
    }

    // Update Progress header banner
    const total = state.tasks.length;
    const completedCount = state.tasks.filter(t => t.completed).length;
    const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    const countLabel = document.getElementById("tasks-stats-count");
    const percentLabel = document.getElementById("tasks-stats-percent");
    const barFill = document.getElementById("tasks-overall-progress");

    if (countLabel) countLabel.textContent = `${completedCount} of ${total} tasks completed`;
    if (percentLabel) percentLabel.textContent = `${percent}%`;
    if (barFill) barFill.style.width = `${percent}%`;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state card">
          <i class="fa-solid fa-clipboard-check"></i>
          <h4>No tasks found</h4>
          <p>You're all caught up, or no tasks match your filter criteria.</p>
          <button class="btn btn-primary" onclick="openTaskModal()">
            <i class="fa-solid fa-plus"></i> Create New Task
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(t => {
      const priorityClass = `pill-priority-${t.priority.toLowerCase()}`;
      const dueFormatted = t.dueDate ? formatShortDate(t.dueDate) : "No due date";

      return `
        <div class="task-item-card ${t.completed ? 'completed' : ''}" data-id="${t.id}">
          <div class="task-left">
            <label class="custom-checkbox">
              <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="taskManager.toggleTask('${t.id}')">
              <span class="checkmark"></span>
            </label>
            <div class="task-content">
              <div class="task-title-text">${escapeHtml(t.title)}</div>
              <div class="task-tags-row">
                <span class="task-pill ${priorityClass}">
                  <i class="fa-solid fa-flag"></i> ${capitalize(t.priority)}
                </span>
                <span class="task-pill pill-subject">
                  <i class="fa-solid fa-book"></i> ${escapeHtml(t.subject)}
                </span>
                <span class="task-pill pill-pomo" title="Estimated Pomodoros">
                  🍅 ${t.pomodoros || 1}
                </span>
                <span class="task-pill pill-subject">
                  <i class="fa-regular fa-clock"></i> ${dueFormatted}
                </span>
              </div>
            </div>
          </div>
          <div class="task-right">
            ${!t.completed ? `
              <button class="icon-btn" title="Focus on this task in Timer" onclick="taskManager.launchTaskInTimer('${t.id}')">
                <i class="fa-solid fa-play" style="color: var(--primary);"></i>
              </button>
            ` : ''}
            <button class="icon-btn" title="Edit task" onclick="taskManager.editTask('${t.id}')">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="icon-btn" title="Delete task" onclick="taskManager.deleteTask('${t.id}')">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;
    }).join("");
  }
}

let taskManager;

// ------------------------------------------------------------------------------
// 8. STUDY PLANNER CONTROLLER
// ------------------------------------------------------------------------------

class PlannerController {
  constructor() {
    this.selectedSubject = "all";
    this.currentDate = new Date();
    this.init();
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Prev / Next day buttons
    const prevBtn = document.getElementById("planner-prev-day-btn");
    const nextBtn = document.getElementById("planner-next-day-btn");
    const todayBtn = document.getElementById("planner-today-btn");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        this.currentDate.setDate(this.currentDate.getDate() - 1);
        this.render();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        this.render();
      });
    }

    if (todayBtn) {
      todayBtn.addEventListener("click", () => {
        this.currentDate = new Date();
        this.render();
      });
    }

    // Subject Filter
    const subjectFilter = document.getElementById("planner-subject-filter");
    if (subjectFilter) {
      subjectFilter.addEventListener("change", e => {
        this.selectedSubject = e.target.value;
        this.render();
      });
    }

    // Add Session Modal Trigger
    const openAddBtn = document.getElementById("open-add-session-btn");
    if (openAddBtn) {
      openAddBtn.addEventListener("click", () => openSessionModal());
    }

    // Session Form Submit
    const sessionForm = document.getElementById("session-form");
    if (sessionForm) {
      sessionForm.addEventListener("submit", e => {
        e.preventDefault();
        this.saveSessionFromModal();
      });
    }
  }

  saveSessionFromModal() {
    const idInput = document.getElementById("session-id");
    const title = document.getElementById("session-title").value.trim();
    const subject = document.getElementById("session-subject").value;
    const tagColor = document.getElementById("session-tag-color").value;
    const startTime = document.getElementById("session-start").value;
    const endTime = document.getElementById("session-end").value;
    const notes = document.getElementById("session-notes").value.trim();

    if (!title || !startTime || !endTime) return;

    const dateKey = getLocalDateString(this.currentDate);

    if (idInput.value) {
      // Edit
      const session = state.sessions.find(s => s.id === idInput.value);
      if (session) {
        session.title = title;
        session.subject = subject;
        session.tagColor = tagColor;
        session.startTime = startTime;
        session.endTime = endTime;
        session.notes = notes;
        showToast("Study session updated!", "success");
      }
    } else {
      // Add
      const newSession = {
        id: "session-" + Date.now(),
        title,
        subject,
        tagColor,
        startTime,
        endTime,
        notes,
        date: dateKey
      };
      state.sessions.push(newSession);
      showToast("Study session scheduled!", "success");
    }

    // Sort by startTime
    state.sessions.sort((a, b) => a.startTime.localeCompare(b.startTime));
    state.save("studybuddy_sessions", state.sessions);

    closeModals();
    this.render();
    renderDashboard();
    updateBadges();
  }

  deleteSession(sessionId) {
    if (confirm("Delete this planned study block?")) {
      state.sessions = state.sessions.filter(s => s.id !== sessionId);
      state.save("studybuddy_sessions", state.sessions);
      this.render();
      renderDashboard();
      updateBadges();
      showToast("Session removed", "info");
    }
  }

  editSession(sessionId) {
    const session = state.sessions.find(s => s.id === sessionId);
    if (!session) return;
    openSessionModal(session);
  }

  startSessionTimer(sessionId) {
    const session = state.sessions.find(s => s.id === sessionId);
    if (!session) return;
    timerController.setFocusTask(session.title);
    switchView("timer");
    timerController.start();
  }

  render() {
    const container = document.getElementById("timeline-sessions-list");
    const dateHeading = document.getElementById("planner-date-heading");
    if (!container) return;

    const dateKey = getLocalDateString(this.currentDate);
    const isToday = dateKey === getLocalDateString();

    if (dateHeading) {
      const options = { weekday: "short", month: "short", day: "numeric" };
      const dateFormatted = this.currentDate.toLocaleDateString("en-US", options);
      dateHeading.textContent = isToday ? `Today (${dateFormatted})` : dateFormatted;
    }

    // Filter sessions by date and subject
    let filtered = state.sessions.filter(s => {
      const matchesDate = (s.date === dateKey) || (!s.date && isToday);
      const matchesSubject = this.selectedSubject === "all" || s.subject === this.selectedSubject;
      return matchesDate && matchesSubject;
    });

    // Summary calculation
    let totalMinutes = 0;
    filtered.forEach(s => {
      const startParts = s.startTime.split(":").map(Number);
      const endParts = s.endTime.split(":").map(Number);
      const startTotal = startParts[0] * 60 + startParts[1];
      const endTotal = endParts[0] * 60 + endParts[1];
      if (endTotal > startTotal) totalMinutes += (endTotal - startTotal);
    });

    const hours = (totalMinutes / 60).toFixed(1);
    const totalHoursEl = document.getElementById("planner-total-hours");
    const sessionCountEl = document.getElementById("planner-session-count");

    if (totalHoursEl) totalHoursEl.textContent = `${hours} Hours`;
    if (sessionCountEl) sessionCountEl.textContent = `${filtered.length} Blocks`;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-calendar-xmark"></i>
          <h4>No sessions planned for this date</h4>
          <p>Plan your focus blocks to stay ahead of your deadlines and coursework.</p>
          <button class="btn btn-primary" onclick="openSessionModal()">
            <i class="fa-solid fa-plus"></i> Schedule Study Block
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(s => {
      return `
        <div class="session-block-card">
          <div class="session-accent-bar tag-${s.tagColor || 'indigo'}"></div>
          <div class="session-block-content">
            <div class="session-main-info">
              <div class="session-meta-top">
                <span class="session-time-badge">
                  <i class="fa-regular fa-clock"></i> ${formatTime12(s.startTime)} – ${formatTime12(s.endTime)}
                </span>
                <span class="session-subject-tag">${escapeHtml(s.subject)}</span>
              </div>
              <h4>${escapeHtml(s.title)}</h4>
              ${s.notes ? `<p><i class="fa-solid fa-bullseye" style="color: var(--amber); margin-right: 6px;"></i>${escapeHtml(s.notes)}</p>` : ''}
            </div>
            <div class="session-actions-right">
              <button class="btn btn-secondary btn-sm" title="Launch Pomodoro for this block" onclick="plannerController.startSessionTimer('${s.id}')">
                <i class="fa-solid fa-play" style="color: var(--primary);"></i> Focus
              </button>
              <button class="icon-btn" title="Edit session" onclick="plannerController.editSession('${s.id}')">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="icon-btn" title="Delete session" onclick="plannerController.deleteSession('${s.id}')">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }
}

let plannerController;

// ------------------------------------------------------------------------------
// 9. QUICK NOTES & SCRATCHPAD CONTROLLER
// ------------------------------------------------------------------------------

class NotesController {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    const addBtn = document.getElementById("add-new-note-btn");
    if (addBtn) {
      addBtn.addEventListener("click", () => this.createNote());
    }

    const exportBtn = document.getElementById("export-notes-btn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => this.exportNotes());
    }
  }

  createNote() {
    const newNote = {
      id: "note-" + Date.now(),
      title: "Untitled Note",
      content: "",
      updatedAt: Date.now()
    };
    state.notes.unshift(newNote);
    state.save("studybuddy_notes", state.notes);
    this.render();
    showToast("Created a new note card", "success");
  }

  updateNoteTitle(id, val) {
    const note = state.notes.find(n => n.id === id);
    if (note) {
      note.title = val;
      note.updatedAt = Date.now();
      state.save("studybuddy_notes", state.notes);
    }
  }

  updateNoteContent(id, val) {
    const note = state.notes.find(n => n.id === id);
    if (note) {
      note.content = val;
      note.updatedAt = Date.now();
      state.save("studybuddy_notes", state.notes);
    }
  }

  deleteNote(id) {
    if (confirm("Delete this note?")) {
      state.notes = state.notes.filter(n => n.id !== id);
      state.save("studybuddy_notes", state.notes);
      this.render();
      showToast("Note deleted", "info");
    }
  }

  exportNotes() {
    if (state.notes.length === 0) {
      showToast("No notes to export!", "warning");
      return;
    }
    let exportText = `# StudyBuddy Notes Export (${new Date().toLocaleDateString()})\n\n`;
    state.notes.forEach((note, index) => {
      exportText += `## ${index + 1}. ${note.title}\n${note.content}\n\n---\n\n`;
    });

    const blob = new Blob([exportText], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `StudyBuddy_Notes_${getLocalDateString()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Notes exported to Markdown file!", "success");
  }

  render() {
    const grid = document.getElementById("notes-grid");
    if (!grid) return;

    if (state.notes.length === 0) {
      grid.innerHTML = `
        <div class="empty-state card" style="grid-column: 1 / -1;">
          <i class="fa-solid fa-note-sticky"></i>
          <h4>Your scratchpad is empty</h4>
          <p>Keep your formulas, exam tips, and ideas organized in one place.</p>
          <button class="btn btn-primary" onclick="notesController.createNote()">
            <i class="fa-solid fa-plus"></i> Create First Note
          </button>
        </div>
      `;
      return;
    }

    grid.innerHTML = state.notes.map(n => {
      const dateStr = new Date(n.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `
        <div class="note-card" data-id="${n.id}">
          <div class="note-top">
            <span class="note-tag">Quick Note</span>
            <div class="note-actions">
              <button class="note-action-btn" title="Delete Note" onclick="notesController.deleteNote('${n.id}')">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
          <input
            type="text"
            class="note-title-input"
            value="${escapeHtml(n.title)}"
            placeholder="Note Title..."
            oninput="notesController.updateNoteTitle('${n.id}', this.value)"
          />
          <textarea
            class="note-body-textarea"
            placeholder="Write reminders, formulas, or study notes here..."
            oninput="notesController.updateNoteContent('${n.id}', this.value)"
          >${escapeHtml(n.content)}</textarea>
          <div class="note-date-footer">
            <i class="fa-regular fa-clock"></i> Last updated: ${dateStr}
          </div>
        </div>
      `;
    }).join("");
  }
}

let notesController;

// ------------------------------------------------------------------------------
// 10. DASHBOARD VIEW RENDERER
// ------------------------------------------------------------------------------

function renderDashboard() {
  // 1. User & Greeting
  const user = state.settings.username || "Student";
  const hour = new Date().getHours();
  let timeOfDay = "Good morning";
  if (hour >= 12 && hour < 17) timeOfDay = "Good afternoon";
  if (hour >= 17) timeOfDay = "Good evening";

  const headline = document.getElementById("greeting-headline");
  const greetingBadge = document.getElementById("greeting-time");
  if (headline) headline.textContent = `${timeOfDay}, ${user}!`;
  if (greetingBadge) greetingBadge.textContent = "READY TO EXCEL";

  // 2. Metrics & Stats
  const hoursCompleted = (state.todayFocusMinutes / 60).toFixed(1);
  const goalHours = state.settings.dailyGoalHours;
  const focusPercent = Math.min(100, Math.round((hoursCompleted / goalHours) * 100));

  const statTodayTime = document.getElementById("stat-today-time");
  const statGoalTarget = document.getElementById("stat-goal-target");
  const statFocusProgress = document.getElementById("stat-focus-progress");

  const h = Math.floor(state.todayFocusMinutes / 60);
  const m = state.todayFocusMinutes % 60;
  if (statTodayTime) statTodayTime.textContent = `${h}h ${m}m`;
  if (statGoalTarget) statGoalTarget.textContent = `/ ${goalHours}h goal`;
  if (statFocusProgress) statFocusProgress.style.width = `${focusPercent}%`;

  // Tasks metric
  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(t => t.completed).length;
  const tasksPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const statTasksDone = document.getElementById("stat-tasks-done");
  const statTasksPercent = document.getElementById("stat-tasks-percent");
  const statTasksProgress = document.getElementById("stat-tasks-progress");

  if (statTasksDone) statTasksDone.textContent = `${completedTasks} / ${totalTasks}`;
  if (statTasksPercent) statTasksPercent.textContent = `${tasksPercent}%`;
  if (statTasksProgress) statTasksProgress.style.width = `${tasksPercent}%`;

  // Streak
  const streakCounter = document.getElementById("streak-counter");
  const statStreakDays = document.getElementById("stat-streak-days");
  if (streakCounter) streakCounter.textContent = state.streak;
  if (statStreakDays) statStreakDays.textContent = `${state.streak} Days`;

  // Productivity Score
  const productivityScore = Math.min(100, Math.round((focusPercent * 0.5) + (tasksPercent * 0.5)));
  const statScore = document.getElementById("stat-productivity-score");
  if (statScore) statScore.textContent = `${productivityScore}%`;

  // Hero Subtext
  const heroSubtext = document.getElementById("greeting-subtext");
  if (heroSubtext) {
    heroSubtext.textContent = `You've completed ${completedTasks} of ${totalTasks} tasks today (${tasksPercent}%). Keep pushing towards your ${goalHours}h daily focus goal!`;
  }

  // 3. Today's Schedule Preview (Top 3 upcoming)
  const schedulePreviewContainer = document.getElementById("dash-schedule-preview");
  if (schedulePreviewContainer) {
    const todayKey = getLocalDateString();
    const todaySessions = state.sessions
      .filter(s => s.date === todayKey || !s.date)
      .slice(0, 3);

    if (todaySessions.length === 0) {
      schedulePreviewContainer.innerHTML = `
        <div class="empty-state" style="padding: 24px;">
          <p>No study blocks scheduled for today yet.</p>
          <button class="btn btn-secondary btn-sm" onclick="switchView('planner')">Open Daily Planner</button>
        </div>
      `;
    } else {
      schedulePreviewContainer.innerHTML = todaySessions.map(s => `
        <div class="preview-session-item">
          <div class="preview-time">${formatTime12(s.startTime)}</div>
          <div class="preview-body">
            <h4>${escapeHtml(s.title)}</h4>
            <p><i class="fa-solid fa-tag"></i> ${escapeHtml(s.subject)}</p>
          </div>
          <button class="btn btn-secondary btn-sm" title="Focus on this session in Timer" onclick="plannerController.startSessionTimer('${s.id}')">
            <i class="fa-solid fa-play" style="color: var(--primary);"></i>
          </button>
        </div>
      `).join("");
    }
  }

  // 4. Priority Tasks Preview (Top 4 pending tasks)
  const tasksPreviewContainer = document.getElementById("dash-tasks-preview");
  if (tasksPreviewContainer) {
    const pendingTasks = state.tasks
      .filter(t => !t.completed)
      .slice(0, 4);

    if (pendingTasks.length === 0) {
      tasksPreviewContainer.innerHTML = `
        <div class="empty-state" style="padding: 24px;">
          <i class="fa-solid fa-award" style="color: var(--amber); font-size: 2rem;"></i>
          <h4>All tasks complete!</h4>
          <p>Great job! Take a break or add new tasks.</p>
        </div>
      `;
    } else {
      tasksPreviewContainer.innerHTML = pendingTasks.map(t => `
        <div class="preview-session-item" style="cursor: pointer;" onclick="taskManager.toggleTask('${t.id}')">
          <label class="custom-checkbox" onclick="event.stopPropagation();">
            <input type="checkbox" onchange="taskManager.toggleTask('${t.id}')">
            <span class="checkmark"></span>
          </label>
          <div class="preview-body">
            <h4>${escapeHtml(t.title)}</h4>
            <p>${escapeHtml(t.subject)} • <span class="task-pill pill-priority-${t.priority.toLowerCase()}">${capitalize(t.priority)}</span></p>
          </div>
        </div>
      `).join("");
    }
  }

  // 5. Sidebar profile info
  const sidebarUsername = document.getElementById("sidebar-username");
  const sidebarSchool = document.getElementById("sidebar-school");
  const sidebarAvatar = document.getElementById("sidebar-avatar");

  if (sidebarUsername) sidebarUsername.textContent = state.settings.username;
  if (sidebarSchool) sidebarSchool.textContent = state.settings.school;
  if (sidebarAvatar) {
    const initials = state.settings.username
      .split(" ")
      .map(n => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
    sidebarAvatar.textContent = initials || "SB";
  }
}

// ------------------------------------------------------------------------------
// 11. NAVIGATION & MODALS
// ------------------------------------------------------------------------------

function switchView(viewName) {
  state.currentView = viewName;

  // View titles mapping
  const titleMap = {
    dashboard: "Dashboard",
    planner: "Daily Study Planner",
    tasks: "Task Checklist",
    timer: "Focus & Pomodoro Timer",
    notes: "Quick Notes & Scratchpad"
  };

  const titleEl = document.getElementById("view-title");
  if (titleEl) titleEl.textContent = titleMap[viewName] || "Dashboard";

  // Update nav buttons
  document.querySelectorAll(".sidebar-nav .nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === viewName);
  });

  // Update panels
  document.querySelectorAll(".view-panel").forEach(panel => {
    panel.classList.toggle("active", panel.id === `view-${viewName}`);
  });

  // Re-render specific view if needed
  if (viewName === "dashboard") renderDashboard();
  if (viewName === "tasks") taskManager.render();
  if (viewName === "planner") plannerController.render();
  if (viewName === "notes") notesController.render();

  // Close mobile sidebar if open
  closeMobileSidebar();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateBadges() {
  const pendingCount = state.tasks.filter(t => !t.completed).length;
  const plannerCount = state.sessions.length;

  const navTasksCount = document.getElementById("nav-tasks-count");
  const navPlannerCount = document.getElementById("nav-planner-count");

  if (navTasksCount) navTasksCount.textContent = pendingCount;
  if (navPlannerCount) navPlannerCount.textContent = plannerCount;
}

// Modals management
function openTaskModal(task = null) {
  const modal = document.getElementById("modal-task");
  const title = document.getElementById("modal-task-title");
  const idInput = document.getElementById("task-id");
  const titleInput = document.getElementById("task-title");
  const subjectInput = document.getElementById("task-subject");
  const priorityInput = document.getElementById("task-priority");
  const dueInput = document.getElementById("task-due-date");
  const pomoInput = document.getElementById("task-pomodoros");

  if (task) {
    title.textContent = "Edit Task";
    idInput.value = task.id;
    titleInput.value = task.title;
    subjectInput.value = task.subject;
    priorityInput.value = task.priority;
    dueInput.value = task.dueDate || "";
    pomoInput.value = task.pomodoros || 2;
  } else {
    title.textContent = "Add New Task";
    idInput.value = "";
    titleInput.value = "";
    dueInput.value = getLocalDateString();
    pomoInput.value = 2;
  }

  modal.classList.add("show");
  titleInput.focus();
}

function openSessionModal(session = null) {
  const modal = document.getElementById("modal-session");
  const title = document.getElementById("modal-session-title");
  const idInput = document.getElementById("session-id");
  const titleInput = document.getElementById("session-title");
  const subjectInput = document.getElementById("session-subject");
  const colorInput = document.getElementById("session-tag-color");
  const startInput = document.getElementById("session-start");
  const endInput = document.getElementById("session-end");
  const notesInput = document.getElementById("session-notes");

  if (session) {
    title.textContent = "Edit Study Session";
    idInput.value = session.id;
    titleInput.value = session.title;
    subjectInput.value = session.subject;
    colorInput.value = session.tagColor || "indigo";
    startInput.value = session.startTime;
    endInput.value = session.endTime;
    notesInput.value = session.notes || "";
  } else {
    title.textContent = "Add Study Session";
    idInput.value = "";
    titleInput.value = "";
    startInput.value = "09:00";
    endInput.value = "10:30";
    notesInput.value = "";
  }

  modal.classList.add("show");
  titleInput.focus();
}

function openSettingsModal() {
  const modal = document.getElementById("modal-settings");
  document.getElementById("settings-username").value = state.settings.username;
  document.getElementById("settings-school").value = state.settings.school;
  document.getElementById("settings-daily-goal").value = state.settings.dailyGoalHours;
  document.getElementById("settings-pomo-len").value = state.settings.pomoDuration;
  document.getElementById("settings-short-len").value = state.settings.shortBreakDuration;
  document.getElementById("settings-long-len").value = state.settings.longBreakDuration;

  modal.classList.add("show");
}

function closeModals() {
  document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.remove("show"));
}

function closeMobileSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.remove("mobile-open");
}

// ------------------------------------------------------------------------------
// 12. HELPERS & FORMATTERS
// ------------------------------------------------------------------------------

function formatTime12(time24) {
  if (!time24) return "";
  const parts = time24.split(":");
  let hours = parseInt(parts[0], 10);
  const mins = parts[1];
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${mins} ${ampm}`;
}

function formatShortDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ------------------------------------------------------------------------------
// 13. APP INITIALIZATION & EVENT LISTENERS
// ------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  // Set initial theme
  document.body.className = `theme-${state.settings.theme || 'dark'}`;
  const themeIcon = document.getElementById("theme-icon");
  if (themeIcon) {
    themeIcon.className = state.settings.theme === "light" ? "fa-solid fa-moon" : "fa-solid fa-sun";
  }

  // Live Date
  const dateEl = document.getElementById("live-date-string");
  if (dateEl) {
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  // Sidebar random quote
  const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  const quoteEl = document.getElementById("sidebar-quote");
  const authorEl = document.getElementById("sidebar-author");
  if (quoteEl) quoteEl.textContent = `"${randomQuote.text}"`;
  if (authorEl) authorEl.textContent = `— ${randomQuote.author}`;

  // Initialize Controllers
  timerController = new TimerController();
  taskManager = new TaskManager();
  plannerController = new PlannerController();
  notesController = new NotesController();

  // Navigation tab clicks
  document.querySelectorAll(".sidebar-nav .nav-item").forEach(item => {
    item.addEventListener("click", () => {
      switchView(item.dataset.view);
    });
  });

  // Top Dashboard quick links
  const dashPlannerLink = document.getElementById("dash-view-planner-link");
  if (dashPlannerLink) dashPlannerLink.addEventListener("click", () => switchView("planner"));

  const dashTasksLink = document.getElementById("dash-view-tasks-link");
  if (dashTasksLink) dashTasksLink.addEventListener("click", () => switchView("tasks"));

  const dashQuickTask = document.getElementById("dash-quick-task-btn");
  if (dashQuickTask) dashQuickTask.addEventListener("click", () => openTaskModal());

  const heroNewTask = document.getElementById("hero-new-task-btn");
  if (heroNewTask) heroNewTask.addEventListener("click", () => openTaskModal());

  // Mobile menu buttons
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const sidebarCloseBtn = document.getElementById("sidebar-close-btn");
  const sidebar = document.getElementById("sidebar");

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      sidebar.classList.add("mobile-open");
    });
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener("click", () => {
      sidebar.classList.remove("mobile-open");
    });
  }

  // Theme toggle button
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const isDark = document.body.classList.contains("theme-dark");
      const newTheme = isDark ? "light" : "dark";
      document.body.className = `theme-${newTheme}`;
      themeIcon.className = newTheme === "light" ? "fa-solid fa-moon" : "fa-solid fa-sun";
      state.settings.theme = newTheme;
      state.save("studybuddy_settings", state.settings);
      showToast(`Switched to ${newTheme} mode`, "info");
    });
  }

  // Ambient sound dropdown toggle
  const soundToggleBtn = document.getElementById("sound-toggle-btn");
  const soundMenu = document.getElementById("sound-dropdown-menu");

  if (soundToggleBtn && soundMenu) {
    soundToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      soundMenu.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!soundMenu.contains(e.target) && e.target !== soundToggleBtn) {
        soundMenu.classList.remove("show");
      }
    });
  }

  // Sound option selections
  document.querySelectorAll(".sound-option").forEach(btn => {
    btn.addEventListener("click", () => {
      sounds.playAmbient(btn.dataset.sound);
      soundMenu.classList.remove("show");
    });
  });

  // Sound preset pills in timer view
  document.querySelectorAll(".sound-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      sounds.playAmbient(pill.dataset.preset);
    });
  });

  // Volume slider
  const volumeSlider = document.getElementById("ambient-volume");
  if (volumeSlider) {
    volumeSlider.addEventListener("input", (e) => {
      sounds.setVolume(e.target.value / 100);
    });
  }

  // Topbar Quick Add button & modal
  const globalAddBtn = document.getElementById("global-add-btn");
  const modalQuickAdd = document.getElementById("modal-quick-add");
  const closeQuickAdd = document.getElementById("close-quick-add-modal");

  if (globalAddBtn && modalQuickAdd) {
    globalAddBtn.addEventListener("click", () => {
      modalQuickAdd.classList.add("show");
    });
  }

  if (closeQuickAdd) {
    closeQuickAdd.addEventListener("click", () => {
      modalQuickAdd.classList.remove("show");
    });
  }

  document.getElementById("quick-add-task-choice")?.addEventListener("click", () => {
    closeModals();
    openTaskModal();
  });

  document.getElementById("quick-add-session-choice")?.addEventListener("click", () => {
    closeModals();
    openSessionModal();
  });

  document.getElementById("quick-add-note-choice")?.addEventListener("click", () => {
    closeModals();
    switchView("notes");
    notesController.createNote();
  });

  // Settings Modal Triggers
  const openSettingsBtn = document.getElementById("open-settings-btn");
  if (openSettingsBtn) {
    openSettingsBtn.addEventListener("click", () => openSettingsModal());
  }

  const settingsForm = document.getElementById("settings-form");
  if (settingsForm) {
    settingsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      state.settings.username = document.getElementById("settings-username").value.trim() || "Student";
      state.settings.school = document.getElementById("settings-school").value.trim() || "Student";
      state.settings.dailyGoalHours = parseFloat(document.getElementById("settings-daily-goal").value) || 4;
      state.settings.pomoDuration = parseInt(document.getElementById("settings-pomo-len").value, 10) || 25;
      state.settings.shortBreakDuration = parseInt(document.getElementById("settings-short-len").value, 10) || 5;
      state.settings.longBreakDuration = parseInt(document.getElementById("settings-long-len").value, 10) || 15;

      state.save("studybuddy_settings", state.settings);
      closeModals();
      timerController.setMode(timerController.mode);
      renderDashboard();
      showToast("Preferences saved!", "success");
    });
  }

  // Reset to factory defaults button
  const resetBtn = document.getElementById("reset-data-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Are you sure? This will reset all your tasks, planner blocks, and settings back to initial sample defaults.")) {
        state.resetDefaults();
        taskManager.render();
        plannerController.render();
        notesController.render();
        timerController.setMode("pomodoro");
        renderDashboard();
        updateBadges();
        closeModals();
        showToast("StudyBuddy reset to default sample data!", "info");
      }
    });
  }

  // Generic modal close buttons & clicking backdrop
  document.querySelectorAll(".modal-close-btn, #cancel-task-btn, #cancel-session-btn, #cancel-settings-btn").forEach(btn => {
    btn.addEventListener("click", () => closeModals());
  });

  document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModals();
    });
  });

  // Initial UI Render
  renderDashboard();
  updateBadges();
});

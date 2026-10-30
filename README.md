# 🎓 StudyBuddy — Modern Student Productivity Hub

Welcome to **StudyBuddy**, a beautiful, modern, and comprehensive student productivity web application built with clean, modern HTML5, CSS3, and Vanilla JavaScript.

Designed specifically for students, StudyBuddy unifies your **Daily Planner**, **Task Checklist**, **Pomodoro Focus Timer**, and **Analytics Dashboard** into a single, cohesive, distraction-free workspace.

---

## 🚀 How to Run (Beginner-Friendly)

Because StudyBuddy is built with pure web technologies (no node modules, no build steps, and no extra installations required), you can run it in seconds!

### Method 1: The Quickest Way (Double-Click)
1. Open the folder:
   ```
   c:\Users\Anirudh Bhatnagar\OneDrive\Desktop\hackathon practice
   ```
2. Find the file named **`index.html`**.
3. **Double-click `index.html`** (or right-click → *Open with* → Google Chrome, Microsoft Edge, Brave, or Firefox).
4. That's it! StudyBuddy will open right in your web browser.

---

### Method 2: Using VS Code "Live Server" (Recommended for Development)
If you are using Visual Studio Code:
1. Open the folder in VS Code (`File > Open Folder...`).
2. Install the **Live Server** extension (by Ritwick Dey) from the Extensions marketplace (`Ctrl + Shift + X`).
3. Right-click on `index.html` and select **"Open with Live Server"**.
4. A local web server will spin up automatically at `http://127.0.0.1:5500`.

---

### Method 3: Using Python (Optional Command Line)
If you have Python installed, you can launch a local server with a simple command:
1. Open PowerShell or Command Prompt in this folder.
2. Run:
   ```bash
   python -m http.server 8000
   ```
3. Open your browser and navigate to `http://localhost:8000`.

---

## ✨ Features Overview

### 1. 📊 Interactive Dashboard
- **Personalized Greeting**: Dynamic greeting ("Good morning / afternoon / evening, Alex!") with custom student name and major.
- **Live Key Metrics**:
  - ⏱️ **Focus Time Today**: Tracks your logged study time against your daily target (e.g. `1h 45m / 4h goal`).
  - ✅ **Tasks Finished**: Real-time completion percentage and progress bar.
  - 🔥 **Study Streak**: Keeps you motivated with an active day-streak counter.
  - ⚡ **Productivity Rating**: Automatically calculated based on completed tasks and focus sessions.
- **Today's Schedule Preview**: Shows your next upcoming study blocks with one-click Pomodoro launch.
- **Priority Tasks Preview**: Directly check off your most urgent tasks right from the dashboard.
- **Daily Motivational Quote**: Rotating inspirational quote from thinkers like Cal Newport, Picasso, and Churchill.

---

### 2. 📅 Daily Study Planner
- **Time Block Scheduling**: Add structured sessions (e.g., 09:00 AM – 10:30 AM) with title, subject, notes, and custom color accents (Indigo, Emerald, Purple, Amber, Crimson).
- **Date Navigation**: Browse past or upcoming days using `<` and `>`, or jump back to **Today** in one click.
- **Subject Filtering**: Filter your view by Computer Science, Mathematics, Physics, Literature, or General Revision.
- **Direct Focus Integration**: Click the **"Focus"** button on any study block to immediately launch the Pomodoro timer with that session as your target!

---

### 3. ✅ Task Checklist
- **Rich Task Metadata**: Assign subjects, due dates, estimated Pomodoro sessions (🍅), and priority badges (High 🔴, Medium 🟡, Low 🟢).
- **Interactive Checkboxes**: Complete tasks with animated strike-throughs and a festive **canvas confetti explosion**!
- **Search & Filters**: Instant live search by keyword, filter by status (All / Pending / Completed), or filter by priority.
- **Overall Progress Banner**: Live visual progress bar showing your exact completion percentage.

---

### 4. ⏱️ Study & Pomodoro Timer
- **Three Modes**:
  - 🧠 **Pomodoro** (25 minutes deep focus)
  - ☕ **Short Break** (5 minutes relaxation)
  - 🛋️ **Long Break** (15 minutes recovery)
- **Circular SVG Countdown Ring**: Smooth visual progress ring displaying time remaining.
- **Cycle Tracker**: Visual dots track your 4-pomodoro cycle sets.
- **Custom Goal Tag**: Set and edit what specific topic you are currently concentrating on.
- **Synthesized Ambient Soundscapes (Offline)**:
  - 🌧️ *Gentle Rain* (Pink noise synthesis)
  - 💨 *White Noise / Breeze*
  - 🌊 *Ocean Waves* (LFO-modulated rhythmic waves)
  - 🪐 *Deep Focus Drone* (Harmonic sine waves)
  - *Note: These sounds are generated on-the-fly using the Web Audio API without requiring any external audio files!*
- **Pleasant Chime**: Rings a gentle 4-note melodic arpeggio when your session finishes.

---

### 5. 📝 Quick Notes & Formula Scratchpad
- **Fast Idea Capture**: Keep lecture notes, important formulas, and cheat sheets handy.
- **Auto-Save**: Changes save instantaneously to `localStorage`.
- **Export to Markdown**: Download all your notes in clean `.md` format with one click.

---

### 6. ⚙️ Settings & Customization
- **Dark & Light Mode**: One-click toggle with smooth color transitions and persistent state.
- **Customizable Goals**: Change your name, degree, daily study goal in hours, and preferred Pomodoro durations.
- **Reset to Defaults**: Safely reset back to the starter sample data at any time.

---

## 📁 File Structure

```
hackathon practice/
│
├── index.html        # Clean, semantic structure with sidebar, topbar, and views
├── style.css         # Modern styling, responsive layout, dark/light themes & animations
├── app.js            # Modular JavaScript: state, timer, planner, tasks, notes & audio
└── README.md         # Documentation & guide
```

---

## 💡 Quick Tips for Beginners

1. **Where is my data saved?**
   All your tasks, schedule items, and notes are saved directly in your browser's `localStorage`. You can close the tab or refresh the page, and your progress will remain intact!
2. **Want to change your name?**
   Click on **"Settings & Goals"** at the bottom left of the sidebar, change the name to your own, and click **Save Settings**.
3. **Sound not playing?**
   Modern browsers require you to interact with the page (click any button or start the timer) before audio can play. Once you click "Start Focus" or choose an ambient soundscape, the audio will activate immediately.

---

*Enjoy studying with StudyBuddy! Stay focused, stay consistent, and achieve your academic goals!* 🚀

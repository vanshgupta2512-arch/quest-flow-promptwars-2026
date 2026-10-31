# 🎮 QUESTFLOW AI – Play Your Tasks. Finish Your Life.

> **Google for Developers × PromptWars 2026 Hackathon Submission**  
> *Transforming boring digital chores into fast-paced games where playing triggers real-world background execution.*

---

## ⚡ The Core Problem & Innovation

People constantly procrastinate on repetitive digital chores:
- Thousands of unread and promotional emails piling up.
- Messy download folders and duplicate files consuming disk space.
- Unmonitored bank statements with sneaky recurring subscriptions.
- Codebases riddled with security leaks, lint errors, and dead code.

**QUESTFLOW AI solves this with a radical paradigm shift:**
> **While users play fast-paced arcade minigames, the actual digital task executes in the background.**

Completing a game mission does not just award imaginary points—it translates the player's gameplay choices into an **Action Manifest**, prompts for **Human-in-the-Loop approval**, and executes real operations with verifiable audit receipts. **XP is only awarded after the backend confirms successful execution.**

---

## 🕹️ The 4 Productivity Arenas

### 1. ✉️ Inbox Quest (Email Cleaning Game)
- **Gameplay**: Arcade Tinder-style / keyboard speed sorter (`A` = Archive, `D` = Keep, `W` = Unsubscribe, `S` = Quarantine Spam).
- **Real Task Execution**: Connects to Gmail API OAuth 2.0 (or realistic sandbox demo). Batches archive requests, labels promotional emails, and executes automated newsletter unsubscriptions.
- **Safety**: Generates an Action Manifest for confirmation prior to execution.

### 2. 📁 File Frenzy (Drag & Drop File Sorter)
- **Gameplay**: Conveyor-belt sorting game where incoming clutter files are dragged into destination portals (`Financial`, `Media`, `Code`, `Documents`, `Duplicates`).
- **Real Task Execution**: Real filesystem organizer that moves files into clean categorized directories on disk and Google Drive.
- **Duplicate Hunter**: Computes SHA-256 byte hashes to detect 100% duplicate files and purges redundants.

### 3. 💳 Money Mission (Expense Anomaly Detective)
- **Gameplay**: High-speed transaction triage inspecting bank and credit card records.
- **Real Task Execution**: Detects recurring ghost subscriptions (e.g. gyms unused for 60+ days) and foreign anomalies, generating an audited double-entry ledger and downloadable CSV report.
- **Safety Guarantee**: Acts purely as an auditor. Never initiates payments or bank transfers.

### 4. 👾 Bug Hunter (AST Lint & Security Remediation)
- **Gameplay**: Cyberpunk code terminal where players identify vulnerabilities and apply AST patches.
- **Real Task Execution**: Flags credential leaks (`console.log(token)`), dangerous `eval()` Remote Code Execution, SQL string concatenation, and unused variables. Shows a side-by-side git diff and applies syntax-verified patches to files.

---

## 🤖 AI Command Centre (Google Gemini)

Powered by **Google Gemini API** (`gemini-1.5-flash`), the AI Command Centre accepts free-form natural language goals:
```
"Clean my inbox and organize all promotional emails from last month."
"Tidy up my downloads folder and remove duplicate screenshots."
"Review my last quarter expenses and find sneaky subscriptions."
```

Gemini decomposes the high-level intent into structured game missions:
- Target action & count
- Estimated completion time
- Difficulty rating & XP reward
- One-click **LAUNCH ARENA** button into the corresponding game.
- *Resilient Fallback*: If no `GEMINI_API_KEY` is provided, a built-in cognitive reasoning engine parses commands out of the box with zero configuration!

---

## 🏆 Gamification Architecture

- **Experience Points (XP) & Levels**: Exponential leveling curve ($Level = \lfloor\sqrt{XP / 100}\rfloor + 1$).
- **7-Day Consistency Streaks**: Dynamic streak counter with fire animations and XP multipliers.
- **Daily Operations**: Refreshed daily quests rewarding consistent habit formation.
- **Achievement Showcase**: Unlockable badges with custom cyber aesthetics across RARE, EPIC, LEGENDARY, and MYTHIC tiers.
- **Competitive Global Leaderboard**: Live ranking comparing hackers based on real tasks completed.
- **Retro Web Audio Synthesizer**: Pure Web Audio API synthesized sound effects (swipes, laser zaps, score chimes, level-up fanfares) with global mute control.

---

## 🔒 Security & Human-in-the-Loop Safety

1. **Two-Phase Execution Loop**:
   - *Phase 1 (Gameplay)*: High-speed classification generates proposed actions.
   - *Phase 2 (Audit & Verification)*: User reviews itemized checklist with destructive action warnings.
2. **Cryptographic Audit Receipts**:
   - Every completed task logs an audit receipt ID (e.g., `RCPT-GMAIL-9042`, `RCPT-FS-8192`) with timestamp and status confirmation.
3. **Rollback & Safety Settings**:
   - Strict Human-in-the-Loop mode is enabled by default to ensure zero accidental file deletions.

---

## 🚀 Quickstart & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/questflow-ai.git
cd questflow-ai

# Install all backend and frontend dependencies
npm run install:all
```

### Running the Application
```bash
# Build the production frontend bundle
cd client && npm run build && cd ..

# Launch the unified backend and frontend
npm start
```
The application will be live at:
- **Web UI & API**: `http://localhost:3001` (or `http://localhost:5173` for Vite HMR dev server)

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Backend Express server port | `3001` |
| `GEMINI_API_KEY` | Google Gemini API key from Google AI Studio | *(Optional - Local AI fallback included)* |
| `GMAIL_CLIENT_ID` | OAuth 2.0 Client ID for Gmail | *(Optional - Sandbox demo included)* |
| `GMAIL_CLIENT_SECRET` | OAuth 2.0 Client Secret for Gmail | *(Optional)* |
| `DEMO_MODE` | Realistic interactive sandbox mode | `true` |
| `AUTO_APPROVE_SAFE_ACTIONS` | Skip approval for non-destructive tasks | `false` |

---

## 🧪 Testing the User Journey

1. **AI Task Decomposition**:
   - Navigate to **Gemini AI Core**.
   - Click the preset *"Clean promotional & spam emails"*.
   - Click **GENERATE GAME MISSIONS** to watch Gemini decompose the goal into 3 structured missions.
   - Click **LAUNCH** on the *Promotional Blitz* card.
2. **Play Inbox Quest**:
   - Swipe or use keyboard shortcuts (`A` = Archive, `D` = Keep, `W` = Unsubscribe, `S` = Quarantine).
   - Watch the score and combo multiplier increase.
   - Upon round completion, click **Review & Execute Real Actions**.
3. **Human-in-the-Loop Approval & Verification**:
   - Inspect the itemized checklist in the **Execution Manifest Modal**.
   - Click **Approve & Execute**.
   - Notice the live execution status transition to `COMPLETED` and receipt verification.
   - Watch your verified XP increase and trigger the **Level Up celebration**!
4. **Try File Frenzy, Money Mission, and Bug Hunter**:
   - Drag files into folder portals to organize real files and purge SHA-256 duplicate clutter.
   - Audit expenses, discover recurring ghost subscriptions, and export cleaned CSVs.
   - Inspect code vulnerabilities, preview AST diffs, and apply syntax patches.

---

## 🛡️ Hackathon Team

- **Product & System Architecture**: Vansh Gupta
- **Competition**: Google for Developers × PromptWars 2026
- **Status**: Production-Ready Live Demonstration

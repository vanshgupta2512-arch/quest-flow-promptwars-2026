// Mock & Default Datasets for QUESTFLOW AI
// Provides rich, realistic data for Inbox Quest, File Frenzy, Money Mission, Bug Hunter, and Daily Missions

export const INITIAL_PLAYER = {
  id: "user_cyber_01",
  name: "CyberOperative",
  callsign: "Vansh Gupta",
  level: 4,
  xp: 1350,
  nextLevelXp: 2000,
  streakDays: 7,
  productivityScore: 88,
  tasksCompleted: 42,
  emailsCleaned: 184,
  filesOrganized: 67,
  expensesAudited: 53,
  bugsEliminated: 29,
  settings: {
    demoMode: true,
    soundEnabled: true,
    geminiApiKey: "",
    gmailConnected: false,
    gdriveConnected: false,
    autoApproveSafeActions: false
  }
};

export const MOCK_EMAILS = [
  {
    id: "msg_001",
    sender: "no-reply@megadeals-weekly.com",
    senderName: "MegaDeals Flash Sale",
    subject: "🔥 80% OFF Flash Sale ends in 2 hours! Don't miss out",
    snippet: "Exclusive gadget discounts on cyber wearables, neon keyboards, and smart mugs...",
    date: "10 mins ago",
    category: "Promotional",
    recommendedAction: "archive",
    size: "142 KB",
    isUnread: true
  },
  {
    id: "msg_002",
    sender: "security@github.com",
    senderName: "GitHub Security",
    subject: "[Security Alert] Personal access token expiration warning",
    snippet: "Your personal access token 'questflow-deploy' will expire in 7 days. Please regenerate...",
    date: "45 mins ago",
    category: "Important",
    recommendedAction: "keep",
    size: "24 KB",
    isUnread: true
  },
  {
    id: "msg_003",
    sender: "crypto-rewards-win-now@suspicious-domain-x.xyz",
    senderName: "Crypto Lottery Club",
    subject: "CLAIM 2.45 ETH INSTANTLY - YOU WERE SELECTED IN OUR DRAW",
    snippet: "Congratulations user! Click this unverified link immediately to connect your Web3 wallet...",
    date: "2 hours ago",
    category: "Spam",
    recommendedAction: "trash",
    size: "512 KB",
    isUnread: true
  },
  {
    id: "msg_004",
    sender: "newsletter@tldr.tech",
    senderName: "TLDR Tech Digest",
    subject: "TLDR: Google Gemini 2.0 announced & next-gen AI agent benchmarks",
    snippet: "Today in tech: Gemini expands reasoning multimodal capabilities, new agent architectures emerge...",
    date: "4 hours ago",
    category: "Promotional",
    recommendedAction: "unsubscribe",
    size: "88 KB",
    isUnread: true
  },
  {
    id: "msg_005",
    sender: "billing@stripe.com",
    senderName: "Stripe Invoicing",
    subject: "Receipt for Invoice #STR-90421 - QuestFlow Cloud Cluster",
    snippet: "Your payment of $49.00 USD to Cloud Hosting Services was successful. Download your tax invoice...",
    date: "Yesterday",
    category: "Important",
    recommendedAction: "keep",
    size: "35 KB",
    isUnread: false
  },
  {
    id: "msg_006",
    sender: "promo@streamflix-deals.net",
    senderName: "StreamFlix Updates",
    subject: "New series dropping this weekend: Cyber Runners Season 3",
    snippet: "Grab your popcorn and stream in 4K HDR. Check out what is trending in your region...",
    date: "Yesterday",
    category: "Promotional",
    recommendedAction: "archive",
    size: "210 KB",
    isUnread: true
  },
  {
    id: "msg_007",
    sender: "phish-alert-service@bank-secure-login-attempt.tk",
    senderName: "Immediate Action Required",
    subject: "URGENT: Your bank account is locked due to suspicious activity",
    snippet: "We detected unauthorized access from IP 192.168.1.1. Enter your SSN and password to unlock...",
    date: "2 days ago",
    category: "Spam",
    recommendedAction: "trash",
    size: "95 KB",
    isUnread: true
  },
  {
    id: "msg_008",
    sender: "updates@linkedin.com",
    senderName: "LinkedIn Job Alerts",
    subject: "14 new jobs match your alert for Senior AI Engineer / Full Stack Developer",
    snippet: "Companies like Google, Anthropic, and OpenAI are hiring developers with your skillset...",
    date: "3 days ago",
    category: "Promotional",
    recommendedAction: "archive",
    size: "64 KB",
    isUnread: false
  }
];

export const MOCK_FILES = [
  {
    id: "file_001",
    name: "Invoice_AWS_Oct_2026.pdf",
    size: "420 KB",
    type: "pdf",
    category: "Financial",
    suggestedFolder: "Financial & Invoices",
    hash: "a89f2d1e4",
    isDuplicate: false,
    reason: "Contains tax identification, billing line items, and invoice number."
  },
  {
    id: "file_002",
    name: "Screenshot_2026-10-15_at_14.22.png",
    size: "2.1 MB",
    type: "image",
    category: "Media",
    suggestedFolder: "Media & Screenshots",
    hash: "b77c3e4f1",
    isDuplicate: false,
    reason: "Desktop viewport capture with timestamp naming pattern."
  },
  {
    id: "file_003",
    name: "deploy_cluster_v2.sh",
    size: "4.2 KB",
    type: "code",
    category: "Code",
    suggestedFolder: "Code & Repositories",
    hash: "c99a1b2d3",
    isDuplicate: false,
    reason: "Bash deployment script containing Docker and Kubernetes manifests."
  },
  {
    id: "file_004",
    name: "NDA_Contract_Final_Signed.docx",
    size: "180 KB",
    type: "document",
    category: "Documents",
    suggestedFolder: "Legal & Documents",
    hash: "d44b8c9e0",
    isDuplicate: false,
    reason: "Legal confidentiality agreement containing signature clauses."
  },
  {
    id: "file_005",
    name: "Invoice_AWS_Oct_2026 (copy).pdf",
    size: "420 KB",
    type: "pdf",
    category: "Duplicates",
    suggestedFolder: "Duplicates (To Purge)",
    hash: "a89f2d1e4",
    isDuplicate: true,
    duplicateOf: "Invoice_AWS_Oct_2026.pdf",
    reason: "Exact 100% SHA-256 byte match with file_001."
  },
  {
    id: "file_006",
    name: "Q3_Financial_Summary_2026.xlsx",
    size: "850 KB",
    type: "spreadsheet",
    category: "Financial",
    suggestedFolder: "Financial & Invoices",
    hash: "e55d2f8a1",
    isDuplicate: false,
    reason: "Spreadsheet with P&L ledgers, profit margins, and payroll projections."
  },
  {
    id: "file_007",
    name: "UI_Design_System_Mockup.fig",
    size: "18.4 MB",
    type: "media",
    category: "Media",
    suggestedFolder: "Media & Screenshots",
    hash: "f66e3a9b2",
    isDuplicate: false,
    reason: "Figma vector graphic design and component library."
  },
  {
    id: "file_008",
    name: "Screenshot_2026-10-15_at_14.22 (1).png",
    size: "2.1 MB",
    type: "image",
    category: "Duplicates",
    suggestedFolder: "Duplicates (To Purge)",
    hash: "b77c3e4f1",
    isDuplicate: true,
    duplicateOf: "Screenshot_2026-10-15_at_14.22.png",
    reason: "Exact 100% SHA-256 byte match with file_002."
  }
];

export const MOCK_EXPENSES = [
  {
    id: "exp_001",
    date: "2026-10-28",
    merchant: "Google Cloud Platform",
    amount: 142.50,
    category: "Software & Cloud",
    type: "Business Necessity",
    status: "Verified",
    isRecurring: true,
    isAnomaly: false,
    flagReason: null
  },
  {
    id: "exp_002",
    date: "2026-10-27",
    merchant: "SuperGym Luxury Fitness",
    amount: 129.99,
    category: "Health & Fitness",
    type: "Subscription",
    status: "Needs Review",
    isRecurring: true,
    isAnomaly: true,
    flagReason: "Unused for 62 days! Potential ghost subscription."
  },
  {
    id: "exp_003",
    date: "2026-10-26",
    merchant: "Tokyo VIP Casino Lounge",
    amount: 850.00,
    category: "Entertainment",
    type: "Anomaly",
    status: "Needs Review",
    isRecurring: false,
    isAnomaly: true,
    flagReason: "Unusual high-value foreign transaction outside regular travel patterns."
  },
  {
    id: "exp_004",
    date: "2026-10-24",
    merchant: "GitHub Copilot Enterprise",
    amount: 19.00,
    category: "Developer Tools",
    type: "Business Necessity",
    status: "Verified",
    isRecurring: true,
    isAnomaly: false,
    flagReason: null
  },
  {
    id: "exp_005",
    date: "2026-10-22",
    merchant: "StreamFlix Mega Ultra 4K",
    amount: 24.99,
    category: "Streaming & Media",
    type: "Subscription",
    status: "Needs Review",
    isRecurring: true,
    isAnomaly: false,
    flagReason: "Subscription renewed automatically."
  },
  {
    id: "exp_006",
    date: "2026-10-20",
    merchant: "Whole Foods Organic Market",
    amount: 78.40,
    category: "Groceries",
    type: "Personal Necessity",
    status: "Verified",
    isRecurring: false,
    isAnomaly: false,
    flagReason: null
  },
  {
    id: "exp_007",
    date: "2026-10-18",
    merchant: "SaaS Mystery Domain Ltd",
    amount: 49.00,
    category: "Software",
    type: "Subscription",
    status: "Needs Review",
    isRecurring: true,
    isAnomaly: true,
    flagReason: "Unknown merchant ID billing for 4 consecutive months."
  }
];

export const MOCK_CODE_SNIPPETS = [
  {
    id: "code_001",
    file: "auth/sessionController.js",
    language: "javascript",
    code: `function authenticateUser(req, res) {
  const token = req.headers['authorization'];
  console.log("DEBUG: received token: " + token); // BUG: Token leakage in logs
  
  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  // Dangerous eval used for legacy claims
  const claims = eval("(" + req.body.rawClaims + ")"); // BUG: Remote code execution vulnerability

  return res.json({ status: "success", user: claims.user });
}`,
    fixedCode: `function authenticateUser(req, res) {
  const token = req.headers['authorization'];
  // Token logging removed for security compliance
  
  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  // Safe JSON parsing without eval vulnerability
  let claims;
  try {
    claims = JSON.parse(req.body.rawClaims);
  } catch (err) {
    return res.status(400).json({ error: "Invalid claims payload" });
  }

  return res.json({ status: "success", user: claims.user });
}`,
    bugs: [
      { line: 3, type: "security", message: "Sensitive credential logging: Token leaked to stdout." },
      { line: 9, type: "critical", message: "Dangerous eval() usage allows arbitrary Remote Code Execution." }
    ],
    difficulty: "EASY",
    xpReward: 80
  },
  {
    id: "code_002",
    file: "analytics/userMetrics.ts",
    language: "typescript",
    code: `export async function calculateMetrics(userId: string) {
  let unusedVar = 42; // BUG: Unused variable
  const rawData = await fetchUserData(userId);
  
  // Missing error handling on async promise
  const results = rawData.map((item: any) => {
    return item.value * 2;
  });

  return results;
}`,
    fixedCode: `export async function calculateMetrics(userId: string) {
  try {
    const rawData = await fetchUserData(userId);
    
    const results = rawData.map((item: any) => {
      return item.value * 2;
    });

    return results;
  } catch (error) {
    console.error("Failed to calculate user metrics:", error);
    return [];
  }
}`,
    bugs: [
      { line: 2, type: "lint", message: "'unusedVar' is declared but its value is never read (no-unused-vars)." },
      { line: 3, type: "stability", message: "Async operation missing try/catch boundary." }
    ],
    difficulty: "MEDIUM",
    xpReward: 100
  },
  {
    id: "code_003",
    file: "database/queryBuilder.py",
    language: "python",
    code: `def get_user_by_email(email):
    # SQL Injection Vulnerability
    query = f"SELECT * FROM users WHERE email = '{email}' AND is_active = 1"
    cursor.execute(query)
    return cursor.fetchone()`,
    fixedCode: `def get_user_by_email(email):
    # Parameterized SQL query preventing injection
    query = "SELECT * FROM users WHERE email = %s AND is_active = 1"
    cursor.execute(query, (email,))
    return cursor.fetchone()`,
    bugs: [
      { line: 3, type: "critical", message: "Raw SQL string interpolation allows SQL Injection attacks." }
    ],
    difficulty: "MEDIUM",
    xpReward: 90
  }
];

export const MOCK_DAILY_MISSIONS = [
  {
    id: "daily_01",
    title: "Inbox Zero Vanguard",
    description: "Triage and clean at least 5 promotional or spam emails.",
    targetGame: "inbox-quest",
    current: 3,
    target: 5,
    xpReward: 150,
    completed: false
  },
  {
    id: "daily_02",
    title: "Digital Purifier",
    description: "Detect and purge 2 duplicate clutter files in File Frenzy.",
    targetGame: "file-frenzy",
    current: 1,
    target: 2,
    xpReward: 120,
    completed: false
  },
  {
    id: "daily_03",
    title: "Subscription Slayer",
    description: "Review and audit 3 recurring expense items in Money Mission.",
    targetGame: "money-mission",
    current: 3,
    target: 3,
    xpReward: 180,
    completed: true
  },
  {
    id: "daily_04",
    title: "Vulnerability Extinguisher",
    description: "Identify and patch 2 critical security bugs in Bug Hunter.",
    targetGame: "bug-hunter",
    current: 0,
    target: 2,
    xpReward: 200,
    completed: false
  }
];

export const MOCK_ACHIEVEMENTS = [
  {
    id: "ach_01",
    name: "Zero Inbox Prodigy",
    description: "Cleaned over 100 unread promotional emails.",
    category: "Inbox",
    icon: "MailCheck",
    unlocked: true,
    unlockedAt: "2026-10-29",
    rarity: "EPIC",
    xpBonus: 250
  },
  {
    id: "ach_02",
    name: "Folder Architect",
    description: "Organized 50 files into structured directories.",
    category: "Files",
    icon: "FolderGit2",
    unlocked: true,
    unlockedAt: "2026-10-30",
    rarity: "RARE",
    xpBonus: 150
  },
  {
    id: "ach_03",
    name: "Ghost Buster",
    description: "Found and flagged 5 unused recurring subscriptions.",
    category: "Finance",
    icon: "ShieldAlert",
    unlocked: true,
    unlockedAt: "2026-10-31",
    rarity: "LEGENDARY",
    xpBonus: 350
  },
  {
    id: "ach_04",
    name: "Cyber Sentinel",
    description: "Fixed 10 critical code vulnerabilities.",
    category: "Security",
    icon: "BugOff",
    unlocked: false,
    unlockedAt: null,
    rarity: "LEGENDARY",
    xpBonus: 500
  },
  {
    id: "ach_05",
    name: "AI Prompt Master",
    description: "Decomposed 20 custom goals using the Gemini AI Command Centre.",
    category: "AI",
    icon: "Sparkles",
    unlocked: true,
    unlockedAt: "2026-10-28",
    rarity: "RARE",
    xpBonus: 200
  },
  {
    id: "ach_06",
    name: "7-Day Streak Sovereign",
    description: "Maintained a 7-day continuous productivity streak.",
    category: "Habit",
    icon: "Flame",
    unlocked: true,
    unlockedAt: "2026-10-31",
    rarity: "MYTHIC",
    xpBonus: 600
  }
];

export const MOCK_LEADERBOARD = [
  { rank: 1, name: "NeoMatrix_X", level: 12, xp: 8420, tasks: 210, badge: "⚡ Grandmaster" },
  { rank: 2, name: "DevZero_Pro", level: 9, xp: 5890, tasks: 165, badge: "🛡️ Cyber Knight" },
  { rank: 3, name: "Vansh Gupta (You)", level: 4, xp: 1350, tasks: 42, badge: "🚀 Operative", isUser: true },
  { rank: 4, name: "ByteHunter99", level: 4, xp: 1280, tasks: 39, badge: "🎯 Scout" },
  { rank: 5, name: "AsyncKitten", level: 3, xp: 950, tasks: 28, badge: "🌱 Apprentice" }
];

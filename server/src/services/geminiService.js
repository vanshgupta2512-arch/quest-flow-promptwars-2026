// Gemini AI Integration Service with Intelligent Fallback Heuristics
import { GoogleGenerativeAI } from '@google/generative-ai';

let geminiClient = null;

export function initGemini(apiKey) {
  if (apiKey && apiKey.trim() !== '') {
    try {
      geminiClient = new GoogleGenerativeAI(apiKey.trim());
      console.log('✅ Google Gemini API client initialized successfully.');
      return true;
    } catch (err) {
      console.error('❌ Failed to initialize Google Gemini client:', err.message);
    }
  }
  geminiClient = null;
  return false;
}

// Automatically initialize if env var exists
if (process.env.GEMINI_API_KEY) {
  initGemini(process.env.GEMINI_API_KEY);
}

/**
 * Natural language task decomposition into structured game missions.
 */
export async function decomposeTaskWithGemini(userPrompt, apiKey = null) {
  const activeKey = apiKey || process.env.GEMINI_API_KEY;
  
  if (activeKey) {
    try {
      const client = new GoogleGenerativeAI(activeKey);
      const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

      const systemPrompt = `You are the AI Command Core of QUESTFLOW AI, an intelligent productivity gamification system.
Your mission is to analyze the user's natural language productivity goal and decompose it into 2 to 4 interactive game missions.
Available game modes:
1. "inbox-quest" (for email cleaning, unread inbox, unsubscribing, newsletters, spam)
2. "file-frenzy" (for organizing downloads, documents, desktop clutter, duplicate files, folders)
3. "money-mission" (for reviewing expenses, bank statements, auditing subscriptions, detecting unusual charges)
4. "bug-hunter" (for code cleanup, linting, debugging, fixing vulnerabilities, refactoring)

Return ONLY valid JSON with this exact structure, without any markdown formatting or commentary:
{
  "summary": "Brief summary of the operation plan",
  "recommendedGame": "inbox-quest" | "file-frenzy" | "money-mission" | "bug-hunter",
  "estimatedTimeMinutes": 5,
  "totalPotentialXp": 250,
  "missions": [
    {
      "id": "mission_1",
      "game": "inbox-quest",
      "title": "Clear Promotional Clutter",
      "description": "Identify and batch-archive promotional emails from the past 30 days.",
      "targetAction": "Archive 15 emails",
      "difficulty": "EASY" | "MEDIUM" | "HARD",
      "xp": 100,
      "parameters": {
        "filter": "category:promotions",
        "action": "archive"
      }
    }
  ],
  "safetyAdvisory": "Inform user that destructive operations require explicit pre-execution approval."
}`;

      const result = await model.generateContent([systemPrompt, `User Command: "${userPrompt}"`]);
      const responseText = result.response.text();
      
      // Clean possible markdown code fences
      const cleaned = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (err) {
      console.warn("⚠️ Gemini API invocation failed, falling back to local cognitive engine:", err.message);
    }
  }

  // High-fidelity local AI reasoning fallback
  return generateLocalAIPlan(userPrompt);
}

function generateLocalAIPlan(prompt) {
  const p = prompt.toLowerCase();
  
  if (p.includes('email') || p.includes('inbox') || p.includes('mail') || p.includes('newsletter') || p.includes('unread')) {
    return {
      summary: "Decomposed email triage and inbox purification plan",
      recommendedGame: "inbox-quest",
      estimatedTimeMinutes: 4,
      totalPotentialXp: 220,
      missions: [
        {
          id: "m_inbox_01",
          game: "inbox-quest",
          title: "Promotional Blitz",
          description: "Archive promotional deals and automated marketing emails.",
          targetAction: "Archive 5 promotional emails",
          difficulty: "EASY",
          xp: 80,
          parameters: { filter: "promotional", action: "archive" }
        },
        {
          id: "m_inbox_02",
          game: "inbox-quest",
          title: "Spam Annihilator",
          description: "Detect phishing links and unverified lottery emails.",
          targetAction: "Trash 2 suspicious spam messages",
          difficulty: "MEDIUM",
          xp: 90,
          parameters: { filter: "spam", action: "trash" }
        },
        {
          id: "m_inbox_03",
          game: "inbox-quest",
          title: "Subscription Freedom",
          description: "Identify redundant newsletters and unsubscribe.",
          targetAction: "Unsubscribe from 1 automated newsletter",
          difficulty: "EASY",
          xp: 50,
          parameters: { filter: "newsletter", action: "unsubscribe" }
        }
      ],
      safetyAdvisory: "All email actions generate an approval manifest. No email will be deleted without your manual confirmation."
    };
  }

  if (p.includes('file') || p.includes('download') || p.includes('folder') || p.includes('desktop') || p.includes('duplicate')) {
    return {
      summary: "Automated desktop & file directory organization pipeline",
      recommendedGame: "file-frenzy",
      estimatedTimeMinutes: 5,
      totalPotentialXp: 260,
      missions: [
        {
          id: "m_file_01",
          game: "file-frenzy",
          title: "Invoices to Vault",
          description: "Classify AWS & vendor invoices into Financial directory.",
          targetAction: "Organize 3 financial documents",
          difficulty: "EASY",
          xp: 90,
          parameters: { category: "Financial", folder: "Financial & Invoices" }
        },
        {
          id: "m_file_02",
          game: "file-frenzy",
          title: "Duplicate Hunter",
          description: "Identify identical byte-hash duplicates and purge redundants.",
          targetAction: "Detect and remove 2 duplicate files",
          difficulty: "MEDIUM",
          xp: 110,
          parameters: { filter: "duplicates", action: "purge" }
        },
        {
          id: "m_file_03",
          game: "file-frenzy",
          title: "Media Triage",
          description: "Group screenshots and design files into Media repository.",
          targetAction: "Relocate 2 media assets",
          difficulty: "EASY",
          xp: 60,
          parameters: { category: "Media", folder: "Media & Screenshots" }
        }
      ],
      safetyAdvisory: "File operations will show original paths and destination folders before any file is moved."
    };
  }

  if (p.includes('expense') || p.includes('money') || p.includes('spend') || p.includes('bank') || p.includes('subscription') || p.includes('audit')) {
    return {
      summary: "Financial audit & recurring subscription detection protocol",
      recommendedGame: "money-mission",
      estimatedTimeMinutes: 6,
      totalPotentialXp: 300,
      missions: [
        {
          id: "m_money_01",
          game: "money-mission",
          title: "Ghost Subscription Audit",
          description: "Review recurring monthly subscriptions with low usage.",
          targetAction: "Audit 3 active subscriptions",
          difficulty: "MEDIUM",
          xp: 120,
          parameters: { type: "Subscription" }
        },
        {
          id: "m_money_02",
          game: "money-mission",
          title: "Anomaly Sentinel",
          description: "Investigate unusual or high-value foreign transactions.",
          targetAction: "Flag 1 suspicious charge",
          difficulty: "HARD",
          xp: 130,
          parameters: { type: "Anomaly" }
        },
        {
          id: "m_money_03",
          game: "money-mission",
          title: "Tax Deductible Tagging",
          description: "Verify business software infrastructure vs personal groceries.",
          targetAction: "Categorize 2 business expenses",
          difficulty: "EASY",
          xp: 50,
          parameters: { type: "Business Necessity" }
        }
      ],
      safetyAdvisory: "Money Mission acts purely as an analytical auditor. No payments or banking transfers can ever be initiated."
    };
  }

  // Default to Code cleanup / General productive workflow
  return {
    summary: "Code quality overhaul and vulnerability remediation plan",
    recommendedGame: "bug-hunter",
    estimatedTimeMinutes: 5,
    totalPotentialXp: 270,
    missions: [
      {
        id: "m_code_01",
        game: "bug-hunter",
        title: "Credential Leak Sanitizer",
        description: "Eliminate stdout console.log statements exposing authorization tokens.",
        targetAction: "Fix 1 sensitive data leak",
        difficulty: "EASY",
        xp: 80,
        parameters: { rule: "no-console-token" }
      },
      {
        id: "m_code_02",
        game: "bug-hunter",
        title: "Remote Execution Defense",
        description: "Replace dangerous eval() statements with safe JSON schema validation.",
        targetAction: "Remediate 1 critical security flaw",
        difficulty: "HARD",
        xp: 140,
        parameters: { rule: "no-eval" }
      },
      {
        id: "m_code_03",
        game: "bug-hunter",
        title: "Lint Optimization",
        description: "Prune unused variables and inject async error handling.",
        targetAction: "Clean 1 dead code branch",
        difficulty: "MEDIUM",
        xp: 50,
        parameters: { rule: "no-unused-vars" }
      }
    ],
    safetyAdvisory: "Code fixes display a side-by-side git-style diff before files are modified."
  };
}

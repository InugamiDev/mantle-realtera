/**
 * Auto-translate script using Local LLM
 *
 * Supports:
 * - Ollama (default, free)
 * - LM Studio
 * - Any OpenAI-compatible local API
 *
 * Usage:
 *   # With Ollama (default)
 *   npx ts-node scripts/translate-local.ts
 *
 *   # With LM Studio
 *   LLM_BASE_URL=http://localhost:1234/v1 npx ts-node scripts/translate-local.ts
 *
 *   # Specify model
 *   LLM_MODEL=llama3.2 npx ts-node scripts/translate-local.ts
 *
 * Prerequisites:
 *   - Ollama: brew install ollama && ollama pull llama3.2
 *   - LM Studio: Download from lmstudio.ai
 */

import fs from "fs";
import path from "path";

const LOCALES_DIR = path.join(process.cwd(), "src/locales");
const VI_FILE = path.join(LOCALES_DIR, "vi.json");
const EN_FILE = path.join(LOCALES_DIR, "en.json");

// Configuration
const config = {
  // Ollama default, change for LM Studio or other
  baseUrl: process.env.LLM_BASE_URL || "http://localhost:11434/v1",
  model: process.env.LLM_MODEL || "llama3.2",
  // For non-OpenAI compatible APIs (like raw Ollama)
  useOllamaApi: process.env.USE_OLLAMA_API === "true",
};

interface TranslationObject {
  [key: string]: string | TranslationObject;
}

// Load JSON file
function loadJson(filePath: string): TranslationObject {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return {};
  }
}

// Save JSON file
function saveJson(filePath: string, data: TranslationObject): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

// Translate using Ollama native API
async function translateWithOllama(
  text: string,
  context: string
): Promise<string> {
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: config.model,
        prompt: `Translate this Vietnamese UI text to English. Keep it concise and professional for a real estate platform.
Context: ${context}
Vietnamese: ${text}
English:`,
        stream: false,
        options: {
          temperature: 0.3,
          num_predict: 100,
        },
      }),
    });

    const data = await response.json();
    return data.response?.trim() || text;
  } catch (error) {
    console.error("Ollama translation failed:", error);
    return text;
  }
}

// Translate using OpenAI-compatible API (LM Studio, Ollama OpenAI mode)
async function translateWithOpenAI(
  text: string,
  context: string
): Promise<string> {
  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: "system",
            content: `You are a translator. Translate Vietnamese to English for a real estate platform UI.
Keep translations concise, professional, and suitable for UI labels.
Only respond with the translation, nothing else.`,
          },
          {
            role: "user",
            content: `Context: ${context}\nVietnamese: ${text}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 100,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || text;
  } catch (error) {
    console.error("OpenAI-compatible API failed:", error);
    return text;
  }
}

// Main translate function
async function translate(text: string, context: string): Promise<string> {
  if (config.useOllamaApi) {
    return translateWithOllama(text, context);
  }
  return translateWithOpenAI(text, context);
}

// Find missing keys between source and target
function findMissingKeys(
  source: TranslationObject,
  target: TranslationObject,
  parentKey = ""
): { key: string; value: string }[] {
  const missing: { key: string; value: string }[] = [];

  for (const [key, value] of Object.entries(source)) {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof value === "object" && value !== null) {
      missing.push(
        ...findMissingKeys(
          value as TranslationObject,
          (target[key] as TranslationObject) || {},
          fullKey
        )
      );
    } else if (typeof value === "string" && !target[key]) {
      missing.push({ key: fullKey, value });
    }
  }

  return missing;
}

// Set nested value in object
function setNestedValue(
  obj: TranslationObject,
  path: string,
  value: string
): void {
  const keys = path.split(".");
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]] as TranslationObject;
  }

  current[keys[keys.length - 1]] = value;
}

// Check if LLM is available
async function checkLLMAvailable(): Promise<boolean> {
  try {
    if (config.useOllamaApi) {
      const res = await fetch("http://localhost:11434/api/tags");
      return res.ok;
    } else {
      const res = await fetch(`${config.baseUrl}/models`);
      return res.ok;
    }
  } catch {
    return false;
  }
}

// Main
async function main() {
  console.log("🌐 i18n Translation Sync (Local LLM)\n");
  console.log(`Config: ${config.baseUrl} / ${config.model}\n`);

  // Check LLM availability
  const llmAvailable = await checkLLMAvailable();
  if (!llmAvailable) {
    console.error("❌ Local LLM not available!");
    console.log("\nSetup options:");
    console.log("  1. Ollama: brew install ollama && ollama run llama3.2");
    console.log("  2. LM Studio: Download from https://lmstudio.ai");
    console.log(
      "\nThen set: LLM_BASE_URL=http://localhost:1234/v1 (for LM Studio)"
    );
    process.exit(1);
  }

  console.log("✅ LLM available\n");

  const vi = loadJson(VI_FILE);
  const en = loadJson(EN_FILE);

  // Find missing keys
  const missing = findMissingKeys(vi, en);

  if (missing.length === 0) {
    console.log("✅ All keys are synced!");
    return;
  }

  console.log(`📝 Found ${missing.length} missing keys:\n`);

  // Translate each missing key
  for (const { key, value } of missing) {
    process.stdout.write(`  Translating: ${key}... `);

    const translated = await translate(value, key);
    setNestedValue(en, key, translated);

    console.log(`"${translated}"`);

    // Small delay to avoid overwhelming local LLM
    await new Promise((r) => setTimeout(r, 100));
  }

  // Save
  saveJson(EN_FILE, en);
  console.log("\n✅ Saved to en.json");
}

main().catch(console.error);

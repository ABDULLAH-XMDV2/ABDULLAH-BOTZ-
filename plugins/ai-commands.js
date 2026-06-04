const { cmd } = require('../lib/command');
const axios = require('axios');
const config = require('../setting');

// ============ GROQ AI HELPER ============
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

async function askGroq(prompt, systemPrompt = "You are a helpful AI assistant. Reply concisely and clearly.", model = "llama3-8b-8192") {
  if (!GROQ_API_KEY) return "❌ *GROQ_API_KEY not set in config.env!*\n\nAdd: GROQ_API_KEY=your_key_here";
  try {
    const res = await axios.post(GROQ_URL, {
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 1024,
      temperature: 0.7
    }, {
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      timeout: 30000
    });
    return res.data.choices[0]?.message?.content || "No response from AI.";
  } catch (e) {
    if (e.response?.status === 401) return "❌ Invalid GROQ API Key!";
    if (e.response?.status === 429) return "⚠️ Rate limit hit, try again later.";
    return `❌ AI Error: ${e.message}`;
  }
}

// ============ MAIN AI COMMAND (gpt, chatgpt, ai, brain etc) ============
const aiAliases = ["chatgpt", "gpt", "gpt4", "gpt4o", "brain", "elite", "smart", "genius",
  "proai", "nova", "neo", "omega", "quantum", "apex", "vertex", "pulse", "zenith",
  "maxai", "ultra", "assistant", "talkAI", "elitegpt", "mscopilot", "elitecopilot",
  "copilot", "chatgptelite", "llama2", "llama3", "deepseek", "grokbeta",
  "mistral", "mixtral", "falcon", "bloom", "orca", "vicuna", "alpaca", "phi2",
  "wizard", "starling", "yi", "yi34b", "qwen", "command", "jurassic", "ai21",
  "solar", "lumin", "bard", "redpajama", "dolly", "gptneo", "gptj", "bloomz",
  "flant5", "codegen", "starcoder", "gpt3", "chatgptplus", "gpt4turbo",
  "palm2", "openassist", "hugging", "mathgpt", "grammar", "perplexity", "kimi"
];

cmd({
  pattern: "ai",
  alias: aiAliases,
  react: "🤖",
  desc: "Ask AI anything using Groq LLaMA",
  category: "ai",
  use: "<question>",
  filename: __filename
}, async (conn, mek, m, { from, pushname, args, reply, quoted }) => {
  try {
    let query = args.join(" ");
    if (!query && quoted?.text) query = quoted.text;
    if (!query) return reply("❌ *Please provide a question!*\n\n*Usage:* .ai What is the capital of Pakistan?");

    await conn.sendMessage(from, { react: { text: "🤔", key: mek.key } });
    const answer = await askGroq(query);

    const responseText = `╭──❍ *🤖 ABDULLAH-BOTZ AI* ❍──╮
│
├─❍ *User:* ${pushname}
├─❍ *Question:* ${query.substring(0, 100)}${query.length > 100 ? "..." : ""}
│
├─❍ *Answer:*
${answer}
│
╰──────────────────────❍

> _Powered by ABDULLAH-BOTZ × Groq LLaMA_ 🔰`;

    await conn.sendMessage(from, {
      image: { url: "https://files.catbox.moe/ymgwct.jpg" },
      caption: responseText
    }, { quoted: mek });

  } catch (e) {
    reply(`❌ Error: ${e.message}`);
  }
});

// ============ CLAUDE AI ============
cmd({
  pattern: "claude",
  alias: ["claude2", "claudeinstant"],
  react: "🧠",
  desc: "Ask Claude AI (via Groq)",
  category: "ai",
  use: "<question>",
  filename: __filename
}, async (conn, mek, m, { from, pushname, args, reply, quoted }) => {
  try {
    let query = args.join(" ");
    if (!query && quoted?.text) query = quoted.text;
    if (!query) return reply("❌ *Usage:* .claude <question>");
    await conn.sendMessage(from, { react: { text: "🧠", key: mek.key } });
    const answer = await askGroq(query, "You are Claude, an AI assistant by Anthropic. Be helpful, harmless, and honest.");
    reply(`╭──❍ *🧠 CLAUDE AI* ❍──╮\n│\n├─❍ *Q:* ${query.substring(0,80)}\n│\n├─❍ *A:*\n${answer}\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ × Claude_ 🔰`);
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ============ GEMINI AI ============
cmd({
  pattern: "gemini",
  react: "💎",
  desc: "Ask Gemini AI (via Groq)",
  category: "ai",
  use: "<question>",
  filename: __filename
}, async (conn, mek, m, { from, pushname, args, reply, quoted }) => {
  try {
    let query = args.join(" ");
    if (!query && quoted?.text) query = quoted.text;
    if (!query) return reply("❌ *Usage:* .gemini <question>");
    await conn.sendMessage(from, { react: { text: "💎", key: mek.key } });
    const answer = await askGroq(query, "You are Gemini, Google's advanced AI. Answer thoughtfully and accurately.");
    reply(`╭──❍ *💎 GEMINI AI* ❍──╮\n│\n├─❍ *Q:* ${query.substring(0,80)}\n│\n├─❍ *A:*\n${answer}\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ × Gemini_ 🔰`);
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ============ DEEPSEEK CODER ============
cmd({
  pattern: "deepseek",
  alias: ["deepseekcode", "deepseekcoder", "code", "codehelp"],
  react: "💻",
  desc: "DeepSeek Code AI for programming help",
  category: "ai",
  use: "<code question>",
  filename: __filename
}, async (conn, mek, m, { from, pushname, args, reply, quoted }) => {
  try {
    let query = args.join(" ");
    if (!query && quoted?.text) query = quoted.text;
    if (!query) return reply("❌ *Usage:* .deepseek <coding question>");
    await conn.sendMessage(from, { react: { text: "💻", key: mek.key } });
    const answer = await askGroq(query, "You are DeepSeek Coder, an expert programming AI. Provide clean, efficient code with explanations. Use proper formatting.", "llama3-70b-8192");
    reply(`╭──❍ *💻 DEEPSEEK CODER* ❍──╮\n│\n├─❍ *Q:* ${query.substring(0,80)}\n│\n├─❍ *Code:*\n${answer}\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ × DeepSeek_ 🔰`);
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ============ GRAMMAR FIX ============
cmd({
  pattern: "grammar",
  alias: ["fix", "grammarly"],
  react: "📝",
  desc: "Fix grammar of given text",
  category: "ai",
  use: "<text>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply, quoted }) => {
  try {
    let query = args.join(" ");
    if (!query && quoted?.text) query = quoted.text;
    if (!query) return reply("❌ *Usage:* .grammar <text to fix>");
    await conn.sendMessage(from, { react: { text: "📝", key: mek.key } });
    const answer = await askGroq(`Fix the grammar and spelling of this text, then return only the corrected version: "${query}"`);
    reply(`╭──❍ *📝 GRAMMAR FIX* ❍──╮\n│\n├─❍ *Original:*\n${query}\n│\n├─❍ *Fixed:*\n${answer}\n│\n╰──────────────────────❍`);
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ============ MATHGPT ============
cmd({
  pattern: "mathgpt",
  alias: ["math", "solve", "calculator"],
  react: "🔢",
  desc: "Solve math problems with AI",
  category: "ai",
  use: "<math problem>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply, quoted }) => {
  try {
    let query = args.join(" ");
    if (!query && quoted?.text) query = quoted.text;
    if (!query) return reply("❌ *Usage:* .math <problem>");
    await conn.sendMessage(from, { react: { text: "🔢", key: mek.key } });
    const answer = await askGroq(`Solve this math problem step by step: ${query}`, "You are a math expert. Solve problems step by step clearly.");
    reply(`╭──❍ *🔢 MATH GPT* ❍──╮\n│\n├─❍ *Problem:* ${query}\n│\n├─❍ *Solution:*\n${answer}\n│\n╰──────────────────────❍`);
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ============ TRANSLATE ============
cmd({
  pattern: "translate",
  alias: ["tr", "trans"],
  react: "🌐",
  desc: "Translate text to any language",
  category: "ai",
  use: "<lang> <text>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply, quoted }) => {
  try {
    const lang = args[0];
    const text = args.slice(1).join(" ") || quoted?.text;
    if (!lang || !text) return reply("❌ *Usage:* .translate urdu <text>\n\n*Example:* .translate english میں ٹھیک ہوں");
    await conn.sendMessage(from, { react: { text: "🌐", key: mek.key } });
    const answer = await askGroq(`Translate the following text to ${lang}. Return only the translated text:\n\n${text}`);
    reply(`╭──❍ *🌐 TRANSLATE* ❍──╮\n│\n├─❍ *Language:* ${lang}\n├─❍ *Original:* ${text}\n│\n├─❍ *Translated:*\n${answer}\n│\n╰──────────────────────❍`);
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ============ ROAST ============
cmd({
  pattern: "roast",
  react: "🔥",
  desc: "Roast someone with AI",
  category: "fun",
  use: "<name or @mention>",
  filename: __filename
}, async (conn, mek, m, { from, pushname, args, reply, mentioned }) => {
  try {
    const target = args.join(" ") || pushname;
    await conn.sendMessage(from, { react: { text: "🔥", key: mek.key } });
    const roast = await askGroq(`Give a funny and savage roast for someone named "${target}". Keep it humorous, not offensive. Max 3 lines.`);
    reply(`╭──❍ *🔥 ROAST* ❍──╮\n│\n├─❍ *Target:* ${target}\n│\n${roast}\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Roast Machine_ 🔰`);
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ============ JOKE ============
cmd({
  pattern: "joke",
  alias: ["jokes"],
  react: "😂",
  desc: "Get a random joke",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    await conn.sendMessage(from, { react: { text: "😂", key: mek.key } });
    const joke = await askGroq("Tell me one funny joke. Format: Setup on first line, punchline on second line after blank line.");
    reply(`╭──❍ *😂 JOKE* ❍──╮\n│\n${joke}\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Joke Bot_ 🔰`);
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ============ SHAYARI ============
cmd({
  pattern: "shayari",
  alias: ["poetry", "poem"],
  react: "📜",
  desc: "Get Urdu shayari",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    const topic = args.join(" ") || "mohabbat";
    await conn.sendMessage(from, { react: { text: "📜", key: mek.key } });
    const shayari = await askGroq(`Write a beautiful 4-line Urdu shayari in Roman Urdu about "${topic}". Pure Urdu shayari style.`);
    reply(`╭──❍ *📜 SHAYARI* ❍──╮\n│\n${shayari}\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Poetry_ 🔰`);
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ============ PICKUP LINE ============
cmd({
  pattern: "pickup",
  alias: ["flirt", "pickupline"],
  react: "😏",
  desc: "Get a pickup line",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    const target = args.join(" ") || "someone";
    await conn.sendMessage(from, { react: { text: "😏", key: mek.key } });
    const line = await askGroq(`Write a funny and cheesy pickup line for someone named "${target}".`);
    reply(`╭──❍ *😏 PICKUP LINE* ❍──╮\n│\n${line}\n│\n╰──────────────────────❍`);
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ============ COMPLIMENT ============
cmd({
  pattern: "compliment",
  react: "🌸",
  desc: "Give a compliment",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, pushname, args, reply }) => {
  try {
    const target = args.join(" ") || pushname;
    await conn.sendMessage(from, { react: { text: "🌸", key: mek.key } });
    const comp = await askGroq(`Give a sweet and genuine compliment for someone named "${target}". Max 2 lines.`);
    reply(`╭──❍ *🌸 COMPLIMENT* ❍──╮\n│\n├─❍ *For:* ${target}\n│\n${comp}\n│\n╰──────────────────────❍`);
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ============ QUOTE ============
cmd({
  pattern: "quote",
  alias: ["quotes", "motivation"],
  react: "💭",
  desc: "Get a motivational quote",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    const topic = args.join(" ") || "life";
    const q = await askGroq(`Give one powerful motivational quote about "${topic}". Include author name.`);
    reply(`╭──❍ *💭 QUOTE* ❍──╮\n│\n${q}\n│\n╰──────────────────────❍`);
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ============ 8BALL ============
cmd({
  pattern: "8ball",
  alias: ["8b"],
  react: "🎱",
  desc: "Ask the magic 8 ball",
  category: "fun",
  use: "<question>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    const q = args.join(" ");
    if (!q) return reply("❌ *Ask a yes/no question!*");
    const answers = ["Yes, definitely!", "No, absolutely not!", "Maybe...", "Ask again later.", "Without a doubt!", "Very doubtful.", "Signs point to yes.", "Don't count on it.", "Outlook good!", "My sources say no.", "It is certain!", "Cannot predict now."];
    const a = answers[Math.floor(Math.random() * answers.length)];
    reply(`╭──❍ *🎱 8-BALL* ❍──╮\n│\n├─❍ *Q:* ${q}\n├─❍ *A:* ${a}\n│\n╰──────────────────────❍`);
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ============ LOVESTEST ============
cmd({
  pattern: "lovetest",
  alias: ["lovemeter", "love"],
  react: "❤️",
  desc: "Love compatibility test",
  category: "fun",
  use: "<name1> + <name2>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    const input = args.join(" ");
    const names = input.split(/\+|and|&/i).map(n => n.trim());
    if (names.length < 2) return reply("❌ *Usage:* .lovetest Bunty + Manoo");
    const percentage = Math.floor(Math.random() * 41) + 60;
    const heart = percentage >= 80 ? "💘" : percentage >= 60 ? "❤️" : "💔";
    reply(`╭──❍ *${heart} LOVE TEST* ❍──╮\n│\n├─❍ *${names[0]}* ❤️ *${names[1]}*\n│\n├─❍ *Compatibility:* ${percentage}%\n├─❍ ${"❤️".repeat(Math.floor(percentage/10))}${"🖤".repeat(10-Math.floor(percentage/10))}\n│\n╰──────────────────────❍`);
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ============ AURA ============
cmd({
  pattern: "aura",
  react: "✨",
  desc: "Check your aura",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, pushname, args, reply }) => {
  try {
    const name = args.join(" ") || pushname;
    await conn.sendMessage(from, { react: { text: "✨", key: mek.key } });
    const aura = await askGroq(`Describe the aura/vibe of a person named "${name}" in 2-3 fun lines. Be creative and mystical.`);
    reply(`╭──❍ *✨ AURA CHECK* ❍──╮\n│\n├─❍ *Name:* ${name}\n│\n${aura}\n│\n╰──────────────────────❍`);
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ============ COMPATIBILITY ============
cmd({
  pattern: "compatibility",
  alias: ["compat"],
  react: "🔮",
  desc: "Check friendship/relationship compatibility",
  category: "fun",
  use: "<name1> <name2>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    if (args.length < 2) return reply("❌ *Usage:* .compatibility Bunty Manoo");
    const [n1, n2] = [args[0], args[1]];
    const pct = Math.floor(Math.random() * 51) + 50;
    reply(`╭──❍ *🔮 COMPATIBILITY* ❍──╮\n│\n├─❍ *${n1}* 🤝 *${n2}*\n├─❍ *Score:* ${pct}%\n├─❍ ${"💚".repeat(Math.floor(pct/10))}${"⬛".repeat(10-Math.floor(pct/10))}\n│\n╰──────────────────────❍`);
  } catch(e) { reply(`❌ ${e.message}`); }
});

module.exports = {};

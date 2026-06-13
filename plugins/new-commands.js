const { cmd } = require('../lib/command');
const config = require('../setting');
const bot = require('../lib/bot');
const axios = require('axios');

// ============================================================
//                    PAIR COMMAND
// ============================================================
cmd({
  pattern: "pair",
  alias: ["paircode", "getpair", "login"],
  react: "🔗",
  desc: "Get pairing code to connect bot",
  category: "owner",
  use: ".pair <number>  Example: .pair 923041956023",
  filename: __filename
}, async (conn, mek, m, { from, args, reply, isOwner }) => {
  try {
    const number = args[0]?.replace(/[^0-9]/g, "");
    if (!number) {
      return reply(`╭──❍ *🔗 PAIR CODE* ❍──╮\n│\n├─❍ *Usage:* .pair 923041956023\n├─❍ *Format:* CountryCode + Number\n│\n├─❍ *Examples:*\n│  923041956023 (Pakistan)\n│  919876543210 (India)\n│  447911123456 (UK)\n│\n├─❍ *Steps:*\n│  1️⃣ Type .pair <your number>\n│  2️⃣ Bot will send 8-digit code\n│  3️⃣ Open WhatsApp > Linked Devices\n│  4️⃣ Tap "Link with phone number"\n│  5️⃣ Enter the 8-digit code\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Pairing System_ 🔰`);
    }

    if (number.length < 10 || number.length > 15) {
      return reply("❌ *Invalid number!* Include country code.\nExample: *923041956023*");
    }

    await reply("⏳ *Generating pairing code...*");

    let code;
    try {
      code = await conn.requestPairingCode(number);
    } catch (e) {
      // If already paired or error
      return reply(`❌ *Could not generate code!*\n\n*Reason:* ${e.message}\n\n*Make sure:*\n- Number is correct with country code\n- WhatsApp is installed on that number\n- Bot is not already linked`);
    }

    if (!code) return reply("❌ *Failed to generate pairing code. Try again!*");

    // Format code nicely: XXXX-XXXX
    const formattedCode = code.length === 8
      ? `${code.slice(0, 4)}-${code.slice(4)}`
      : code;

    await conn.sendMessage(from, {
      image: { url: bot.ALIVE_IMG },
      caption: `╭──❍ *🔗 PAIRING CODE* ❍──╮\n│\n├─❍ *Number:* +${number}\n│\n├─❍ *Your Code:*\n│\n│  ┌─────────────┐\n│  │  *${formattedCode}*  │\n│  └─────────────┘\n│\n├─❍ *How to use:*\n│  1️⃣ Open WhatsApp\n│  2️⃣ Go to Linked Devices\n│  3️⃣ Tap "Link with phone number"\n│  4️⃣ Enter code above\n│\n├─❍ ⚠️ *Code expires in 60 seconds!*\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ × Pairing System_ 🔰`
    }, { quoted: mek });

  } catch (e) {
    reply(`❌ Error: ${e.message}`);
  }
});

// ============================================================
//                  FUN COMMANDS
// ============================================================

// TRUTH
cmd({
  pattern: "truth",
  dontAddCommandList: true,
  react: "💬",
  desc: "Random truth question",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  const truths = [
    "Kya tumne kabhi kisi ko dhoka diya hai?",
    "Aaj tak ki sabse sharmindagi wali baat batao?",
    "Tumhara secret crush kaun hai?",
    "Kya tumne kabhi doston se jhooth bola hai?",
    "Aaj tak ka sabse bura kaam jo tumne kiya?",
    "Kya tumhe kabhi kisi pe gussa aaya jo tumhara dost ho?",
    "Pehli mohabbat ka naam batao?",
    "Kya tumhari koi aisi baat hai jo tumne kabhi share nahi ki?",
    "Sabse zyada kise miss karte ho?",
    "Kya tumne kabhi exam mein cheat kiya?",
    "Aaj tak ka sabse bada raaz kya hai?",
    "Kya tum apni zindagi se khush ho?",
  ];
  const q = truths[Math.floor(Math.random() * truths.length)];
  reply(`╭──❍ *💬 TRUTH* ❍──╮\n│\n├─❍ *Question:*\n│\n│  _${q}_\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Fun_ 🔰`);
});

// DARE
cmd({
  pattern: "dare",
  dontAddCommandList: true,
  react: "🔥",
  desc: "Random dare task",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  const dares = [
    "Apni profile picture 1 ghante ke liye funny banana do",
    "Group mein 5 min tak har message pe sirf emojis mein reply karo",
    "Apna WhatsApp status koi sharmindagi wala set karo 1 ghante ke liye",
    "Kisi bhi contact ko random meme bhejo bina explain kiye",
    "Apna naam group mein 'Pagal Insaan' rakh lo 30 min ke liye",
    "Kisi ko bhi voice note mein gao aur group mein bhejo",
    "5 different logon ko Good Morning bhejo abhi",
    "Apni sabse purani photo group mein share karo",
    "Koi funny joke sunao group ko",
    "Apna number group mein post karo 5 min ke liye",
  ];
  const d = dares[Math.floor(Math.random() * dares.length)];
  reply(`╭──❍ *🔥 DARE* ❍──╮\n│\n├─❍ *Your Dare:*\n│\n│  _${d}_\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Fun_ 🔰`);
});

// WOULD YOU RATHER
cmd({
  pattern: "would",
  dontAddCommandList: true,
  alias: ["wyr", "wouldyou"],
  react: "🤔",
  desc: "Would you rather game",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  const questions = [
    ["Hamesha jhooth bolna", "Kabhi baat na kar pana"],
    ["Superfast speed", "Ud sakne ki taqat"],
    ["Ameer hona lekin akela", "Khush hona lekin garib"],
    ["Bhoot dekhna", "Bhoot se baat karna"],
    ["10 saal aur jeena", "Abhi 1 crore milna"],
    ["Dost se dhoka", "Dushman se madad"],
    ["Famous hona", "Peaceful life jeena"],
  ];
  const q = questions[Math.floor(Math.random() * questions.length)];
  reply(`╭──❍ *🤔 WOULD YOU RATHER* ❍──╮\n│\n├─❍ *Option A:*\n│  _${q[0]}_\n│\n│  ──── OR ────\n│\n├─❍ *Option B:*\n│  _${q[1]}_\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Fun_ 🔰`);
});

// 8BALL
cmd({
  pattern: "8ball",
  dontAddCommandList: true,
  alias: ["eightball", "magic"],
  react: "🎱",
  desc: "Magic 8 ball answer",
  category: "fun",
  use: "<question>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const q = args.join(" ");
  if (!q) return reply("❌ *Koi sawaal poochho!*\nExample: .8ball Kya main pass hounga?");
  const answers = [
    "✅ Bilkul haan!", "✅ Yes, zaroor!",
    "🤔 Shayad...", "🤔 Dekha jayega...",
    "❌ Nahi bilkul!", "❌ Hargiz nahi!",
    "🌟 Bohot zyada chances hain!", "⚠️ Abhi nahi, baad mein!",
    "🎯 100% haan!", "💯 Pakka!",
  ];
  const ans = answers[Math.floor(Math.random() * answers.length)];
  reply(`╭──❍ *🎱 MAGIC 8 BALL* ❍──╮\n│\n├─❍ *Question:* ${q}\n│\n├─❍ *Answer:* ${ans}\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Fun_ 🔰`);
});

// ROCK PAPER SCISSORS
cmd({
  pattern: "rps",
  dontAddCommandList: true,
  alias: ["rockpaper", "game"],
  react: "✂️",
  desc: "Rock Paper Scissors game",
  category: "fun",
  use: "rock / paper / scissors",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const choices = ["rock", "paper", "scissors"];
  const emojis = { rock: "🪨", paper: "📄", scissors: "✂️" };
  const userChoice = args[0]?.toLowerCase();
  if (!choices.includes(userChoice)) return reply("❌ *Choose:* rock / paper / scissors\nExample: .rps rock");
  const botChoice = choices[Math.floor(Math.random() * 3)];
  let result;
  if (userChoice === botChoice) result = "🤝 *Draw!*";
  else if ((userChoice === "rock" && botChoice === "scissors") || (userChoice === "paper" && botChoice === "rock") || (userChoice === "scissors" && botChoice === "paper")) result = "🏆 *Tum jeete!*";
  else result = "🤖 *Bot jeeta!*";
  reply(`╭──❍ *✂️ ROCK PAPER SCISSORS* ❍──╮\n│\n├─❍ *You:* ${emojis[userChoice]} ${userChoice}\n├─❍ *Bot:* ${emojis[botChoice]} ${botChoice}\n│\n├─❍ *Result:* ${result}\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Fun_ 🔰`);
});

// RIDDLE
cmd({
  pattern: "riddle",
  dontAddCommandList: true,
  alias: ["paheli"],
  react: "🧩",
  desc: "Random riddle/paheli",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  const riddles = [
    { q: "Woh kya cheez hai jo har ghar mein hoti hai lekin kabhi bhi andar nahi aati?", a: "Darwaza 🚪" },
    { q: "Jitna zyada bharo utna halki ho jaye?", a: "Balloon 🎈" },
    { q: "Do baap do bete, teen log — ye kaise?", a: "Dada, bap, beta — teen logon ke beech do bap do bete hain" },
    { q: "Woh kya hai jo aap dekh sakte hain lekin chhoo nahi sakte?", a: "Parchai (Shadow) 👥" },
    { q: "Jis ki hoti hai awaaz, par na hoti hai zindagi?", a: "Ghanti 🔔" },
  ];
  const r = riddles[Math.floor(Math.random() * riddles.length)];
  await reply(`╭──❍ *🧩 RIDDLE* ❍──╮\n│\n├─❍ *Paheli:*\n│  _${r.q}_\n│\n├─❍ *Jawab jaanne ke liye likhو:*\n│  *.riddleans*\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Fun_ 🔰`);
  // Store answer temporarily
  global._lastRiddle = r.a;
});

cmd({
  pattern: "riddleans",
  dontAddCommandList: true,
  alias: ["answer", "jawab"],
  react: "💡",
  desc: "Get last riddle answer",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  const ans = global._lastRiddle || "Pehle .riddle command use karo!";
  reply(`╭──❍ *💡 RIDDLE ANSWER* ❍──╮\n│\n├─❍ *Jawab:* ${ans}\n│\n╰──────────────────────❍`);
});

// FACT
cmd({
  pattern: "fact",
  dontAddCommandList: true,
  alias: ["facts", "amazingfact"],
  react: "🤯",
  desc: "Random amazing fact",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  const facts = [
    "🤯 Insaan ek din mein average 70,000 khayal sochta hai!",
    "🐘 Haathi ek aakhe so sakte hain aur doosri aankhse jaag sakte hain!",
    "🍯 Shahad kabhi kharab nahi hota — 3000 saal purana shahad bhi khaane ke laiq hota hai!",
    "🌊 Samundar mein itna sona ghula hua hai ke har insaan ko 9 pound mil sake!",
    "🦷 Dant ka enamel body ka sabse sakht hissa hai, haddi se bhi zyada!",
    "🧠 Dimagh 75% paani se bana hai!",
    "🐬 Dolfinne apna naam rakhti hain aur ek dusre ko us naam se pehchanti hain!",
    "👁️ Har insaan ki aankhon ka pattern bilkul unique hota hai jaise fingerprint!",
    "🌙 Agar aap ek lambi neend soye toh aap technically waqt mein thoda aage gaye!",
    "🦋 Titlian apne pairon se swad leti hain!",
  ];
  const f = facts[Math.floor(Math.random() * facts.length)];
  reply(`╭──❍ *🤯 AMAZING FACT* ❍──╮\n│\n│  ${f}\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Facts_ 🔰`);
});

// QUOTE
cmd({
  pattern: "quote",
  dontAddCommandList: true,
  alias: ["motivation", "inspire"],
  react: "✨",
  desc: "Motivational quote",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  const quotes = [
    { q: "Mushkilein insaan ko kamzor nahi, mazboot banati hain.", a: "— Unknown" },
    { q: "Haar wahi manta hai jo ladna chhor deta hai.", a: "— Abdullah" },
    { q: "Kal ki fikr mat karo, aaj ko acha banao.", a: "— Unknown" },
    { q: "Kamyabi woh hai jo gir ke dobara uth khada ho.", a: "— Unknown" },
    { q: "Sapne wo nahi jo sote waqt aate hain, sapne wo hain jo soene nahi dete.", a: "— APJ Abdul Kalam" },
    { q: "Mehnat karo, naseeb tumhara intezaar kar raha hai.", a: "— Unknown" },
    { q: "Zindagi mein sirf wahi milta hai jiske liye tum sach mein koshish karte ho.", a: "— Unknown" },
  ];
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  reply(`╭──❍ *✨ MOTIVATION* ❍──╮\n│\n│  _"${q.q}"_\n│\n│  ${q.a}\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Quotes_ 🔰`);
});

// COMPLIMENT
cmd({
  pattern: "compliment",
  dontAddCommandList: true,
  alias: ["comp", "tarif"],
  react: "💝",
  desc: "Send a compliment",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, pushname, reply, mentioned }) => {
  const name = mentioned?.[0]
    ? `@${mentioned[0].split("@")[0]}`
    : pushname;
  const compliments = [
    `${name} bahut samajhdaar insaan ho! 🌟`,
    `${name} ki personality kisi se kam nahi! 💫`,
    `${name} bohot brave ho! Sab kuch handle kar lete ho! 💪`,
    `${name} ki smile contagious hai! 😊`,
    `${name} real gem ho! Aisa dost milna mushkil hota hai! 💎`,
    `${name} duniya ko better jagah banate ho sirf apni presence se! 🌍`,
    `${name} mein itna talent hai mashallah! 🎯`,
  ];
  const c = compliments[Math.floor(Math.random() * compliments.length)];
  reply(`╭──❍ *💝 COMPLIMENT* ❍──╮\n│\n│  ${c}\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ_ 🔰`);
});

// ============================================================
//                  TOOLS COMMANDS
// ============================================================

// QR CODE
cmd({
  pattern: "qr",
  alias: ["qrcode", "makeqr"],
  react: "📱",
  desc: "Generate QR code from text/link",
  category: "tools",
  use: "<text or url>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const text = args.join(" ");
  if (!text) return reply("❌ *Usage:* .qr https://wa.me/923041956023");
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
  await conn.sendMessage(from, {
    image: { url: qrUrl },
    caption: `╭──❍ *📱 QR CODE* ❍──╮\n│\n├─❍ *Text:* ${text.substring(0, 50)}\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ QR Generator_ 🔰`
  }, { quoted: mek });
});

// SHORT URL
cmd({
  pattern: "shorturl",
  alias: ["short", "shorten", "tinyurl"],
  react: "🔗",
  desc: "Shorten a long URL",
  category: "tools",
  use: "<url>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    const url = args[0];
    if (!url || !url.startsWith("http")) return reply("❌ *Usage:* .shorturl https://example.com");
    const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`, { timeout: 8000 });
    reply(`╭──❍ *🔗 SHORT URL* ❍──╮\n│\n├─❍ *Original:* ${url.substring(0, 40)}...\n├─❍ *Short:* ${res.data}\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ URL Shortener_ 🔰`);
  } catch (e) { reply("❌ *URL shortening failed!*"); }
});

// PASSWORD GENERATOR
cmd({
  pattern: "password",
  alias: ["genpass", "makepass"],
  react: "🔐",
  desc: "Generate a strong random password",
  category: "tools",
  use: "<length (optional, default 12)>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const len = parseInt(args[0]) || 12;
  if (len < 6 || len > 32) return reply("❌ *Length must be between 6 and 32!*");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}";
  let pass = "";
  for (let i = 0; i < len; i++) pass += chars[Math.floor(Math.random() * chars.length)];
  reply(`╭──❍ *🔐 PASSWORD* ❍──╮\n│\n├─❍ *Length:* ${len}\n├─❍ *Password:*\n│  \`${pass}\`\n│\n├─❍ ⚠️ _Save this safely!_\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Password Gen_ 🔰`);
});

// BASE64 ENCODE/DECODE
cmd({
  pattern: "base64",
  alias: ["b64", "encode64"],
  react: "🔢",
  desc: "Base64 encode or decode text",
  category: "tools",
  use: "encode <text> OR decode <text>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const mode = args[0]?.toLowerCase();
  const text = args.slice(1).join(" ");
  if (!mode || !text) return reply("❌ *Usage:*\n.base64 encode Hello World\n.base64 decode SGVsbG8gV29ybGQ=");
  try {
    let result;
    if (mode === "encode") result = Buffer.from(text).toString("base64");
    else if (mode === "decode") result = Buffer.from(text, "base64").toString("utf8");
    else return reply("❌ *Use:* encode or decode");
    reply(`╭──❍ *🔢 BASE64* ❍──╮\n│\n├─❍ *Mode:* ${mode}\n├─❍ *Input:* ${text.substring(0, 30)}\n├─❍ *Result:*\n│  \`${result}\`\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Tools_ 🔰`);
  } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// WORD COUNT
cmd({
  pattern: "wordcount",
  dontAddCommandList: true,
  alias: ["wc", "countword"],
  react: "🔢",
  desc: "Count words and characters in text",
  category: "tools",
  use: "<text>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply, quoted }) => {
  const text = args.join(" ") || quoted?.message?.conversation || quoted?.message?.extendedTextMessage?.text;
  if (!text) return reply("❌ *Koi text do ya message reply karo!*");
  const words = text.trim().split(/\s+/).length;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const lines = text.split("\n").length;
  reply(`╭──❍ *🔢 WORD COUNT* ❍──╮\n│\n├─❍ *Words:* ${words}\n├─❍ *Characters:* ${chars}\n├─❍ *Chars (no space):* ${charsNoSpace}\n├─❍ *Lines:* ${lines}\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Tools_ 🔰`);
});

// REVERSE TEXT
cmd({
  pattern: "reverse",
  dontAddCommandList: true,
  alias: ["rev", "ulta"],
  react: "🔄",
  desc: "Reverse any text",
  category: "tools",
  use: "<text>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const text = args.join(" ");
  if (!text) return reply("❌ *Usage:* .reverse Hello World");
  const reversed = text.split("").reverse().join("");
  reply(`╭──❍ *🔄 REVERSE* ❍──╮\n│\n├─❍ *Original:* ${text}\n├─❍ *Reversed:* ${reversed}\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Tools_ 🔰`);
});

// CALCULATOR
cmd({
  pattern: "calc",
  dontAddCommandList: true,
  alias: ["calculate", "math"],
  react: "🧮",
  desc: "Calculate any math expression",
  category: "tools",
  use: "<expression>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const expr = args.join(" ");
  if (!expr) return reply("❌ *Usage:* .calc 25 * 4 + 10");
  try {
    // Safe eval — only allow math characters
    if (/[^0-9+\-*/.() %^]/.test(expr)) return reply("❌ *Invalid expression! Only numbers and +,-,*,/,() allowed*");
    const result = Function(`"use strict"; return (${expr})`)();
    reply(`╭──❍ *🧮 CALCULATOR* ❍──╮\n│\n├─❍ *Expression:* ${expr}\n├─❍ *Result:* *${result}*\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Calc_ 🔰`);
  } catch (e) { reply("❌ *Invalid math expression!*"); }
});

// TRANSLATE
cmd({
  pattern: "translate",
  dontAddCommandList: true,
  alias: ["tr", "trans"],
  react: "🌍",
  desc: "Translate text to any language",
  category: "tools",
  use: "<lang code> <text>  Example: .translate en Salam kya haal",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    const lang = args[0];
    const text = args.slice(1).join(" ");
    if (!lang || !text) return reply("❌ *Usage:* .translate en Salam kya haal\n\n*Common codes:* en=English, ur=Urdu, ar=Arabic, hi=Hindi, fr=French");
    const res = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|${lang}`, { timeout: 10000 });
    const translated = res.data.responseData?.translatedText;
    if (!translated) return reply("❌ *Translation failed!*");
    reply(`╭──❍ *🌍 TRANSLATE* ❍──╮\n│\n├─❍ *Original:* ${text}\n├─❍ *Language:* ${lang}\n├─❍ *Translated:*\n│  ${translated}\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Translator_ 🔰`);
  } catch (e) { reply("❌ *Translation failed! Check language code.*"); }
});

// ============================================================
//              INFO / SEARCH COMMANDS
// ============================================================

// CRYPTO PRICE
cmd({
  pattern: "crypto",
  dontAddCommandList: true,
  alias: ["coin", "bitcoin", "btc"],
  react: "💰",
  desc: "Check cryptocurrency price",
  category: "search",
  use: "<coin name>  Example: .crypto bitcoin",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    const coin = args[0]?.toLowerCase() || "bitcoin";
    const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd,pkr&include_24hr_change=true`, { timeout: 10000 });
    const data = res.data[coin];
    if (!data) return reply(`❌ *Coin '${coin}' not found!*\nTry: bitcoin, ethereum, dogecoin, solana`);
    const change = data.usd_24h_change?.toFixed(2);
    const trend = change > 0 ? "📈" : "📉";
    reply(`╭──❍ *💰 CRYPTO PRICE* ❍──╮\n│\n├─❍ *Coin:* ${coin.toUpperCase()}\n├─❍ *USD:* $${data.usd?.toLocaleString()}\n├─❍ *PKR:* ₨${data.pkr?.toLocaleString()}\n├─❍ *24h Change:* ${trend} ${change}%\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Crypto_ 🔰`);
  } catch (e) { reply("❌ *Could not fetch crypto price!*"); }
});

// IP LOOKUP
cmd({
  pattern: "ip",
  dontAddCommandList: true,
  alias: ["iplookup", "ipinfo"],
  react: "🌐",
  desc: "IP address information lookup",
  category: "search",
  use: "<ip address>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    const ip = args[0];
    if (!ip) return reply("❌ *Usage:* .ip 8.8.8.8");
    const res = await axios.get(`http://ip-api.com/json/${ip}`, { timeout: 8000 });
    const d = res.data;
    if (d.status === "fail") return reply("❌ *Invalid IP address!*");
    reply(`╭──❍ *🌐 IP INFO* ❍──╮\n│\n├─❍ *IP:* ${d.query}\n├─❍ *Country:* ${d.country} ${d.countryCode}\n├─❍ *Region:* ${d.regionName}\n├─❍ *City:* ${d.city}\n├─❍ *ISP:* ${d.isp}\n├─❍ *Timezone:* ${d.timezone}\n├─❍ *Lat/Lon:* ${d.lat}, ${d.lon}\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ IP Lookup_ 🔰`);
  } catch (e) { reply("❌ *IP lookup failed!*"); }
});

// WIKIPEDIA SEARCH
cmd({
  pattern: "wiki",
  dontAddCommandList: true,
  alias: ["wikipedia", "search"],
  react: "📚",
  desc: "Search Wikipedia",
  category: "search",
  use: "<topic>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    const query = args.join(" ");
    if (!query) return reply("❌ *Usage:* .wiki Pakistan");
    const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`, { timeout: 10000 });
    const d = res.data;
    if (d.type === "disambiguation" || !d.extract) return reply("❌ *Topic not found or too broad. Be more specific!*");
    const summary = d.extract.substring(0, 500);
    reply(`╭──❍ *📚 WIKIPEDIA* ❍──╮\n│\n├─❍ *Topic:* ${d.title}\n│\n├─❍ *Summary:*\n${summary}...\n│\n├─❍ *Read more:* ${d.content_urls?.desktop?.page}\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Wiki_ 🔰`);
  } catch (e) { reply("❌ *Topic not found!*"); }
});

// ============================================================
//              GROUP COMMANDS
// ============================================================

// WARN SYSTEM
const warnMap = new Map();
cmd({
  pattern: "warn",
  react: "⚠️",
  desc: "Warn a group member",
  category: "group",
  use: "@mention <reason>",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply, mentioned, args }) => {
  if (!isGroup) return reply("❌ *Group mein use karo!*");
  if (!isAdmins) return reply("❌ *Sirf admins warn kar sakte hain!*");
  if (!isBotAdmins) return reply("❌ *Bot ko admin banao pehle!*");
  const target = mentioned?.[0];
  if (!target) return reply("❌ *Kisi ko mention karo: .warn @user*");
  const reason = args.slice(1).join(" ") || "No reason given";
  const key = `${from}_${target}`;
  const current = warnMap.get(key) || 0;
  const newCount = current + 1;
  warnMap.set(key, newCount);
  if (newCount >= 3) {
    await conn.groupParticipantsUpdate(from, [target], "remove");
    return reply(`🚫 *@${target.split("@")[0]} ko 3 warnings ke baad kick kar diya gaya!*`);
  }
  reply(`╭──❍ *⚠️ WARNING* ❍──╮\n│\n├─❍ *User:* @${target.split("@")[0]}\n├─❍ *Warnings:* ${newCount}/3\n├─❍ *Reason:* ${reason}\n│\n├─❍ ⚠️ _3 warnings pe kick!_\n╰──────────────────────❍`);
});

cmd({
  pattern: "warnclear",
  alias: ["clearwarn", "resetwarn"],
  react: "✅",
  desc: "Clear warnings of a user",
  category: "group",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, reply, mentioned }) => {
  if (!isGroup) return reply("❌ *Group mein use karo!*");
  if (!isAdmins) return reply("❌ *Sirf admins use kar sakte hain!*");
  const target = mentioned?.[0];
  if (!target) return reply("❌ *Kisi ko mention karo!*");
  warnMap.delete(`${from}_${target}`);
  reply(`✅ *@${target.split("@")[0]} ki sab warnings clear ho gayi!*`);
});

cmd({
  pattern: "warnlist",
  alias: ["warnings", "warned"],
  react: "📋",
  desc: "List all warned users in group",
  category: "group",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, reply }) => {
  if (!isGroup) return reply("❌ *Group mein use karo!*");
  if (!isAdmins) return reply("❌ *Sirf admins dekh sakte hain!*");
  const entries = [...warnMap.entries()].filter(([k]) => k.startsWith(from));
  if (!entries.length) return reply("✅ *Is group mein koi warned user nahi!*");
  let list = `╭──❍ *⚠️ WARNED USERS* ❍──╮\n│\n`;
  entries.forEach(([k, v]) => {
    const user = k.split("_")[1].split("@")[0];
    list += `├─❍ @${user}: *${v}/3 warnings*\n`;
  });
  list += `│\n╰──────────────────────❍`;
  reply(list);
});

// GROUP INFO
cmd({
  pattern: "groupinfo",
  alias: ["ginfo", "grpinfo"],
  react: "ℹ️",
  desc: "Get full group information",
  category: "group",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, reply }) => {
  if (!isGroup) return reply("❌ *Group mein use karo!*");
  try {
    const meta = await conn.groupMetadata(from);
    const admins = meta.participants.filter(p => p.admin).map(p => `@${p.id.split("@")[0]}`).join(", ");
    const created = new Date(meta.creation * 1000).toLocaleDateString();
    reply(`╭──❍ *ℹ️ GROUP INFO* ❍──╮\n│\n├─❍ *Name:* ${meta.subject}\n├─❍ *Members:* ${meta.participants.length}\n├─❍ *Admins:* ${meta.participants.filter(p => p.admin).length}\n├─❍ *Created:* ${created}\n├─❍ *Description:*\n│  ${(meta.desc || "No description").substring(0, 100)}\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Group Info_ 🔰`);
  } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// POLL
cmd({
  pattern: "poll",
  alias: ["vote"],
  react: "📊",
  desc: "Create a group poll",
  category: "group",
  use: "<question> | <option1> | <option2> ...",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, args, reply }) => {
  if (!isGroup) return reply("❌ *Group mein use karo!*");
  const input = args.join(" ").split("|").map(s => s.trim());
  if (input.length < 3) return reply("❌ *Usage:* .poll Kaun best hai? | Abdullah | Ahmed | Ali");
  const question = input[0];
  const options = input.slice(1).map((opt, i) => `${["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣"][i] || `${i+1}.`} ${opt}`);
  reply(`╭──❍ *📊 POLL* ❍──╮\n│\n├─❍ *Question:* ${question}\n│\n${options.map(o => `├─❍ ${o}`).join("\n")}\n│\n├─❍ _Reply with number to vote!_\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Poll_ 🔰`);
});

// TAG ALL
cmd({
  pattern: "tagall",
  alias: ["mentionall", "everyone"],
  react: "📢",
  desc: "Tag all group members",
  category: "group",
  use: "<message>",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, reply, args }) => {
  if (!isGroup) return reply("❌ *Group mein use karo!*");
  if (!isAdmins) return reply("❌ *Sirf admins tag all kar sakte hain!*");
  try {
    const meta = await conn.groupMetadata(from);
    const members = meta.participants.map(p => p.id);
    const msg = args.join(" ") || "📢 *Attention Everyone!*";
    const mentions = members.map(m => `@${m.split("@")[0]}`).join(" ");
    await conn.sendMessage(from, {
      text: `${msg}\n\n${mentions}`,
      mentions: members
    }, { quoted: mek });
  } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// REMOVE PIC
cmd({
  pattern: "removepic",
  alias: ["delpic", "removegp"],
  react: "🗑️",
  desc: "Remove group profile picture",
  category: "group",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
  if (!isGroup) return reply("❌ *Group mein use karo!*");
  if (!isAdmins) return reply("❌ *Sirf admins use kar sakte hain!*");
  if (!isBotAdmins) return reply("❌ *Bot admin hona chahiye!*");
  try {
    await conn.removeProfilePicture(from);
    reply("✅ *Group profile picture remove ho gaya!*");
  } catch (e) { reply(`❌ ${e.message}`); }
});

// ============================================================
//              MEDIA COMMANDS
// ============================================================

// TOIMG (sticker to image)
cmd({
  pattern: "toimg",
  alias: ["stickertoimg", "toimage"],
  react: "🖼️",
  desc: "Convert sticker to image",
  category: "tools",
  filename: __filename
}, async (conn, mek, m, { from, reply, quoted }) => {
  try {
    const msg = quoted || mek;
    const type = Object.keys(msg.message || {})[0];
    if (type !== "stickerMessage") return reply("❌ *Kisi sticker ko reply karo!*");
    const media = await conn.downloadMediaMessage(msg, "buffer");
    await conn.sendMessage(from, { image: media, caption: "✅ *Sticker → Image*" }, { quoted: mek });
  } catch (e) { reply(`❌ ${e.message}`); }
});

// ASCII ART
cmd({
  pattern: "ascii",
  dontAddCommandList: true,
  alias: ["asciart", "textart"],
  react: "🎨",
  desc: "Convert text to ASCII art",
  category: "fun",
  use: "<text>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    const text = args.join(" ");
    if (!text) return reply("❌ *Usage:* .ascii Hello");
    const res = await axios.get(`https://artii.herokuapp.com/make?text=${encodeURIComponent(text)}&font=banner3`, { timeout: 8000 });
    reply(`\`\`\`\n${res.data}\n\`\`\``);
  } catch (e) {
    // Fallback simple ASCII
    const text = args.join(" ").toUpperCase();
    reply(`╭──❍ *🎨 ASCII* ❍──╮\n│\n\`\`\`${text}\`\`\`\n│\n╰──────────────────────❍`);
  }
});

// OCR (Image to Text)
cmd({
  pattern: "ocr",
  dontAddCommandList: true,
  alias: ["imagetext", "readimg"],
  react: "🔍",
  desc: "Extract text from image",
  category: "tools",
  filename: __filename
}, async (conn, mek, m, { from, reply, quoted }) => {
  try {
    const msg = quoted || mek;
    const type = Object.keys(msg.message || {})[0];
    if (!type?.includes("image")) return reply("❌ *Kisi image ko reply karo!*");
    const media = await conn.downloadMediaMessage(msg, "buffer");
    const base64 = media.toString("base64");
    // Use OCR API
    const FormData = require("form-data");
    const form = new FormData();
    form.append("base64Image", `data:image/jpeg;base64,${base64}`);
    form.append("language", "eng");
    form.append("isOverlayRequired", "false");
    const res = await axios.post("https://api.ocr.space/parse/image", form, {
      headers: { ...form.getHeaders?.() || {}, apikey: "helloworld" },
      timeout: 15000
    });
    const text = res.data?.ParsedResults?.[0]?.ParsedText?.trim();
    if (!text) return reply("❌ *Image mein koi text nahi mila!*");
    reply(`╭──❍ *🔍 OCR RESULT* ❍──╮\n│\n├─❍ *Text Found:*\n│\n${text}\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ OCR_ 🔰`);
  } catch (e) { reply(`❌ OCR failed: ${e.message}`); }
});

// SCREENSHOT
cmd({
  pattern: "screenshot",
  dontAddCommandList: true,
  alias: ["ss", "webshot", "capture"],
  react: "📸",
  desc: "Take screenshot of a website",
  category: "tools",
  use: "<url>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    const url = args[0];
    if (!url || !url.startsWith("http")) return reply("❌ *Usage:* .screenshot https://google.com");
    await reply("⏳ *Website ka screenshot le raha hoon...*");
    const ssUrl = `https://api.apiflash.com/v1/urltoimage?access_key=free&url=${encodeURIComponent(url)}&width=1280&height=720`;
    await conn.sendMessage(from, {
      image: { url: ssUrl },
      caption: `╭──❍ *📸 SCREENSHOT* ❍──╮\n│\n├─❍ *URL:* ${url}\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Screenshot_ 🔰`
    }, { quoted: mek });
  } catch (e) { reply("❌ *Screenshot failed!*"); }
});

// ============================================================
//              CHECK COMMANDS
// ============================================================

// NUMBER CHECK
cmd({
  pattern: "numcheck",
  dontAddCommandList: true,
  alias: ["checknum", "numinfo", "numbercheck"],
  react: "📞",
  desc: "Check if a WhatsApp number exists",
  category: "tools",
  use: "<number with country code>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    const num = args[0]?.replace(/[^0-9]/g, "");
    if (!num) return reply("❌ *Usage:* .numcheck 923041956023");
    await reply(`⏳ *Checking ${num}...*`);
    const jid = num + "@s.whatsapp.net";
    const result = await conn.onWhatsApp(jid);
    if (result && result[0]?.exists) {
      reply(`╭──❍ *📞 NUMBER CHECK* ❍──╮\n│\n├─❍ *Number:* +${num}\n├─❍ *Status:* ✅ WhatsApp pe hai!\n├─❍ *JID:* ${result[0].jid}\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Check_ 🔰`);
    } else {
      reply(`╭──❍ *📞 NUMBER CHECK* ❍──╮\n│\n├─❍ *Number:* +${num}\n├─❍ *Status:* ❌ WhatsApp nahi hai\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Check_ 🔰`);
    }
  } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// LINK CHECK
cmd({
  pattern: "linkcheck",
  dontAddCommandList: true,
  alias: ["checklink", "urlcheck"],
  react: "🔗",
  desc: "Check if a URL/link is safe or dead",
  category: "tools",
  use: "<url>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    const url = args[0];
    if (!url || !url.startsWith("http")) return reply("❌ *Usage:* .linkcheck https://google.com");
    await reply("⏳ *Link check ho raha hai...*");
    const res = await axios.get(url, { timeout: 10000, maxRedirects: 5, validateStatus: () => true });
    const status = res.status;
    const statusMsg = status >= 200 && status < 300 ? "✅ Link Active / Working" : status >= 300 && status < 400 ? "🔄 Redirect hai" : status >= 400 ? "❌ Link broken / dead" : "⚠️ Unknown";
    reply(`╭──❍ *🔗 LINK CHECK* ❍──╮\n│\n├─❍ *URL:* ${url.substring(0, 50)}\n├─❍ *Status Code:* ${status}\n├─❍ *Result:* ${statusMsg}\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Link Check_ 🔰`);
  } catch (e) { reply(`╭──❍ *🔗 LINK CHECK* ❍──╮\n│\n├─❍ *URL:* ${args[0]?.substring(0, 50)}\n├─❍ *Result:* ❌ *Site unreachable / offline*\n│\n╰──────────────────────❍`); }
});

// BOT CHECK / STATUS CHECK
cmd({
  pattern: "check",
  alias: ["botcheck", "health"],
  react: "✅",
  desc: "Full bot health check",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  const mem = process.memoryUsage();
  const ramUsed = (mem.heapUsed / 1024 / 1024).toFixed(2);
  const ramTotal = (mem.heapTotal / 1024 / 1024).toFixed(2);
  const uptime = require('../lib/functions').runtime(process.uptime());
  const checks = [
    `├─❍ *Bot:* ✅ Online`,
    `├─❍ *Uptime:* ${uptime}`,
    `├─❍ *RAM:* ${ramUsed}MB / ${ramTotal}MB`,
    `├─❍ *Node:* ${process.version}`,
    `├─❍ *Prefix:* ${config.PREFIX}`,
    `├─❍ *Mode:* ${config.MODE}`,
    `├─❍ *Bot Name:* ${config.BOT_NAME}`,
    `├─❍ *Owner:* ${config.OWNER_NAME}`,
    `├─❍ *Version:* ${config.VERSION || "9.0.0"}`,
  ];
  await conn.sendMessage(from, {
    image: { url: bot.ALIVE_IMG },
    caption: `╭──❍ *✅ BOT HEALTH CHECK* ❍──╮\n│\n${checks.join("\n")}\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ System Check_ 🔰`
  }, { quoted: mek });
});

// SPAM CHECK
cmd({
  pattern: "antispamcheck",
  alias: ["spamcheck", "checkspam"],
  react: "🛡️",
  desc: "Check anti-spam settings",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, reply }) => {
  if (!isOwner) return reply("❌ *Owner Only!*");
  const settings = [
    `├─❍ *Anti Spam:* ${config.ANTI_SPAM === "true" ? "✅ ON" : "❌ OFF"}`,
    `├─❍ *Anti Link:* ${config.ANTI_LINK === "true" ? "✅ ON" : "❌ OFF"}`,
    `├─❍ *Anti Bad:* ${config.ANTI_BAD === "true" ? "✅ ON" : "❌ OFF"}`,
    `├─❍ *Anti Bot:* ${config.ANTI_BOT === "true" ? "✅ ON" : "❌ OFF"}`,
    `├─❍ *Anti Call:* ${config.ANTI_CALL === "true" ? "✅ ON" : "❌ OFF"}`,
    `├─❍ *Anti VV:* ${config.ANTI_VV === "true" ? "✅ ON" : "❌ OFF"}`,
    `├─❍ *Anti Delete:* ${config.ANTI_DELETE === "true" ? "✅ ON" : "❌ OFF"}`,
    `├─❍ *Anti Edit:* ${config.ANTI_EDIT === "true" ? "✅ ON" : "❌ OFF"}`,
  ];
  reply(`╭──❍ *🛡️ ANTI SETTINGS* ❍──╮\n│\n${settings.join("\n")}\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Security Check_ 🔰`);
});

module.exports = { warnMap };

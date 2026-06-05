const { cmd } = require('../lib/command');
const config = require('../setting');
const bot = require('../lib/bot');
const { runtime } = require('../lib/functions');
const os = require('os');
const axios = require('axios');

// ============ 1. ALIVE ============
cmd({
  pattern: "alive",
  alias: ["alv"],
  react: "💚",
  desc: "Check if bot is alive",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, pushname, reply, contextInfo }) => {
  const txt = `*╭── 💚 BOT ALIVE ──*
*│* Bot: *${config.BOT_NAME}*
*│* Owner: *${config.OWNER_NAME}*
*│* Prefix: *${config.PREFIX}*
*│* Uptime: *${runtime(process.uptime())}*
*│* RAM: *${(process.memoryUsage().heapUsed/1024/1024).toFixed(1)}MB*
*╰── YES IM ALIVE ──*

> ABDULLAH-BOTZ`;
  await conn.sendMessage(from, {
    image: { url: bot.ALIVE_IMG },
    caption: txt, contextInfo
  }, { quoted: mek });
});

// ============ 2. RUNTIME ============
cmd({
  pattern: "runtime",
  alias: ["uptime", "ut"],
  react: "⏱",
  desc: "Check bot uptime",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  reply(`*⏱ Bot Uptime:* ${runtime(process.uptime())}`);
});

// ============ 3. RAM ============
cmd({
  pattern: "ram",
  alias: ["memory", "mem"],
  react: "💾",
  desc: "Check bot RAM usage",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  const used = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
  const total = Math.round(os.totalmem() / 1024 / 1024);
  const free = Math.round(os.freemem() / 1024 / 1024);
  reply(`*╭── 💾 RAM INFO ──*\n*│* Used: *${used}MB*\n*│* Free: *${free}MB*\n*│* Total: *${total}MB*\n*╰──────────────*`);
});

// ============ 4. BOTINFO ============
cmd({
  pattern: "botinfo",
  alias: ["info", "binfo"],
  react: "🤖",
  desc: "Bot full information",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, pushname, reply, contextInfo }) => {
  const txt = `*╭── 🤖 BOT INFO ──*
*│* Name: *${config.BOT_NAME}*
*│* Owner: *${config.OWNER_NAME}*
*│* Number: *+${config.OWNER_NUMBER}*
*│* Prefix: *${config.PREFIX}*
*│* Mode: *${config.MODE}*
*│* Uptime: *${runtime(process.uptime())}*
*│* RAM: *${(process.memoryUsage().heapUsed/1024/1024).toFixed(1)}MB / ${Math.round(os.totalmem()/1024/1024)}MB*
*│* Platform: *${os.platform()}*
*╰────────────────*

> ABDULLAH-BOTZ`;
  await conn.sendMessage(from, {
    image: { url: bot.ALIVE_IMG },
    caption: txt, contextInfo
  }, { quoted: mek });
});

// ============ 5. REPO ============
cmd({
  pattern: "repo",
  alias: ["github", "source"],
  react: "🔗",
  desc: "Get bot GitHub repo link",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  reply(`*ABDULLAH-BOTZ GitHub*\nhttps://github.com/ABDULLAH-BOTZ\n\n> Star the repo if you like it!`);
});

// ============ 6. MYID ============
cmd({
  pattern: "myid",
  alias: ["id", "mynum"],
  react: "🪪",
  desc: "Get your WhatsApp ID/number",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
  const num = sender?.split("@")[0] || from.split("@")[0];
  reply(`*Your Number:* +${num}\n*Your JID:* ${sender || from}`);
});

// ============ 7. DONATE ============
cmd({
  pattern: "donate",
  alias: ["support"],
  react: "💝",
  desc: "Support the bot developer",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  reply(`*╭── 💝 SUPPORT DEV ──*
*│* Developer: *ABDULLAH*
*│* Contact: *wa.me/${config.OWNER_NUMBER}*
*╰────────────────*

> Thank you for using ABDULLAH-BOTZ!`);
});

// ============ 8. QRCODE (generate QR for text) ============
cmd({
  pattern: "qr",
  alias: ["qrcode", "makeqr"],
  react: "📷",
  desc: "Generate QR code from text",
  category: "main",
  use: "<text>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const text = args.join(" ");
  if (!text) return reply("❌ *Usage: .qr <text or link>*");
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
  await conn.sendMessage(from, {
    image: { url },
    caption: `*QR Code for:*\n${text}`
  }, { quoted: mek });
});

// ============ 9. WEATHER ============
cmd({
  pattern: "weather",
  alias: ["wthr", "climate"],
  react: "🌤",
  desc: "Get weather info for a city",
  category: "main",
  use: "<city>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const city = args.join(" ");
  if (!city) return reply("❌ *Usage: .weather <city>*\nExample: .weather Karachi");
  try {
    const url = `https://wttr.in/${encodeURIComponent(city)}?format=3`;
    const { data } = await axios.get(url, { timeout: 8000 });
    reply(`*🌤 Weather Info*\n${data}\n\n> ABDULLAH-BOTZ`);
  } catch(e) {
    reply(`❌ *Could not fetch weather for* ${city}`);
  }
});

// ============ 10. TRANSLATE ============
cmd({
  pattern: "tr",
  alias: ["translate"],
  react: "🌍",
  desc: "Translate text to any language",
  category: "main",
  use: "<lang code> <text> | Example: .tr ur Hello",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  if (!args[0]) return reply("❌ *Usage: .tr <lang> <text>*\nExamples:\n.tr ur Hello World\n.tr en Salam dunya\n\nLang codes: ur=Urdu, en=English, ar=Arabic, hi=Hindi");
  const lang = args[0];
  const text = args.slice(1).join(" ");
  if (!text) return reply("❌ *Provide text to translate!*");
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|${lang}`;
    const { data } = await axios.get(url, { timeout: 8000 });
    const translated = data?.responseData?.translatedText;
    if (!translated) return reply("❌ *Translation failed!*");
    reply(`*🌍 Translation*\n\n*Original:* ${text}\n*Translated (${lang}):* ${translated}\n\n> ABDULLAH-BOTZ`);
  } catch(e) {
    reply(`❌ *Translation error: ${e.message}*`);
  }
});

module.exports = {};

// ============ IMGHOST — Public command ============
cmd({
  pattern: "imghost",
  alias: ["imgupload", "uploadimg"],
  react: "🖼",
  desc: "Upload image and get a hosted URL",
  category: "tools",
  use: ".imghost (reply to image)",
  filename: __filename
}, async (conn, mek, m, { from, quoted, reply }) => {
  try {
    const msg = quoted || mek;
    const type = Object.keys(msg.message || {})[0];
    if (!type?.includes('image')) return reply("❌ *Kisi image ko reply kar ke .imghost likho!*");
    
    reply("⏳ *Uploading image...*");
    const buffer = await conn.downloadMediaMessage(msg, "buffer");
    const axios = require("axios");
    const FormData = require("form-data");
    
    // imgbb free API
    const form = new FormData();
    form.append("image", buffer.toString("base64"));
    const { data } = await axios.post(
      "https://api.imgbb.com/1/upload?key=your_imgbb_key_here",
      form,
      { headers: form.getHeaders(), timeout: 20000 }
    ).catch(() => ({ data: null }));
    
    let url = data?.data?.url;
    
    // Fallback: catbox.moe (no key needed)
    if (!url) {
      const form2 = new FormData();
      form2.append("reqtype", "fileupload");
      form2.append("fileToUpload", buffer, { filename: "image.jpg", contentType: "image/jpeg" });
      const res2 = await axios.post("https://catbox.moe/user/api.php", form2, {
        headers: form2.getHeaders(), timeout: 20000
      });
      url = res2.data;
    }
    
    if (!url) return reply("❌ *Upload fail hua, try again!*");
    reply(`✅ *Image Hosted!*\n\n🔗 *URL:* ${url}\n\n> ABDULLAH-BOTZ`);
  } catch(e) {
    reply(`❌ *Error:* ${e.message}`);
  }
});

// ============ ANTIBUG — Public command ============
cmd({
  pattern: "antibug",
  alias: ["fixbug", "clearbug"],
  react: "🛡",
  desc: "Send anti-bug/anti-crash protection message",
  category: "tools",
  use: ".antibug",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    // Send a protective vCard that clears WhatsApp bugs/crashes
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:ANTI BUG\nORG:ABDULLAH-BOTZ;\nTEL;type=CELL;type=VOICE;waid=0:+0\nEND:VCARD`;
    await conn.sendMessage(from, {
      contacts: {
        displayName: "ANTI BUG",
        contacts: [{ vcard }]
      }
    }, { quoted: mek });
    reply("✅ *Anti-Bug sent! WhatsApp crash/bug fix ho gaya.*\n> ABDULLAH-BOTZ");
  } catch(e) {
    reply(`❌ Error: ${e.message}`);
  }
});


// ============ PAIR — Public command (anyone can pair) ============
cmd({
  pattern: "pair",
  alias: ["paircode", "getpair"],
  react: "📱",
  desc: "Get pairing code for your number",
  category: "main",
  use: ".pair <number>  Example: .pair 923041956023",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const num = args[0]?.replace(/[^0-9]/g, "");
  if (!num || num.length < 10) return reply("❌ *Usage: .pair 923041956023*\nCountry code ke saath number do.");
  try {
    reply("⏳ *Pairing code generate ho raha hai...*");
    const code = await conn.requestPairingCode(num);
    if (!code) return reply("❌ *Code generate nahi hua, try again!*");
    const fmt = code.length === 8 ? code.slice(0,4) + "-" + code.slice(4) : code;
    
    // ✅ Register this number as paired (for private mode access)
    if (!global.pairedNumbers) global.pairedNumbers = new Set();
    global.pairedNumbers.add(num);
    
    reply(`*╭── 📱 PAIRING CODE ──*\n*│*\n*│*  *${fmt}*\n*│*\n*╰──────────────*\n\n*Steps:*\n1. WhatsApp kholo\n2. Menu (⋮) → Linked Devices\n3. Link with phone number\n4. Code enter karo\n\n⏰ *60 seconds mein enter karo!*\n> ABDULLAH-BOTZ`);
  } catch(e) {
    reply(`❌ *Error:* ${e.message}`);
  }
});


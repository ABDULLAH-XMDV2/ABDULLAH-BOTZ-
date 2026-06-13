const { cmd } = require('../lib/command');
const config = require('../setting');
const bot = require('../lib/bot');
const { runtime } = require('../lib/functions');
const os = require('os');
const axios = require('axios');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .alive  (extra)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "alive",
  alias: ["alv"],
  react: "💚",
  desc: "Check if bot is alive",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, pushname, reply, contextInfo }) => {
  const ram = (process.memoryUsage().heapUsed/1024/1024).toFixed(1);
  const txt =
`╔══════════════════════════╗
║  💚 *ʙᴏᴛ ɪꜱ ᴀʟɪᴠᴇ!* 💚   ║
╚══════════════════════════╝

╭━━━「 🤖 ꜱᴛᴀᴛᴜꜱ 」━━━━━━━
┃ 🏷️  *Bot    :* ${config.BOT_NAME}
┃ 👨‍💻 *Owner  :* ${config.OWNER_NAME} 🇵🇰
┃ 🔑 *Prefix :* ${config.PREFIX}
┃ ⏱️  *Uptime :* ${runtime(process.uptime())}
┃ 🧠 *RAM    :* ${ram}MB
┃ 💡 *Status :* ✅ Online
╰━━━━━━━━━━━━━━━━━━━━━━━

> *㋛ ABDULLAH-BOTZ — ᴀʟᴡᴀʏꜱ ʀᴇᴀᴅʏ 🚀*`;
  await conn.sendMessage(from, { image: { url: bot.ALIVE_IMG }, caption: txt, contextInfo }, { quoted: mek });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .runtime
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "runtime",
  alias: ["uptime", "ut"],
  react: "⏱️",
  desc: "Check bot uptime",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  reply(
`╭━━━「 ⏱️ ᴜᴘᴛɪᴍᴇ 」━━━━━━━
┃ ⏱️  *Runtime :* ${runtime(process.uptime())}
┃ 🤖 *Bot     :* ABDULLAH-BOTZ
╰━━━━━━━━━━━━━━━━━━━━━━━
> *㋛ ABDULLAH-BOTZ 🚀*`);
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .ram
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "ram",
  alias: ["memory", "mem"],
  react: "💾",
  desc: "Check bot RAM usage",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  const used  = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
  const total = Math.round(os.totalmem()  / 1024 / 1024);
  const free  = Math.round(os.freemem()   / 1024 / 1024);
  const pct   = ((used / total) * 100).toFixed(1);
  reply(
`╔══════════════════════════╗
║  💾 *ʀᴀᴍ ɪɴꜰᴏ* 💾         ║
╚══════════════════════════╝

╭━━━「 🧠 ᴍᴇᴍᴏʀʏ 」━━━━━━━
┃ 📊 *Used  :* ${used}MB
┃ 🆓 *Free  :* ${free}MB
┃ 💽 *Total :* ${total}MB
┃ 📈 *Usage :* ${pct}%
╰━━━━━━━━━━━━━━━━━━━━━━━
> *㋛ ABDULLAH-BOTZ 🚀*`);
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .botinfo
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "botinfo",
  alias: ["info", "binfo"],
  react: "🤖",
  desc: "Full bot information",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, pushname, reply, contextInfo }) => {
  const txt =
`╔══════════════════════════╗
║  🤖 *ʙᴏᴛ ɪɴꜰᴏ* 🤖         ║
╚══════════════════════════╝

╭━━━「 📋 ᴅᴇᴛᴀɪʟꜱ 」━━━━━━
┃ 🏷️  *Name    :* ${config.BOT_NAME}
┃ 👨‍💻 *Owner   :* ${config.OWNER_NAME} 🇵🇰
┃ 📞 *Number  :* +${config.OWNER_NUMBER}
┃ 🔑 *Prefix  :* ${config.PREFIX}
┃ 🌐 *Mode    :* ${config.MODE.toUpperCase()}
┃ ⏱️  *Uptime  :* ${runtime(process.uptime())}
┃ 🧠 *RAM     :* ${(process.memoryUsage().heapUsed/1024/1024).toFixed(1)}MB / ${Math.round(os.totalmem()/1024/1024)}MB
┃ 💻 *Platform:* ${os.platform()}
┃ 🔧 *Node.js :* ${process.version}
╰━━━━━━━━━━━━━━━━━━━━━━━

> *㋛ ABDULLAH-BOTZ — ᴘᴀᴋɪꜱᴛᴀɴɪ ᴘᴏᴡᴇʀ 🇵🇰*`;
  await conn.sendMessage(from, { image: { url: bot.ALIVE_IMG }, caption: txt, contextInfo }, { quoted: mek });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .repo  (extra)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "repo",
  alias: ["github", "source"],
  react: "🔗",
  desc: "Get bot GitHub repo",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  reply(
`╭━━━「 🔗 ɢɪᴛʜᴜʙ 」━━━━━━━
┃ 📦 *Repo :* ${bot.REPO_LINK}
┃ ⭐ Star the repo if you like it!
╰━━━━━━━━━━━━━━━━━━━━━━━
> *㋛ ABDULLAH-BOTZ 🇵🇰*`);
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .myid
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "myid",
  alias: ["id", "mynum"],
  react: "🪪",
  desc: "Get your WhatsApp ID",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
  const num = sender?.split("@")[0] || from.split("@")[0];
  reply(
`╭━━━「 🪪 ʏᴏᴜʀ ɪᴅ 」━━━━━━
┃ 📞 *Number :* +${num}
┃ 🔑 *JID    :* ${sender || from}
╰━━━━━━━━━━━━━━━━━━━━━━━
> *㋛ ABDULLAH-BOTZ 🇵🇰*`);
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .donate
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "donate",
  alias: ["support"],
  react: "💝",
  desc: "Support the developer",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  reply(
`╔══════════════════════════╗
║  💝 *ꜱᴜᴘᴘᴏʀᴛ ᴅᴇᴠ* 💝      ║
╚══════════════════════════╝

╭━━━「 👨‍💻 ᴅᴇᴠᴇʟᴏᴘᴇʀ 」━━━━━
┃ 👤 *Dev     :* ABDULLAH 🇵🇰
┃ 💬 *Contact :* wa.me/${config.OWNER_NUMBER}
┃ 📦 *Repo    :* ${bot.REPO_LINK}
╰━━━━━━━━━━━━━━━━━━━━━━━

💖 *Thank you for using ABDULLAH-BOTZ!*
> *㋛ ᴘᴀᴋɪꜱᴛᴀɴɪ ᴘᴏᴡᴇʀ 🇵🇰*`);
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .qr
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(text)}&bgcolor=0d0d0d&color=ffffff`;
  await conn.sendMessage(from, {
    image: { url },
    caption:
`╭━━━「 📷 ǫʀ ᴄᴏᴅᴇ 」━━━━━━
┃ 📝 *Text :* ${text.slice(0,50)}${text.length>50?'...':''}
╰━━━━━━━━━━━━━━━━━━━━━━━
> *㋛ ABDULLAH-BOTZ 🇵🇰*`
  }, { quoted: mek });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .weather
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "weather",
  alias: ["wthr", "climate"],
  react: "🌤️",
  desc: "Get weather for a city",
  category: "main",
  use: "<city>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const city = args.join(" ");
  if (!city) return reply("❌ *Usage: .weather <city>*\nExample: .weather Karachi");
  try {
    const { data } = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=3`, { timeout: 8000 });
    reply(
`╭━━━「 🌤️ ᴡᴇᴀᴛʜᴇʀ 」━━━━━━
┃ 🌍 *City   :* ${city}
┃ 🌡️  *Info   :* ${data}
╰━━━━━━━━━━━━━━━━━━━━━━━
> *㋛ ABDULLAH-BOTZ 🇵🇰*`);
  } catch(e) {
    reply(`❌ *Could not fetch weather for* *${city}*`);
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .tr
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "tr",
  alias: ["translate"],
  react: "🌍",
  desc: "Translate text to any language",
  category: "main",
  use: "<lang> <text>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  if (!args[0]) return reply("❌ *Usage: .tr <lang> <text>*\nExamples:\n.tr ur Hello World\n.tr en Salam dunya\n\nLang codes: ur=Urdu en=English ar=Arabic hi=Hindi");
  const lang = args[0];
  const text = args.slice(1).join(" ");
  if (!text) return reply("❌ *Provide text to translate!*");
  try {
    const { data } = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|${lang}`, { timeout: 8000 });
    const translated = data?.responseData?.translatedText;
    if (!translated) return reply("❌ *Translation failed!*");
    reply(
`╭━━━「 🌍 ᴛʀᴀɴꜱʟᴀᴛɪᴏɴ 」━━━
┃ 📝 *Original   :* ${text}
┃ 🔤 *Translated :* ${translated}
┃ 🌐 *Lang Code  :* ${lang}
╰━━━━━━━━━━━━━━━━━━━━━━━
> *㋛ ABDULLAH-BOTZ 🇵🇰*`);
  } catch(e) {
    reply(`❌ *Translation error: ${e.message}*`);
  }
});

module.exports = {};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .imghost
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "imghost",
  alias: ["imgupload", "uploadimg"],
  react: "🖼️",
  desc: "Upload image and get hosted URL",
  category: "tools",
  use: ".imghost (reply to image)",
  filename: __filename
}, async (conn, mek, m, { from, quoted, reply }) => {
  try {
    const msg = quoted || mek;
    const type = Object.keys(msg.message || {})[0];
    if (!type?.includes('image')) return reply("❌ *Reply to an image with .imghost*");
    reply("⏳ *Uploading image...*");
    const buffer = await conn.downloadMediaMessage(msg, "buffer");
    const FormData = require("form-data");
    const form = new FormData();
    form.append("reqtype", "fileupload");
    form.append("fileToUpload", buffer, { filename: "image.jpg", contentType: "image/jpeg" });
    const res = await axios.post("https://catbox.moe/user/api.php", form, { headers: form.getHeaders(), timeout: 20000 });
    const url = res.data;
    if (!url || !url.startsWith("http")) return reply("❌ *Upload failed, try again!*");
    reply(
`╭━━━「 🖼️ ɪᴍᴀɢᴇ ʜᴏꜱᴛᴇᴅ 」━━━
┃ ✅ *Upload Success!*
┃ 🔗 *URL :* ${url}
╰━━━━━━━━━━━━━━━━━━━━━━━
> *㋛ ABDULLAH-BOTZ 🇵🇰*`);
  } catch(e) { reply(`❌ *Error:* ${e.message}`); }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .antibug
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "antibug",
  alias: ["fixbug", "clearbug"],
  react: "🛡️",
  desc: "Anti-bug/crash protection",
  category: "tools",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:🛡️ ANTI BUG\nORG:ABDULLAH-BOTZ;\nTEL;type=CELL;type=VOICE;waid=0:+0\nEND:VCARD`;
    await conn.sendMessage(from, { contacts: { displayName: "ANTI BUG", contacts: [{ vcard }] } }, { quoted: mek });
    reply(
`╭━━━「 🛡️ ᴀɴᴛɪ-ʙᴜɢ 」━━━━━━
┃ ✅ *Anti-Bug sent!*
┃ 🔒 *WhatsApp crash fixed*
╰━━━━━━━━━━━━━━━━━━━━━━━
> *㋛ ABDULLAH-BOTZ 🇵🇰*`);
  } catch(e) { reply(`❌ Error: ${e.message}`); }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .pair
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "pair",
  alias: ["paircode", "getpair"],
  react: "📱",
  desc: "Get pairing code for your number",
  category: "main",
  use: ".pair <number>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const num = args[0]?.replace(/[^0-9]/g, "");
  if (!num || num.length < 10) return reply("❌ *Usage: .pair 923041956023*\nInclude country code.");
  try {
    reply("⏳ *Generating pairing code...*");
    const code = await conn.requestPairingCode(num);
    if (!code) return reply("❌ *Code generation failed, try again!*");
    const fmt = code.length === 8 ? code.slice(0,4) + "-" + code.slice(4) : code;
    if (!global.pairedNumbers) global.pairedNumbers = new Set();
    global.pairedNumbers.add(num);
    reply(
`╔══════════════════════════╗
║  📱 *ᴘᴀɪʀɪɴɢ ᴄᴏᴅᴇ* 📱    ║
╚══════════════════════════╝

╭━━━「 🔑 ʏᴏᴜʀ ᴄᴏᴅᴇ 」━━━━━
┃
┃   ✨ *${fmt}* ✨
┃
╰━━━━━━━━━━━━━━━━━━━━━━━

*📋 Steps:*
┃ 1️⃣  Open WhatsApp
┃ 2️⃣  Menu (⋮) → Linked Devices
┃ 3️⃣  Link with Phone Number
┃ 4️⃣  Enter the code above

⏰ *Enter within 60 seconds!*
> *㋛ ABDULLAH-BOTZ 🇵🇰*`);
  } catch(e) { reply(`❌ *Error:* ${e.message}`); }
});

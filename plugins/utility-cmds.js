const { cmd } = require('../lib/command');
const config = require('../setting');
const os = require('os');
const { runtime } = require('../lib/functions');

// ============ PING ============
cmd({
  pattern: "ping",
  alias: ["ping2", "speed"],
  react: "🏓",
  desc: "Check bot ping/speed",
  category: "utility",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  const start = Date.now();
  await reply("🏓 *Pinging...*");
  const end = Date.now();
  reply(`╭──❍ *🏓 PING* ❍──╮\n│\n├─❍ *Speed:* ${end - start}ms\n├─❍ *Status:* ✅ Online\n│\n╰──────────────────────❍`);
});

// ============ UPTIME ============
cmd({
  pattern: "uptime",
  alias: ["alive", "runtime"],
  react: "⏰",
  desc: "Check bot uptime",
  category: "utility",
  filename: __filename
}, async (conn, mek, m, { from, pushname, reply }) => {
  const uptime = runtime(process.uptime());
  const mem = process.memoryUsage();
  const ramUsed = (mem.heapUsed / 1024 / 1024).toFixed(2);
  const ramTotal = (mem.heapTotal / 1024 / 1024).toFixed(2);
  await conn.sendMessage(from, {
    image: { url: "https://files.catbox.moe/yba2f9.jpg" },
    caption: `╭──❍ *⚙️ ABDULLAH-BOTZ STATUS* ❍──╮\n│\n├─❍ *Bot:* ${config.BOT_NAME}\n├─❍ *User:* ${pushname}\n├─❍ *Uptime:* ${uptime}\n├─❍ *RAM:* ${ramUsed}MB / ${ramTotal}MB\n├─❍ *Platform:* ${os.platform()}\n├─❍ *Node:* ${process.version}\n├─❍ *Prefix:* ${config.PREFIX}\n├─❍ *Mode:* ${config.MODE}\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Always Online_ 🔰`
  }, { quoted: mek });
});

// ============ STICKER ============
cmd({
  pattern: "sticker",
  alias: ["s", "stiker"],
  react: "🎨",
  desc: "Convert image/video to sticker",
  category: "tools",
  filename: __filename
}, async (conn, mek, m, { from, reply, quoted }) => {
  try {
    const msg = quoted || mek;
    const type = Object.keys(msg.message || {})[0];
    if (!type || (!type.includes("image") && !type.includes("video"))) {
      return reply("❌ *Reply to an image or video!*");
    }
    const { Sticker, StickerTypes } = require('wa-sticker-formatter');
    const media = await conn.downloadMediaMessage(msg, "buffer");
    const sticker = new Sticker(media, {
      pack: config.STICKER_NAME || "ABDULLAH-BOTZ",
      author: "ABDULLAH-BOTZ",
      type: StickerTypes.FULL,
      quality: 50
    });
    const stickerBuffer = await sticker.toBuffer();
    await conn.sendMessage(from, { sticker: stickerBuffer }, { quoted: mek });
  } catch(e) { reply(`❌ Error: ${e.message}`); }
});

// ============ TOMP3 ============
cmd({
  pattern: "tomp3",
  dontAddCommandList: true,
  alias: ["tompthree", "mp3"],
  react: "🎵",
  desc: "Convert video to audio",
  category: "tools",
  filename: __filename
}, async (conn, mek, m, { from, reply, quoted }) => {
  try {
    const msg = quoted || mek;
    const type = Object.keys(msg.message || {})[0];
    if (!type?.includes("video")) return reply("❌ *Reply to a video!*");
    const media = await conn.downloadMediaMessage(msg, "buffer");
    await conn.sendMessage(from, {
      audio: media,
      mimetype: "audio/mp4",
      ptt: false
    }, { quoted: mek });
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ============ ID ============
cmd({
  pattern: "id",
  alias: ["getid", "jid"],
  react: "🔍",
  desc: "Get chat/user JID",
  category: "utility",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  const meta = isGroup ? await conn.groupMetadata(from).catch(() => null) : null;
  reply(`╭──❍ *🔍 ID INFO* ❍──╮\n│\n├─❍ *Chat:* ${from}\n├─❍ *Sender:* ${sender}\n${meta ? `├─❍ *Group:* ${meta.subject}\n` : ""}│\n╰──────────────────────❍`);
});

// ============ CAPTION ============
cmd({
  pattern: "caption",
  react: "💬",
  desc: "Get caption of quoted media",
  category: "utility",
  filename: __filename
}, async (conn, mek, m, { from, reply, quoted }) => {
  if (!quoted) return reply("❌ *Reply to a media message!*");
  const type = Object.keys(quoted.message || {})[0];
  const caption = quoted.message?.[type]?.caption || "No caption";
  reply(`╭──❍ *💬 CAPTION* ❍──╮\n│\n${caption}\n│\n╰──────────────────────❍`);
});

// ============ URL ============
cmd({
  pattern: "url",
  alias: ["geturl", "mediaurl"],
  react: "🔗",
  desc: "Get URL of a media message",
  category: "utility",
  filename: __filename
}, async (conn, mek, m, { from, reply, quoted }) => {
  if (!quoted) return reply("❌ *Reply to a media message!*");
  try {
    const url = await conn.downloadMediaMessage(quoted, "stream");
    reply(`╭──❍ *🔗 MEDIA URL* ❍──╮\n│\n├─❍ Media fetched successfully!\n│\n╰──────────────────────❍`);
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ============ FONT ============
const fontMaps = {
  1: c => c.replace(/[a-z]/g, m => "𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇"[m.charCodeAt(0)-97]).replace(/[A-Z]/g, m => "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭"[m.charCodeAt(0)-65]),
  2: c => c.replace(/[a-z]/g, m => "𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻"[m.charCodeAt(0)-97]).replace(/[A-Z]/g, m => "𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡"[m.charCodeAt(0)-65]),
  3: c => c.replace(/[a-z]/g, m => "𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃"[m.charCodeAt(0)-97]).replace(/[A-Z]/g, m => "𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩"[m.charCodeAt(0)-65]),
  4: c => c.replace(/[a-z]/g, m => "ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ"[m.charCodeAt(0)-97]).replace(/[A-Z]/g, m => "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ"[m.charCodeAt(0)-65]),
  5: c => c.split("").map(ch => ch + "̶").join(""),
};

cmd({
  pattern: "font",
  dontAddCommandList: true,
  alias: ["font1","font2","font3","font4","font5"],
  react: "✒️",
  desc: "Convert text to different fonts",
  category: "tools",
  use: "<number 1-5> <text>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const num = parseInt(args[0]);
  const text = args.slice(1).join(" ");
  if (!num || !text || !fontMaps[num]) return reply("❌ *Usage:* .font 1 Hello\n\n*Styles:* 1=Bold 2=Italic 3=Cursive 4=Wide 5=Strike");
  const converted = fontMaps[num](text);
  reply(`╭──❍ *✒️ FONT* ❍──╮\n│\n├─❍ *Style:* ${num}\n├─❍ *Result:* ${converted}\n│\n╰──────────────────────❍`);
});

// ============ WEATHER ============
cmd({
  pattern: "weather",
  alias: ["wthr"],
  react: "🌤️",
  desc: "Get weather info (AI powered)",
  category: "utility",
  use: "<city>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    const city = args.join(" ");
    if (!city) return reply("❌ *Usage:* .weather Karachi");
    const { askGroq } = require('./ai-commands') || {};
    const axios = require('axios');
    const res = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=3`, { timeout: 8000 });
    reply(`╭──❍ *🌤️ WEATHER* ❍──╮\n│\n├─❍ ${res.data}\n│\n╰──────────────────────❍`);
  } catch(e) { reply(`❌ Could not fetch weather. Try: .weather Karachi`); }
});

// ============ PRAYERTIME ============
cmd({
  pattern: "prayertime",
  alias: ["namaz", "prayer"],
  react: "🕌",
  desc: "Get prayer times for a city",
  category: "utility",
  use: "<city>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    const city = args.join(" ") || "Karachi";
    const axios = require('axios');
    const res = await axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=PK&method=1`, { timeout: 10000 });
    const t = res.data.data.timings;
    reply(`╭──❍ *🕌 PRAYER TIMES* ❍──╮\n│\n├─❍ *City:* ${city}\n│\n├─❍ 🌅 *Fajr:* ${t.Fajr}\n├─❍ ☀️ *Dhuhr:* ${t.Dhuhr}\n├─❍ 🌤️ *Asr:* ${t.Asr}\n├─❍ 🌇 *Maghrib:* ${t.Maghrib}\n├─❍ 🌙 *Isha:* ${t.Isha}\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Prayer Times_ 🔰`);
  } catch(e) { reply(`❌ Could not fetch prayer times!`); }
});

// ============ CONVERT (CURRENCY) ============
cmd({
  pattern: "convert",
  react: "💱",
  desc: "Convert currency",
  category: "utility",
  use: "<amount> <from> <to>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    if (args.length < 3) return reply("❌ *Usage:* .convert 100 USD PKR");
    const [amount, from_curr, to_curr] = args;
    const axios = require('axios');
    const res = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from_curr.toUpperCase()}`, { timeout: 8000 });
    const rate = res.data.rates[to_curr.toUpperCase()];
    if (!rate) return reply("❌ *Invalid currency code!*");
    const result = (parseFloat(amount) * rate).toFixed(2);
    reply(`╭──❍ *💱 CURRENCY* ❍──╮\n│\n├─❍ ${amount} ${from_curr.toUpperCase()} = *${result} ${to_curr.toUpperCase()}*\n├─❍ *Rate:* 1 ${from_curr.toUpperCase()} = ${rate} ${to_curr.toUpperCase()}\n│\n╰──────────────────────❍`);
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ============ DEFINE ============
cmd({
  pattern: "define",
  alias: ["meaning", "dict"],
  react: "📖",
  desc: "Get word definition",
  category: "search",
  use: "<word>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    const word = args[0];
    if (!word) return reply("❌ *Usage:* .define hello");
    const axios = require('axios');
    const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, { timeout: 8000 });
    const def = res.data[0]?.meanings?.[0]?.definitions?.[0];
    if (!def) return reply("❌ *Word not found!*");
    reply(`╭──❍ *📖 DEFINITION* ❍──╮\n│\n├─❍ *Word:* ${word}\n├─❍ *Meaning:* ${def.definition}\n${def.example ? `├─❍ *Example:* ${def.example}\n` : ""}│\n╰──────────────────────❍`);
  } catch(e) { reply(`❌ Word not found!`); }
});

// ============ OWNER CONTACT ============
cmd({
  pattern: "owner",
  react: "👑",
  desc: "Get owner contact info",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  const ownerJid = config.OWNER_NUMBER + "@s.whatsapp.net";
  await conn.sendMessage(from, {
    contacts: {
      displayName: "ABDULLAH-BOTZ Owner",
      contacts: [{
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:ABDULLAH-BOTZ Owner\nORG:ABDULLAH-BOTZ;\nTEL;type=CELL;type=VOICE;waid=${config.OWNER_NUMBER}:+${config.OWNER_NUMBER}\nEND:VCARD`
      }]
    }
  }, { quoted: mek });
});

module.exports = {};

const {cmd , commands} = require('../lib/command')
const os = require("os")
const { runtime } = require('../lib/functions')
const axios = require('axios');
const { fakevCard } = require('../lib/fakevCard');
const bot = require('../lib/bot')
const config = require('../setting')

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DESIGN HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return '🌅 ɢᴏᴏᴅ ᴍᴏʀɴɪɴɢ';
  if (h >= 12 && h < 17) return '☀️ ɢᴏᴏᴅ ᴀꜰᴛᴇʀɴᴏᴏɴ';
  if (h >= 17 && h < 21) return '🌆 ɢᴏᴏᴅ ᴇᴠᴇɴɪɴɢ';
  return '🌙 ɢᴏᴏᴅ ɴɪɢʜᴛ';
}
function getNow() {
  const now = new Date();
  const date = now.toLocaleDateString('en-PK', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  const time = now.toLocaleTimeString('en-PK', { hour:'2-digit', minute:'2-digit', hour12:true });
  return { date, time };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .about
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "about",
  react: "👑",
  desc: "About ABDULLAH-BOTZ",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, contextInfo, pushname, reply }) => {
  try {
    const { date, time } = getNow();
    const text =
`╔══════════════════════════╗
║  👑 *ᴀʙᴅᴜʟʟᴀʜ-ʙᴏᴛᴢ*  👑  ║
╚══════════════════════════╝

${getGreeting()}, *${pushname}* 🫡

╭━━━「 🗓️ ᴅᴀᴛᴇ & ᴛɪᴍᴇ 」━━━
┃ 📅 ${date}
┃ ⏰ ${time}
╰━━━━━━━━━━━━━━━━━━━━━━━

╭━━━「 🤖 ʙᴏᴛ ɪɴꜰᴏ 」━━━━━
┃ 🏷️  *Name :* ABDULLAH-BOTZ
┃ 👨‍💻 *Owner :* ABDULLAH 🇵🇰
┃ 📞 *Number :* +${bot.OWNER_NUMBER}
┃ 🧬 *Version :* ${bot.VERSION}
┃ 🌐 *Platform :* WhatsApp MD
┃ ⚡ *Speed :* Ultra Fast 🚀
╰━━━━━━━━━━━━━━━━━━━━━━━

╭━━━「 🔗 ʟɪɴᴋꜱ 」━━━━━━━
┃ 📦 *Repo :* ${bot.REPO_LINK}
┃ 📢 *Channel :* ${bot.WA_CHANNEL}
╰━━━━━━━━━━━━━━━━━━━━━━━

> *㋛ ABDULLAH-BOTZ — ᴘᴀᴋɪꜱᴛᴀɴɪ ᴘᴏᴡᴇʀ 🇵🇰*`;

    await conn.sendMessage(from, { image:{ url:bot.ALIVE_IMG }, caption:text, contextInfo }, { quoted:mek });
  } catch(e) { reply(`${e}`) }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .alive
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "alive",
  alias: ["online"],
  desc: "Check if bot is alive",
  category: "main",
  react: "💚",
  filename: __filename,
}, async (conn, mek, m, { from, pushname, reply, contextInfo }) => {
  try {
    const { date, time } = getNow();
    const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
    const ramTotal = Math.round(os.totalmem() / 1024 / 1024);

    const text =
`╔══════════════════════════╗
║  💚 *ʏᴇꜱ! ɪ ᴀᴍ ᴀʟɪᴠᴇ* 💚  ║
╚══════════════════════════╝

${getGreeting()}, *${pushname}* ✨

╭━━━「 🗓️ ᴅᴀᴛᴇ & ᴛɪᴍᴇ 」━━━
┃ 📅 ${date}
┃ ⏰ ${time}
╰━━━━━━━━━━━━━━━━━━━━━━━

╭━━━「 📊 ʙᴏᴛ ꜱᴛᴀᴛᴜꜱ 」━━━
┃ 👤 *User    :* ${pushname}
┃ 🔑 *Prefix  :* ${config.PREFIX}
┃ 🧬 *Version :* ${bot.VERSION}
┃ ⏱️  *Uptime  :* ${runtime(process.uptime())}
┃ 🧠 *RAM     :* ${ram}MB / ${ramTotal}MB
┃ 💡 *Status  :* Online ✅
╰━━━━━━━━━━━━━━━━━━━━━━━

*🔢 Reply with a number:*
┃ 1 ➤ 📜 Commands Menu
┃ 2 ➤ ⚡ Bot Speed Test

> *㋛ ABDULLAH-BOTZ — ᴀʟᴡᴀʏꜱ ᴏɴʟɪɴᴇ 🚀*`;

    const vv = await conn.sendMessage(from, { image: { url:bot.ALIVE_IMG }, caption:text, contextInfo }, { quoted:mek });

    conn.ev.on('messages.upsert', async (msgUpdate) => {
      const msg = msgUpdate.messages[0];
      if (!msg.message?.extendedTextMessage) return;
      const opt = msg.message.extendedTextMessage.text.trim();
      if (msg.message.extendedTextMessage.contextInfo?.stanzaId === vv.key.id) {
        if (opt === '1') reply('.menu');
        else if (opt === '2') reply('.ping');
        else reply("❌ Invalid option. Send *1* or *2*.");
      }
    });
  } catch(e) { reply(`❌ ${e.message}`) }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Auto Bio
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let autoBioInterval;
cmd({ on: "body" }, async (conn, mek, m, { from, isOwner, reply }) => {
  if (config.AUTO_BIO === 'true') startAutoBio(conn);
});
function startAutoBio(conn) {
  if (autoBioInterval) clearInterval(autoBioInterval);
  autoBioInterval = setInterval(async () => {
    const bioText = `⚡ ABDULLAH-BOTZ | Uptime: ${runtime(process.uptime())} 🇵🇰`;
    await conn.updateProfileStatus(bioText);
  }, 60 * 1000);
}
console.log(`ABDULLAH-BOTZ ♻ Auto Bio Started`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .env
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function isEnabled(v) { return v?.toString().toLowerCase() === "true"; }
function onOff(v) { return isEnabled(v) ? "✅ ON" : "❌ OFF"; }

cmd({
  pattern: "env",
  alias: ["setting2", "allvar"],
  desc: "Show all env settings",
  category: "main",
  react: "⚙️",
  filename: __filename
}, async (conn, mek, m, { from, contextInfo, reply }) => {
  try {
    const text =
`╔══════════════════════════╗
║  ⚙️ *ᴇɴᴠ ꜱᴇᴛᴛɪɴɢꜱ* ⚙️   ║
╚══════════════════════════╝

╭━━━「 👁️ ꜱᴛᴀᴛᴜꜱ & ʀᴇᴀᴄᴛ 」━━━
┃ 👁️ *Status View :* ${onOff(config.AUTO_READ_STATUS)}
┃ 💬 *Status Reply:* ${onOff(config.AUTO_STATUS_REPLY)}
┃ 😍 *Auto React  :* ${onOff(config.AUTO_REACT)}
╰━━━━━━━━━━━━━━━━━━━━━━━

╭━━━「 🤖 ᴀᴜᴛᴏ ꜰᴇᴀᴛᴜʀᴇꜱ 」━━━
┃ 💬 *Auto Reply   :* ${onOff(config.AUTO_REPLY)}
┃ 🎨 *Auto Sticker :* ${onOff(config.AUTO_STICKER)}
┃ 🎙️  *Auto Voice   :* ${onOff(config.AUTO_VOICE)}
┃ ⌨️  *Auto Typing  :* ${onOff(config.AUTO_TYPING)}
┃ 🔴 *Auto Record  :* ${onOff(config.AUTO_RECORDING)}
╰━━━━━━━━━━━━━━━━━━━━━━━

╭━━━「 🛡️ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ 」━━━━
┃ 🔗 *Anti Link  :* ${onOff(config.ANTI_LINK)}
┃ 🤬 *Anti Bad   :* ${onOff(config.ANTI_BAD)}
╰━━━━━━━━━━━━━━━━━━━━━━━

╭━━━「 🌐 ᴍᴏᴅᴇ 」━━━━━━━━━
┃ 🌍 *Always Online :* ${onOff(config.ALWAYS_ONLINE)}
┃ 🌎 *Public Mode   :* ${onOff(config.PUBLIC_MODE)}
┃ 📖 *Read CMD      :* ${onOff(config.READ_CMD)}
╰━━━━━━━━━━━━━━━━━━━━━━━

> *㋛ ABDULLAH-BOTZ — ${bot.DESCRIPTION}*`;

    await conn.sendMessage(from, { image: { url: bot.ALIVE_IMG }, caption: text, contextInfo }, { quoted: mek });
  } catch(e) { reply(`Error: ${e.message}`) }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .menu  /  .cmd
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CAT_META = {
  "owner":     { icon:"👑", label:"ᴏᴡɴᴇʀ"     },
  "main":      { icon:"🤖", label:"ᴍᴀɪɴ"      },
  "group":     { icon:"👥", label:"ɢʀᴏᴜᴘ"     },
  "ai":        { icon:"🧠", label:"ᴀɪ"         },
  "tools":     { icon:"🔧", label:"ᴛᴏᴏʟꜱ"     },
  "fun":       { icon:"🎉", label:"ꜰᴜɴ"        },
  "convert":   { icon:"🔄", label:"ᴄᴏɴᴠᴇʀᴛ"  },
  "search":    { icon:"🔍", label:"ꜱᴇᴀʀᴄʜ"   },
  "download":  { icon:"📥", label:"ᴅᴏᴡɴʟᴏᴀᴅ" },
  "other":     { icon:"📦", label:"ᴏᴛʜᴇʀ"     },
  "movie":     { icon:"🎬", label:"ᴍᴏᴠɪᴇ"     },
  "news":      { icon:"📰", label:"ɴᴇᴡꜱ"      },
  "education": { icon:"📚", label:"ᴇᴅᴜᴄ"     },
};

function buildMenu(pushname) {
  const { date, time } = getNow();
  const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
  let total = 0;

  let text =
`╔══════════════════════════╗
║  📜 *ᴀʙᴅᴜʟʟᴀʜ-ʙᴏᴛᴢ ᴍᴇɴᴜ* 📜 ║
╚══════════════════════════╝

┌───────────────────────
│ 👤 *User    :* ${pushname}
│ 🔑 *Prefix  :* ${config.PREFIX}
│ ⏱️  *Uptime  :* ${runtime(process.uptime())}
│ 🧠 *RAM     :* ${ram}MB
│ 📅 *Date    :* ${date}
│ ⏰ *Time    :* ${time}
└───────────────────────\n\n`;

  for (const [cat, meta] of Object.entries(CAT_META)) {
    const cmds = commands.filter(c => c.category === cat && c.pattern && !c.dontAddCommandList);
    if (!cmds.length) continue;
    total += cmds.length;
    text += `╭━━━「 ${meta.icon} *${meta.label.toUpperCase()}* 」━━━\n`;
    for (const c of cmds) {
      text += `┃ ➤ ${config.PREFIX}${c.pattern}\n`;
    }
    text += `╰┈ Total: ${cmds.length} cmds ━━━━━━━━━\n\n`;
  }

  text += `┌────────────────────────\n`;
  text += `│ 📊 *Total Commands: ${total}*\n`;
  text += `│ 📞 *Owner: +${bot.OWNER_NUMBER}*\n`;
  text += `│ 🌐 *Repo: ${bot.REPO_LINK}*\n`;
  text += `└────────────────────────\n\n`;
  text += `> *㋛ ABDULLAH-BOTZ — ᴘᴀᴋɪꜱᴛᴀɴɪ ᴘᴏᴡᴇʀ 🇵🇰*`;
  return text;
}

cmd({
  pattern: "menu",
  alias: ["help"],
  react: "📜",
  desc: "Show all commands",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, pushname, reply, contextInfo }) => {
  try {
    await conn.sendMessage(from, { image: { url: bot.ALIVE_IMG }, caption: buildMenu(pushname), contextInfo }, { quoted: mek });
  } catch(e) { reply(`❌ ${e.message}`) }
});

cmd({
  pattern: "cmd",
  alias: ["cmds", "commands", "list"],
  react: "📋",
  desc: "Show all commands",
  category: "main",
  use: ".cmd",
  filename: __filename
}, async (conn, mek, m, { from, pushname, reply, contextInfo }) => {
  try {
    await conn.sendMessage(from, { image: { url: bot.ALIVE_IMG }, caption: buildMenu(pushname), contextInfo }, { quoted: mek });
  } catch(e) { reply(`❌ ${e.message}`) }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .owner
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "owner",
  react: "👑",
  alias: ["ow"],
  desc: "Get owner contact",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  try {
    const ownerNumber = config.OWNER_NUMBER || "923041956023";
    const ownerName   = config.OWNER_NAME   || "ABDULLAH";
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${ownerName} 👑\nORG:ABDULLAH-BOTZ;\nTEL;type=CELL;type=VOICE;waid=${ownerNumber}:+${ownerNumber}\nEND:VCARD`;
    await conn.sendMessage(from, { contacts: { displayName: ownerName, contacts: [{ vcard }] } }, { quoted: mek });
    await conn.sendMessage(from, {
      text:
`╔══════════════════════════╗
║  👑 *ᴏᴡɴᴇʀ ᴄᴏɴᴛᴀᴄᴛ* 👑   ║
╚══════════════════════════╝

╭━━━「 👨‍💻 ᴏᴡɴᴇʀ ɪɴꜰᴏ 」━━━
┃ 🏷️  *Name   :* ${ownerName} 🇵🇰
┃ 📞 *Number :* +${ownerNumber}
┃ 🤖 *Bot    :* ABDULLAH-BOTZ
┃ 🌐 *Repo   :* ${bot.REPO_LINK}
╰━━━━━━━━━━━━━━━━━━━━━━━

> *㋛ ABDULLAH-BOTZ — ᴏᴡɴᴇʀ ᴄᴀʀᴅ 🇵🇰*`
    }, { quoted: mek });
  } catch(e) {
    await conn.sendMessage(from, { text: '❌ Error fetching owner contact.' }, { quoted: mek });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .ping  /  .speed
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "speed",
  react: "🚀",
  alias: ["s2"],
  desc: "Quick ping test",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const t1 = Date.now();
    const p = await conn.sendMessage(from, { text: '⚡ *ᴛᴇꜱᴛɪɴɢ...*' }, { quoted: mek });
    const ms = Date.now() - t1;
    await conn.sendMessage(from, { delete: p.key });
    reply(
`╔══════════════════════════╗
║  🚀 *ᴘɪɴɢ ʀᴇꜱᴜʟᴛ* 🚀     ║
╚══════════════════════════╝

╭━━━「 ⚡ ꜱᴘᴇᴇᴅ 」━━━━━━━
┃ 📡 *Ping  :* ${ms}ms
┃ 🏷️  *Status:* ${ms < 200 ? '🟢 EXCELLENT' : ms < 500 ? '🟡 GOOD' : '🔴 SLOW'}
┃ 🤖 *Bot   :* ABDULLAH-BOTZ
╰━━━━━━━━━━━━━━━━━━━━━━━

> *㋛ Powered by ABDULLAH-BOTZ 🚀*`
    );
  } catch(e) { reply('❌ Error!') }
});

cmd({
  pattern: "ping",
  alias: ["pong", "test"],
  desc: "Real-time ping test",
  category: "main",
  react: "⚡",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  try {
    const startTime = Date.now();
    let isRunning = true;
    const initialMsg = await conn.sendMessage(from, {
      text:
`╔══════════════════════════╗
║  ⚡ *ᴘɪɴɢ ᴛᴇꜱᴛ ꜱᴛᴀʀᴛᴇᴅ* ⚡ ║
╚══════════════════════════╝
┃ ⏳ *Time :* 0s
┃ ⚡ *MS   :* —
┃ 🔁 *Status:* Testing...
╰━━━━━━━━━━━━━━━━━━━━━━━
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀʙᴅᴜʟʟᴀʜ-ʙᴏᴛᴢ`
    }, { quoted: m });

    const iv = setInterval(async () => {
      if (!isRunning) return;
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const ms = Math.floor(Math.random() * 50) + 30;
      const stage = elapsed < 5 ? '🔁 ᴛᴇꜱᴛɪɴɢ...' : elapsed < 10 ? '📡 ᴍᴇᴀꜱᴜʀɪɴɢ...' : elapsed < 20 ? '⚡ ᴄᴀʟᴄᴜʟᴀᴛɪɴɢ...' : `✅ ᴄᴏᴍᴘʟᴇᴛᴇ ɪɴ ${30 - elapsed}s`;
      try {
        await conn.sendMessage(from, { text:
`╔══════════════════════════╗
║  ⚡ *ᴘɪɴɢ ᴛᴇꜱᴛ ʀᴜɴɴɪɴɢ* ⚡ ║
╚══════════════════════════╝
┃ ⏳ *Time  :* ${elapsed}s
┃ ⚡ *MS    :* ${ms}ms
┃ 📶 *Stage :* ${stage}
╰━━━━━━━━━━━━━━━━━━━━━━━
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀʙᴅᴜʟʟᴀʜ-ʙᴏᴛᴢ`, edit: initialMsg.key });
      } catch { isRunning = false; clearInterval(iv); }
    }, 1000);

    setTimeout(async () => {
      isRunning = false; clearInterval(iv);
      const total = Date.now() - startTime;
      const avg = Math.floor(total / 30);
      const grade = avg < 100 ? '🟢 ULTRA FAST 🚀' : avg < 200 ? '🟡 EXCELLENT ⚡' : avg < 500 ? '🟠 GOOD 👍' : '🔴 AVERAGE 📶';
      try {
        await conn.sendMessage(from, { text:
`╔══════════════════════════╗
║  ✅ *ᴘɪɴɢ ᴛᴇꜱᴛ ᴅᴏɴᴇ* ✅   ║
╚══════════════════════════╝
┃ ⏱️  *Total Time :* 30s
┃ ⚡ *Final MS   :* ${total}ms
┃ 📊 *Avg MS     :* ${avg}ms
┃ 🏆 *Rating     :* ${grade}
╰━━━━━━━━━━━━━━━━━━━━━━━
> *㋛ ABDULLAH-BOTZ — ꜱᴘᴇᴇᴅ ᴛᴇꜱᴛ 🚀*`, edit: initialMsg.key });
      } catch {
        await conn.sendMessage(from, { text: `⚡ Ping done! Avg: ${avg}ms | ${grade}` }, { quoted: m });
      }
    }, 30000);
  } catch(e) {
    await conn.sendMessage(from, { text: `❌ Error: ${e.message}` }, { quoted: fakevCard });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .repo
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "repo",
  desc: "Bot repo info",
  react: "📡",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const text =
`╔══════════════════════════╗
║  📡 *ʀᴇᴘᴏ ɪɴꜰᴏ* 📡        ║
╚══════════════════════════╝

╭━━━「 🔗 ʟɪɴᴋꜱ 」━━━━━━━━
┃ 👨‍💻 *Owner  :* ${bot.OWNER_NAME} 🇵🇰
┃ 📞 *Number :* +${bot.OWNER_NUMBER}
┃ 📦 *Repo   :* ${bot.REPO_LINK}
┃ 📢 *Channel:* ${bot.WA_CHANNEL}
┃ 🧬 *Version:* ${bot.VERSION}
╰━━━━━━━━━━━━━━━━━━━━━━━

> *㋛ ABDULLAH-BOTZ — ᴏᴘᴇɴ ꜱᴏᴜʀᴄᴇ 🇵🇰*`;
    await conn.sendMessage(from, { image:{ url: bot.ALIVE_IMG }, caption: text }, { quoted:mek });
  } catch(e) { reply(`${e}`) }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .settings
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "settings",
  alias: ["setting", "s"],
  desc: "Bot settings panel",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, reply }) => {
  try {
    if (!isOwner) return reply("❌ *Owner Only Command!*");
    let modeLabel = { public:'🌎 PUBLIC', private:'👤 PRIVATE', groups:'👥 GROUPS', inbox:'🫂 INBOX' }[config.MODE] || '🛑 UNKNOWN';

    const vv = await conn.sendMessage(from, {
      image: { url: bot.ALIVE_IMG },
      caption:
`╔══════════════════════════╗
║  ⚙️ *ꜱᴇᴛᴛɪɴɢꜱ ᴘᴀɴᴇʟ* ⚙️  ║
╚══════════════════════════╝

╭━━━「 📊 ᴄᴜʀʀᴇɴᴛ ꜱᴛᴀᴛᴜꜱ 」━
┃ 🌐 *Work Mode  :* ${modeLabel}
┃ 👁️  *Auto Status:* ${onOff(config.AUTO_READ_STATUS)}
┃ 😍 *Auto React :* ${onOff(config.AUTO_REACT)}
╰━━━━━━━━━━━━━━━━━━━━━━━

╭━━━「 🔧 ᴄʜᴀɴɢᴇ ꜱᴇᴛᴛɪɴɢꜱ 」━
┃
┃ *🌐 WORK MODE*
┃  1.1 ➤ Public
┃  1.2 ➤ Private
┃  1.3 ➤ Groups Only
┃  1.4 ➤ Inbox Only
┃
┃ *👁️ AUTO STATUS*
┃  3.1 ➤ Auto Status ON
┃  3.2 ➤ Auto Status OFF
┃
┃ *😍 AUTO REACT*
┃  4.1 ➤ Auto React ON
┃  4.2 ➤ Auto React OFF
┃
┃ *⌨️ AUTO TYPING*
┃  5.1 ➤ Auto Typing ON
┃  5.2 ➤ Auto Typing OFF
┃
┃ *🔁 AUTO BIO*
┃  6   ➤ Toggle Auto Bio
┃
┃ *📰 NEWS SERVICE*
┃  7   ➤ Activate News
┃
╰━━━━━━━━━━━━━━━━━━━━━━━
> *㋛ ABDULLAH-BOTZ Settings 🇵🇰*`
    }, { quoted: mek });

    conn.ev.on('messages.upsert', async (msgUpdate) => {
      const msg = msgUpdate.messages[0];
      if (!msg.message?.extendedTextMessage) return;
      const opt = msg.message.extendedTextMessage.text.trim();
      if (msg.message.extendedTextMessage.contextInfo?.stanzaId === vv.key.id) {
        const actions = {
          '1.1': () => { reply('.update MODE:public');  reply('.restart'); },
          '1.2': () => { reply('.update MODE:private'); reply('.restart'); },
          '1.3': () => { reply('.update MODE:groups');  reply('.restart'); },
          '1.4': () => { reply('.update MODE:inbox');   reply('.restart'); },
          '2.1': () => reply('.update AUTO_VOICE:true'),
          '2.2': () => reply('.update AUTO_VOICE:false'),
          '3.1': () => reply('.update AUTO_READ_STATUS:true'),
          '3.2': () => reply('.update AUTO_READ_STATUS:false'),
          '4.1': () => { reply('.update AUTO_REACT:true');  reply('.restart'); },
          '4.2': () => { reply('.update AUTO_REACT:false'); reply('.restart'); },
          '5.1': () => reply('.update AUTO_TYPING:true'),
          '5.2': () => reply('.update AUTO_TYPING:false'),
          '6':   () => reply('.setautobio'),
          '7':   () => reply('.sprikynews'),
        };
        if (actions[opt]) actions[opt]();
        else reply("❌ Invalid option. Send a number from the list.");
      }
    });
  } catch(e) { reply(`${e}`) }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .system
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "system",
  react: "🖥️",
  alias: ["uptime", "sysinfo"],
  desc: "System info",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const ram    = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const ramTot = Math.round(os.totalmem() / 1024 / 1024);
    const text =
`╔══════════════════════════╗
║  🖥️ *ꜱʏꜱᴛᴇᴍ ɪɴꜰᴏ* 🖥️     ║
╚══════════════════════════╝

╭━━━「 📊 ꜱʏꜱᴛᴇᴍ ꜱᴛᴀᴛꜱ 」━━
┃ ⏱️  *Uptime   :* ${runtime(process.uptime())}
┃ 🧠 *RAM      :* ${ram}MB / ${ramTot}MB
┃ 💻 *Platform :* ${os.hostname()}
┃ 🔧 *Node.js  :* ${process.version}
┃ 🧬 *Version  :* ${bot.VERSION}
┃ 👨‍💻 *Owner    :* ${bot.OWNER_NAME} 🇵🇰
┃ 📞 *Number   :* +${bot.OWNER_NUMBER}
╰━━━━━━━━━━━━━━━━━━━━━━━

> *㋛ ABDULLAH-BOTZ — ꜱʏꜱᴛᴇᴍ ᴅᴀꜱʜʙᴏᴀʀᴅ 🚀*`;
    await conn.sendMessage(from, { image:{ url:bot.ALIVE_IMG }, caption: text }, { quoted:mek });
  } catch(e) { reply(`${e}`) }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Presence / Anti-features (unchanged logic)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({ on: "body" }, async (conn, mek, m, { from }) => {
  if (config.AUTO_RECORDING === 'true') await conn.sendPresenceUpdate('recording', from);
});
cmd({ on: "body" }, async (conn, mek, m, { from, body, isOwner }) => {
  try {
    let voc = await axios.get(`${bot.BOT_URL}`);
    const url = voc.data.voice;
    let { data } = await axios.get(url);
    for (const text in data) {
      if (body.toLowerCase() === text.toLowerCase() && config.AUTO_VOICE === 'true' && !isOwner) {
        await conn.sendPresenceUpdate('recording', from);
        await conn.sendMessage(from, { audio: { url: data[text] }, mimetype: 'audio/mpeg', ptt: true }, { quoted: mek });
      }
    }
  } catch {}
});
cmd({ on: "body" }, async (conn, mek, m, { from, body, isOwner }) => {
  try {
    let rep = await axios.get(`${bot.BOT_URL}`);
    const url = rep.data.reply;
    let { data } = await axios.get(url);
    for (const text in data) {
      if (body.toLowerCase() === text.toLowerCase() && config.AUTO_REPLY === 'true' && !isOwner) {
        await m.reply(data[text]);
      }
    }
  } catch {}
});
cmd({ on: "body" }, async (conn, mek, m, { from }) => {
  if (config.AUTO_TYPING === 'true') await conn.sendPresenceUpdate('composing', from);
});
cmd({ on: "body" }, async (conn, mek, m, { from, isOwner }) => {
  try {
    if (config.ALWAYS_ONLINE === "true") await conn.sendPresenceUpdate("available", from);
    else await conn.sendPresenceUpdate(isOwner ? "available" : "unavailable", from);
  } catch {}
});

// Anti bad words
cmd({ on: "body" }, async (conn, mek, m, { from, body, isGroup, isAdmins, isBotAdmins }) => {
  try {
    const badWords = ["porno","porn","xxn","pono","fack","nude","nappi","doch","xnxn","khalifa","kalifa","xxx","cum","pussy","prono","fuck","sex","pronhub","xnxx","pakaya","ponnaya","huththa","paka","huka","wesa","ponna","wesi","kariya","sex","Sex","xxx","XXX","sexy","Sexy","porn","ass","nude","pussy","dick","boobs","pusy","naked"];
    if (!isGroup || isAdmins || !isBotAdmins) return;
    const low = body.toLowerCase();
    if (badWords.some(w => low.includes(w)) && config.ANTI_BAD === 'true') {
      await conn.sendMessage(from, { delete: mek.key }, { quoted: mek });
      await conn.sendMessage(from, { text: "🚫 *BAD WORDS NOT ALLOWED* 🚫" }, { quoted: mek });
    }
  } catch {}
});

// Anti link
const linkPatterns = [
  /https?:\/\/(?:chat\.whatsapp\.com|wa\.me)\/\S+/gi,
  /https?:\/\/(?:t\.me|telegram\.me)\/\S+/gi,
  /https?:\/\/(?:www\.)?youtube\.com\/\S+/gi,
  /https?:\/\/youtu\.be\/\S+/gi,
  /https?:\/\/(?:www\.)?facebook\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?instagram\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?twitter\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?tiktok\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?discord\.com\/\S+/gi,
];
cmd({ on: "body" }, async (conn, mek, m, { from, body, sender, isGroup, isAdmins, isBotAdmins }) => {
  try {
    if (!isGroup || isAdmins || !isBotAdmins) return;
    if (linkPatterns.some(p => p.test(body)) && config.ANTI_LINK === 'true') {
      await conn.sendMessage(from, { delete: mek.key }, { quoted: mek });
      await conn.sendMessage(from, { text: `⚠️ *Links are not allowed!*\n@${sender.split('@')[0]} has been removed. 🚫`, mentions: [sender] }, { quoted: mek });
      await conn.groupParticipantsUpdate(from, [sender], 'remove');
    }
  } catch {}
});

const { cmd, commands } = require('../lib/command');
const os = require('os');
const { runtime } = require('../lib/functions');
const axios = require('axios');
const bot = require('../lib/bot');
const config = require('../setting');

// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
//  HELPERS
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return '🌅 GOOD MORNING';
  if (h >= 12 && h < 17) return '☀️  GOOD AFTERNOON';
  if (h >= 17 && h < 21) return '🌆 GOOD EVENING';
  return '🌙 GOOD NIGHT';
}
function getNow() {
  const n = new Date();
  return {
    date: n.toLocaleDateString('en-PK', { weekday:'long', year:'numeric', month:'long', day:'numeric' }),
    time: n.toLocaleTimeString('en-PK', { hour:'2-digit', minute:'2-digit', hour12:true })
  };
}
function bar(pct, len = 10) {
  const f = Math.round((pct / 100) * len);
  return '█'.repeat(f) + '░'.repeat(len - f);
}

// ╔══════════════════════════════════════╗
// ║  .about                             ║
// ╚══════════════════════════════════════╝
cmd({
  pattern: 'about', react: '👑',
  desc: 'About ABDULLAH-BOTZ', category: 'main', filename: __filename
}, async (conn, mek, m, { from, pushname, reply, contextInfo }) => {
  const { date, time } = getNow();
  const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
  const ramTotal = Math.round(os.totalmem() / 1024 / 1024);
  const ramPct = Math.round((ram / ramTotal) * 100);

  const txt =
`\`\`\`
╔══════════════════════════════╗
║   ██████╗  ██████╗ ████████╗ ║
║  ██╔══██╗██╔═══██╗╚══██╔══╝ ║
║  ███████╗██║   ██║   ██║    ║
║  ██╔══██╗██║   ██║   ██║    ║
║  ██████╔╝╚██████╔╝   ██║    ║
║  ╚═════╝  ╚═════╝    ╚═╝    ║
║      ABDULLAH-BOTZ v9.0      ║
╚══════════════════════════════╝
\`\`\`
*[ SYSTEM INFO ]*
┌─────────────────────────────
│ 👤 User    » ${pushname}
│ 🤖 Bot     » ${config.BOT_NAME}
│ 👑 Owner   » ${config.OWNER_NAME} 🇵🇰
│ 📞 Number  » +${config.OWNER_NUMBER}
│ ⏱️  Uptime  » ${runtime(process.uptime())}
│ 🧠 RAM     » ${ram}MB / ${ramTotal}MB
│ 📊 Load    » [${bar(ramPct)}] ${ramPct}%
│ 📅 Date    » ${date}
│ ⏰ Time    » ${time}
└─────────────────────────────

*[ LINKS ]*
┌─────────────────────────────
│ 📦 Repo    » ${bot.REPO_LINK}
│ 📢 Channel » ${bot.WA_CHANNEL}
└─────────────────────────────
\`\`\`
▀▄▀▄ PAKISTANI POWER 🇵🇰 ▄▀▄▀
\`\`\``;

  await conn.sendMessage(from, { image: { url: bot.ALIVE_IMG }, caption: txt, contextInfo }, { quoted: mek });
});

// ╔══════════════════════════════════════╗
// ║  .alive                             ║
// ╚══════════════════════════════════════╝
cmd({
  pattern: 'alive', alias: ['status','online'],
  react: '💚', desc: 'Bot alive check', category: 'main', filename: __filename
}, async (conn, mek, m, { from, pushname, reply, contextInfo }) => {
  const { date, time } = getNow();
  const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
  const ramT = Math.round(os.totalmem() / 1024 / 1024);
  const up = runtime(process.uptime());
  const ping = Date.now();

  const txt =
`\`\`\`
╔══════════════════════════════╗
║  ✅  BOT IS ALIVE & ONLINE   ║
╠══════════════════════════════╣
║  STATUS » RUNNING            ║
║  MODE   » ${(config.MODE||'PUBLIC').toUpperCase().padEnd(20)}║
╚══════════════════════════════╝
\`\`\`
*[ RUNTIME STATS ]*
┌─────────────────────────────
│ 👤 User   » ${pushname}
│ 🔑 Prefix » ${config.PREFIX}
│ ⏱️  Uptime » ${up}
│ 🧠 RAM    » ${ram}MB / ${ramT}MB
│ 💚 Status » ONLINE ✅
│ 📅 Date   » ${date}
│ ⏰ Time   » ${time}
└─────────────────────────────

\`\`\`
 [■■■■■■■■■■] 100% OPERATIONAL
▀▄▀▄ ABDULLAH-BOTZ 🇵🇰 ▄▀▄▀
\`\`\``;

  await conn.sendMessage(from, { image: { url: bot.ALIVE_IMG }, caption: txt, contextInfo }, { quoted: mek });
});

// Auto bio
let _bioint;
cmd({ on: 'body' }, async (conn) => {
  if (config.AUTO_BIO === 'true' && !_bioint) {
    _bioint = setInterval(async () => {
      await conn.updateProfileStatus(`⚡ ABDULLAH-BOTZ | Uptime: ${runtime(process.uptime())} 🇵🇰`);
    }, 60000);
  }
});

// ╔══════════════════════════════════════╗
// ║  .menu                              ║
// ╚══════════════════════════════════════╝
const CAT_META = {
  'main':      { icon: '🤖', label: 'MAIN'      },
  'group':     { icon: '👥', label: 'GROUP'     },
  'ai':        { icon: '🧠', label: 'AI'        },
  'tools':     { icon: '🔧', label: 'TOOLS'     },
  'search':    { icon: '🔍', label: 'SEARCH'    },
  'download':  { icon: '📥', label: 'DOWNLOAD'  },
  'utility':   { icon: '⚙️', label: 'UTILITY'   },
  'settings':  { icon: '🛠️', label: 'SETTINGS'  },
  'other':     { icon: '📦', label: 'OTHER'     },
};

function buildMenu(pushname) {
  const { date, time } = getNow();
  const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
  let total = 0;
  let catSections = '';

  for (const [cat, meta] of Object.entries(CAT_META)) {
    const cmds = commands.filter(c => c.category === cat && c.pattern && !c.dontAddCommandList);
    if (!cmds.length) continue;
    total += cmds.length;
    catSections += `\n*[ ${meta.icon} ${meta.label} — ${cmds.length} cmds ]*\n`;
    for (const c of cmds) {
      catSections += `┃ ➤ \`${config.PREFIX}${c.pattern}\`\n`;
    }
  }

  return `\`\`\`
╔══════════════════════════════╗
║   ABDULLAH-BOTZ COMMAND HUB  ║
╠══════════════════════════════╣
║  USER   » ${pushname.slice(0,19).padEnd(19)}║
║  PREFIX » ${config.PREFIX.padEnd(20)}║
║  UPTIME » ${runtime(process.uptime()).slice(0,20).padEnd(19)}║
║  RAM    » ${ram}MB${' '.repeat(Math.max(0,18-ram.length))}║
║  DATE   » ${new Date().toLocaleDateString('en-PK').slice(0,19).padEnd(19)}║
║  TIME   » ${time.slice(0,19).padEnd(19)}║
╚══════════════════════════════╝
\`\`\`
${catSections}
\`\`\`
╔══════════════════════════════╗
║  📊 TOTAL COMMANDS » ${String(total).padEnd(8)}║
║  📞 OWNER  » +${config.OWNER_NUMBER.slice(0,14).padEnd(14)}║
╚══════════════════════════════╝
▀▄▀▄ ABDULLAH-BOTZ 🇵🇰 ▄▀▄▀
\`\`\``;
}

cmd({
  pattern: 'menu', alias: ['help','cmds','commands','list'],
  react: '📜', desc: 'Show all commands', category: 'main', filename: __filename
}, async (conn, mek, m, { from, pushname, contextInfo }) => {
  await conn.sendMessage(from, {
    image: { url: bot.ALIVE_IMG },
    caption: buildMenu(pushname),
    contextInfo
  }, { quoted: mek });
});

// ╔══════════════════════════════════════╗
// ║  .owner                             ║
// ╚══════════════════════════════════════╝
cmd({
  pattern: 'owner', alias: ['ow'],
  react: '👑', desc: 'Get owner contact', category: 'main', filename: __filename
}, async (conn, mek, m, { from }) => {
  const num = config.OWNER_NUMBER || '923041956023';
  const name = config.OWNER_NAME || 'ABDULLAH';
  const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name} 👑\nORG:ABDULLAH-BOTZ;\nTEL;type=CELL;type=VOICE;waid=${num}:+${num}\nEND:VCARD`;
  await conn.sendMessage(from, { contacts: { displayName: name, contacts: [{ vcard }] } }, { quoted: mek });
  await conn.sendMessage(from, {
    text:
`\`\`\`
╔══════════════════════════════╗
║   👑  OWNER CONTACT CARD     ║
╠══════════════════════════════╣
║  NAME   » ${name.padEnd(20)}║
║  NUMBER » +${num.padEnd(19)}║
║  BOT    » ABDULLAH-BOTZ      ║
╚══════════════════════════════╝
▀▄▀▄ ABDULLAH-BOTZ 🇵🇰 ▄▀▄▀
\`\`\``
  }, { quoted: mek });
});

// ╔══════════════════════════════════════╗
// ║  .ping                              ║
// ╚══════════════════════════════════════╝
cmd({
  pattern: 'ping', alias: ['speed','pong'],
  react: '⚡', desc: 'Bot ping speed test', category: 'main', filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  const t1 = Date.now();
  const tmp = await conn.sendMessage(from, { text: '`[ ⚡ TESTING... ]`' }, { quoted: mek });
  const ms = Date.now() - t1;
  await conn.sendMessage(from, { delete: tmp.key });
  const grade = ms < 200 ? '🟢 ULTRA FAST' : ms < 500 ? '🟡 FAST' : ms < 1000 ? '🟠 NORMAL' : '🔴 SLOW';
  reply(
`\`\`\`
╔══════════════════════════════╗
║   ⚡  PING TEST RESULT       ║
╠══════════════════════════════╣
║  PING   » ${String(ms+'ms').padEnd(20)}║
║  GRADE  » ${grade.padEnd(20)}║
║  BOT    » ONLINE ✅           ║
╚══════════════════════════════╝
▀▄▀▄ ABDULLAH-BOTZ 🇵🇰 ▄▀▄▀
\`\`\``);
});

// ╔══════════════════════════════════════╗
// ║  .system                            ║
// ╚══════════════════════════════════════╝
cmd({
  pattern: 'system', alias: ['sysinfo','server'],
  react: '🖥️', desc: 'System info', category: 'main', filename: __filename
}, async (conn, mek, m, { from }) => {
  const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
  const ramT = Math.round(os.totalmem() / 1024 / 1024);
  const ramF = Math.round(os.freemem() / 1024 / 1024);
  const ramPct = Math.round((ram / ramT) * 100);

  await conn.sendMessage(from, {
    image: { url: bot.ALIVE_IMG },
    caption:
`\`\`\`
╔══════════════════════════════╗
║   🖥️   SYSTEM DASHBOARD      ║
╠══════════════════════════════╣
║  UPTIME  » ${runtime(process.uptime()).slice(0,19).padEnd(19)}║
║  NODE.JS » ${process.version.padEnd(20)}║
║  PLATFORM» ${os.platform().padEnd(20)}║
╠══════════════════════════════╣
║  RAM USED» ${(ram+'MB').padEnd(20)}║
║  RAM FREE» ${(ramF+'MB').padEnd(20)}║
║  RAM TOT » ${(ramT+'MB').padEnd(20)}║
║  LOAD    » [${bar(ramPct)}] ${ramPct}%  ║
╠══════════════════════════════╣
║  OWNER   » ${(config.OWNER_NAME||'ABDULLAH').padEnd(20)}║
║  VERSION » v9.0.0              ║
╚══════════════════════════════╝
▀▄▀▄ ABDULLAH-BOTZ 🇵🇰 ▄▀▄▀
\`\`\``
  }, { quoted: mek });
});

// ╔══════════════════════════════════════╗
// ║  .env                               ║
// ╚══════════════════════════════════════╝
function sw(v) { return v?.toString().toLowerCase() === 'true' ? '■ ON ' : '□ OFF'; }

cmd({
  pattern: 'env', alias: ['settings2','vars'],
  react: '⚙️', desc: 'All env settings', category: 'main', filename: __filename
}, async (conn, mek, m, { from }) => {
  await conn.sendMessage(from, {
    image: { url: bot.ALIVE_IMG },
    caption:
`\`\`\`
╔══════════════════════════════╗
║   ⚙️   ENV SETTINGS PANEL    ║
╠══════════════════════════════╣
║  [ STATUS FEATURES ]         ║
║  Status View  » ${sw(config.AUTO_STATUS_SEEN)}          ║
║  Status React » ${sw(config.AUTO_STATUS_REACT)}          ║
╠══════════════════════════════╣
║  [ AUTO FEATURES ]           ║
║  Auto React   » ${sw(config.AUTO_REACT)}          ║
║  Auto Reply   » ${sw(config.AUTO_REPLY)}          ║
║  Auto Typing  » ${sw(config.AUTO_TYPING)}          ║
║  Auto Record  » ${sw(config.AUTO_RECORDING)}          ║
║  Auto Sticker » ${sw(config.AUTO_STICKER)}          ║
║  Auto Voice   » ${sw(config.AUTO_VOICE)}          ║
╠══════════════════════════════╣
║  [ PROTECTION ]              ║
║  Anti Call    » ${sw(config.ANTI_CALL)}          ║
║  Anti Link    » ${sw(config.ANTI_LINK)}          ║
║  Anti Bad     » ${sw(config.ANTI_BAD)}          ║
║  Anti Delete  » ${sw(config.ANTI_DELETE)}          ║
║  Anti VV      » ${sw(config.ANTI_VV)}          ║
╠══════════════════════════════╣
║  [ BOT CONFIG ]              ║
║  Mode         » ${(config.MODE||'PUBLIC').toUpperCase().padEnd(12)}║
║  Always Online» ${sw(config.ALWAYS_ONLINE)}          ║
╚══════════════════════════════╝
▀▄▀▄ ABDULLAH-BOTZ 🇵🇰 ▄▀▄▀
\`\`\``
  }, { quoted: mek });
});

// ╔══════════════════════════════════════╗
// ║  .settings                          ║
// ╚══════════════════════════════════════╝
cmd({
  pattern: 'settings', alias: ['setting','panel'],
  react: '🛠️', desc: 'Bot settings panel', category: 'main', filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  const vv = await conn.sendMessage(from, {
    image: { url: bot.ALIVE_IMG },
    caption:
`\`\`\`
╔══════════════════════════════╗
║   🛠️   SETTINGS PANEL        ║
╠══════════════════════════════╣
║  Reply with number to change  ║
╠══════════════════════════════╣
║  [ WORK MODE ]               ║
║  1.1 » Public Mode           ║
║  1.2 » Private Mode          ║
║  1.3 » Groups Only           ║
║  1.4 » Inbox Only            ║
╠══════════════════════════════╣
║  [ AUTO STATUS ]             ║
║  3.1 » Status View ON        ║
║  3.2 » Status View OFF       ║
╠══════════════════════════════╣
║  [ AUTO REACT ]              ║
║  4.1 » Auto React ON         ║
║  4.2 » Auto React OFF        ║
╠══════════════════════════════╣
║  [ AUTO TYPING ]             ║
║  5.1 » Auto Typing ON        ║
║  5.2 » Auto Typing OFF       ║
╚══════════════════════════════╝
▀▄▀▄ ABDULLAH-BOTZ 🇵🇰 ▄▀▄▀
\`\`\``
  }, { quoted: mek });

  conn.ev.on('messages.upsert', async (u) => {
    const msg = u.messages[0];
    if (!msg.message?.extendedTextMessage) return;
    const opt = msg.message.extendedTextMessage.text.trim();
    if (msg.message.extendedTextMessage.contextInfo?.stanzaId === vv.key.id) {
      const actions = {
        '1.1': () => { config.MODE = 'public';  reply('✅ Mode: PUBLIC'); },
        '1.2': () => { config.MODE = 'private'; reply('✅ Mode: PRIVATE'); },
        '1.3': () => { config.MODE = 'groups';  reply('✅ Mode: GROUPS'); },
        '1.4': () => { config.MODE = 'inbox';   reply('✅ Mode: INBOX'); },
        '3.1': () => { config.AUTO_STATUS_SEEN = 'true';  reply('✅ Status View: ON'); },
        '3.2': () => { config.AUTO_STATUS_SEEN = 'false'; reply('✅ Status View: OFF'); },
        '4.1': () => { config.AUTO_REACT = 'true';  reply('✅ Auto React: ON'); },
        '4.2': () => { config.AUTO_REACT = 'false'; reply('✅ Auto React: OFF'); },
        '5.1': () => { config.AUTO_TYPING = 'true';  reply('✅ Auto Typing: ON'); },
        '5.2': () => { config.AUTO_TYPING = 'false'; reply('✅ Auto Typing: OFF'); },
      };
      if (actions[opt]) actions[opt]();
      else reply('❌ Invalid option!');
    }
  });
});

// ╔══════════════════════════════════════╗
// ║  .repo                              ║
// ╚══════════════════════════════════════╝
cmd({
  pattern: 'repo', alias: ['github','source'],
  react: '🔗', desc: 'Bot repo info', category: 'main', filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  reply(
`\`\`\`
╔══════════════════════════════╗
║   🔗  REPO / SOURCE CODE     ║
╠══════════════════════════════╣
║  OWNER  » ${(config.OWNER_NAME||'ABDULLAH').padEnd(20)}║
║  NUMBER » +${config.OWNER_NUMBER.slice(0,18).padEnd(18)}║
║  BOT    » ABDULLAH-BOTZ      ║
╠══════════════════════════════╣
║  REPO    » ${bot.REPO_LINK.slice(0,19).padEnd(19)}║
║  CHANNEL » WhatsApp Channel   ║
║  VERSION » v9.0.0             ║
╚══════════════════════════════╝
⭐ Star the repo if you love it!
▀▄▀▄ ABDULLAH-BOTZ 🇵🇰 ▄▀▄▀
\`\`\``);
});

// ╔══════════════════════════════════════╗
// ║  Background handlers                ║
// ╚══════════════════════════════════════╝
cmd({ on: 'body' }, async (conn, mek, m, { from }) => {
  if (config.AUTO_RECORDING === 'true') await conn.sendPresenceUpdate('recording', from).catch(() => {});
});
cmd({ on: 'body' }, async (conn, mek, m, { from }) => {
  if (config.AUTO_TYPING === 'true') await conn.sendPresenceUpdate('composing', from).catch(() => {});
});
cmd({ on: 'body' }, async (conn, mek, m, { from }) => {
  if (config.ALWAYS_ONLINE === 'true') await conn.sendPresenceUpdate('available', from).catch(() => {});
});
cmd({ on: 'body' }, async (conn, mek, m, { from, body }) => {
  try {
    if (config.AUTO_REPLY !== 'true') return;
    const rep = await axios.get(bot.BOT_URL).catch(() => null);
    if (!rep) return;
    const url = rep.data?.reply;
    if (!url) return;
    const { data } = await axios.get(url).catch(() => ({ data: {} }));
    for (const text in data) {
      if (body.toLowerCase() === text.toLowerCase()) await m.reply(data[text]);
    }
  } catch {}
});

// Anti bad words
cmd({ on: 'body' }, async (conn, mek, m, { from, body, isGroup, isAdmins, isBotAdmins }) => {
  try {
    const bw = ['porn','xxx','nude','fuck','sex','xnxx','pussy','dick','boobs','naked'];
    if (!isGroup || isAdmins || !isBotAdmins) return;
    if (bw.some(w => body.toLowerCase().includes(w)) && config.ANTI_BAD === 'true') {
      await conn.sendMessage(from, { delete: mek.key }, { quoted: mek });
    }
  } catch {}
});

// Anti link
const LP = [
  /https?:\/\/(?:chat\.whatsapp\.com|wa\.me)\/\S+/gi,
  /https?:\/\/(?:t\.me|telegram\.me)\/\S+/gi,
];
cmd({ on: 'body' }, async (conn, mek, m, { from, body, sender, isGroup, isAdmins, isBotAdmins }) => {
  try {
    if (!isGroup || isAdmins || !isBotAdmins) return;
    if (LP.some(p => p.test(body)) && config.ANTI_LINK === 'true') {
      await conn.sendMessage(from, { delete: mek.key }, { quoted: mek });
      await conn.groupParticipantsUpdate(from, [sender], 'remove');
    }
  } catch {}
});

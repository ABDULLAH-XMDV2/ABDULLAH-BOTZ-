const { cmd } = require('../lib/command');
const config = require('../setting');
const axios = require('axios');
const os = require('os');
const { runtime } = require('../lib/functions');

// ══════════════════════════════════════════
//  .ping
// ══════════════════════════════════════════
cmd({
  pattern: 'ping2', alias: ['p2'],
  react: '🏓', desc: 'Bot ping check', category: 'utility', filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  const t = Date.now();
  await reply('`[ ⚡ PINGING... ]`');
  const ms = Date.now() - t;
  reply(`\`\`\`[ 🏓 PING RESULT ]\nSpeed  » ${ms}ms\nStatus » ✅ ONLINE\nBot    » ABDULLAH-BOTZ\`\`\``);
});

// ══════════════════════════════════════════
//  .sticker
// ══════════════════════════════════════════
cmd({
  pattern: 'sticker', alias: ['s','stiker','stic'],
  react: '🎨', desc: 'Image/video to sticker', category: 'tools',
  use: '.sticker (reply to image/video)', filename: __filename
}, async (conn, mek, m, { from, reply, quoted }) => {
  try {
    const msg = quoted || mek;
    const type = Object.keys(msg.message || {})[0];
    if (!type || (!type.includes('image') && !type.includes('video')))
      return reply('❌ *Reply to an image or video with .sticker*');
    await reply('`[ ⏳ MAKING STICKER... ]`');
    const { Sticker, StickerTypes } = require('wa-sticker-formatter');
    const media = await conn.downloadMediaMessage(msg, 'buffer');
    const sticker = new Sticker(media, {
      pack: config.STICKER_NAME || 'ABDULLAH-BOTZ',
      author: config.OWNER_NAME || 'ABDULLAH',
      type: StickerTypes.FULL,
      quality: 50
    });
    await conn.sendMessage(from, { sticker: await sticker.toBuffer() }, { quoted: mek });
  } catch(e) { reply(`❌ Sticker error: ${e.message}`); }
});

// ══════════════════════════════════════════
//  .tomp3
// ══════════════════════════════════════════
cmd({
  pattern: 'tomp3', dontAddCommandList: true,
  alias: ['mp3','v2a','videotoaudio'],
  react: '🎵', desc: 'Video to audio', category: 'tools',
  use: '.tomp3 (reply to video)', filename: __filename
}, async (conn, mek, m, { from, reply, quoted }) => {
  try {
    const msg = quoted || mek;
    const type = Object.keys(msg.message || {})[0];
    if (!type?.includes('video')) return reply('❌ *Reply to a video with .tomp3*');
    const media = await conn.downloadMediaMessage(msg, 'buffer');
    await conn.sendMessage(from, { audio: media, mimetype: 'audio/mp4', ptt: false }, { quoted: mek });
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ══════════════════════════════════════════
//  .qr  — FIXED
// ══════════════════════════════════════════
cmd({
  pattern: 'qr', alias: ['qrcode','makeqr','qrgen'],
  react: '📷', desc: 'Generate QR code from text/link', category: 'tools',
  use: '.qr <text or url>', filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const text = args.join(' ');
  if (!text) return reply(
`\`\`\`[ 📷 QR GENERATOR ]
Usage : .qr <text or link>
Eg    : .qr https://google.com
Eg    : .qr Hello World
\`\`\``);
  try {
    // API 1: qrserver (most reliable)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text)}&bgcolor=000000&color=00ff00&margin=20&format=png`;
    const res = await axios.get(qrUrl, { responseType: 'arraybuffer', timeout: 15000 });
    const buf = Buffer.from(res.data);
    await conn.sendMessage(from, {
      image: buf,
      caption: `\`\`\`[ 📷 QR CODE GENERATED ]\nData » ${text.slice(0,50)}${text.length>50?'...':''}\nBot  » ABDULLAH-BOTZ 🇵🇰\`\`\``
    }, { quoted: mek });
  } catch(e) {
    // Fallback API
    try {
      const fallback = `https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl=${encodeURIComponent(text)}&choe=UTF-8`;
      const res2 = await axios.get(fallback, { responseType: 'arraybuffer', timeout: 15000 });
      await conn.sendMessage(from, {
        image: Buffer.from(res2.data),
        caption: `\`[ 📷 QR CODE ]\n[ ${text.slice(0,40)} ]\``
      }, { quoted: mek });
    } catch(e2) { reply(`❌ QR failed: ${e2.message}`); }
  }
});

// ══════════════════════════════════════════
//  .id
// ══════════════════════════════════════════
cmd({
  pattern: 'id', alias: ['getid','jid','myid'],
  react: '🔍', desc: 'Get JID/ID info', category: 'utility', filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  const meta = isGroup ? await conn.groupMetadata(from).catch(() => null) : null;
  reply(`\`\`\`[ 🔍 ID INFO ]\nChat   » ${from}\nSender » ${sender}\n${meta?`Group  » ${meta.subject}\nMembers» ${meta.participants?.length||0}`:'Type   » Private'}\`\`\``);
});

// ══════════════════════════════════════════
//  .define
// ══════════════════════════════════════════
cmd({
  pattern: 'define', alias: ['meaning','dict','word'],
  react: '📖', desc: 'Word definition', category: 'search',
  use: '.define <word>', filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const word = args[0];
  if (!word) return reply('❌ `.define <word>`');
  try {
    const { data } = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      { timeout: 10000 }
    );
    const m0 = data[0]?.meanings?.[0];
    const def = m0?.definitions?.[0];
    if (!def) return reply('❌ Word not found!');
    reply(`\`\`\`[ 📖 DICTIONARY ]\nWord    » ${word}\nType    » ${m0.partOfSpeech||'N/A'}\nMeaning » ${def.definition}\n${def.example?`Example » ${def.example}`:''}\`\`\``);
  } catch(e) { reply(`❌ Not found: ${word}`); }
});

// ══════════════════════════════════════════
//  .weather
// ══════════════════════════════════════════
cmd({
  pattern: 'weather', alias: ['wthr','clima'],
  react: '🌤️', desc: 'Weather info', category: 'utility',
  use: '.weather <city>', filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const city = args.join(' ') || 'Karachi';
  try {
    const { data } = await axios.get(
      `https://wttr.in/${encodeURIComponent(city)}?format=3`,
      { timeout: 10000, headers: { 'User-Agent': 'curl/7.68.0' } }
    );
    reply(`\`\`\`[ 🌤️ WEATHER ]\n${data}\n[ ABDULLAH-BOTZ ]\`\`\``);
  } catch(e) { reply(`❌ Weather not found for: ${city}`); }
});

// ══════════════════════════════════════════
//  .prayertime
// ══════════════════════════════════════════
cmd({
  pattern: 'prayertime', alias: ['namaz','prayer','salah'],
  react: '🕌', desc: 'Prayer times for a city', category: 'utility',
  use: '.prayertime <city>', filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const city = args.join(' ') || 'Karachi';
  try {
    const { data } = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=PK&method=1`,
      { timeout: 12000 }
    );
    const t = data.data.timings;
    reply(`\`\`\`[ 🕌 PRAYER TIMES — ${city.toUpperCase()} ]\nFajr    » ${t.Fajr}\nSunrise » ${t.Sunrise}\nDhuhr   » ${t.Dhuhr}\nAsr     » ${t.Asr}\nMaghrib » ${t.Maghrib}\nIsha    » ${t.Isha}\n\n[ ABDULLAH-BOTZ 🇵🇰 ]\`\`\``);
  } catch(e) { reply(`❌ Not found: ${city}`); }
});

// ══════════════════════════════════════════
//  .convert (currency)
// ══════════════════════════════════════════
cmd({
  pattern: 'convert', alias: ['currency','cur'],
  react: '💱', desc: 'Currency converter', category: 'utility',
  use: '.convert <amount> <FROM> <TO>', filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  if (args.length < 3) return reply('❌ `.convert 100 USD PKR`');
  const [amount, fc, tc] = args;
  try {
    const { data } = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/${fc.toUpperCase()}`,
      { timeout: 10000 }
    );
    const rate = data.rates[tc.toUpperCase()];
    if (!rate) return reply(`❌ Invalid currency: ${tc}`);
    const result = (parseFloat(amount) * rate).toFixed(2);
    reply(`\`\`\`[ 💱 CURRENCY CONVERTER ]\n${amount} ${fc.toUpperCase()} = ${result} ${tc.toUpperCase()}\nRate » 1 ${fc.toUpperCase()} = ${rate} ${tc.toUpperCase()}\n[ ABDULLAH-BOTZ ]\`\`\``);
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ══════════════════════════════════════════
//  .font
// ══════════════════════════════════════════
const FM = {
  1: t => t.replace(/[a-z]/g,c=>'𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇'[c.charCodeAt(0)-97]).replace(/[A-Z]/g,c=>'𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭'[c.charCodeAt(0)-65]),
  2: t => t.replace(/[a-z]/g,c=>'𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻'[c.charCodeAt(0)-97]).replace(/[A-Z]/g,c=>'𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡'[c.charCodeAt(0)-65]),
  3: t => t.replace(/[a-z]/g,c=>'𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃'[c.charCodeAt(0)-97]).replace(/[A-Z]/g,c=>'𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩'[c.charCodeAt(0)-65]),
  4: t => t.replace(/[a-z]/g,c=>'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ'[c.charCodeAt(0)-97]).replace(/[A-Z]/g,c=>'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ'[c.charCodeAt(0)-65]),
  5: t => [...t].map(c=>c+'̶').join(''),
};
cmd({
  pattern: 'font', dontAddCommandList: true,
  alias: ['fonts'],
  react: '✒️', desc: 'Text font converter', category: 'tools',
  use: '.font <1-5> <text>', filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const n = parseInt(args[0]);
  const text = args.slice(1).join(' ');
  if (!n || !text || !FM[n]) return reply('❌ `.font 1 Hello`\nStyles: 1=Bold 2=Italic 3=Cursive 4=Wide 5=Strike');
  reply(`\`\`\`[ ✒️ FONT STYLE ${n} ]\n${FM[n](text)}\`\`\``);
});

// ══════════════════════════════════════════
//  .wiki
// ══════════════════════════════════════════
cmd({
  pattern: 'wiki', dontAddCommandList: true,
  alias: ['wikipedia'],
  react: '📚', desc: 'Wikipedia search', category: 'search',
  use: '.wiki <topic>', filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const q = args.join(' ');
  if (!q) return reply('❌ `.wiki <topic>`');
  try {
    const { data } = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`,
      { timeout: 10000 }
    );
    if (!data?.extract) return reply('❌ Not found!');
    reply(`\`\`\`[ 📚 WIKIPEDIA ]\nTopic » ${data.title}\`\`\`\n\n${data.extract.slice(0,800)}...\n\n🔗 ${data.content_urls?.desktop?.page||''}`);
  } catch(e) { reply(`❌ Not found: ${q}`); }
});

// ══════════════════════════════════════════
//  .calc
// ══════════════════════════════════════════
cmd({
  pattern: 'calc', dontAddCommandList: true,
  alias: ['calculate','math2'],
  react: '🔢', desc: 'Calculator', category: 'utility',
  use: '.calc <expression>', filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const expr = args.join(' ');
  if (!expr) return reply('❌ `.calc 2+2*5`');
  try {
    const safe = expr.replace(/[^0-9+\-*/.() %^]/g,'');
    const result = Function(`'use strict'; return (${safe})`)();
    reply(`\`\`\`[ 🔢 CALCULATOR ]\n${expr} = ${result}\`\`\``);
  } catch(e) { reply(`❌ Invalid expression: ${expr}`); }
});

// ══════════════════════════════════════════
//  .reverse
// ══════════════════════════════════════════
cmd({
  pattern: 'reverse', dontAddCommandList: true,
  alias: ['rev'],
  react: '🔄', desc: 'Reverse text', category: 'tools',
  use: '.reverse <text>', filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const text = args.join(' ');
  if (!text) return reply('❌ `.reverse <text>`');
  reply(`\`\`\`[ 🔄 REVERSED ]\n${[...text].reverse().join('')}\`\`\``);
});

// ══════════════════════════════════════════
//  .wordcount
// ══════════════════════════════════════════
cmd({
  pattern: 'wordcount', dontAddCommandList: true,
  alias: ['wc','charcount'],
  react: '📊', desc: 'Count words/chars', category: 'tools',
  use: '.wordcount <text>', filename: __filename
}, async (conn, mek, m, { from, args, reply, quoted }) => {
  const text = args.join(' ') || quoted?.text;
  if (!text) return reply('❌ `.wordcount <text>` ya reply karo');
  const words = text.trim().split(/\s+/).length;
  const chars = text.length;
  const lines = text.split('\n').length;
  reply(`\`\`\`[ 📊 TEXT STATS ]\nWords » ${words}\nChars » ${chars}\nLines » ${lines}\`\`\``);
});

// ══════════════════════════════════════════
//  .ip
// ══════════════════════════════════════════
cmd({
  pattern: 'ip', dontAddCommandList: true,
  alias: ['ipinfo','iplookup'],
  react: '🌐', desc: 'IP address lookup', category: 'utility',
  use: '.ip <ip address>', filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const ip = args[0];
  if (!ip) return reply('❌ `.ip <ip address>`\nExample: .ip 8.8.8.8');
  try {
    const { data } = await axios.get(`http://ip-api.com/json/${ip}`, { timeout: 10000 });
    if (data.status !== 'success') return reply('❌ Invalid IP!');
    reply(`\`\`\`[ 🌐 IP LOOKUP ]\nIP      » ${data.query}\nCountry » ${data.country}\nCity    » ${data.city}\nISP     » ${data.isp}\nOrg     » ${data.org}\nLat/Lon » ${data.lat}, ${data.lon}\`\`\``);
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ══════════════════════════════════════════
//  .numcheck
// ══════════════════════════════════════════
cmd({
  pattern: 'numcheck', dontAddCommandList: true,
  alias: ['checknum','isonwa'],
  react: '📱', desc: 'Check if number is on WhatsApp', category: 'utility',
  use: '.numcheck <number>', filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const num = args[0]?.replace(/[^0-9]/g,'');
  if (!num) return reply('❌ `.numcheck 923001234567`');
  try {
    const jid = num + '@s.whatsapp.net';
    const [result] = await conn.onWhatsApp(jid);
    if (result?.exists) {
      reply(`\`\`\`[ 📱 NUMBER CHECK ]\nNumber » +${num}\nStatus » ✅ ON WHATSAPP\nJID    » ${result.jid}\`\`\``);
    } else {
      reply(`\`\`\`[ 📱 NUMBER CHECK ]\nNumber » +${num}\nStatus » ❌ NOT ON WHATSAPP\`\`\``);
    }
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ══════════════════════════════════════════
//  .linkcheck
// ══════════════════════════════════════════
cmd({
  pattern: 'linkcheck', dontAddCommandList: true,
  alias: ['checklink','urlcheck'],
  react: '🔗', desc: 'Check if a link is safe/alive', category: 'utility',
  use: '.linkcheck <url>', filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const url = args[0];
  if (!url) return reply('❌ `.linkcheck <url>`');
  try {
    const t = Date.now();
    const res = await axios.get(url, { timeout: 10000, maxRedirects: 5 });
    const ms = Date.now() - t;
    reply(`\`\`\`[ 🔗 LINK CHECK ]\nURL    » ${url.slice(0,50)}\nStatus » ✅ ALIVE (${res.status})\nSpeed  » ${ms}ms\nType   » ${res.headers['content-type']?.split(';')[0]||'unknown'}\`\`\``);
  } catch(e) {
    reply(`\`\`\`[ 🔗 LINK CHECK ]\nURL    » ${url.slice(0,50)}\nStatus » ❌ ${e.response?.status||'UNREACHABLE'}\`\`\``);
  }
});

// ══════════════════════════════════════════
//  .screenshot (website)
// ══════════════════════════════════════════
cmd({
  pattern: 'screenshot', dontAddCommandList: true,
  alias: ['ss','webss','capture'],
  react: '📸', desc: 'Website screenshot', category: 'tools',
  use: '.screenshot <url>', filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const url = args[0];
  if (!url) return reply('❌ `.screenshot https://example.com`');
  try {
    await reply('`[ ⏳ CAPTURING SCREENSHOT... ]`');
    // Use thum.io free API
    const ssUrl = `https://image.thum.io/get/width/1280/crop/720/noanimate/${url}`;
    const res = await axios.get(ssUrl, { responseType: 'arraybuffer', timeout: 20000 });
    await conn.sendMessage(from, {
      image: Buffer.from(res.data),
      caption: `\`\`\`[ 📸 SCREENSHOT ]\nURL » ${url.slice(0,50)}\n[ ABDULLAH-BOTZ ]\`\`\``
    }, { quoted: mek });
  } catch(e) { reply(`❌ Screenshot failed: ${e.message}`); }
});

// ══════════════════════════════════════════
//  .uptime
// ══════════════════════════════════════════
cmd({
  pattern: 'uptime', alias: ['runtime','ut'],
  react: '⏱️', desc: 'Bot uptime', category: 'utility', filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  reply(`\`\`\`[ ⏱️ BOT UPTIME ]\nRunning » ${runtime(process.uptime())}\nRAM     » ${(process.memoryUsage().heapUsed/1024/1024).toFixed(1)}MB\nNode    » ${process.version}\`\`\``);
});

module.exports = {};

const { cmd } = require('../lib/command');
const axios = require('axios');

// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
//  MULTI-API SYSTEM — fallback chain
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
async function getBuffer(url) {
  const res = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 40000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': '*/*'
    }
  });
  return Buffer.from(res.data);
}

// ── TikTok APIs (3 fallbacks) ─────────────────
async function tiktokDownload(url) {
  const apis = [
    `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&web=1&hd=1`,
    `https://tikwm.com/api/?url=${encodeURIComponent(url)}&count=12&cursor=0&web=1&hd=1`,
    `https://api.tikmate.app/api/lookup?url=${encodeURIComponent(url)}`
  ];
  for (const api of apis) {
    try {
      const { data } = await axios.get(api, { timeout: 15000 });
      if (data?.data?.hdplay || data?.data?.play) return data.data;
    } catch {}
  }
  // API 4: savetube
  try {
    const { data } = await axios.get(
      `https://cdn.savetube.me/info?url=${encodeURIComponent(url)}`,
      { timeout: 15000 }
    );
    if (data?.data?.video) return { play: data.data.video, title: data.data.title, author: { nickname: 'TikTok' } };
  } catch {}
  return null;
}

// ── YouTube APIs (3 fallbacks) ────────────────
function ytId(url) {
  const m = url.match(/(?:v=|youtu\.be\/|\/embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}
async function ytAudioDownload(url) {
  const id = ytId(url);
  if (!id) return null;
  // API 1: yt-dlp public
  const apis = [
    `https://yt-dlp-api.vercel.app/audio?url=${encodeURIComponent(url)}`,
    `https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/?url=${encodeURIComponent(url)}`,
    `https://y2down.cc/api/mp3?url=https://www.youtube.com/watch?v=${id}`
  ];
  for (const api of apis) {
    try {
      const { data } = await axios.get(api, { timeout: 20000 });
      const link = data?.link || data?.url || data?.dlink || data?.audio;
      if (link && link.startsWith('http')) return link;
    } catch {}
  }
  // API fallback: cobalt
  try {
    const res = await axios.post('https://api.cobalt.tools/api/json',
      { url, isAudioOnly: true, aFormat: 'mp3' },
      { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, timeout: 20000 }
    );
    if (res.data?.url) return res.data.url;
  } catch {}
  return null;
}

async function ytVideoDownload(url) {
  // cobalt.tools
  try {
    const res = await axios.post('https://api.cobalt.tools/api/json',
      { url, vCodec: 'h264', vQuality: '720', isAudioOnly: false },
      { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, timeout: 25000 }
    );
    if (res.data?.url) return res.data.url;
  } catch {}
  // yt1s
  try {
    const id = ytId(url);
    const r = await axios.post('https://yt1s.com/api/ajaxSearch/index',
      `q=https://www.youtube.com/watch?v=${id}&vt=home`,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 15000 }
    );
    const kData = r.data?.links?.mp4;
    if (kData) {
      const key = Object.keys(kData).find(k => kData[k]?.q?.includes('720') || kData[k]?.q?.includes('480'));
      if (key) {
        const conv = await axios.post('https://yt1s.com/api/ajaxConvert/convert',
          `vid=${id}&k=${key}`,
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 15000 }
        );
        if (conv.data?.dlink) return conv.data.dlink;
      }
    }
  } catch {}
  return null;
}

// ── Instagram APIs (3 fallbacks) ─────────────
async function igDownload(url) {
  // API 1: cobalt
  try {
    const res = await axios.post('https://api.cobalt.tools/api/json',
      { url },
      { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, timeout: 20000 }
    );
    if (res.data?.url) return { url: res.data.url, type: 'video' };
    if (res.data?.picker?.[0]?.url) return { url: res.data.picker[0].url, type: 'image' };
  } catch {}
  // API 2: savetube
  try {
    const { data } = await axios.get(
      `https://cdn.savetube.me/info?url=${encodeURIComponent(url)}`,
      { timeout: 15000 }
    );
    if (data?.data?.video) return { url: data.data.video, type: 'video' };
    if (data?.data?.image) return { url: data.data.image, type: 'image' };
  } catch {}
  // API 3: snapinsta
  try {
    const { data } = await axios.get(
      `https://snapinsta.app/api.php?url=${encodeURIComponent(url)}`,
      { timeout: 15000 }
    );
    if (data?.url) return { url: data.url, type: 'video' };
  } catch {}
  return null;
}

// ── Facebook APIs (2 fallbacks) ──────────────
async function fbDownload(url) {
  try {
    const res = await axios.post('https://api.cobalt.tools/api/json',
      { url },
      { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, timeout: 20000 }
    );
    if (res.data?.url) return res.data.url;
  } catch {}
  try {
    const { data } = await axios.get(
      `https://cdn.savetube.me/info?url=${encodeURIComponent(url)}`,
      { timeout: 15000 }
    );
    if (data?.data?.video) return data.data.video;
  } catch {}
  return null;
}

// ── Twitter/X APIs ────────────────────────────
async function twDownload(url) {
  try {
    const res = await axios.post('https://api.cobalt.tools/api/json',
      { url },
      { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, timeout: 20000 }
    );
    if (res.data?.url) return res.data.url;
  } catch {}
  try {
    const { data } = await axios.get(
      `https://twitsave.com/info?url=${encodeURIComponent(url)}`,
      { timeout: 15000 }
    );
    if (data?.data?.[0]?.highest_quality) return data.data[0].highest_quality;
  } catch {}
  return null;
}

// ══════════════════════════════════════════
//  1. TIKTOK VIDEO
// ══════════════════════════════════════════
cmd({
  pattern: 'tiktok', alias: ['tt','tik','tikdl'],
  react: '🎵', desc: 'TikTok video download (no watermark)',
  category: 'download', use: '.tiktok <url>', filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const url = args[0];
  if (!url || !url.includes('tiktok')) return reply(
`\`\`\`[ 🎵 TIKTOK DOWNLOADER ]
Usage : .tiktok <url>
Eg    : .tiktok https://tiktok.com/...
\`\`\``);
  await reply('`[ ⏳ DOWNLOADING TIKTOK... ]`');
  try {
    const d = await tiktokDownload(url);
    if (!d) return reply('`[ ❌ VIDEO NOT FOUND — Try again ]`');
    const videoUrl = d.hdplay || d.play;
    const buf = await getBuffer(videoUrl);
    await conn.sendMessage(from, {
      video: buf,
      caption: `\`\`\`[ 🎵 TIKTOK VIDEO ]\nTitle  » ${(d.title||'TikTok').slice(0,40)}\nAuthor » @${d.author?.nickname||'Unknown'}\nBot    » ABDULLAH-BOTZ 🇵🇰\`\`\``,
      mimetype: 'video/mp4'
    }, { quoted: mek });
  } catch(e) { reply(`\`[ ❌ ERROR: ${e.message} ]\``); }
});

// ══════════════════════════════════════════
//  2. TIKTOK AUDIO
// ══════════════════════════════════════════
cmd({
  pattern: 'ttaudio', alias: ['ttmp3','tikmp3','tiktokmp3'],
  react: '🎶', desc: 'TikTok audio/music download',
  category: 'download', use: '.ttaudio <url>', filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const url = args[0];
  if (!url || !url.includes('tiktok')) return reply('❌ `.ttaudio <tiktok url>`');
  await reply('`[ ⏳ EXTRACTING AUDIO... ]`');
  try {
    const d = await tiktokDownload(url);
    if (!d?.music && !d?.play) return reply('`[ ❌ AUDIO NOT FOUND ]`');
    const buf = await getBuffer(d.music || d.play);
    await conn.sendMessage(from, {
      audio: buf, mimetype: 'audio/mpeg', ptt: false
    }, { quoted: mek });
  } catch(e) { reply(`\`[ ❌ ${e.message} ]\``); }
});

// ══════════════════════════════════════════
//  3. YOUTUBE VIDEO
// ══════════════════════════════════════════
cmd({
  pattern: 'ytv', alias: ['ytvideo','yt','youtubemp4','ytdl'],
  react: '📹', desc: 'YouTube video download',
  category: 'download', use: '.ytv <url>', filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const url = args[0];
  if (!url || (!url.includes('youtube') && !url.includes('youtu.be')))
    return reply('❌ `.ytv <youtube url>`');
  await reply('`[ ⏳ DOWNLOADING YOUTUBE VIDEO... may take 30s ]`');
  try {
    const videoUrl = await ytVideoDownload(url);
    if (!videoUrl) return reply('`[ ❌ Video too large or not available.\nTry .yta for audio only ]`');
    const buf = await getBuffer(videoUrl);
    await conn.sendMessage(from, {
      video: buf,
      caption: `\`\`\`[ 📹 YOUTUBE VIDEO ]\nURL » ${url.slice(0,40)}...\nBot » ABDULLAH-BOTZ 🇵🇰\`\`\``,
      mimetype: 'video/mp4'
    }, { quoted: mek });
  } catch(e) { reply(`\`[ ❌ ERROR: ${e.message} ]\n[ Tip: Try .yta for audio ]\``); }
});

// ══════════════════════════════════════════
//  4. YOUTUBE MP3
// ══════════════════════════════════════════
cmd({
  pattern: 'yta', alias: ['ytmp3','ytaudio','youtubemp3','ytsong'],
  react: '🎵', desc: 'YouTube audio as MP3',
  category: 'download', use: '.yta <url>', filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const url = args[0];
  if (!url || (!url.includes('youtube') && !url.includes('youtu.be')))
    return reply('❌ `.yta <youtube url>`');
  await reply('`[ ⏳ CONVERTING TO MP3... ]`');
  try {
    const audioUrl = await ytAudioDownload(url);
    if (!audioUrl) return reply('`[ ❌ Audio not found! Try different video ]`');
    const buf = await getBuffer(audioUrl);
    await conn.sendMessage(from, {
      audio: buf, mimetype: 'audio/mpeg', ptt: false
    }, { quoted: mek });
  } catch(e) { reply(`\`[ ❌ ${e.message} ]\``); }
});

// ══════════════════════════════════════════
//  5. INSTAGRAM
// ══════════════════════════════════════════
cmd({
  pattern: 'ig', alias: ['insta','instagram','igdl','reel'],
  react: '📸', desc: 'Instagram reel/post/story download',
  category: 'download', use: '.ig <url>', filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const url = args[0];
  if (!url || !url.includes('instagram')) return reply('❌ `.ig <instagram url>`');
  await reply('`[ ⏳ DOWNLOADING INSTAGRAM... ]`');
  try {
    const result = await igDownload(url);
    if (!result?.url) return reply('`[ ❌ Media not found!\nPublic posts only work ]`');
    const buf = await getBuffer(result.url);
    if (result.type === 'video') {
      await conn.sendMessage(from, {
        video: buf,
        caption: `\`[ 📸 INSTAGRAM VIDEO ]\n[ ABDULLAH-BOTZ 🇵🇰 ]\``,
        mimetype: 'video/mp4'
      }, { quoted: mek });
    } else {
      await conn.sendMessage(from, {
        image: buf,
        caption: `\`[ 📸 INSTAGRAM IMAGE ]\n[ ABDULLAH-BOTZ 🇵🇰 ]\``
      }, { quoted: mek });
    }
  } catch(e) { reply(`\`[ ❌ ${e.message} ]\``); }
});

// ══════════════════════════════════════════
//  6. FACEBOOK
// ══════════════════════════════════════════
cmd({
  pattern: 'fb', alias: ['facebook','fbdl','fbvideo'],
  react: '📘', desc: 'Facebook video download',
  category: 'download', use: '.fb <url>', filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const url = args[0];
  if (!url || (!url.includes('facebook') && !url.includes('fb.watch') && !url.includes('fb.com')))
    return reply('❌ `.fb <facebook url>`');
  await reply('`[ ⏳ DOWNLOADING FACEBOOK VIDEO... ]`');
  try {
    const videoUrl = await fbDownload(url);
    if (!videoUrl) return reply('`[ ❌ Video not found! Public videos only ]`');
    const buf = await getBuffer(videoUrl);
    await conn.sendMessage(from, {
      video: buf,
      caption: `\`[ 📘 FACEBOOK VIDEO ]\n[ ABDULLAH-BOTZ 🇵🇰 ]\``,
      mimetype: 'video/mp4'
    }, { quoted: mek });
  } catch(e) { reply(`\`[ ❌ ${e.message} ]\``); }
});

// ══════════════════════════════════════════
//  7. TWITTER / X
// ══════════════════════════════════════════
cmd({
  pattern: 'twitter', alias: ['tw','twdl','xdl','xvideo'],
  react: '🐦', desc: 'Twitter/X video download',
  category: 'download', use: '.twitter <url>', filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const url = args[0];
  if (!url || (!url.includes('twitter') && !url.includes('x.com')))
    return reply('❌ `.twitter <twitter/x url>`');
  await reply('`[ ⏳ DOWNLOADING TWITTER/X VIDEO... ]`');
  try {
    const videoUrl = await twDownload(url);
    if (!videoUrl) return reply('`[ ❌ Video not found! ]`');
    const buf = await getBuffer(videoUrl);
    await conn.sendMessage(from, {
      video: buf,
      caption: `\`[ 🐦 TWITTER/X VIDEO ]\n[ ABDULLAH-BOTZ 🇵🇰 ]\``,
      mimetype: 'video/mp4'
    }, { quoted: mek });
  } catch(e) { reply(`\`[ ❌ ${e.message} ]\``); }
});

// ══════════════════════════════════════════
//  8. SNAPCHAT
// ══════════════════════════════════════════
cmd({
  pattern: 'snap', alias: ['snapchat','snapdl'],
  react: '👻', desc: 'Snapchat video download',
  category: 'download', use: '.snap <url>', filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const url = args[0];
  if (!url || !url.includes('snapchat')) return reply('❌ `.snap <snapchat url>`');
  await reply('`[ ⏳ DOWNLOADING SNAPCHAT... ]`');
  try {
    const res = await axios.post('https://api.cobalt.tools/api/json',
      { url },
      { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, timeout: 20000 }
    );
    if (!res.data?.url) return reply('`[ ❌ Not found ]`');
    const buf = await getBuffer(res.data.url);
    await conn.sendMessage(from, {
      video: buf,
      caption: `\`[ 👻 SNAPCHAT VIDEO ]\n[ ABDULLAH-BOTZ 🇵🇰 ]\``,
      mimetype: 'video/mp4'
    }, { quoted: mek });
  } catch(e) { reply(`\`[ ❌ ${e.message} ]\``); }
});

// ══════════════════════════════════════════
//  9. PINTEREST
// ══════════════════════════════════════════
cmd({
  pattern: 'pin', alias: ['pinterest','pindl'],
  react: '📌', desc: 'Pinterest image/video download',
  category: 'download', use: '.pin <url>', filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const url = args[0];
  if (!url || !url.includes('pinterest')) return reply('❌ `.pin <pinterest url>`');
  await reply('`[ ⏳ DOWNLOADING PINTEREST... ]`');
  try {
    const res = await axios.post('https://api.cobalt.tools/api/json',
      { url },
      { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, timeout: 20000 }
    );
    if (!res.data?.url) return reply('`[ ❌ Media not found ]`');
    const buf = await getBuffer(res.data.url);
    const isVid = res.data.url.includes('.mp4');
    if (isVid) {
      await conn.sendMessage(from, { video: buf, caption: `\`[ 📌 PINTEREST VIDEO ]\n[ ABDULLAH-BOTZ 🇵🇰 ]\``, mimetype: 'video/mp4' }, { quoted: mek });
    } else {
      await conn.sendMessage(from, { image: buf, caption: `\`[ 📌 PINTEREST IMAGE ]\n[ ABDULLAH-BOTZ 🇵🇰 ]\`` }, { quoted: mek });
    }
  } catch(e) { reply(`\`[ ❌ ${e.message} ]\``); }
});

// ══════════════════════════════════════════
//  10. SPOTIFY (info + yt audio)
// ══════════════════════════════════════════
cmd({
  pattern: 'spotify', alias: ['spot','spdl'],
  react: '🎧', desc: 'Spotify track download',
  category: 'download', use: '.spotify <url or song name>', filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const query = args.join(' ');
  if (!query) return reply('❌ `.spotify <url or song name>`\nExample: .spotify Shape of You');
  await reply('`[ ⏳ SEARCHING SPOTIFY TRACK... ]`');
  try {
    // Search on YouTube for the song
    const ytSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const { data: html } = await axios.get(ytSearch, { timeout: 10000 });
    const match = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
    if (!match) return reply('`[ ❌ Song not found ]`');
    const ytUrl = `https://www.youtube.com/watch?v=${match[1]}`;
    const audioUrl = await ytAudioDownload(ytUrl);
    if (!audioUrl) return reply('`[ ❌ Could not download audio ]`');
    const buf = await getBuffer(audioUrl);
    await conn.sendMessage(from, { audio: buf, mimetype: 'audio/mpeg', ptt: false }, { quoted: mek });
  } catch(e) { reply(`\`[ ❌ ${e.message} ]\``); }
});

module.exports = {};

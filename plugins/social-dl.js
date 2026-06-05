const { cmd } = require('../lib/command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────
//  HELPER: download buffer from URL
// ─────────────────────────────────────────────
async function getBuffer(url, options = {}) {
  const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000, ...options });
  return Buffer.from(res.data);
}

// ─────────────────────────────────────────────
//  HELPER: get video info from cobalt.tools API (free, no key needed)
// ─────────────────────────────────────────────
async function cobaltDownload(url) {
  const res = await axios.post('https://api.cobalt.tools/api/json', 
    { url, vCodec: 'h264', vQuality: '720', aFormat: 'mp3', isAudioOnly: false },
    { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, timeout: 20000 }
  );
  return res.data;
}

// ─────────────────────────────────────────────
//  1. TIKTOK DOWNLOAD
// ─────────────────────────────────────────────
cmd({
  pattern: "tiktok",
  alias: ["tt", "tik"],
  react: "🎵",
  desc: "Download TikTok video (no watermark)",
  category: "download",
  use: ".tiktok <url>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const url = args[0];
  if (!url || !url.includes('tiktok')) return reply("❌ *Usage:* .tiktok https://tiktok.com/...");
  
  reply("⏳ *Downloading TikTok...*");
  try {
    // Use tiktok API
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&count=12&cursor=0&web=1&hd=1`;
    const { data } = await axios.get(apiUrl, { timeout: 20000 });
    
    if (!data?.data?.play) return reply("❌ *Video nahi mila! Valid TikTok URL do.*");
    
    const videoUrl = data.data.hdplay || data.data.play;
    const caption = `*TikTok Video*\n*Title:* ${data.data.title || 'N/A'}\n*Author:* @${data.data.author?.nickname || 'N/A'}\n> ABDULLAH-BOTZ`;
    
    const buffer = await getBuffer(videoUrl);
    await conn.sendMessage(from, { video: buffer, caption, mimetype: 'video/mp4' }, { quoted: mek });
  } catch(e) {
    reply(`❌ *Error:* ${e.message}`);
  }
});

// ─────────────────────────────────────────────
//  2. TIKTOK AUDIO
// ─────────────────────────────────────────────
cmd({
  pattern: "ttaudio",
  alias: ["tiktokmp3", "ttmp3"],
  react: "🎶",
  desc: "Download TikTok audio/music",
  category: "download",
  use: ".ttaudio <url>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const url = args[0];
  if (!url || !url.includes('tiktok')) return reply("❌ *Usage:* .ttaudio https://tiktok.com/...");
  
  reply("⏳ *Downloading TikTok audio...*");
  try {
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&web=1`;
    const { data } = await axios.get(apiUrl, { timeout: 20000 });
    if (!data?.data?.music) return reply("❌ *Audio nahi mila!*");
    
    const buffer = await getBuffer(data.data.music);
    await conn.sendMessage(from, {
      audio: buffer,
      mimetype: 'audio/mpeg',
      ptt: false
    }, { quoted: mek });
  } catch(e) {
    reply(`❌ *Error:* ${e.message}`);
  }
});

// ─────────────────────────────────────────────
//  3. YOUTUBE VIDEO DOWNLOAD
// ─────────────────────────────────────────────
cmd({
  pattern: "ytv",
  alias: ["ytvideo", "youtubemp4"],
  react: "📹",
  desc: "Download YouTube video",
  category: "download",
  use: ".ytv <url>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const url = args[0];
  if (!url || (!url.includes('youtube') && !url.includes('youtu.be')))
    return reply("❌ *Usage:* .ytv https://youtube.com/watch?v=...");
  
  reply("⏳ *Downloading YouTube video... (may take a moment)*");
  try {
    const apiUrl = `https://youtube-mp36.p.rapidapi.com/dl?id=${extractYtId(url)}`;
    // Use cobalt.tools free API instead
    const result = await cobaltDownload(url);
    if (!result?.url) return reply("❌ *Video nahi mila ya size badi hai!*");
    
    const buffer = await getBuffer(result.url);
    await conn.sendMessage(from, {
      video: buffer,
      caption: `*YouTube Video*\n> ABDULLAH-BOTZ`,
      mimetype: 'video/mp4'
    }, { quoted: mek });
  } catch(e) {
    reply(`❌ *Error:* ${e.message}\n_Large videos download nahi hote, try .yta for audio_`);
  }
});

function extractYtId(url) {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : '';
}

// ─────────────────────────────────────────────
//  4. YOUTUBE MP3
// ─────────────────────────────────────────────
cmd({
  pattern: "yta",
  alias: ["ytmp3", "ytaudio", "youtubemp3"],
  react: "🎵",
  desc: "Download YouTube audio as MP3",
  category: "download",
  use: ".yta <url>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const url = args[0];
  if (!url || (!url.includes('youtube') && !url.includes('youtu.be')))
    return reply("❌ *Usage:* .yta https://youtube.com/watch?v=...");
  
  reply("⏳ *Downloading YouTube audio...*");
  try {
    const vidId = extractYtId(url);
    if (!vidId) return reply("❌ *Valid YouTube URL do!*");
    
    // Free API
    const { data } = await axios.get(`https://youtube-mp36.p.rapidapi.com/dl?id=${vidId}`, {
      headers: {
        'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
        'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
      },
      timeout: 20000
    }).catch(() => ({ data: null }));
    
    let audioUrl = data?.link;
    
    // Fallback to cobalt
    if (!audioUrl) {
      const result = await cobaltDownload(url);
      audioUrl = result?.url;
    }
    
    if (!audioUrl) return reply("❌ *Audio nahi mila!*");
    
    const buffer = await getBuffer(audioUrl);
    await conn.sendMessage(from, {
      audio: buffer,
      mimetype: 'audio/mpeg',
      ptt: false
    }, { quoted: mek });
  } catch(e) {
    reply(`❌ *Error:* ${e.message}`);
  }
});

// ─────────────────────────────────────────────
//  5. INSTAGRAM DOWNLOAD
// ─────────────────────────────────────────────
cmd({
  pattern: "ig",
  alias: ["insta", "instagram"],
  react: "📸",
  desc: "Download Instagram reel/post/story",
  category: "download",
  use: ".ig <url>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const url = args[0];
  if (!url || !url.includes('instagram')) return reply("❌ *Usage:* .ig https://instagram.com/reel/...");
  
  reply("⏳ *Downloading Instagram...*");
  try {
    const result = await cobaltDownload(url);
    if (!result?.url && !result?.picker) return reply("❌ *Media nahi mili! Private post nahi download hoti.*");
    
    const mediaUrl = result.url || result.picker?.[0]?.url;
    if (!mediaUrl) return reply("❌ *URL nahi mila!*");
    
    const buffer = await getBuffer(mediaUrl);
    const isVideo = result.type === 'video' || mediaUrl.includes('.mp4');
    
    if (isVideo) {
      await conn.sendMessage(from, { video: buffer, caption: `*Instagram Video*\n> ABDULLAH-BOTZ`, mimetype: 'video/mp4' }, { quoted: mek });
    } else {
      await conn.sendMessage(from, { image: buffer, caption: `*Instagram Image*\n> ABDULLAH-BOTZ` }, { quoted: mek });
    }
  } catch(e) {
    reply(`❌ *Error:* ${e.message}`);
  }
});

// ─────────────────────────────────────────────
//  6. SNAPCHAT DOWNLOAD
// ─────────────────────────────────────────────
cmd({
  pattern: "snap",
  alias: ["snapchat", "snapdl"],
  react: "👻",
  desc: "Download Snapchat spotlight/story",
  category: "download",
  use: ".snap <url>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const url = args[0];
  if (!url || !url.includes('snapchat')) return reply("❌ *Usage:* .snap https://snapchat.com/...");
  
  reply("⏳ *Downloading Snapchat...*");
  try {
    const result = await cobaltDownload(url);
    if (!result?.url) return reply("❌ *Media nahi mili!*");
    
    const buffer = await getBuffer(result.url);
    await conn.sendMessage(from, {
      video: buffer,
      caption: `*Snapchat Video*\n> ABDULLAH-BOTZ`,
      mimetype: 'video/mp4'
    }, { quoted: mek });
  } catch(e) {
    reply(`❌ *Error:* ${e.message}`);
  }
});

// ─────────────────────────────────────────────
//  7. TWITTER/X DOWNLOAD
// ─────────────────────────────────────────────
cmd({
  pattern: "twitter",
  alias: ["twdl", "xdl", "tw"],
  react: "🐦",
  desc: "Download Twitter/X video",
  category: "download",
  use: ".twitter <url>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const url = args[0];
  if (!url || (!url.includes('twitter') && !url.includes('x.com')))
    return reply("❌ *Usage:* .twitter https://x.com/...");
  
  reply("⏳ *Downloading Twitter/X video...*");
  try {
    const result = await cobaltDownload(url);
    if (!result?.url) return reply("❌ *Video nahi mila!*");
    
    const buffer = await getBuffer(result.url);
    await conn.sendMessage(from, {
      video: buffer,
      caption: `*Twitter/X Video*\n> ABDULLAH-BOTZ`,
      mimetype: 'video/mp4'
    }, { quoted: mek });
  } catch(e) {
    reply(`❌ *Error:* ${e.message}`);
  }
});

// ─────────────────────────────────────────────
//  8. FACEBOOK DOWNLOAD
// ─────────────────────────────────────────────
cmd({
  pattern: "fb",
  alias: ["facebook", "fbdl"],
  react: "📘",
  desc: "Download Facebook video",
  category: "download",
  use: ".fb <url>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  const url = args[0];
  if (!url || !url.includes('facebook') && !url.includes('fb.watch'))
    return reply("❌ *Usage:* .fb https://facebook.com/...");
  
  reply("⏳ *Downloading Facebook video...*");
  try {
    const result = await cobaltDownload(url);
    if (!result?.url) return reply("❌ *Video nahi mila!*");
    
    const buffer = await getBuffer(result.url);
    await conn.sendMessage(from, {
      video: buffer,
      caption: `*Facebook Video*\n> ABDULLAH-BOTZ`,
      mimetype: 'video/mp4'
    }, { quoted: mek });
  } catch(e) {
    reply(`❌ *Error:* ${e.message}`);
  }
});

module.exports = {};

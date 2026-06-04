const { cmd } = require('../lib/command');
const config = require('../setting');
const fs = require('fs');
const path = require('path');

// ============ BROADCAST ============
cmd({
  pattern: "broadcast",
  alias: ["bc"],
  react: "📡",
  desc: "Broadcast message to all chats",
  category: "owner",
  use: "<message>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, reply, args }) => {
  if (!isOwner) return reply("❌ *Owner Only!*");
  const msg = args.join(" ");
  if (!msg) return reply("❌ *Usage:* .broadcast <message>");
  const chats = await conn.getChats?.() || [];
  let sent = 0;
  for (const chat of chats) {
    try {
      await conn.sendMessage(chat.id, { text: `📡 *BROADCAST*\n\n${msg}` });
      sent++;
      await new Promise(r => setTimeout(r, 300));
    } catch(e) {}
  }
  reply(`✅ *Broadcast sent to ${sent} chats!*`);
});

// ============ BLOCK/UNBLOCK ============
cmd({
  pattern: "block",
  react: "🚫",
  desc: "Block a user",
  category: "owner",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, reply, mentioned, args }) => {
  if (!isOwner) return reply("❌ *Owner Only!*");
  let target = mentioned?.[0];
  if (!target && args[0]) target = args[0].replace(/[^0-9]/g,"") + "@s.whatsapp.net";
  if (!target) return reply("❌ *Mention or provide number!*");
  await conn.updateBlockStatus(target, "block").catch(() => {});
  reply(`✅ *Blocked!*`);
});

cmd({
  pattern: "unblock",
  react: "✅",
  desc: "Unblock a user",
  category: "owner",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, reply, mentioned, args }) => {
  if (!isOwner) return reply("❌ *Owner Only!*");
  let target = mentioned?.[0];
  if (!target && args[0]) target = args[0].replace(/[^0-9]/g,"") + "@s.whatsapp.net";
  if (!target) return reply("❌ *Mention or provide number!*");
  await conn.updateBlockStatus(target, "unblock").catch(() => {});
  reply(`✅ *Unblocked!*`);
});

// ============ FORWARD ============
cmd({
  pattern: "forward",
  react: "📤",
  desc: "Forward a message to a number",
  category: "owner",
  use: "<number>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, reply, quoted, args }) => {
  if (!isOwner) return reply("❌ *Owner Only!*");
  if (!quoted) return reply("❌ *Reply to a message to forward!*");
  const num = args[0]?.replace(/[^0-9]/g,"");
  if (!num) return reply("❌ *Provide number!*");
  await conn.sendMessage(num + "@s.whatsapp.net", { forward: quoted, force: true }).catch(() => {});
  reply(`✅ *Message forwarded to ${num}!*`);
});

// ============ SUDO ============
const sudoList = new Set();
cmd({
  pattern: "sudo",
  react: "⚡",
  desc: "Add sudo user",
  category: "owner",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, reply, mentioned, args }) => {
  if (!isOwner) return reply("❌ *Owner Only!*");
  let target = mentioned?.[0];
  if (!target && args[0]) target = args[0].replace(/[^0-9]/g,"") + "@s.whatsapp.net";
  if (!target) return reply("❌ *Mention or provide number!*");
  sudoList.add(target);
  reply(`✅ *Added as Sudo!*`);
});

cmd({
  pattern: "delsudo",
  alias: ["removesudo"],
  react: "🗑",
  desc: "Remove sudo user",
  category: "owner",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, reply, mentioned, args }) => {
  if (!isOwner) return reply("❌ *Owner Only!*");
  let target = mentioned?.[0];
  if (!target && args[0]) target = args[0].replace(/[^0-9]/g,"") + "@s.whatsapp.net";
  if (!target) return reply("❌ *Mention or provide number!*");
  sudoList.delete(target);
  reply(`✅ *Removed from Sudo!*`);
});

// ============ VV (VIEW ONCE) ============
cmd({
  pattern: "vv",
  alias: ["viewonce"],
  react: "👁",
  desc: "View a view-once message",
  category: "owner",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, reply, quoted }) => {
  if (!isOwner) return reply("❌ *Owner Only!*");
  if (!quoted) return reply("❌ *Reply to a view-once message!*");
  try {
    const type = Object.keys(quoted.message || {})[0];
    const media = await conn.downloadMediaMessage(quoted, "buffer").catch(() => null);
    if (!media) return reply("❌ *Could not download media!*");
    if (type?.includes("image")) {
      await conn.sendMessage(from, { image: media, caption: "View Once Image" }, { quoted: mek });
    } else if (type?.includes("video")) {
      await conn.sendMessage(from, { video: media, caption: "View Once Video" }, { quoted: mek });
    } else if (type?.includes("audio")) {
      await conn.sendMessage(from, { audio: media, mimetype: "audio/mp4" }, { quoted: mek });
    } else {
      reply("❌ *Unsupported media type!*");
    }
  } catch(e) { reply(`❌ Error: ${e.message}`); }
});

// ============ JOIN ============
cmd({
  pattern: "join",
  react: "🚪",
  desc: "Bot joins a group via invite link",
  category: "owner",
  use: "<group link>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, reply, args }) => {
  if (!isOwner) return reply("❌ *Owner Only!*");
  const link = args[0];
  if (!link) return reply("❌ *Provide group invite link!*");
  const code = link.split("chat.whatsapp.com/")[1];
  if (!code) return reply("❌ *Invalid invite link!*");
  await conn.groupAcceptInvite(code).catch(() => {});
  reply(`✅ *Joined group!*`);
});

// ============ SETPUBLICBOTNAME — ALL users ka bot name change ============
cmd({
  pattern: "setpublicbotname",
  alias: ["setbotname", "publicname"],
  react: "✏",
  desc: "Change bot name for ALL users (public bot name)",
  category: "owner",
  use: "<name>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, reply, args }) => {
  if (!isOwner) return reply("❌ *Owner Only!*");
  const name = args.join(" ");
  if (!name) return reply("❌ *Usage: .setpublicbotname <name>*\nExample: .setpublicbotname ABDULLAH-BOTZ");
  // Update config so ALL users see new name
  config.BOT_NAME = name;
  // Also update WhatsApp display name
  await conn.updateProfileName(name).catch(() => {});
  reply(`✅ *Bot name changed to* *${name}* *for all users!*`);
});

// ============ SETIMG — Bot profile picture (OWNER only) ============
cmd({
  pattern: "setimg",
  alias: ["setbotimg", "botpic"],
  react: "🖼",
  desc: "Change bot profile picture via URL (owner only)",
  category: "owner",
  use: "<image url>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, reply, args, quoted }) => {
  if (!isOwner) return reply("❌ *Owner Only!*");
  
  try {
    let imgBuffer;
    
    // Method 1: URL provided
    if (args[0] && args[0].startsWith("http")) {
      const axios = require("axios");
      const res = await axios.get(args[0], { responseType: "arraybuffer" });
      imgBuffer = Buffer.from(res.data);
    }
    // Method 2: Reply to image
    else if (quoted?.message?.imageMessage) {
      imgBuffer = await conn.downloadMediaMessage(quoted, "buffer");
    }
    else {
      return reply(`❌ *Usage:*\n.setimg <url>\nOR reply to an image with .setimg`);
    }
    
    await conn.updateProfilePicture(conn.user.id, imgBuffer);
    reply("✅ *Bot profile picture updated!*");
  } catch(e) {
    reply(`❌ *Failed: ${e.message}*`);
  }
});

module.exports = {};

// ============ PAIRED NUMBERS STORE ============
// Global store - jab bot kisi number pe lage to yahan add hoga
if (!global.pairedNumbers) global.pairedNumbers = new Set();

// ============ DEL PAIR - Kisi number se bot hata do ============
cmd({
  pattern: "delpair",
  alias: ["removepair", "unpair"],
  react: "🔌",
  desc: "Remove/offline bot from a specific number",
  category: "owner",
  use: "<number>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, reply, args }) => {
  if (!isOwner) return reply("❌ *Owner Only!*");
  const num = args[0]?.replace(/[^0-9]/g, "");
  if (!num) return reply("❌ *Usage: .delpair 923001234567*");
  const jid = num + "@s.whatsapp.net";
  // Mark as offline for this number
  await conn.sendPresenceUpdate("unavailable", jid).catch(() => {});
  // Remove from paired list
  global.pairedNumbers.delete(num);
  reply(`✅ *Bot set to OFFLINE for* *${num}!*\nNumber removed from paired list.`);
});

// ============ LISTPAIR - Sab paired numbers dikhao ============
cmd({
  pattern: "listpair",
  alias: ["pairedlist", "pairlist"],
  react: "📋",
  desc: "Show all numbers bot is paired/active on",
  category: "owner",
  use: ".listpair",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, reply }) => {
  if (!isOwner) return reply("❌ *Owner Only!*");
  // Add current connected number to list
  if (conn.user?.id) {
    const myNum = conn.user.id.split(":")[0].split("@")[0];
    global.pairedNumbers.add(myNum);
  }
  if (!global.pairedNumbers.size) {
    return reply("📋 *No numbers in paired list yet.*");
  }
  let list = `*╭── 📋 PAIRED NUMBERS ──*\n`;
  let i = 1;
  for (const num of global.pairedNumbers) {
    list += `*│* ${i}. +${num}\n`;
    i++;
  }
  list += `*╰── Total: ${global.pairedNumbers.size} ──*\n\n> ABDULLAH-BOTZ`;
  reply(list);
});

// ============ SETBOTNAME - Owner only ============
cmd({
  pattern: "setbotname",
  alias: ["botname", "changebotname"],
  react: "✏",
  desc: "Change bot name (Owner only)",
  category: "owner",
  use: "<name>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, reply, args }) => {
  if (!isOwner) return reply("❌ *Owner Only!*");
  const name = args.join(" ");
  if (!name) return reply("❌ *Usage: .setbotname MY-BOT*");
  config.BOT_NAME = name;
  await conn.updateProfileName(name).catch(() => {});
  reply(`✅ *Bot name changed to:* *${name}*`);
});

// ============ SETBOTIMG - Owner only ============
cmd({
  pattern: "setbotimg",
  alias: ["botimg", "changebotimg"],
  react: "🖼",
  desc: "Change bot profile picture (Owner only)",
  category: "owner",
  use: "<url> or reply to image",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, reply, args, quoted }) => {
  if (!isOwner) return reply("❌ *Owner Only!*");
  try {
    let imgBuffer;
    if (args[0]?.startsWith("http")) {
      const axios = require("axios");
      const res = await axios.get(args[0], { responseType: "arraybuffer" });
      imgBuffer = Buffer.from(res.data);
    } else if (quoted?.message?.imageMessage) {
      imgBuffer = await conn.downloadMediaMessage(quoted, "buffer");
    } else {
      return reply("❌ *Provide URL or reply to image!*\nExample: .setbotimg https://example.com/pic.jpg");
    }
    await conn.updateProfilePicture(conn.user.id, imgBuffer);
    reply("✅ *Bot profile picture updated!*");
  } catch(e) {
    reply(`❌ Failed: ${e.message}`);
  }
});


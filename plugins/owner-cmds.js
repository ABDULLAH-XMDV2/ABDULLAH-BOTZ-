const { cmd } = require('../lib/command');
const config = require('../setting');
const fs = require('fs');

const ownerNumber = config.OWNER_NUMBER || "923044975027";

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
      await conn.sendMessage(chat.id, { text: `📡 *ABDULLAH-BOTZ BROADCAST*\n\n${msg}` });
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
  reply(`✅ *@${target.split("@")[0]} blocked!*`);
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
  reply(`✅ *@${target.split("@")[0]} unblocked!*`);
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
  if (!num) return reply("❌ *Provide number: .forward 923001234567*");
  const jid = num + "@s.whatsapp.net";
  await conn.sendMessage(jid, { forward: quoted, force: true }).catch(() => {});
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
  reply(`✅ *@${target.split("@")[0]} added as Sudo!*`);
});

cmd({
  pattern: "delsudo",
  alias: ["removesudo"],
  react: "🗑️",
  desc: "Remove sudo user",
  category: "owner",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, reply, mentioned, args }) => {
  if (!isOwner) return reply("❌ *Owner Only!*");
  let target = mentioned?.[0];
  if (!target && args[0]) target = args[0].replace(/[^0-9]/g,"") + "@s.whatsapp.net";
  if (!target) return reply("❌ *Mention or provide number!*");
  sudoList.delete(target);
  reply(`✅ *@${target.split("@")[0]} removed from Sudo!*`);
});

cmd({
  pattern: "listsudo",
  react: "📋",
  desc: "List all sudo users",
  category: "owner",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, reply }) => {
  if (!isOwner) return reply("❌ *Owner Only!*");
  if (!sudoList.size) return reply("*No sudo users added yet!*");
  let list = `╭──❍ *⚡ SUDO LIST* ❍──╮\n│\n`;
  sudoList.forEach(u => { list += `├─❍ @${u.split("@")[0]}\n`; });
  list += `│\n╰──────────────────────❍`;
  reply(list);
});

// ============ VV (VIEW ONCE BYPASS) ============
cmd({
  pattern: "vv",
  alias: ["vv2", "vv3", "viewonce"],
  react: "👁️",
  desc: "View a view-once message",
  category: "owner",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, reply, quoted }) => {
  if (!isOwner) return reply("❌ *Owner Only!*");
  if (!quoted) return reply("❌ *Reply to a view-once message!*");
  try {
    const msg = quoted.message;
    const type = Object.keys(msg)[0];
    if (!type) return reply("❌ *No media found!*");
    const media = await conn.downloadMediaMessage(quoted, "buffer").catch(() => null);
    if (!media) return reply("❌ *Could not download media!*");
    if (type.includes("image")) {
      await conn.sendMessage(from, { image: media, caption: "👁️ *View Once Image*" }, { quoted: mek });
    } else if (type.includes("video")) {
      await conn.sendMessage(from, { video: media, caption: "👁️ *View Once Video*" }, { quoted: mek });
    } else if (type.includes("audio")) {
      await conn.sendMessage(from, { audio: media, mimetype: "audio/mp4" }, { quoted: mek });
    } else {
      reply("❌ *Unsupported media type!*");
    }
  } catch(e) { reply(`❌ Error: ${e.message}`); }
});

// ============ SETPP ============
cmd({
  pattern: "botpp",
  alias: ["setbotpp", "botdp"],
  react: "🖼️",
  desc: "Change bot profile picture",
  category: "owner",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, reply, quoted }) => {
  if (!isOwner) return reply("❌ *Owner Only!*");
  if (!quoted?.message?.imageMessage) return reply("❌ *Reply to an image!*");
  try {
    const img = await conn.downloadMediaMessage(quoted, "buffer");
    await conn.updateProfilePicture(conn.user.id, img);
    reply("✅ *Bot profile picture updated!*");
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ============ SETNAME ============
cmd({
  pattern: "setname",
  alias: ["ownername", "myname"],
  react: "✏️",
  desc: "Change bot display name",
  category: "owner",
  use: "<name>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, reply, args }) => {
  if (!isOwner) return reply("❌ *Owner Only!*");
  const name = args.join(" ");
  if (!name) return reply("❌ *Provide a name!*");
  await conn.updateProfileName(name).catch(() => {});
  reply(`✅ *Name changed to ${name}!*`);
});

// ============ STATUS ============
cmd({
  pattern: "status",
  alias: ["setstatus", "updatebio"],
  react: "📝",
  desc: "Update WhatsApp status/bio",
  category: "owner",
  use: "<status text>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, reply, args }) => {
  if (!isOwner) return reply("❌ *Owner Only!*");
  const text = args.join(" ");
  if (!text) return reply("❌ *Provide status text!*");
  await conn.updateProfileStatus(text).catch(() => {});
  reply(`✅ *Status updated to: ${text}*`);
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

// ============ OWNERNUMBER ============
cmd({
  pattern: "ownernumber",
  react: "📞",
  desc: "Change owner number",
  category: "owner",
  use: "<number>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, reply, args }) => {
  if (!isOwner) return reply("❌ *Owner Only!*");
  const num = args[0]?.replace(/[^0-9]/g,"");
  if (!num) return reply("❌ *Usage: .ownernumber 923001234567*");
  config.OWNER_NUMBER = num;
  reply(`✅ *Owner number changed to ${num}!*`);
});

module.exports = {};

// ============ IMGHOST - Image Upload to ImgBB ============
cmd({
  pattern: "imghost",
  alias: ["imagehost", "uploadimg", "imgbb"],
  react: "📸",
  desc: "Upload an image and get a hosting link",
  category: "owner",
  use: ".imghost (reply to image)",
  filename: __filename
}, async (conn, mek, m, { from, reply, quoted, isOwner }) => {
  if (!isOwner) return reply("❌ *Owner Only!*");
  
  // Accept quoted OR current message image
  const targetMsg = quoted || mek;
  const msgType = targetMsg?.message ? Object.keys(targetMsg.message)[0] : null;
  const hasImage = msgType === "imageMessage" ||
    targetMsg?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;

  if (!hasImage) {
    return reply(`╭──❍ *📸 IMGHOST USAGE* ❍──╮\n│\n├─❍ *Reply to any image* with:\n├─❍ *.imghost*\n│\n├─❍ Bot will upload it to ImgBB\n├─❍ and send you the direct link!\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ Image Host_ 🔰`);
  }

  try {
    await reply("⏳ *Uploading image to ImgBB...*");

    // Download the image buffer
    const imgMsg = targetMsg?.message?.imageMessage ||
      targetMsg?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;

    const buffer = await conn.downloadMediaMessage(
      { message: { imageMessage: imgMsg }, key: targetMsg.key },
      "buffer"
    );

    // Convert buffer to base64
    const base64Image = buffer.toString("base64");

    // Upload to ImgBB
    const axios = require("axios");
    const FormData = require("form-data") || null;

    // Use URLSearchParams for form upload (no extra deps)
    const params = new URLSearchParams();
    params.append("key", "2f9b9f3b57c88b9b9a9e4b2d2c1b5a3f"); // placeholder key - user must set IMGBB_KEY in config
    params.append("image", base64Image);

    // Use config IMGBB_KEY if set
    const apiKey = config.IMGBB_KEY || process.env.IMGBB_KEY || "";
    if (!apiKey) {
      return reply(`❌ *ImgBB API Key not set!*\n\nAdd this to your *config.env*:\n\`\`\`\nIMGBB_KEY=your_key_here\n\`\`\`\nGet free key at: *https://api.imgbb.com/*`);
    }

    const uploadParams = new URLSearchParams();
    uploadParams.append("key", apiKey);
    uploadParams.append("image", base64Image);

    const response = await axios.post(
      "https://api.imgbb.com/1/upload",
      uploadParams.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const data = response.data;
    if (!data.success) throw new Error("Upload failed: " + JSON.stringify(data));

    const imageUrl     = data.data.url;
    const displayUrl   = data.data.display_url;
    const deleteUrl    = data.data.delete_url;
    const size         = (data.data.size / 1024).toFixed(1);
    const title        = data.data.title || "image";

    const resultMsg = `╭──❍ *📸 IMAGE HOSTED* ❍──╮\n│\n├─❍ *✅ Upload Successful!*\n│\n├─❍ *🔗 Direct Link:*\n│  ${imageUrl}\n│\n├─❍ *🖼️ Display Link:*\n│  ${displayUrl}\n│\n├─❍ *🗑️ Delete Link:*\n│  ${deleteUrl}\n│\n├─❍ *📁 File:* ${title}\n├─❍ *💾 Size:* ${size} KB\n│\n╰──────────────────────❍\n\n> _ABDULLAH-BOTZ × ImgBB Host_ 🔰`;

    // Send result with the hosted image preview
    await conn.sendMessage(from, {
      image: { url: displayUrl },
      caption: resultMsg
    }, { quoted: mek });

  } catch (e) {
    console.error("imghost error:", e);
    reply(`❌ *Upload Failed!*\n\n${e.message}`);
  }
});

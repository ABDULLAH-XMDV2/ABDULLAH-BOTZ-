const { cmd } = require('../lib/command');
const config = require('../setting');

// ============ ANTI DELETE ============
cmd({
  pattern: "antidelete",
  alias: ["antidel"],
  react: "🔒",
  desc: "Enable/Disable Anti Delete",
  category: "settings",
  use: "<on/off>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, args, reply }) => {
  if (!isOwner) return reply("❌ *Owner Only Command!*");
  const val = args[0]?.toLowerCase();
  if (!val || !["on","off"].includes(val)) return reply("*Usage: .antidelete on/off*");
  config.ANTI_DELETE = val === "on" ? "true" : "false";
  reply(`✅ *Anti Delete ${val === "on" ? "Enabled" : "Disabled"} Successfully!*`);
});

// ============ ANTI VIEW ONCE ============
cmd({
  pattern: "antiviewonce",
  alias: ["antivv", "antivo"],
  react: "👁️",
  desc: "Enable/Disable Anti View Once",
  category: "settings",
  use: "<on/off>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, args, reply }) => {
  if (!isOwner) return reply("❌ *Owner Only Command!*");
  const val = args[0]?.toLowerCase();
  if (!val || !["on","off"].includes(val)) return reply("*Usage: .antiviewonce on/off*");
  config.ANTI_VV = val === "on" ? "true" : "false";
  reply(`✅ *Anti View Once ${val === "on" ? "Enabled" : "Disabled"} Successfully!*`);
});

// ============ ANTI LINK ============
cmd({
  pattern: "antilink",
  react: "🔗",
  desc: "Enable/Disable Anti Link in group",
  category: "group",
  use: "<on/off>",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isOwner, args, reply, groupSetting }) => {
  if (!isGroup) return reply("❌ *Group Only Command!*");
  if (!isAdmins && !isOwner) return reply("❌ *Admins Only!*");
  const val = args[0]?.toLowerCase();
  if (!val || !["on","off"].includes(val)) return reply("*Usage: .antilink on/off*");
  if (!groupSetting) groupSetting = {};
  groupSetting.antilink = val === "on";
  reply(`✅ *Anti Link ${val === "on" ? "Enabled" : "Disabled"} in this group!*`);
});

// ============ ANTI BAD ============
cmd({
  pattern: "antibad",
  alias: ["antibadword"],
  react: "🤬",
  desc: "Enable/Disable Anti Bad Words",
  category: "settings",
  use: "<on/off>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, args, reply }) => {
  if (!isOwner) return reply("❌ *Owner Only Command!*");
  const val = args[0]?.toLowerCase();
  if (!val || !["on","off"].includes(val)) return reply("*Usage: .antibad on/off*");
  config.ANTI_BAD = val === "on" ? "true" : "false";
  reply(`✅ *Anti Bad Words ${val === "on" ? "Enabled" : "Disabled"} Successfully!*`);
});

// ============ ANTI CALL ============
cmd({
  pattern: "anticall",
  react: "📵",
  desc: "Enable/Disable Anti Call",
  category: "settings",
  use: "<on/off>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, args, reply }) => {
  if (!isOwner) return reply("❌ *Owner Only Command!*");
  const val = args[0]?.toLowerCase();
  if (!val || !["on","off"].includes(val)) return reply("*Usage: .anticall on/off*");
  config.ANTI_CALL = val === "on" ? "true" : "false";
  reply(`✅ *Anti Call ${val === "on" ? "Enabled" : "Disabled"} Successfully!*`);
});

// ============ ANTI BOT ============
cmd({
  pattern: "antibot",
  react: "🤖",
  desc: "Enable/Disable Anti Bot",
  category: "settings",
  use: "<on/off>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, args, reply }) => {
  if (!isOwner) return reply("❌ *Owner Only Command!*");
  const val = args[0]?.toLowerCase();
  if (!val || !["on","off"].includes(val)) return reply("*Usage: .antibot on/off*");
  config.ANTI_BOT = val === "on" ? "true" : "false";
  reply(`✅ *Anti Bot ${val === "on" ? "Enabled" : "Disabled"} Successfully!*`);
});

// ============ ANTI EDIT ============
cmd({
  pattern: "antiedit",
  react: "✏️",
  desc: "Enable/Disable Anti Edit (notify when msg is edited)",
  category: "settings",
  use: "<on/off>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, args, reply }) => {
  if (!isOwner) return reply("❌ *Owner Only Command!*");
  const val = args[0]?.toLowerCase();
  if (!val || !["on","off"].includes(val)) return reply("*Usage: .antiedit on/off*");
  config.ANTI_EDIT = val === "on" ? "true" : "false";
  reply(`✅ *Anti Edit ${val === "on" ? "Enabled" : "Disabled"} Successfully!*`);
});

// ============ ANTI SPAM ============
const spamMap = new Map();
cmd({
  pattern: "antispam",
  react: "🚫",
  desc: "Enable/Disable Anti Spam",
  category: "settings",
  use: "<on/off>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, args, reply }) => {
  if (!isOwner) return reply("❌ *Owner Only Command!*");
  const val = args[0]?.toLowerCase();
  if (!val || !["on","off"].includes(val)) return reply("*Usage: .antispam on/off*");
  config.ANTI_SPAM = val === "on" ? "true" : "false";
  reply(`✅ *Anti Spam ${val === "on" ? "Enabled" : "Disabled"} Successfully!*`);
});

// ============ STATUS FEATURES ============
cmd({
  pattern: "statusview",
  alias: ["autostatus"],
  react: "👁️",
  desc: "Enable/Disable Auto Status View",
  category: "settings",
  use: "<on/off>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, args, reply }) => {
  if (!isOwner) return reply("❌ *Owner Only Command!*");
  const val = args[0]?.toLowerCase();
  if (!val || !["on","off"].includes(val)) return reply("*Usage: .statusview on/off*");
  config.AUTO_STATUS_SEEN = val === "on" ? "true" : "false";
  reply(`✅ *Auto Status View ${val === "on" ? "Enabled" : "Disabled"}!*`);
});

cmd({
  pattern: "statuslike",
  alias: ["autostatusreact"],
  react: "❤️",
  desc: "Enable/Disable Auto Status Like/React",
  category: "settings",
  use: "<on/off>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, args, reply }) => {
  if (!isOwner) return reply("❌ *Owner Only Command!*");
  const val = args[0]?.toLowerCase();
  if (!val || !["on","off"].includes(val)) return reply("*Usage: .statuslike on/off*");
  config.AUTO_STATUS_REACT = val === "on" ? "true" : "false";
  reply(`✅ *Auto Status React ${val === "on" ? "Enabled" : "Disabled"}!*`);
});

// ============ AUTO FEATURES ============
cmd({
  pattern: "autotyping",
  react: "⌨️",
  desc: "Enable/Disable Auto Typing indicator",
  category: "settings",
  use: "<on/off>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, args, reply }) => {
  if (!isOwner) return reply("❌ *Owner Only Command!*");
  const val = args[0]?.toLowerCase();
  if (!val || !["on","off"].includes(val)) return reply("*Usage: .autotyping on/off*");
  config.AUTO_TYPING = val === "on" ? "true" : "false";
  reply(`✅ *Auto Typing ${val === "on" ? "Enabled" : "Disabled"}!*`);
});

cmd({
  pattern: "autorecording",
  alias: ["recording"],
  react: "🎙️",
  desc: "Enable/Disable Auto Recording indicator",
  category: "settings",
  use: "<on/off>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, args, reply }) => {
  if (!isOwner) return reply("❌ *Owner Only Command!*");
  const val = args[0]?.toLowerCase();
  if (!val || !["on","off"].includes(val)) return reply("*Usage: .autorecording on/off*");
  config.AUTO_RECORDING = val === "on" ? "true" : "false";
  reply(`✅ *Auto Recording ${val === "on" ? "Enabled" : "Disabled"}!*`);
});

cmd({
  pattern: "autoread",
  alias: ["readmessage"],
  react: "✅",
  desc: "Enable/Disable Auto Read Messages",
  category: "settings",
  use: "<on/off>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, args, reply }) => {
  if (!isOwner) return reply("❌ *Owner Only Command!*");
  const val = args[0]?.toLowerCase();
  if (!val || !["on","off"].includes(val)) return reply("*Usage: .autoread on/off*");
  config.READ_MESSAGE = val === "on" ? "true" : "false";
  reply(`✅ *Auto Read ${val === "on" ? "Enabled" : "Disabled"}!*`);
});

cmd({
  pattern: "autoreact",
  react: "😊",
  desc: "Enable/Disable Auto React on messages",
  category: "settings",
  use: "<on/off>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, args, reply }) => {
  if (!isOwner) return reply("❌ *Owner Only Command!*");
  const val = args[0]?.toLowerCase();
  if (!val || !["on","off"].includes(val)) return reply("*Usage: .autoreact on/off*");
  config.AUTO_REACT = val === "on" ? "true" : "false";
  reply(`✅ *Auto React ${val === "on" ? "Enabled" : "Disabled"}!*`);
});

cmd({
  pattern: "online",
  alias: ["alwaysonline"],
  react: "🟢",
  desc: "Enable/Disable Always Online",
  category: "settings",
  use: "<on/off>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, args, reply }) => {
  if (!isOwner) return reply("❌ *Owner Only Command!*");
  const val = args[0]?.toLowerCase();
  if (!val || !["on","off"].includes(val)) return reply("*Usage: .online on/off*");
  config.ALWAYS_ONLINE = val === "on" ? "true" : "false";
  reply(`✅ *Always Online ${val === "on" ? "Enabled" : "Disabled"}!*`);
});

// ============ ANTI STATUS ============
cmd({
  pattern: "antistatusreply",
  react: "📊",
  desc: "Enable/Disable Auto Status Reply",
  category: "settings",
  use: "<on/off>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, args, reply }) => {
  if (!isOwner) return reply("❌ *Owner Only Command!*");
  const val = args[0]?.toLowerCase();
  if (!val || !["on","off"].includes(val)) return reply("*Usage: .antistatusreply on/off*");
  config.AUTO_STATUS_REPLY = val === "on" ? "true" : "false";
  reply(`✅ *Auto Status Reply ${val === "on" ? "Enabled" : "Disabled"}!*`);
});

// ============ MODE ============
cmd({
  pattern: "mode",
  react: "⚙️",
  desc: "Change bot mode",
  category: "settings",
  use: "<public/private/inbox/group>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, args, reply }) => {
  if (!isOwner) return reply("❌ *Owner Only Command!*");
  const val = args[0]?.toLowerCase();
  const modes = ["public", "private", "inbox", "group"];
  if (!val || !modes.includes(val)) return reply(`*Usage: .mode <${modes.join("/")}> *`);
  config.MODE = val;
  reply(`✅ *Bot Mode Changed to ${val.toUpperCase()}!*`);
});

// ============ PREFIX ============
cmd({
  pattern: "prefix",
  react: "⌨️",
  desc: "Change bot prefix",
  category: "settings",
  use: "<prefix>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, args, reply }) => {
  if (!isOwner) return reply("❌ *Owner Only Command!*");
  const val = args[0];
  if (!val) return reply("*Usage: .prefix <new prefix>*");
  config.PREFIX = val;
  reply(`✅ *Prefix Changed to ${val}*`);
});

// ============ BOTNAME ============
cmd({
  pattern: "botname",
  react: "🤖",
  desc: "Change bot name",
  category: "settings",
  use: "<name>",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, args, reply }) => {
  if (!isOwner) return reply("❌ *Owner Only Command!*");
  const val = args.join(" ");
  if (!val) return reply("*Usage: .botname <name>*");
  config.BOT_NAME = val;
  reply(`✅ *Bot Name Changed to ${val}!*`);
});

// ============ SETTINGS VIEW ============
cmd({
  pattern: "settings",
  alias: ["setting"],
  react: "⚙️",
  desc: "View all bot settings",
  category: "settings",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, reply }) => {
  if (!isOwner) return reply("❌ *Owner Only Command!*");
  const settingsText = `
╭──❍ *⚙️ ABDULLAH-BOTZ SETTINGS* ❍──╮
│
├─❍ *Anti Features*
├─── 🔒 Anti Delete: ${config.ANTI_DELETE === "true" ? "✅ ON" : "❌ OFF"}
├─── 👁️ Anti View Once: ${config.ANTI_VV === "true" ? "✅ ON" : "❌ OFF"}
├─── 🔗 Anti Link: ${config.ANTI_LINK === "true" ? "✅ ON" : "❌ OFF"}
├─── 🤬 Anti Bad: ${config.ANTI_BAD === "true" ? "✅ ON" : "❌ OFF"}
├─── 📵 Anti Call: ${config.ANTI_CALL === "true" ? "✅ ON" : "❌ OFF"}
├─── 🤖 Anti Bot: ${config.ANTI_BOT === "true" ? "✅ ON" : "❌ OFF"}
│
├─❍ *Auto Features*
├─── 👁️ Status View: ${config.AUTO_STATUS_SEEN === "true" ? "✅ ON" : "❌ OFF"}
├─── ❤️ Status React: ${config.AUTO_STATUS_REACT === "true" ? "✅ ON" : "❌ OFF"}
├─── ✅ Auto Read: ${config.READ_MESSAGE === "true" ? "✅ ON" : "❌ OFF"}
├─── 😊 Auto React: ${config.AUTO_REACT === "true" ? "✅ ON" : "❌ OFF"}
├─── ⌨️ Auto Typing: ${config.AUTO_TYPING === "true" ? "✅ ON" : "❌ OFF"}
├─── 🎙️ Auto Recording: ${config.AUTO_RECORDING === "true" ? "✅ ON" : "❌ OFF"}
├─── 🟢 Always Online: ${config.ALWAYS_ONLINE === "true" ? "✅ ON" : "❌ OFF"}
│
├─❍ *Bot Config*
├─── 🤖 Bot Name: ${config.BOT_NAME}
├─── ⌨️ Prefix: ${config.PREFIX}
├─── 🌐 Mode: ${config.MODE?.toUpperCase()}
│
╰──────────────────────❍

> _ABDULLAH-BOTZ Settings Panel_ 🔰`;
  await conn.sendMessage(from, {
    image: { url: "https://files.catbox.moe/ymgwct.jpg" },
    caption: settingsText
  }, { quoted: mek });
});

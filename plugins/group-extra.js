const { cmd } = require('../lib/command');
const config = require('../setting');

// ============ WARN SYSTEM ============
const warnMap = new Map();

cmd({
  pattern: "warn",
  react: "⚠️",
  desc: "Warn a group member",
  category: "group",
  use: "@mention <reason>",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isOwner, reply, mentioned, args }) => {
  if (!isGroup) return reply("❌ *Group only!*");
  if (!isAdmins && !isOwner) return reply("❌ *Admins only!*");
  if (!mentioned?.length) return reply("❌ *Mention someone to warn!*\n\n*Usage:* .warn @user <reason>");
  const target = mentioned[0];
  const reason = args.slice(1).join(" ") || "No reason given";
  const key = `${from}_${target}`;
  const warns = (warnMap.get(key) || 0) + 1;
  warnMap.set(key, warns);
  const warnMsg = `╭──❍ *⚠️ WARNING* ❍──╮\n│\n├─❍ *User:* @${target.split("@")[0]}\n├─❍ *Reason:* ${reason}\n├─❍ *Warns:* ${warns}/3\n│\n╰──────────────────────❍\n\n> ${warns >= 3 ? "_3 warnings! User will be kicked!_" : "_Stay within group rules!_"} 🔰`;
  await conn.sendMessage(from, { text: warnMsg, mentions: [target] }, { quoted: mek });
  if (warns >= 3) {
    warnMap.delete(key);
    await conn.groupParticipantsUpdate(from, [target], "remove").catch(() => {});
    reply(`✅ *@${target.split("@")[0]} kicked after 3 warnings!*`);
  }
});

cmd({
  pattern: "warncount",
  alias: ["warns"],
  react: "📊",
  desc: "Check warn count of a member",
  category: "group",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, reply, mentioned }) => {
  if (!isGroup) return reply("❌ *Group only!*");
  if (!mentioned?.length) return reply("❌ *Mention someone!*");
  const target = mentioned[0];
  const warns = warnMap.get(`${from}_${target}`) || 0;
  reply(`╭──❍ *📊 WARNS* ❍──╮\n│\n├─❍ *User:* @${target.split("@")[0]}\n├─❍ *Warns:* ${warns}/3\n│\n╰──────────────────────❍`);
});

cmd({
  pattern: "resetwarn",
  alias: ["clearwarn"],
  react: "🔄",
  desc: "Reset warns of a member",
  category: "group",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isOwner, reply, mentioned }) => {
  if (!isGroup) return reply("❌ *Group only!*");
  if (!isAdmins && !isOwner) return reply("❌ *Admins only!*");
  if (!mentioned?.length) return reply("❌ *Mention someone!*");
  const target = mentioned[0];
  warnMap.delete(`${from}_${target}`);
  reply(`✅ *Warns reset for @${target.split("@")[0]}!*`);
});

// ============ MUTE/UNMUTE ============
cmd({
  pattern: "mute",
  react: "🔇",
  desc: "Mute group (only admins can send)",
  category: "group",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isOwner, reply }) => {
  if (!isGroup) return reply("❌ *Group only!*");
  if (!isAdmins && !isOwner) return reply("❌ *Admins only!*");
  await conn.groupSettingUpdate(from, "announcement").catch(() => {});
  reply("✅ *Group Muted! Only admins can send messages.*");
});

cmd({
  pattern: "unmute",
  react: "🔊",
  desc: "Unmute group",
  category: "group",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isOwner, reply }) => {
  if (!isGroup) return reply("❌ *Group only!*");
  if (!isAdmins && !isOwner) return reply("❌ *Admins only!*");
  await conn.groupSettingUpdate(from, "not_announcement").catch(() => {});
  reply("✅ *Group Unmuted! Everyone can send messages.*");
});

// ============ KICK ============
cmd({
  pattern: "kick",
  alias: ["remove", "ban"],
  react: "👢",
  desc: "Kick a member from group",
  category: "group",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isOwner, reply, mentioned }) => {
  if (!isGroup) return reply("❌ *Group only!*");
  if (!isAdmins && !isOwner) return reply("❌ *Admins only!*");
  if (!mentioned?.length) return reply("❌ *Mention someone to kick!*");
  const target = mentioned[0];
  await conn.groupParticipantsUpdate(from, [target], "remove").catch(() => {});
  reply(`✅ *@${target.split("@")[0]} has been kicked from the group!*`);
});

// ============ ADD ============
cmd({
  pattern: "add",
  react: "➕",
  desc: "Add a member to group",
  category: "group",
  use: "<number>",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isOwner, reply, args }) => {
  if (!isGroup) return reply("❌ *Group only!*");
  if (!isAdmins && !isOwner) return reply("❌ *Admins only!*");
  let num = args[0]?.replace(/[^0-9]/g, "");
  if (!num) return reply("❌ *Usage:* .add 923001234567");
  const jid = num + "@s.whatsapp.net";
  await conn.groupParticipantsUpdate(from, [jid], "add").catch(() => {});
  reply(`✅ *${num} added to group!*`);
});

// ============ PROMOTE ============
cmd({
  pattern: "promote",
  alias: ["admin"],
  react: "👑",
  desc: "Promote member to admin",
  category: "group",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isOwner, reply, mentioned }) => {
  if (!isGroup) return reply("❌ *Group only!*");
  if (!isAdmins && !isOwner) return reply("❌ *Admins only!*");
  if (!mentioned?.length) return reply("❌ *Mention someone!*");
  const target = mentioned[0];
  await conn.groupParticipantsUpdate(from, [target], "promote").catch(() => {});
  reply(`✅ *@${target.split("@")[0]} promoted to Admin!* 👑`);
});

// ============ DEMOTE ============
cmd({
  pattern: "demote",
  react: "⬇️",
  desc: "Demote admin to member",
  category: "group",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isOwner, reply, mentioned }) => {
  if (!isGroup) return reply("❌ *Group only!*");
  if (!isAdmins && !isOwner) return reply("❌ *Admins only!*");
  if (!mentioned?.length) return reply("❌ *Mention someone!*");
  const target = mentioned[0];
  await conn.groupParticipantsUpdate(from, [target], "demote").catch(() => {});
  reply(`✅ *@${target.split("@")[0]} demoted to Member!*`);
});

// ============ TAGALL ============
cmd({
  pattern: "tagall",
  alias: ["everyone", "all", "tag"],
  react: "📢",
  desc: "Tag all group members",
  category: "group",
  use: "<message>",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isOwner, reply, args }) => {
  if (!isGroup) return reply("❌ *Group only!*");
  if (!isAdmins && !isOwner) return reply("❌ *Admins only!*");
  const groupMeta = await conn.groupMetadata(from);
  const members = groupMeta.participants.map(p => p.id);
  const msg = args.join(" ") || "👋 Everyone!";
  let text = `╭──❍ *📢 TAG ALL* ❍──╮\n│\n├─❍ *Message:* ${msg}\n├─❍ *Members:* ${members.length}\n│\n`;
  members.forEach(m => { text += `├─ @${m.split("@")[0]}\n`; });
  text += `│\n╰──────────────────────❍`;
  await conn.sendMessage(from, { text, mentions: members }, { quoted: mek });
});

// ============ GINFO ============
cmd({
  pattern: "ginfo",
  alias: ["groupinfo", "gcinfo"],
  react: "ℹ️",
  desc: "Get group info",
  category: "group",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, reply }) => {
  if (!isGroup) return reply("❌ *Group only!*");
  const meta = await conn.groupMetadata(from);
  const admins = meta.participants.filter(p => p.admin).length;
  const members = meta.participants.length;
  const created = new Date(meta.creation * 1000).toLocaleDateString();
  reply(`╭──❍ *ℹ️ GROUP INFO* ❍──╮\n│\n├─❍ *Name:* ${meta.subject}\n├─❍ *Members:* ${members}\n├─❍ *Admins:* ${admins}\n├─❍ *Created:* ${created}\n├─❍ *Desc:* ${meta.desc || "None"}\n│\n╰──────────────────────❍`);
});

// ============ LINK ============
cmd({
  pattern: "link",
  alias: ["invite", "grouplink"],
  react: "🔗",
  desc: "Get group invite link",
  category: "group",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isOwner, reply }) => {
  if (!isGroup) return reply("❌ *Group only!*");
  if (!isAdmins && !isOwner) return reply("❌ *Admins only!*");
  const code = await conn.groupInviteCode(from).catch(() => null);
  if (!code) return reply("❌ *Failed to get invite link!*");
  reply(`╭──❍ *🔗 GROUP LINK* ❍──╮\n│\n├─❍ https://chat.whatsapp.com/${code}\n│\n╰──────────────────────❍`);
});

// ============ REVOKE ============
cmd({
  pattern: "revoke",
  alias: ["resetlink"],
  react: "🔄",
  desc: "Revoke group invite link",
  category: "group",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isOwner, reply }) => {
  if (!isGroup) return reply("❌ *Group only!*");
  if (!isAdmins && !isOwner) return reply("❌ *Admins only!*");
  await conn.groupRevokeInvite(from).catch(() => {});
  reply("✅ *Group invite link has been revoked!*");
});

// ============ UPDATE GROUP NAME ============
cmd({
  pattern: "updategname",
  alias: ["setgname", "groupname"],
  react: "✏️",
  desc: "Update group name",
  category: "group",
  use: "<new name>",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isOwner, reply, args }) => {
  if (!isGroup) return reply("❌ *Group only!*");
  if (!isAdmins && !isOwner) return reply("❌ *Admins only!*");
  const name = args.join(" ");
  if (!name) return reply("❌ *Provide a group name!*");
  await conn.groupUpdateSubject(from, name).catch(() => {});
  reply(`✅ *Group name changed to ${name}!*`);
});

// ============ UPDATE GROUP DESC ============
cmd({
  pattern: "updategdesc",
  alias: ["setgdesc", "groupdesc"],
  react: "📝",
  desc: "Update group description",
  category: "group",
  use: "<new description>",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isOwner, reply, args }) => {
  if (!isGroup) return reply("❌ *Group only!*");
  if (!isAdmins && !isOwner) return reply("❌ *Admins only!*");
  const desc = args.join(" ");
  if (!desc) return reply("❌ *Provide a description!*");
  await conn.groupUpdateDescription(from, desc).catch(() => {});
  reply(`✅ *Group description updated!*`);
});

// ============ WELCOME ============
cmd({
  pattern: "welcome",
  react: "👋",
  desc: "Enable/Disable welcome messages",
  category: "group",
  use: "<on/off>",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isOwner, reply, args }) => {
  if (!isGroup) return reply("❌ *Group only!*");
  if (!isAdmins && !isOwner) return reply("❌ *Admins only!*");
  const val = args[0]?.toLowerCase();
  if (!val || !["on","off"].includes(val)) return reply("*Usage: .welcome on/off*");
  reply(`✅ *Welcome messages ${val === "on" ? "Enabled" : "Disabled"}!*`);
});

// ============ GOODBYE ============
cmd({
  pattern: "goodbye",
  alias: ["bye"],
  react: "👋",
  desc: "Enable/Disable goodbye messages",
  category: "group",
  use: "<on/off>",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isOwner, reply, args }) => {
  if (!isGroup) return reply("❌ *Group only!*");
  if (!isAdmins && !isOwner) return reply("❌ *Admins only!*");
  const val = args[0]?.toLowerCase();
  if (!val || !["on","off"].includes(val)) return reply("*Usage: .goodbye on/off*");
  reply(`✅ *Goodbye messages ${val === "on" ? "Enabled" : "Disabled"}!*`);
});

// ============ OUT ============
cmd({
  pattern: "out",
  alias: ["leave"],
  react: "🚪",
  desc: "Bot leaves the group",
  category: "group",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isOwner, reply }) => {
  if (!isGroup) return reply("❌ *Group only!*");
  if (!isOwner) return reply("❌ *Owner only!*");
  reply("👋 *Goodbye everyone! ABDULLAH-BOTZ is leaving...*");
  await conn.groupLeave(from).catch(() => {});
});

// ============ DELETE ============
cmd({
  pattern: "delete",
  alias: ["del"],
  react: "🗑️",
  desc: "Delete a message (reply to it)",
  category: "group",
  filename: __filename
}, async (conn, mek, m, { from, isAdmins, isOwner, reply, quoted }) => {
  if (!quoted) return reply("❌ *Reply to the message you want to delete!*");
  if (!isAdmins && !isOwner) return reply("❌ *Admins only!*");
  await conn.sendMessage(from, { delete: quoted.key }).catch(() => {});
});

module.exports = {};

const { cmd } = require('../lib/command');
const config = require('../setting');
const bot = require('../lib/bot');
const axios = require('axios');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  OWNER CHECK — reads from config.env
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function isOwnerCheck(sender) {
  const ownerNum = (config.OWNER_NUMBER || "923041956023").toString().replace(/[^0-9]/g, '');
  const senderNum = (sender || '').toString().split('@')[0].replace(/[^0-9]/g, '');
  return senderNum === ownerNum;
}

const OWNER_DENY =
`╭━━━「 ❌ ᴀᴄᴄᴇꜱꜱ ᴅᴇɴɪᴇᴅ 」━━━
┃ 🔐 *Owner Only Command!*
┃ 👑 Only ABDULLAH can use this.
╰━━━━━━━━━━━━━━━━━━━━━━━
> *㋛ ABDULLAH-BOTZ 🇵🇰*`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .setpublicbotname
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "setpublicbotname",
  alias: ["setbotname", "botname"],
  react: "✏️",
  desc: "Change bot display name (Owner only)",
  category: "owner",
  use: ".setpublicbotname <name>",
  filename: __filename
}, async (conn, mek, m, { from, sender, reply, args }) => {
  if (!isOwnerCheck(sender)) return reply(OWNER_DENY);
  const name = args.join(" ");
  if (!name) return reply("❌ *Usage: .setpublicbotname COOL-BOT*");
  config.BOT_NAME = name;
  await conn.updateProfileName(name).catch(() => {});
  reply(
`╭━━━「 ✏️ ɴᴀᴍᴇ ᴜᴘᴅᴀᴛᴇᴅ 」━━━
┃ ✅ *Bot name changed!*
┃ 🏷️  *New Name :* ${name}
╰━━━━━━━━━━━━━━━━━━━━━━━
> *㋛ ABDULLAH-BOTZ 🇵🇰*`);
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .setimg
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "setimg",
  alias: ["setbotimg", "botpic"],
  react: "🖼️",
  desc: "Change bot profile picture (Owner only)",
  category: "owner",
  use: ".setimg <url> OR reply to image",
  filename: __filename
}, async (conn, mek, m, { from, sender, reply, args, quoted }) => {
  if (!isOwnerCheck(sender)) return reply(OWNER_DENY);
  try {
    let imgBuffer;
    if (args[0]?.startsWith("http")) {
      const res = await axios.get(args[0], { responseType: "arraybuffer", timeout: 10000 });
      imgBuffer = Buffer.from(res.data);
    } else if (quoted?.message?.imageMessage) {
      imgBuffer = await conn.downloadMediaMessage(quoted, "buffer");
    } else {
      return reply("❌ *Usage:*\n.setimg https://example.com/pic.jpg\nOr reply to an image with .setimg");
    }
    await conn.updateProfilePicture(conn.user.id, imgBuffer);
    reply(
`╭━━━「 🖼️ ᴘɪᴄᴛᴜʀᴇ ᴜᴘᴅᴀᴛᴇᴅ 」━
┃ ✅ *Bot profile pic updated!*
╰━━━━━━━━━━━━━━━━━━━━━━━
> *㋛ ABDULLAH-BOTZ 🇵🇰*`);
  } catch(e) { reply(`❌ *Failed:* ${e.message}`); }
});

module.exports = {};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GLOBAL STORES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
if (!global.pairedNumbers) global.pairedNumbers = new Set();
if (!global.customCmds)    global.customCmds    = {};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .listpair
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "listpair",
  alias: ["pairlist"],
  react: "📋",
  desc: "Show all paired numbers (Owner only)",
  category: "owner",
  filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
  if (!isOwnerCheck(sender)) return reply(OWNER_DENY);
  if (conn.user?.id) global.pairedNumbers.add(conn.user.id.split(":")[0].split("@")[0]);
  if (!global.pairedNumbers.size) return reply(
`╭━━━「 📋 ᴘᴀɪʀᴇᴅ ɴᴜᴍꜱ 」━━━
┃ 📭 *No numbers paired yet.*
╰━━━━━━━━━━━━━━━━━━━━━━━
> *㋛ ABDULLAH-BOTZ 🇵🇰*`);
  let list = `╔══════════════════════════╗\n║  📋 *ᴘᴀɪʀᴇᴅ ɴᴜᴍʙᴇʀꜱ* 📋  ║\n╚══════════════════════════╝\n\n`;
  let i = 1;
  for (const num of global.pairedNumbers) { list += `┃ ${i++}. 📞 +${num}\n`; }
  list += `\n╰━ *Total: ${global.pairedNumbers.size}* ━━━━━━━━━\n> *㋛ ABDULLAH-BOTZ 🇵🇰*`;
  reply(list);
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .delpair
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "delpair",
  alias: ["removepair", "unpair"],
  react: "🔌",
  desc: "Set bot offline for a number (Owner only)",
  category: "owner",
  use: ".delpair <number>",
  filename: __filename
}, async (conn, mek, m, { from, sender, reply, args }) => {
  if (!isOwnerCheck(sender)) return reply(OWNER_DENY);
  const num = args[0]?.replace(/[^0-9]/g, "");
  if (!num) return reply("❌ *Usage: .delpair 923001234567*");
  await conn.sendPresenceUpdate("unavailable", num + "@s.whatsapp.net").catch(() => {});
  global.pairedNumbers.delete(num);
  reply(
`╭━━━「 🔌 ᴏꜰꜰʟɪɴᴇ ꜱᴇᴛ 」━━━━
┃ ✅ *Bot OFFLINE for +${num}*
┃ 🗑️  *Removed from paired list*
╰━━━━━━━━━━━━━━━━━━━━━━━
> *㋛ ABDULLAH-BOTZ 🇵🇰*`);
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .addcmd  ← POWERFUL NEW COMMAND
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "addcmd",
  alias: ["addcommand"],
  react: "➕",
  desc: "Add a custom auto-reply command (Owner only)",
  category: "owner",
  use: ".addcmd NAME | RESPONSE TEXT",
  filename: __filename
}, async (conn, mek, m, { from, sender, reply, args, body }) => {
  if (!isOwnerCheck(sender)) return reply(OWNER_DENY);

  const fullText = body.slice(body.indexOf(' ') + 1).trim();
  const parts = fullText.split('|');

  if (parts.length < 2) {
    return reply(
`╭━━━「 ➕ ᴀᴅᴅ ᴄᴍᴅ — ʜᴇʟᴘ 」━
┃ ❌ *Wrong format!*
┃
┃ ✅ *Correct Usage:*
┃ .addcmd NAME | RESPONSE
┃
┃ 📌 *Example:*
┃ .addcmd hello | Hi there! 👋
┃
┃ 💡 Bot will reply to:
┃ ${config.PREFIX}hello  →  Hi there! 👋
╰━━━━━━━━━━━━━━━━━━━━━━━
> *㋛ ABDULLAH-BOTZ 🇵🇰*`);
  }

  const cmdName = parts[0].trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const cmdResponse = parts.slice(1).join('|').trim();

  if (!cmdName) return reply("❌ *Invalid command name. Use letters/numbers only.*");
  if (!cmdResponse) return reply("❌ *Response text cannot be empty.*");

  global.customCmds[cmdName] = cmdResponse;

  // Register immediately — no restart needed
  const { cmd: registerCmd } = require('../lib/command');
  registerCmd({
    pattern: cmdName,
    desc: `Custom: ${cmdName}`,
    category: "other",
    dontAddCommandList: false,
    filename: "custom-added"
  }, async (conn2, mek2, m2, { reply: r2 }) => {
    r2(global.customCmds[cmdName] || "⚠️ Response not found.");
  });

  reply(
`╔══════════════════════════╗
║  ➕ *ᴄᴍᴅ ᴀᴅᴅᴇᴅ!* ✅      ║
╚══════════════════════════╝

╭━━━「 📋 ᴅᴇᴛᴀɪʟꜱ 」━━━━━━
┃ 🔖 *Command  :* ${config.PREFIX}${cmdName}
┃ 💬 *Response :* ${cmdResponse.slice(0,40)}${cmdResponse.length>40?'...':''}
┃ ⚡ *Status   :* Live Now!
╰━━━━━━━━━━━━━━━━━━━━━━━

💡 Try it: *${config.PREFIX}${cmdName}*
> *㋛ ABDULLAH-BOTZ 🇵🇰*`);
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .mycmds
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "mycmds",
  alias: ["customcmds", "listcmd"],
  react: "📋",
  desc: "List all custom commands (Owner only)",
  category: "owner",
  filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
  if (!isOwnerCheck(sender)) return reply(OWNER_DENY);
  if (!Object.keys(global.customCmds).length) {
    return reply(
`╭━━━「 📋 ᴄᴜꜱᴛᴏᴍ ᴄᴍᴅꜱ 」━━━
┃ 📭 *No custom commands yet.*
┃ Use .addcmd to add one!
╰━━━━━━━━━━━━━━━━━━━━━━━
> *㋛ ABDULLAH-BOTZ 🇵🇰*`);
  }
  let list = `╔══════════════════════════╗\n║  ➕ *ᴄᴜꜱᴛᴏᴍ ᴄᴏᴍᴍᴀɴᴅꜱ* ➕  ║\n╚══════════════════════════╝\n\n`;
  for (const [name, resp] of Object.entries(global.customCmds)) {
    list += `┃ 🔖 ${config.PREFIX}${name}\n┃    └ ${resp.length > 35 ? resp.slice(0,35)+'...' : resp}\n`;
  }
  list += `\n╰━ *Total: ${Object.keys(global.customCmds).length}* ━━━━━━━━\n> *㋛ ABDULLAH-BOTZ 🇵🇰*`;
  reply(list);
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  .delcmd
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "delcmd",
  alias: ["deletecommand", "removecmd"],
  react: "🗑️",
  desc: "Delete a custom command (Owner only)",
  category: "owner",
  use: ".delcmd NAME",
  filename: __filename
}, async (conn, mek, m, { from, sender, reply, args }) => {
  if (!isOwnerCheck(sender)) return reply(OWNER_DENY);
  const name = (args[0] || '').toLowerCase().trim();
  if (!name) return reply("❌ *Usage: .delcmd commandname*");
  if (!global.customCmds[name]) return reply(
`╭━━━「 ❌ ɴᴏᴛ ꜰᴏᴜɴᴅ 」━━━━━
┃ ❌ *${config.PREFIX}${name}* not found!
┃ Use .mycmds to see your cmds.
╰━━━━━━━━━━━━━━━━━━━━━━━
> *㋛ ABDULLAH-BOTZ 🇵🇰*`);
  delete global.customCmds[name];
  reply(
`╭━━━「 🗑️ ᴄᴍᴅ ᴅᴇʟᴇᴛᴇᴅ 」━━━
┃ ✅ *${config.PREFIX}${name}* deleted!
╰━━━━━━━━━━━━━━━━━━━━━━━
> *㋛ ABDULLAH-BOTZ 🇵🇰*`);
});

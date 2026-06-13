const { cmd } = require('../lib/command');
const config = require('../setting');

if (!global.customCmds) global.customCmds = {};

function isOwnerCheck(sender) {
  const ownerNum = (config.OWNER_NUMBER || "923041956023").toString().replace(/[^0-9]/g, '');
  const senderNum = (sender || '').toString().split('@')[0].replace(/[^0-9]/g, '');
  return senderNum === ownerNum;
}

const DENY = `❌ *Sirf OWNER use kar sakta hai yeh command!*`;

cmd({
  pattern: "addcmd", alias: ["addcommand"], react: "➕",
  desc: "Custom command add karo", category: "owner",
  use: ".addcmd NAME | RESPONSE", filename: __filename
}, async (conn, mek, m, { from, sender, reply, body }) => {
  if (!isOwnerCheck(sender)) return reply(DENY);
  const fullText = body.slice(body.indexOf(' ') + 1).trim();
  const parts = fullText.split('|');
  if (parts.length < 2) return reply(`❌ *Sahi format:*\n.addcmd hello | Hello World!\n\nExample:\n.addcmd test | Yeh test command hai`);
  const cmdName = parts[0].trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const cmdResponse = parts.slice(1).join('|').trim();
  if (!cmdName || !cmdResponse) return reply("❌ *Name aur response dono chahiye!*");
  global.customCmds[cmdName] = cmdResponse;
  const { cmd: reg } = require('../lib/command');
  reg({ pattern: cmdName, desc: `Custom: ${cmdName}`, category: "other", filename: "custom" },
    async (c, mk, mm, { reply: r }) => r(global.customCmds[cmdName] || "Response nahi mila!"));
  reply(`✅ *Command add ho gaya!*\n\n🔖 *Name:* ${config.PREFIX}${cmdName}\n💬 *Response:* ${cmdResponse}\n\n> Try karo: ${config.PREFIX}${cmdName}`);
});

cmd({
  pattern: "mycmds", alias: ["customcmds"], react: "📋",
  desc: "Sab custom commands dekho", category: "owner", filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
  if (!isOwnerCheck(sender)) return reply(DENY);
  const cmds = Object.keys(global.customCmds);
  if (!cmds.length) return reply("📭 *Koi custom command nahi hai abhi.*\nUse: .addcmd name | response");
  let list = `*📋 CUSTOM COMMANDS (${cmds.length})*\n\n`;
  for (const [n, r] of Object.entries(global.customCmds))
    list += `▸ ${config.PREFIX}${n}\n  └ ${r.length > 40 ? r.slice(0,40)+'...' : r}\n`;
  list += `\n> ABDULLAH-BOTZ 🇵🇰`;
  reply(list);
});

cmd({
  pattern: "delcmd", alias: ["removecmd"], react: "🗑️",
  desc: "Custom command delete karo", category: "owner",
  use: ".delcmd NAME", filename: __filename
}, async (conn, mek, m, { from, sender, reply, args }) => {
  if (!isOwnerCheck(sender)) return reply(DENY);
  const name = (args[0] || '').toLowerCase().trim();
  if (!name) return reply("❌ *Usage: .delcmd commandname*");
  if (!global.customCmds[name]) return reply(`❌ *${config.PREFIX}${name}* nahi mila!`);
  delete global.customCmds[name];
  reply(`✅ *${config.PREFIX}${name}* delete ho gaya!`);
});

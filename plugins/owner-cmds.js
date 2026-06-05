const { cmd } = require('../lib/command');
const config = require('../setting');
const axios = require('axios');

// ✅ OWNER NUMBERS — sirf inhe owner commands milenge
const OWNER_NUMBERS = [
  config.OWNER_NUMBER || "923041956023",
  "923041956023"
];

function isOwnerCheck(sender) {
  const num = sender?.replace(/[^0-9]/g, '').replace('@s.whatsapp.net', '');
  return OWNER_NUMBERS.some(o => o.replace(/[^0-9]/g, '') === num);
}

// ============ SETPUBLICBOTNAME — Sirf Owner ============
cmd({
  pattern: "setpublicbotname",
  alias: ["setbotname", "botname"],
  react: "✏",
  desc: "Change bot name for all users (Owner only)",
  category: "owner",
  use: ".setpublicbotname <name>",
  filename: __filename
}, async (conn, mek, m, { from, sender, reply, args }) => {
  if (!isOwnerCheck(sender)) return reply("❌ *Sirf Owner Use Kar Sakta Hai!*");
  const name = args.join(" ");
  if (!name) return reply("❌ *Usage:* .setpublicbotname COOL-BOT");
  config.BOT_NAME = name;
  await conn.updateProfileName(name).catch(() => {});
  reply(`✅ *Bot name ab sab ke liye:* *${name}*`);
});

// ============ SETIMG — Sirf Owner ============
cmd({
  pattern: "setimg",
  alias: ["setbotimg", "botpic"],
  react: "🖼",
  desc: "Change bot profile picture via URL or reply (Owner only)",
  category: "owner",
  use: ".setimg <url> OR reply to image",
  filename: __filename
}, async (conn, mek, m, { from, sender, reply, args, quoted }) => {
  if (!isOwnerCheck(sender)) return reply("❌ *Sirf Owner Use Kar Sakta Hai!*");
  try {
    let imgBuffer;
    if (args[0]?.startsWith("http")) {
      const res = await axios.get(args[0], { responseType: "arraybuffer", timeout: 10000 });
      imgBuffer = Buffer.from(res.data);
    } else if (quoted?.message?.imageMessage) {
      imgBuffer = await conn.downloadMediaMessage(quoted, "buffer");
    } else {
      return reply("❌ *Usage:*\n.setimg https://example.com/pic.jpg\nYa kisi image ko reply kar ke .setimg likho");
    }
    await conn.updateProfilePicture(conn.user.id, imgBuffer);
    reply("✅ *Bot profile picture update ho gayi!*");
  } catch(e) {
    reply(`❌ *Failed:* ${e.message}`);
  }
});

module.exports = {};

// ============ GLOBAL PAIRED NUMBERS STORE ============
if (!global.pairedNumbers) global.pairedNumbers = new Set();

// ============ LISTPAIR — Owner Only ============
cmd({
  pattern: "listpair",
  alias: ["pairlist"],
  react: "📋",
  desc: "Show all numbers bot is paired on (Owner only)",
  category: "owner",
  filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
  if (!isOwnerCheck(sender)) return reply("❌ *Sirf Owner Use Kar Sakta Hai!*");
  if (conn.user?.id) {
    const myNum = conn.user.id.split(":")[0].split("@")[0];
    global.pairedNumbers.add(myNum);
  }
  if (!global.pairedNumbers.size) return reply("📋 *Abhi koi number paired nahi hai.*");
  let list = `*╭── 📋 PAIRED NUMBERS ──*\n`;
  let i = 1;
  for (const num of global.pairedNumbers) {
    list += `*│* ${i}. +${num}\n`;
    i++;
  }
  list += `*╰── Total: ${global.pairedNumbers.size} ──*\n\n> ABDULLAH-BOTZ`;
  reply(list);
});

// ============ DELPAIR — Owner Only ============
cmd({
  pattern: "delpair",
  alias: ["removepair", "unpair"],
  react: "🔌",
  desc: "Set bot offline for a number (Owner only)",
  category: "owner",
  use: ".delpair <number>",
  filename: __filename
}, async (conn, mek, m, { from, sender, reply, args }) => {
  if (!isOwnerCheck(sender)) return reply("❌ *Sirf Owner Use Kar Sakta Hai!*");
  const num = args[0]?.replace(/[^0-9]/g, "");
  if (!num) return reply("❌ *Usage: .delpair 923001234567*");
  const jid = num + "@s.whatsapp.net";
  await conn.sendPresenceUpdate("unavailable", jid).catch(() => {});
  global.pairedNumbers.delete(num);
  reply(`✅ *Bot OFFLINE set for +${num}*\nNumber paired list se remove ho gaya.`);
});


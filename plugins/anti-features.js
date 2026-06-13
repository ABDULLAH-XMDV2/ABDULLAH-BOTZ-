const { cmd } = require('../lib/command');
const config = require('../setting');

// ╔══════════════════════════════════════╗
// ║  SETTINGS COMMANDS — ALL PUBLIC     ║
// ╚══════════════════════════════════════╝

function sw(v) { return v?.toString() === 'true' ? '■ ON' : '□ OFF'; }
function toggle(key, val) { config[key] = val ? 'true' : 'false'; }

// .antidelete
cmd({ pattern:'antidelete', alias:['antidel'], react:'🔒',
  desc:'Anti Delete on/off', category:'settings', use:'on/off', filename:__filename
}, async (conn,mek,m,{from,args,reply}) => {
  const v = args[0]?.toLowerCase();
  if (!['on','off'].includes(v)) return reply('❌ `.antidelete on` ya `.antidelete off`');
  toggle('ANTI_DELETE', v==='on');
  reply(`\`[ 🔒 ANTI DELETE » ${v.toUpperCase()} ]\``);
});

// .antiviewonce
cmd({ pattern:'antiviewonce', alias:['antivv','antivo'], react:'👁️',
  desc:'Anti View Once on/off', category:'settings', use:'on/off', filename:__filename
}, async (conn,mek,m,{from,args,reply}) => {
  const v = args[0]?.toLowerCase();
  if (!['on','off'].includes(v)) return reply('❌ `.antiviewonce on/off`');
  toggle('ANTI_VV', v==='on');
  reply(`\`[ 👁️ ANTI VIEW ONCE » ${v.toUpperCase()} ]\``);
});

// .antilink
cmd({ pattern:'antilink', react:'🔗',
  desc:'Anti Link in group', category:'group', use:'on/off', filename:__filename
}, async (conn,mek,m,{from,isGroup,isAdmins,args,reply}) => {
  if (!isGroup) return reply('❌ Group mein use karo!');
  if (!isAdmins) return reply('❌ Sirf admins!');
  const v = args[0]?.toLowerCase();
  if (!['on','off'].includes(v)) return reply('❌ `.antilink on/off`');
  toggle('ANTI_LINK', v==='on');
  reply(`\`[ 🔗 ANTI LINK » ${v.toUpperCase()} ]\``);
});

// .antibad
cmd({ pattern:'antibad', alias:['antibadword'], react:'🤬',
  desc:'Anti Bad Words on/off', category:'settings', use:'on/off', filename:__filename
}, async (conn,mek,m,{from,args,reply}) => {
  const v = args[0]?.toLowerCase();
  if (!['on','off'].includes(v)) return reply('❌ `.antibad on/off`');
  toggle('ANTI_BAD', v==='on');
  reply(`\`[ 🤬 ANTI BAD WORDS » ${v.toUpperCase()} ]\``);
});

// .anticall
cmd({ pattern:'anticall', react:'📵',
  desc:'Anti Call on/off', category:'settings', use:'on/off', filename:__filename
}, async (conn,mek,m,{from,args,reply}) => {
  const v = args[0]?.toLowerCase();
  if (!['on','off'].includes(v)) return reply('❌ `.anticall on/off`');
  toggle('ANTI_CALL', v==='on');
  reply(`\`[ 📵 ANTI CALL » ${v.toUpperCase()} ]\``);
});

// .antibot
cmd({ pattern:'antibot', react:'🤖',
  desc:'Anti Bot on/off', category:'settings', use:'on/off', filename:__filename
}, async (conn,mek,m,{from,args,reply}) => {
  const v = args[0]?.toLowerCase();
  if (!['on','off'].includes(v)) return reply('❌ `.antibot on/off`');
  toggle('ANTI_BOT', v==='on');
  reply(`\`[ 🤖 ANTI BOT » ${v.toUpperCase()} ]\``);
});

// .antiedit
cmd({ pattern:'antiedit', react:'✏️',
  desc:'Anti Edit on/off', category:'settings', use:'on/off', filename:__filename
}, async (conn,mek,m,{from,args,reply}) => {
  const v = args[0]?.toLowerCase();
  if (!['on','off'].includes(v)) return reply('❌ `.antiedit on/off`');
  toggle('ANTI_EDIT', v==='on');
  reply(`\`[ ✏️ ANTI EDIT » ${v.toUpperCase()} ]\``);
});

// .statusview
cmd({ pattern:'statusview', alias:['autostatus'], react:'👁️',
  desc:'Auto Status View on/off', category:'settings', use:'on/off', filename:__filename
}, async (conn,mek,m,{from,args,reply}) => {
  const v = args[0]?.toLowerCase();
  if (!['on','off'].includes(v)) return reply('❌ `.statusview on/off`');
  toggle('AUTO_STATUS_SEEN', v==='on');
  reply(`\`[ 👁️ STATUS VIEW » ${v.toUpperCase()} ]\``);
});

// .statuslike
cmd({ pattern:'statuslike', alias:['autostatusreact'], react:'❤️',
  desc:'Auto Status React on/off', category:'settings', use:'on/off', filename:__filename
}, async (conn,mek,m,{from,args,reply}) => {
  const v = args[0]?.toLowerCase();
  if (!['on','off'].includes(v)) return reply('❌ `.statuslike on/off`');
  toggle('AUTO_STATUS_REACT', v==='on');
  reply(`\`[ ❤️ STATUS REACT » ${v.toUpperCase()} ]\``);
});

// .autotyping
cmd({ pattern:'autotyping', react:'⌨️',
  desc:'Auto Typing on/off', category:'settings', use:'on/off', filename:__filename
}, async (conn,mek,m,{from,args,reply}) => {
  const v = args[0]?.toLowerCase();
  if (!['on','off'].includes(v)) return reply('❌ `.autotyping on/off`');
  toggle('AUTO_TYPING', v==='on');
  reply(`\`[ ⌨️ AUTO TYPING » ${v.toUpperCase()} ]\``);
});

// .autoread
cmd({ pattern:'autoread', alias:['readmessage'], react:'✅',
  desc:'Auto Read on/off', category:'settings', use:'on/off', filename:__filename
}, async (conn,mek,m,{from,args,reply}) => {
  const v = args[0]?.toLowerCase();
  if (!['on','off'].includes(v)) return reply('❌ `.autoread on/off`');
  toggle('READ_MESSAGE', v==='on');
  reply(`\`[ ✅ AUTO READ » ${v.toUpperCase()} ]\``);
});

// .autoreact
cmd({ pattern:'autoreact', react:'😊',
  desc:'Auto React on/off', category:'settings', use:'on/off', filename:__filename
}, async (conn,mek,m,{from,args,reply}) => {
  const v = args[0]?.toLowerCase();
  if (!['on','off'].includes(v)) return reply('❌ `.autoreact on/off`');
  toggle('AUTO_REACT', v==='on');
  reply(`\`[ 😊 AUTO REACT » ${v.toUpperCase()} ]\``);
});

// .online
cmd({ pattern:'online', alias:['alwaysonline'], react:'🟢',
  desc:'Always Online on/off', category:'settings', use:'on/off', filename:__filename
}, async (conn,mek,m,{from,args,reply}) => {
  const v = args[0]?.toLowerCase();
  if (!['on','off'].includes(v)) return reply('❌ `.online on/off`');
  toggle('ALWAYS_ONLINE', v==='on');
  reply(`\`[ 🟢 ALWAYS ONLINE » ${v.toUpperCase()} ]\``);
});

// .mode
cmd({ pattern:'mode', react:'⚙️',
  desc:'Bot mode change', category:'settings', use:'public/private/inbox/group', filename:__filename
}, async (conn,mek,m,{from,args,reply}) => {
  const v = args[0]?.toLowerCase();
  if (!['public','private','inbox','group'].includes(v))
    return reply('❌ `.mode public` ya `private` ya `inbox` ya `group`');
  config.MODE = v;
  reply(`\`[ ⚙️ MODE » ${v.toUpperCase()} ]\``);
});

// .prefix
cmd({ pattern:'prefix', react:'⌨️',
  desc:'Prefix change', category:'settings', use:'<prefix>', filename:__filename
}, async (conn,mek,m,{from,args,reply}) => {
  const v = args[0];
  if (!v) return reply('❌ `.prefix .` ya koi bhi character');
  config.PREFIX = v;
  reply(`\`[ ⌨️ PREFIX » ${v} ]\``);
});

// .settings (view all)
cmd({ pattern:'settings', alias:['setting'], react:'⚙️',
  desc:'View all settings', category:'settings', filename:__filename
}, async (conn,mek,m,{from}) => {
  const txt =
`\`\`\`
╔══════════════════════════════╗
║   ⚙️   FULL SETTINGS VIEW    ║
╠══════════════════════════════╣
║  [ ANTI PROTECTION ]         ║
║  Anti Delete  » ${sw(config.ANTI_DELETE).padEnd(12)}║
║  Anti VV      » ${sw(config.ANTI_VV).padEnd(12)}║
║  Anti Link    » ${sw(config.ANTI_LINK).padEnd(12)}║
║  Anti Bad     » ${sw(config.ANTI_BAD).padEnd(12)}║
║  Anti Call    » ${sw(config.ANTI_CALL).padEnd(12)}║
║  Anti Bot     » ${sw(config.ANTI_BOT).padEnd(12)}║
║  Anti Edit    » ${sw(config.ANTI_EDIT).padEnd(12)}║
╠══════════════════════════════╣
║  [ AUTO FEATURES ]           ║
║  Status View  » ${sw(config.AUTO_STATUS_SEEN).padEnd(12)}║
║  Status React » ${sw(config.AUTO_STATUS_REACT).padEnd(12)}║
║  Auto Read    » ${sw(config.READ_MESSAGE).padEnd(12)}║
║  Auto React   » ${sw(config.AUTO_REACT).padEnd(12)}║
║  Auto Typing  » ${sw(config.AUTO_TYPING).padEnd(12)}║
║  Auto Record  » ${sw(config.AUTO_RECORDING).padEnd(12)}║
║  Always Online» ${sw(config.ALWAYS_ONLINE).padEnd(12)}║
╠══════════════════════════════╣
║  [ BOT CONFIG ]              ║
║  Bot Name     » ${(config.BOT_NAME||'ABDULLAH-BOTZ').slice(0,12).padEnd(12)}║
║  Prefix       » ${(config.PREFIX||'.').padEnd(12)}║
║  Mode         » ${(config.MODE||'PUBLIC').toUpperCase().padEnd(12)}║
╚══════════════════════════════╝
▀▄▀▄ ABDULLAH-BOTZ 🇵🇰 ▄▀▄▀
\`\`\``;
  await conn.sendMessage(from, {
    image: { url: 'https://files.catbox.moe/yba2f9.jpg' },
    caption: txt
  }, { quoted: mek });
});

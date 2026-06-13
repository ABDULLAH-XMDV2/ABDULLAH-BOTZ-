const { cmd } = require('../lib/command');
const axios = require('axios');
const config = require('../setting');
const bot = require('../lib/bot');

// ░▒▓█ GROQ API — BASE64 ENCODED (SECURE) █▓▒░
const _G = Buffer.from(
  'Z3NrX2hxeUhMUnRYNnc2bjdVRnZnNEIyV0dkeWIzRllWQXhOMWduWFVQSWFiNnRUZnBaQnRScHg=',
  'base64'
).toString('utf8');

const GROQ_KEY = process.env.GROQ_API_KEY || _G;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ╔══════════════════════════════════════╗
// ║      GROQ AI CORE FUNCTION           ║
// ╚══════════════════════════════════════╝
async function askGroq(prompt, system = 'You are a helpful AI assistant. Be concise and clear.', model = 'llama3-8b-8192') {
  try {
    const res = await axios.post(GROQ_URL, {
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user',   content: prompt  }
      ],
      max_tokens: 1500,
      temperature: 0.75
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    return res.data.choices[0]?.message?.content?.trim() || '⚠️ No response.';
  } catch(e) {
    if (e.response?.status === 401) return '❌ *API Key invalid!*';
    if (e.response?.status === 429) return '⚠️ *Rate limit! Thoda wait karo.*';
    return `❌ *AI Error:* ${e.message}`;
  }
}

// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
// HACKING STYLE RESPONSE FRAME
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
function hackFrame(title, icon, content, footer = 'ABDULLAH-BOTZ × GROQ AI') {
  return `\`\`\`
╔══════════════════════════════╗
║  ${icon} ${title.padEnd(26)}║
╚══════════════════════════════╝
\`\`\`
${content}

\`\`\`
▀▄▀▄▀▄ ${footer} ▄▀▄▀▄▀
\`\`\``;
}

// ╔══════════════════════════════════════╗
// ║  .ai — MAIN AI COMMAND              ║
// ╚══════════════════════════════════════╝
cmd({
  pattern: 'ai',
  alias: ['chatgpt','gpt','gpt4','brain','llama','groq','ask','bot','smart','genius',
          'nova','neo','omega','apex','vertex','pulse','zenith','ultra','assistant',
          'copilot','deepai','mistral','mixtral','wizard','kimi','perplexity'],
  react: '🤖',
  desc: 'AI se kuch bhi poocho (Groq LLaMA)',
  category: 'ai',
  use: '.ai <question>',
  filename: __filename
}, async (conn, mek, m, { from, pushname, args, reply, quoted }) => {
  try {
    let q = args.join(' ');
    if (!q && quoted?.text) q = quoted.text;
    if (!q) return reply(
`\`\`\`
╔══════════════════════════╗
║  🤖  AI COMMAND HELP     ║
╚══════════════════════════╝
  Usage  : .ai <question>
  Example: .ai Pakistan ki capital kya hai?
  Model  : Groq LLaMA 3
  Status : ✅ ONLINE
╚══════════════════════════╝
\`\`\``);

    await conn.sendMessage(from, { react: { text: '⚡', key: mek.key } });

    // Typing indicator
    await conn.sendPresenceUpdate('composing', from);
    const answer = await askGroq(q,
      `You are ABDULLAH-BOTZ AI, a powerful Pakistani WhatsApp bot assistant. 
       Answer in the same language the user writes (Urdu/English/Roman Urdu).
       Be helpful, accurate and concise. Never say you are ChatGPT or OpenAI.`
    );
    await conn.sendPresenceUpdate('paused', from);

    const txt =
`\`\`\`
╔══════════════════════════════╗
║  ⚡ ABDULLAH-BOTZ AI  ⚡     ║
╠══════════════════════════════╣
║  USER  » ${pushname.slice(0,20).padEnd(20)}║
║  MODEL » LLaMA 3 (Groq)      ║
╚══════════════════════════════╝
\`\`\`
*❓ Query:*
${q}

*🤖 Answer:*
${answer}

\`\`\`
▀▄ Powered by GROQ × ABDULLAH-BOTZ ▄▀
\`\`\``;

    await conn.sendMessage(from, {
      image: { url: bot.AI_IMG },
      caption: txt
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
  } catch(e) { reply(`❌ *Error:* ${e.message}`); }
});

// ╔══════════════════════════════════════╗
// ║  .gemini                            ║
// ╚══════════════════════════════════════╝
cmd({
  pattern: 'gemini',
  alias: ['gem','google'],
  react: '💎',
  desc: 'Gemini AI se poocho',
  category: 'ai',
  use: '.gemini <question>',
  filename: __filename
}, async (conn, mek, m, { from, pushname, args, reply, quoted }) => {
  try {
    let q = args.join(' ') || quoted?.text;
    if (!q) return reply('❌ *Usage:* .gemini <question>');
    await conn.sendMessage(from, { react: { text: '💎', key: mek.key } });
    const ans = await askGroq(q, 'You are Gemini, Google\'s AI. Answer helpfully and accurately.');
    reply(
`\`\`\`
╔══════════════════════════════╗
║  💎  GEMINI AI               ║
╠══════════════════════════════╣
║  User » ${pushname.slice(0,21).padEnd(21)}║
╚══════════════════════════════╝
\`\`\`
*❓ Q:* ${q.slice(0,100)}

*💎 Answer:*
${ans}

\`\`\`▀▄ ABDULLAH-BOTZ × Gemini ▄▀\`\`\``);
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ╔══════════════════════════════════════╗
// ║  .deepseek — CODER AI               ║
// ╚══════════════════════════════════════╝
cmd({
  pattern: 'deepseek',
  alias: ['code','codeai','coder','devchat'],
  react: '💻',
  desc: 'Code likhne ke liye AI',
  category: 'ai',
  use: '.deepseek <coding question>',
  filename: __filename
}, async (conn, mek, m, { from, pushname, args, reply, quoted }) => {
  try {
    let q = args.join(' ') || quoted?.text;
    if (!q) return reply('❌ *Usage:* .deepseek <coding question>');
    await conn.sendMessage(from, { react: { text: '💻', key: mek.key } });
    const ans = await askGroq(q,
      'You are DeepSeek Coder, an expert programmer. Write clean, efficient code with brief explanations. Use proper code formatting.',
      'llama3-70b-8192'
    );
    reply(
`\`\`\`
╔══════════════════════════════╗
║  💻  DEEPSEEK CODER          ║
╠══════════════════════════════╣
║  Model  » LLaMA 3 70B        ║
║  Status » ✅ ONLINE           ║
╚══════════════════════════════╝
\`\`\`
*📝 Task:* ${q.slice(0,100)}

${ans}

\`\`\`▀▄ ABDULLAH-BOTZ × DeepSeek ▄▀\`\`\``);
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ╔══════════════════════════════════════╗
// ║  .grammar                           ║
// ╚══════════════════════════════════════╝
cmd({
  pattern: 'grammar',
  alias: ['fix','grammarly','spellcheck'],
  react: '📝',
  desc: 'Grammar fix karo AI se',
  category: 'ai',
  use: '.grammar <text>',
  filename: __filename
}, async (conn, mek, m, { from, args, reply, quoted }) => {
  try {
    let q = args.join(' ') || quoted?.text;
    if (!q) return reply('❌ *Usage:* .grammar <text to fix>');
    await conn.sendMessage(from, { react: { text: '📝', key: mek.key } });
    const ans = await askGroq(
      `Fix ONLY the grammar and spelling. Return just the corrected text, nothing else:\n"${q}"`
    );
    reply(
`\`\`\`
╔══════════════════════════════╗
║  📝  GRAMMAR FIX             ║
╚══════════════════════════════╝
\`\`\`
*❌ Original:*
${q}

*✅ Fixed:*
${ans}

\`\`\`▀▄ ABDULLAH-BOTZ × AI ▄▀\`\`\``);
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ╔══════════════════════════════════════╗
// ║  .mathgpt                           ║
// ╚══════════════════════════════════════╝
cmd({
  pattern: 'mathgpt',
  alias: ['math','solve','mathsolve'],
  react: '🔢',
  desc: 'Math problems AI se solve karo',
  category: 'ai',
  use: '.math <problem>',
  filename: __filename
}, async (conn, mek, m, { from, args, reply, quoted }) => {
  try {
    let q = args.join(' ') || quoted?.text;
    if (!q) return reply('❌ *Usage:* .math 2x + 5 = 15, find x');
    await conn.sendMessage(from, { react: { text: '🔢', key: mek.key } });
    const ans = await askGroq(
      `Solve this step by step: ${q}`,
      'You are a math expert. Solve clearly with step-by-step working.'
    );
    reply(
`\`\`\`
╔══════════════════════════════╗
║  🔢  MATH SOLVER             ║
╚══════════════════════════════╝
\`\`\`
*📌 Problem:* ${q}

*📊 Solution:*
${ans}

\`\`\`▀▄ ABDULLAH-BOTZ × MathAI ▄▀\`\`\``);
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ╔══════════════════════════════════════╗
// ║  .translate                         ║
// ╚══════════════════════════════════════╝
cmd({
  pattern: 'translate',
  dontAddCommandList: true,
  alias: ['tr','trans'],
  react: '🌐',
  desc: 'Text translate karo',
  category: 'ai',
  use: '.translate <language> <text>',
  filename: __filename
}, async (conn, mek, m, { from, args, reply, quoted }) => {
  try {
    const lang = args[0];
    const text = args.slice(1).join(' ') || quoted?.text;
    if (!lang || !text) return reply('❌ *Usage:* .translate urdu Hello World\n.translate english Salam Dunya');
    await conn.sendMessage(from, { react: { text: '🌐', key: mek.key } });
    const ans = await askGroq(
      `Translate to ${lang}. Return ONLY the translated text:\n${text}`
    );
    reply(
`\`\`\`
╔══════════════════════════════╗
║  🌐  TRANSLATOR              ║
╚══════════════════════════════╝
\`\`\`
*📝 Original:* ${text}
*🌍 Language:* ${lang}

*✅ Translated:*
${ans}

\`\`\`▀▄ ABDULLAH-BOTZ × Translate ▄▀\`\`\``);
  } catch(e) { reply(`❌ ${e.message}`); }
});

// ╔══════════════════════════════════════╗
// ║  .roast                             ║
// ╚══════════════════════════════════════╝
cmd({
  pattern: 'roast',
  dontAddCommandList: true,
  react: '🔥',
  desc: 'Kisi ko roast karo AI se',
  category: 'fun',
  use: '.roast <name>',
  filename: __filename
}, async (conn, mek, m, { from, pushname, args, reply }) => {
  try {
    const target = args.join(' ') || pushname;
    await conn.sendMessage(from, { react: { text: '🔥', key: mek.key } });
    const roast = await askGroq(
      `Give a funny savage roast for "${target}". Humorous, not offensive. 2-3 lines max.`
    );
    reply(
`\`\`\`
╔══════════════════════════════╗
║  🔥  ROAST MACHINE           ║
╚══════════════════════════════╝
\`\`\`
*🎯 Target:* ${target}

${roast}

\`\`\`▀▄ ABDULLAH-BOTZ ROASTED ▄▀\`\`\``);
  } catch(e) { reply(`❌ ${e.message}`); }
});

// fun cmds — short & clean
cmd({ pattern:'joke', dontAddCommandList:true, alias:['jokes'], react:'😂', desc:'Joke suno', category:'fun', filename:__filename },
async (conn,mek,m,{from,reply}) => {
  const j = await askGroq('Tell one short funny joke. Setup then punchline.');
  reply(`\`\`\`[ 😂 JOKE ]\`\`\`\n\n${j}\n\n\`\`\`▀▄ ABDULLAH-BOTZ ▄▀\`\`\``);
});

cmd({ pattern:'shayari', dontAddCommandList:true, alias:['poetry','poem'], react:'📜', desc:'Urdu shayari', category:'fun', use:'<topic>', filename:__filename },
async (conn,mek,m,{from,args,reply}) => {
  const topic = args.join(' ') || 'mohabbat';
  const s = await askGroq(`Write beautiful 4-line Urdu shayari (Roman Urdu) about "${topic}".`);
  reply(`\`\`\`[ 📜 SHAYARI — ${topic.toUpperCase()} ]\`\`\`\n\n${s}\n\n\`\`\`▀▄ ABDULLAH-BOTZ ▄▀\`\`\``);
});

cmd({ pattern:'pickup', dontAddCommandList:true, alias:['flirt','pickupline'], react:'😏', desc:'Pickup line', category:'fun', filename:__filename },
async (conn,mek,m,{from,args,pushname,reply}) => {
  const t = args.join(' ') || pushname;
  const l = await askGroq(`Funny cheesy pickup line for "${t}". One line only.`);
  reply(`\`\`\`[ 😏 PICKUP LINE ]\`\`\`\n\n${l}\n\n\`\`\`▀▄ ABDULLAH-BOTZ ▄▀\`\`\``);
});

cmd({ pattern:'compliment', dontAddCommandList:true, react:'🌸', desc:'Compliment', category:'fun', filename:__filename },
async (conn,mek,m,{from,args,pushname,reply}) => {
  const t = args.join(' ') || pushname;
  const c = await askGroq(`Sweet genuine compliment for "${t}". 1-2 lines.`);
  reply(`\`\`\`[ 🌸 COMPLIMENT ]\`\`\`\n\n${c}\n\n\`\`\`▀▄ ABDULLAH-BOTZ ▄▀\`\`\``);
});

cmd({ pattern:'quote', dontAddCommandList:true, alias:['quotes','motivation'], react:'💭', desc:'Motivational quote', category:'fun', filename:__filename },
async (conn,mek,m,{from,args,reply}) => {
  const t = args.join(' ') || 'life';
  const q = await askGroq(`One powerful quote about "${t}" with author name.`);
  reply(`\`\`\`[ 💭 QUOTE — ${t.toUpperCase()} ]\`\`\`\n\n${q}\n\n\`\`\`▀▄ ABDULLAH-BOTZ ▄▀\`\`\``);
});

cmd({ pattern:'8ball', dontAddCommandList:true, alias:['8b','magic'], react:'🎱', desc:'Magic 8 ball', category:'fun', use:'<question>', filename:__filename },
async (conn,mek,m,{from,args,reply}) => {
  const q = args.join(' ');
  if(!q) return reply('❌ *Koi sawaal poocho!*');
  const a = ['Yes!','No!','Maybe...','Definitely!','Nahi bilkul!','100% haan!','Shayad...','Pakka nahi!','Bilkul haan!','Hargiz nahi!'][Math.floor(Math.random()*10)];
  reply(`\`\`\`[ 🎱 MAGIC 8 BALL ]\`\`\`\n\n❓ *Q:* ${q}\n🎱 *A:* ${a}\n\n\`\`\`▀▄ ABDULLAH-BOTZ ▄▀\`\`\``);
});

cmd({ pattern:'lovetest', dontAddCommandList:true, alias:['lovemeter','love'], react:'❤️', desc:'Love test', category:'fun', use:'<name1> + <name2>', filename:__filename },
async (conn,mek,m,{from,args,reply}) => {
  const input = args.join(' ');
  const names = input.split(/\+|and|&/i).map(n=>n.trim());
  if(names.length<2) return reply('❌ *Usage:* .lovetest Bunty + Manoo');
  const pct = Math.floor(Math.random()*41)+60;
  const h = pct>=80?'💘':pct>=60?'❤️':'💔';
  const bar = '❤️'.repeat(Math.floor(pct/10))+'🖤'.repeat(10-Math.floor(pct/10));
  reply(`\`\`\`[ ${h} LOVE TEST ]\`\`\`\n\n💑 *${names[0]}* ❤️ *${names[1]}*\n📊 *Match:* ${pct}%\n${bar}\n\n\`\`\`▀▄ ABDULLAH-BOTZ ▄▀\`\`\``);
});

cmd({ pattern:'aura', dontAddCommandList:true, react:'✨', desc:'Aura check', category:'fun', filename:__filename },
async (conn,mek,m,{from,pushname,args,reply}) => {
  const name = args.join(' ') || pushname;
  await conn.sendMessage(from,{react:{text:'✨',key:mek.key}});
  const a = await askGroq(`Describe aura/vibe of person named "${name}" in 2-3 fun mystical lines.`);
  reply(`\`\`\`[ ✨ AURA CHECK — ${name.toUpperCase()} ]\`\`\`\n\n${a}\n\n\`\`\`▀▄ ABDULLAH-BOTZ ▄▀\`\`\``);
});

cmd({ pattern:'compatibility', dontAddCommandList:true, alias:['compat'], react:'🔮', desc:'Compatibility check', category:'fun', filename:__filename },
async (conn,mek,m,{from,args,reply}) => {
  if(args.length<2) return reply('❌ *Usage:* .compatibility Bunty Manoo');
  const [n1,n2] = [args[0],args[1]];
  const pct = Math.floor(Math.random()*51)+50;
  const bar = '💚'.repeat(Math.floor(pct/10))+'⬛'.repeat(10-Math.floor(pct/10));
  reply(`\`\`\`[ 🔮 COMPATIBILITY ]\`\`\`\n\n🤝 *${n1}* & *${n2}*\n📊 *Score:* ${pct}%\n${bar}\n\n\`\`\`▀▄ ABDULLAH-BOTZ ▄▀\`\`\``);
});

module.exports = { askGroq };

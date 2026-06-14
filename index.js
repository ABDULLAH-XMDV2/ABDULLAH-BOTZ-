const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  fetchLatestBaileysVersion,
  downloadContentFromMessage
} = require('@whiskeysockets/baileys');
const fs = require('fs');
const P = require('pino');
const config = require('./setting');
const axios = require('axios');
const path = require('path');

// Owner numbers
const ownerNumber = [(config.OWNER_NUMBER || "923041956023").toString().replace(/[^0-9]/g, "")];

// Global references for web API routes
let globalSock = null;
let botConnected = false;
let lastQR = null;
let pendingPairRequests = new Map(); // number -> {code, expires}

// ==================== LOCAL FILES LOADER ====================
function loadLocalFiles() {
  console.log("📂 Loading local lib and plugins...");
  
  if (!fs.existsSync(path.join(__dirname, 'lib'))) {
    console.log("❌ lib folder not found! Creating empty lib folder...");
    fs.mkdirSync(path.join(__dirname, 'lib'), { recursive: true });
  } else {
    console.log("✅ lib folder found");
    const libFiles = fs.readdirSync('./lib').filter(f => f.endsWith('.js'));
    console.log(`📚 Found ${libFiles.length} lib files`);
  }
  
  if (!fs.existsSync(path.join(__dirname, 'plugins'))) {
    console.log("❌ plugins folder not found! Creating empty plugins folder...");
    fs.mkdirSync(path.join(__dirname, 'plugins'), { recursive: true });
  } else {
    console.log("✅ plugins folder found");
    const pluginFiles = fs.readdirSync('./plugins').filter(f => f.endsWith('.js'));
    console.log(`🔌 Found ${pluginFiles.length} plugin files`);
  }
  
  // Check for abdullah.html
  if (fs.existsSync(path.join(__dirname, 'lib', 'abdullah.html'))) {
    console.log("✅ abdullah.html found in lib folder");
  } else {
    console.log("[WARN] abdullah.html not found in lib folder - path: " + path.join(__dirname, 'lib', 'abdullah.html'));
  }
  
  console.log("✅ Local files loaded successfully!");
}

// Express server for web
const express = require('express');
const app = express();
const port = parseInt(process.env.PORT) || 9090;

// ✅ FIX: Serve entire lib folder as static (so abdullah.html and its assets load)
app.use('/lib', express.static(path.join(__dirname, 'lib')));

// ✅ FIX: Serve abdullah.html on root '/' using absolute __dirname path
app.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, 'lib', 'abdullah.html');
  console.log('[INFO] Root request - looking for:', htmlPath);
  console.log('[INFO] File exists:', fs.existsSync(htmlPath));
  if (fs.existsSync(htmlPath)) {
    res.sendFile(htmlPath);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>ABDULLAH-BOTZ Bot</title>
        <style>
          body { font-family: Arial; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); text-align: center; padding: 50px; color: white; }
          .container { background: rgba(255,255,255,0.1); padding: 30px; border-radius: 10px; }
          h1 { font-size: 3em; }
          .status { color: #4CAF50; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🤖 ABDULLAH-BOTZ</h1>
          <p class="status">✅ BOT IS RUNNING</p>
          <p>Type .menu in WhatsApp to see commands</p>
          <p>Owner: ${config.OWNER_NAME || 'ABDULLAH'}</p>
          <p style="color:red">[WARN] abdullah.html not found at: ${path.join(__dirname, 'lib', 'abdullah.html')}</p>
        </div>
      </body>
      </html>
    `);
  }
});

// Health check for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', bot: botConnected, uptime: process.uptime() });
});

// ✅ FIX: /lib/abdullah.html directly serves the file (no redirect needed)
app.get('/lib/abdullah.html', (req, res) => {
  const htmlPath = path.join(__dirname, 'lib', 'abdullah.html');
  if (fs.existsSync(htmlPath)) {
    res.sendFile(htmlPath);
  } else {
    res.redirect('/');
  }
});

// ✅ Railway Fix: Start HTTP server immediately so Railway health check passes
// Bot connects separately after server is up
const server = app.listen(port, '0.0.0.0', () => {
  console.log('[SERVER] Web server started on port ' + port);
  console.log('[SERVER] abdullah.html: ' + path.join(__dirname, 'lib', 'abdullah.html'));
  console.log('[SERVER] File exists: ' + fs.existsSync(path.join(__dirname, 'lib', 'abdullah.html')));
});

server.on('error', (err) => {
  console.error('[SERVER] Failed to start:', err.message);
  process.exit(1);
});

loadLocalFiles();

// Message store for anti-delete
const messageStore = new Map();

// Group settings store (welcome on/off, welcome message, goodbye on/off, goodbye message)
const groupSettings = new Map();

// Default welcome message
const DEFAULT_WELCOME = "╭──❍ *WELCOME* ❍──╮\n│\n├─❍ *User:* @user\n├─❍ *Group:* @group\n├─❍ *Members:* @count\n│\n╰──────────────────────❍\n\n> Enjoy your stay! 🎉";

// Default goodbye message
const DEFAULT_GOODBYE = "╭──❍ *GOODBYE* ❍──╮\n│\n├─❍ *User:* @user\n├─❍ *Group:* @group\n├─❍ *Left the group*\n│\n╰──────────────────────❍\n\n> We'll miss you! 👋";

// ==================== AUTO PAIRING SYSTEM ====================
// No SESSION_ID needed! Bot pairs automatically via phone number.
const AUTH_DIR = path.join(__dirname, 'auth_info_baileys');
const CREDS = path.join(AUTH_DIR, 'creds.json');

// If old SESSION_ID exists in config, still support it for backward compat
if (!fs.existsSync(CREDS) && config.SESSION_ID && config.SESSION_ID.includes("ABDULLAH-BOTZ~")) {
  try {
    const decoded = Buffer.from(config.SESSION_ID.trim().substring(14), 'base64').toString('utf8');
    JSON.parse(decoded);
    fs.mkdirSync(AUTH_DIR, { recursive: true });
    fs.writeFileSync(CREDS, decoded, { encoding: 'utf8' });
    console.log("[RESTORE] Session restored from SESSION_ID");
  } catch(e) {
    console.log("[WARN] SESSION_ID invalid, will use pairing code instead");
  }
}
// If no session → auto pairing will happen inside connectToWA()

// Load group settings from file if exists
const SETTINGS_FILE = path.join(__dirname, 'group_settings.json');
if (fs.existsSync(SETTINGS_FILE)) {
  try {
    const savedSettings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    for (const [groupId, settings] of Object.entries(savedSettings)) {
      groupSettings.set(groupId, settings);
    }
    console.log("✅ Group settings loaded from file");
  } catch (e) {
    console.log("[WARN] Could not load group settings");
  }
}

// Save group settings to file
function saveGroupSettings() {
  try {
    const settingsObj = {};
    for (const [groupId, settings] of groupSettings.entries()) {
      settingsObj[groupId] = settings;
    }
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settingsObj, null, 2), 'utf8');
  } catch (e) {
    console.error("❌ Could not save group settings:", e);
  }
}



// ── PAIRING API ROUTES ──────────────────────────────────────────────────────

// GET /pair?number=923001234567  → returns REAL pairing code
app.get('/pair', async (req, res) => {
  try {
    const number = (req.query.number || '').replace(/[^0-9]/g, '');
    if (!number || number.length < 10) {
      return res.status(400).json({ error: 'Valid number do — country code ke saath. Example: 923041956023' });
    }

    // Wait up to 20s for globalSock to be ready
    let waited = 0;
    while (!globalSock && waited < 20000) {
      await new Promise(r => setTimeout(r, 500));
      waited += 500;
    }
    if (!globalSock) {
      return res.status(503).json({ error: 'Bot abhi start ho raha hai, 10 second baad try karo' });
    }

    // Small delay — socket ko register hone do
    await new Promise(r => setTimeout(r, 1500));

    console.log(`[PAIR] Requesting code for +${number}`);
    const raw = await globalSock.requestPairingCode(number);

    if (!raw) {
      return res.status(500).json({ error: 'Code generate nahi hua, dobara try karo' });
    }

    // ✅ Custom format: show real code as-is (XXXX-XXXX)
    let code = String(raw);
    if (typeof raw === 'string' && raw.length === 8 && !raw.includes('-')) {
      code = raw.slice(0, 4) + '-' + raw.slice(4);
    }

    console.log(`[PAIR] Code: ${code} for +${number}`);
    return res.json({ code, number, expires: 60 });

  } catch (e) {
    console.error('[PAIR] Error:', e.message);
    if (e.message?.includes('not registered') || e.message?.includes('404')) {
      return res.status(400).json({ error: 'Yeh number WhatsApp pe registered nahi hai!' });
    }
    if (e.message?.includes('rate') || e.message?.includes('429')) {
      return res.status(429).json({ error: 'Bohot zyada requests, 1 minute baad try karo' });
    }
    return res.status(500).json({ error: 'Server error: ' + e.message });
  }
});

// GET /status  → bot status
app.get('/status', (req, res) => {
  res.json({
    connected: botConnected,
    uptime: process.uptime(),
    version: require('./package.json').version || '9.0.0'
  });
});

// GET /qr  → returns QR as JSON (base64)
app.get('/qr', (req, res) => {
  if (lastQR) {
    res.json({ qr: lastQR });
  } else if (botConnected) {
    res.json({ connected: true, message: 'Bot already connected, no QR needed' });
  } else {
    res.status(202).json({ message: 'QR not yet generated, bot is starting...' });
  }
});

// Function to get user profile picture
async function getProfilePicture(sock, jid) {
  try {
    const ppUrl = await sock.profilePictureUrl(jid, 'image');
    return ppUrl;
  } catch {
    return 'https://n.uguu.se/BlGoHUJU.jpg'; // Default image
  }
}

// Main bot function
async function connectToWA() {
  console.log("✅ Using local lib and plugins only");

  const prefix = config.PREFIX || '.';
  console.log(`🤖 ABDULLAH-BOTZ Connecting with prefix: "${prefix}"`);

  const { state: authState, saveCreds: saveCreds } = await useMultiFileAuthState(__dirname + '/auth_info_baileys/');

  // Load required modules from lib
  let functions, sms, botConfig;
  try {
    functions  = require('./lib/functions');
    sms        = require('./lib/msg').sms;
    botConfig  = require('./lib/bot');
    console.log("✅ Lib files loaded successfully");
  } catch (err) {
    console.log("❌ Error loading lib files:", err);
    process.exit(1);
  }

  const { getBuffer, getGroupAdmins, fetchJson, runtime, sleep, isUrl, getRandom } = functions;
  const { version } = await fetchLatestBaileysVersion();

  // ── Decide whether we need a pairing code ──────────────────────────────────
  const needsPairing = !fs.existsSync(path.join(__dirname, 'auth_info_baileys', 'creds.json'));

  const sock = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: false, // Always false — we use web pairing
    browser: ['Ubuntu', 'Chrome', '20.0.04'],
    syncFullHistory: false,
    auth: authState,
    version: version,
    generateHighQualityLinkPreview: true,
    patchMessageBeforeSending: (message) => {
      const requiresPatch = !!(message.buttonsMessage || message.templateMessage || message.listMessage);
      if (requiresPatch) {
        message = { viewOnceMessage: { message: { messageContextInfo: { deviceListMetadataVersion: 2, deviceListMetadata: {} }, ...message } } };
      }
      return message;
    }
  });
  
  // ✅ Set globalSock IMMEDIATELY so /pair route can use it
  globalSock = sock;
  console.log('[BOT] Socket created, globalSock ready for pairing');

  // ── PAIRING: Website se hoga — logs mein URL dikhao ──────────────────────
  if (needsPairing) {
    const port = parseInt(process.env.PORT) || 9090;
    console.log(`\n╔══════════════════════════════════════╗`);
    console.log(`║   ABDULLAH-BOTZ PAIRING SYSTEM      ║`);
    console.log(`║                                      ║`);
    console.log(`║  Website kholo aur pair karo:        ║`);
    console.log(`║  Railway URL pe jao → number dalo    ║`);
    console.log(`║  → GENERATE PAIRING CODE dabao       ║`);
    console.log(`║                                      ║`);
    console.log(`║  Local: http://localhost:${port}/        ║`);
    console.log(`╚══════════════════════════════════════╝\n`);
  }

  // Save credentials whenever they update
  sock.ev.on('creds.update', saveCreds);

  // Connection update handler
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    // Capture QR for web endpoint
    if (qr) {
      lastQR = qr;
      if (!config.OWNER_NUMBER) {
        console.log("\n📱 Scan this QR code with WhatsApp (fallback mode)");
      }
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;

      if (statusCode === DisconnectReason.loggedOut) {
        console.log("[WARN] Logged out — session delete karke reconnect ho raha hai...");
        try { fs.rmSync(__dirname + '/auth_info_baileys', { recursive: true, force: true }); } catch(e) {}
        setTimeout(() => connectToWA(), 3000);
      } else if (statusCode === DisconnectReason.connectionReplaced) {
        console.log("[WARN] Connection replaced — reconnecting...");
        setTimeout(() => connectToWA(), 3000);
      } else if (lastDisconnect?.error?.message?.includes("Bad MAC")) {
        console.log("[WARN] Bad MAC error. Deleting session and reconnecting...");
        fs.rmSync(__dirname + '/auth_info_baileys', { recursive: true, force: true });
        connectToWA();
      } else {
        console.log("🔄 Connection closed, reconnecting...");
        connectToWA();
      }
    } else if (connection === 'open') {
      console.log(`\n╔══════════════════════════════════════╗`);
      console.log(`║  ✅ ABDULLAH-BOTZ CONNECTED!         ║`);
      console.log(`║  📞 Linked to WhatsApp successfully  ║`);
      console.log(`╚══════════════════════════════════════╝\n`);
      console.log("✅ ABDULLAH-BOTZ Bot connected to WhatsApp!");
      botConnected = true;
      lastQR = null; // clear QR once connected
      
      // Load plugins
      console.log("🔌 Loading plugins...");
      const pluginFiles = fs.readdirSync('./plugins/').filter(f => f.endsWith('.js'));
      let loadedCount = 0;
      
      for (const file of pluginFiles) {
        try {
          require('./plugins/' + file);
          loadedCount++;
          console.log(`  ✅ Loaded: ${file}`);
        } catch (err) {
          console.log(`  ❌ Failed to load ${file}: ${err.message}`);
        }
      }
      
      console.log(`✅ Plugins loaded: ${loadedCount}/${pluginFiles.length}`);
      
      // Send connection message with image
      const aliveMsg = `*╭──────────────●●►*\n> *ABDULLAH-BOTZ CONNECTED SUCCESSFULLY*\n\n> *Type ${prefix}menu to view commands*  \n\n*╭⊱✫ ABDULLAH BOTZ ✫⊱╮*\n*│✫📂 Bot Name: ${botConfig.BOT_NAME}*\n*│✫🛡 Owner: ${config.OWNER_NAME}*\n*│✫[RESTORE] Prefix: ${prefix}*\n*│✫🌍 Mode: ${config.MODE}*\n*│✫⏰ Uptime: ${runtime(process.uptime())}*\n*╰──────────────●●►*\n\n> Enjoy Using ABDULLAH BOTZ`;
      
      // Image URL for connection message
      const imageUrl = 'https://n.uguu.se/BlGoHUJU.jpg';
      
      try {
        // Send to owner with image
        sock.sendMessage(ownerNumber[0] + '@s.whatsapp.net', {
          image: { url: imageUrl },
          caption: aliveMsg
        }).catch(() => {
          // Fallback to text if image fails
          sock.sendMessage(ownerNumber[0] + '@s.whatsapp.net', { text: aliveMsg });
        });
        
        // Send to bot's own number
        sock.sendMessage(sock.user.id, {
          image: { url: imageUrl },
          caption: aliveMsg
        }).catch(() => {
          sock.sendMessage(sock.user.id, { text: aliveMsg });
        });
        
        console.log("✅ Connection message sent with image");
      } catch (err) {
        console.log("[WARN] Could not send connection message with image, sending text only");
        sock.sendMessage(ownerNumber[0] + '@s.whatsapp.net', { text: aliveMsg });
      }
    }
  });

  // Anti-call — SIRF reject karo, message NAHI bhejo (message se ban hota hai)
  sock.ev.on('call', async (calls) => {
    if (config.ANTI_CALL === 'true') {
      for (const call of calls) {
        if (call.status === 'offer') {
          try {
            await sock.rejectCall(call.id, call.from);
            console.log(`📵 Call rejected from ${call.from}`);
          } catch(e) { console.log('Call reject err:', e.message); }
        }
      }
    }
  });

  // Emoji list for auto react
  const emojiList = ['😊', '👍', '😂', '<3', '🔥', '🥰', '👌', '💯', '🤣', '😎', '✨', '⭐', '🌟', '💫', '⚡', '💥', '🙏', '🎉', '👏', '💯', '👑', '🤖', '🫡', '✅', '🔰', '💚', '💙', '💜', '🖤', '🤍', '💛', '🧡', '💖', '💝', '💞'];
  
  // ==================== GROUP PARTICIPANTS UPDATE (WELCOME/GOODBYE) ====================
  sock.ev.on('group-participants.update', async (update) => {
    try {
      const { id, participants, action } = update;
      
      if (!id || !participants || !action) return;
      
      const groupMetadata = await sock.groupMetadata(id).catch(() => null);
      if (!groupMetadata) return;
      
      const groupName = groupMetadata.subject || 'Group';
      const groupDesc = groupMetadata.desc || 'No description';
      const memberCount = groupMetadata.participants.length;
      
      // Get group settings
      const settings = groupSettings.get(id) || {
        welcome: true,
        goodbye: true,
        welcomeMsg: DEFAULT_WELCOME,
        goodbyeMsg: DEFAULT_GOODBYE,
        antilink: true,
        antibad: true
      };
      
      for (const participant of participants) {
        // ✅ FIX: participant kabhi object bhi hota hai, string check karo
        const participantStr = typeof participant === 'string' ? participant : (participant?.id || participant?.jid || '');
        if (!participantStr) continue;
        const participantJid = participantStr.split('@')[0];
        const pushName = participantStr.split('@')[0];
        
        if (action === 'add') {
          // WELCOME MESSAGE - Only if enabled
          if (settings.welcome) {
            try {
              // Get user's profile picture
              const ppUrl = await getProfilePicture(sock, participant);
              
              // Format welcome message with variables
              let welcomeText = settings.welcomeMsg || DEFAULT_WELCOME;
              welcomeText = welcomeText
                .replace(/@user/g, `@${participantJid}`)
                .replace(/@group/g, groupName)
                .replace(/@count/g, memberCount)
                .replace(/@desc/g, groupDesc.substring(0, 100));
              
              // Send welcome message with user's DP
              await sock.sendMessage(id, {
                image: { url: ppUrl },
                caption: welcomeText,
                mentions: [participant]
              }).catch(async () => {
                // Fallback to text if image fails
                await sock.sendMessage(id, {
                  text: welcomeText,
                  mentions: [participant]
                });
              });
              
              console.log(`👋 Welcome message sent to ${participantJid} in ${groupName}`);
            } catch (error) {
              console.error("❌ Welcome message error:", error);
            }
          }
          
        } else if (action === 'remove') {
          // GOODBYE MESSAGE - Only if enabled
          if (settings.goodbye) {
            try {
              // Get user's profile picture
              const ppUrl = await getProfilePicture(sock, participant).catch(() => 'https://n.uguu.se/BlGoHUJU.jpg');
              
              // Format goodbye message with variables
              let goodbyeText = settings.goodbyeMsg || DEFAULT_GOODBYE;
              goodbyeText = goodbyeText
                .replace(/@user/g, `@${participantJid}`)
                .replace(/@group/g, groupName)
                .replace(/@count/g, memberCount);
              
              // Send goodbye message with user's DP
              await sock.sendMessage(id, {
                image: { url: ppUrl },
                caption: goodbyeText,
                mentions: [participant]
              }).catch(async () => {
                // Fallback to text if image fails
                await sock.sendMessage(id, {
                  text: goodbyeText,
                  mentions: [participant]
                });
              });
              
              console.log(`👋 Goodbye message sent for ${participantJid} in ${groupName}`);
            } catch (error) {
              console.error("❌ Goodbye message error:", error);
            }
          }
        }
      }
    } catch (error) {
      console.error("❌ Welcome/Goodbye error:", error);
    }
  });

  // Main message handler
  sock.ev.on('messages.upsert', async (messageUpdate) => {
    try {
      const msg = messageUpdate.messages[0];
      
      // ── AUTO PAIRED NUMBER TRACKING ──
      // Jab koi message aaye us number ko pairedNumbers mein add karo
      if (!global.pairedNumbers) global.pairedNumbers = new Set();
      if (sock.user?.id) {
        const myNum = sock.user.id.split(":")[0].split("@")[0];
        global.pairedNumbers.add(myNum);
      }

      if (!msg || !msg.message) {
        return;
      }
      
      // ============ STATUS HANDLING ============
      if (msg.key && msg.key.remoteJid === 'status@broadcast') {

        // AUTO STATUS SEEN — sirf read mark karo, koi message nahi
        if (config.AUTO_STATUS_SEEN === 'true') {
          try {
            await sock.readMessages([msg.key]);
            console.log("📖 Status seen");
          } catch (error) {
            console.error("❌ Status seen error:", error);
          }
        }

        // AUTO STATUS REACT — sirf react karo, koi text message nahi
        if (config.AUTO_STATUS_REACT === 'true' && msg.key.participant) {
          try {
            const botJid = jidNormalizedUser(sock.user.id);
            const reactEmojis = ['💚','❤️','🔥','😍','👍','💯','✨','🫡','👑'];
            const randomReact = reactEmojis[Math.floor(Math.random() * reactEmojis.length)];
            await sock.sendMessage(msg.key.remoteJid, {
              react: { key: msg.key, text: randomReact }
            }, {
              statusJidList: [msg.key.participant, botJid]
            }).catch(() => {});
          } catch (error) {}
        }

        return; // Status messages aage process nahi honi
      }
      
      // Get message type and content
      const msgType = getContentType(msg.message) || 'conversation';
      
      // Get message text
      let body = '';
      if (msgType === 'conversation') {
        body = msg.message.conversation || '';
      } else if (msgType === 'extendedTextMessage') {
        body = msg.message.extendedTextMessage?.text || '';
      } else if (msgType === 'imageMessage') {
        body = msg.message.imageMessage?.caption || '';
      } else if (msgType === 'videoMessage') {
        body = msg.message.videoMessage?.caption || '';
      }
      
      // Create m object
      const m = sms(sock, msg);
      
      // Check if it's a command
      const isCmd = body.startsWith(prefix);
      const command = isCmd ? body.slice(prefix.length).split(' ')[0].toLowerCase().trim() : '';
      const args = body.split(' ').slice(1);
      const q = args.join(' ');
      const from = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const senderNumber = sender.split('@')[0];
      const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      const isGroup = from.endsWith('@g.us');
      const isOwner = ownerNumber.some(o => o.replace(/[^0-9]/g,"") === senderNumber.replace(/[^0-9]/g,""));
      const pushName = msg.pushName || senderNumber;
      const botNumberPure = sock.user.id.split(':')[0];
      const isMe = senderNumber === botNumberPure;
      
      // Get mentions
      let mentions = [];
      if (msgType === 'extendedTextMessage' && msg.message.extendedTextMessage?.contextInfo?.mentionedJid) {
        mentions = msg.message.extendedTextMessage.contextInfo.mentionedJid;
      }
      
      // Group metadata
      let groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins;
      if (isGroup) {
        groupMetadata = await sock.groupMetadata(from).catch(() => ({}));
        groupName = groupMetadata?.subject || '';
        participants = groupMetadata?.participants || [];
        groupAdmins = participants.filter(p => p.admin).map(p => p.id);
        isBotAdmins = groupAdmins.includes(botNumber);
        isAdmins = groupAdmins.includes(sender);
      }
      
      // Get group settings
      let groupSetting = groupSettings.get(from) || {
        welcome: true,
        goodbye: true,
        welcomeMsg: DEFAULT_WELCOME,
        goodbyeMsg: DEFAULT_GOODBYE,
        antilink: true,
        antibad: true
      };
      
      // Reply function
      const reply = (text) => {
        sock.sendMessage(from, { text }, { quoted: msg });
      };
      
      // Store message for anti-delete
      if (!msg.key.fromMe && msg.key.remoteJid !== 'status@broadcast') {
        messageStore.set(msg.key.id, msg);
        if (messageStore.size > 500) {
          const firstKey = messageStore.keys().next().value;
          messageStore.delete(firstKey);
        }
      }

      // ============ ANTI VIEW ONCE ============
      if (config.ANTI_VV === 'true' && !msg.key.fromMe) {
        try {
          const msgType = getContentType(msg.message);
          const viewOnceMsg = msg.message?.[msgType]?.viewOnce ||
            msg.message?.viewOnceMessage?.message ||
            msg.message?.viewOnceMessageV2?.message ||
            msg.message?.viewOnceMessageV2Extension?.message;
          
          if (viewOnceMsg || msg.message?.[msgType]?.viewOnce === true) {
            const ownerJid = ownerNumber[0] + '@s.whatsapp.net';
            const senderJid = msg.key.participant || msg.key.remoteJid;
            
            // Download and re-send to owner
            try {
              const mediaBuffer = await downloadContentFromMessage(
                msg.message?.[msgType] || viewOnceMsg,
                msgType.replace('Message', '')
              );
              let buffer = Buffer.from([]);
              for await (const chunk of mediaBuffer) buffer = Buffer.concat([buffer, chunk]);
              
              const caption = msg.message?.[msgType]?.caption || '';
              const alertText = `╭──❍ *[VIEW] ANTI VIEW ONCE* ❍──╮\n│\n├─❍ *From:* @${senderJid.split('@')[0]}\n├─❍ *Chat:* ${from.includes('@g.us') ? 'Group' : 'Private'}\n${caption ? `├─❍ *Caption:* ${caption}\n` : ''}│\n╰──────────────────────❍`;

              if (msgType === 'imageMessage') {
                await sock.sendMessage(ownerJid, { image: buffer, caption: alertText, mentions: [senderJid] }).catch(() => {});
              } else if (msgType === 'videoMessage') {
                await sock.sendMessage(ownerJid, { video: buffer, caption: alertText, mentions: [senderJid] }).catch(() => {});
              }
            } catch(e) {
              console.log('Anti VV download error:', e.message);
            }
          }
        } catch(e) {
          console.log('Anti VV error:', e.message);
        }
      }
      
      // Log command
      if (isCmd) {
        console.log(`🔍 Command: ${command} from ${pushName} (${senderNumber})`);
      }
      
      // ============ MODE HANDLING ============
      if (config.MODE === 'private' && isCmd) {
        // Private mode: sirf owner OR us number ko allow karo jis pe bot connect hai
        if (!global.pairedNumbers) global.pairedNumbers = new Set();
        
        // Bot ka apna number bhi add karo
        if (sock.user?.id) {
          const botNum = sock.user.id.split(':')[0].split('@')[0];
          global.pairedNumbers.add(botNum);
        }
        
        const isPaired = global.pairedNumbers.has(senderNumber);
        
        if (!isOwner && !isPaired) {
          // Silently ignore — ya optional message bhejo
          return;
        }
      }
      
      // ============ AUTO REACT ============
      if (config.AUTO_REACT === 'true') {
        const randomEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];
        await m.react(randomEmoji).catch(() => {});
      }
      
      // ============ PRESENCE UPDATES ============
      if (config.AUTO_TYPING === 'true') {
        await sock.sendPresenceUpdate('composing', from).catch(() => {});
      }
      
      if (config.ALWAYS_ONLINE === 'true') {
        await sock.sendPresenceUpdate('available').catch(() => {});
      }
      
      if (config.READ_MESSAGE === 'true') {
        await sock.readMessages([msg.key]).catch(() => {});
      }
      
      // ============ WELCOME/GOODBYE COMMANDS ============
      if (isCmd && isGroup) {
        
        // WELCOME ON/OFF
        if (command === 'welcome') {
          if (!isAdmins && !isOwner) {
            return reply('❌ Only admins can use this command!');
          }
          
          const option = args[0]?.toLowerCase();
          
          if (option === 'on') {
            groupSetting.welcome = true;
            groupSettings.set(from, groupSetting);
            saveGroupSettings();
            reply('✅ Welcome messages have been turned ON for this group!');
          } else if (option === 'off') {
            groupSetting.welcome = false;
            groupSettings.set(from, groupSetting);
            saveGroupSettings();
            reply('✅ Welcome messages have been turned OFF for this group!');
          } else {
            reply(`Welcome messages are currently: ${groupSetting.welcome ? 'ON' : 'OFF'}\n\nUse:\n.welcome on - Turn ON\n.welcome off - Turn OFF`);
          }
        }
        
        // GOODBYE ON/OFF
        else if (command === 'goodbye') {
          if (!isAdmins && !isOwner) {
            return reply('❌ Only admins can use this command!');
          }
          
          const option = args[0]?.toLowerCase();
          
          if (option === 'on') {
            groupSetting.goodbye = true;
            groupSettings.set(from, groupSetting);
            saveGroupSettings();
            reply('✅ Goodbye messages have been turned ON for this group!');
          } else if (option === 'off') {
            groupSetting.goodbye = false;
            groupSettings.set(from, groupSetting);
            saveGroupSettings();
            reply('✅ Goodbye messages have been turned OFF for this group!');
          } else {
            reply(`Goodbye messages are currently: ${groupSetting.goodbye ? 'ON' : 'OFF'}\n\nUse:\n.goodbye on - Turn ON\n.goodbye off - Turn OFF`);
          }
        }
        
        // SET WELCOME MESSAGE
        else if (command === 'setwelcome') {
          if (!isAdmins && !isOwner) {
            return reply('❌ Only admins can use this command!');
          }
          
          if (!q) {
            return reply(`❌ Please provide a welcome message!\n\nAvailable variables:\n@user - Mention user\n@group - Group name\n@count - Member count\n@desc - Group description\n\nExample:\n.setwelcome Hello @user! Welcome to @group`);
          }
          
          groupSetting.welcomeMsg = q;
          groupSettings.set(from, groupSetting);
          saveGroupSettings();
          reply('✅ Welcome message has been updated!\n\nPreview:\n' + q.replace(/@user/g, '@user').replace(/@group/g, groupName).replace(/@count/g, participants.length));
        }
        
        // SET GOODBYE MESSAGE
        else if (command === 'setgoodbye') {
          if (!isAdmins && !isOwner) {
            return reply('❌ Only admins can use this command!');
          }
          
          if (!q) {
            return reply(`❌ Please provide a goodbye message!\n\nAvailable variables:\n@user - Mention user\n@group - Group name\n@count - Member count\n\nExample:\n.setgoodbye Goodbye @user! We'll miss you in @group`);
          }
          
          groupSetting.goodbyeMsg = q;
          groupSettings.set(from, groupSetting);
          saveGroupSettings();
          reply('✅ Goodbye message has been updated!\n\nPreview:\n' + q.replace(/@user/g, '@user').replace(/@group/g, groupName).replace(/@count/g, participants.length));
        }
        
        // RESET WELCOME
        else if (command === 'resetwelcome') {
          if (!isAdmins && !isOwner) {
            return reply('❌ Only admins can use this command!');
          }
          
          groupSetting.welcomeMsg = DEFAULT_WELCOME;
          groupSettings.set(from, groupSetting);
          saveGroupSettings();
          reply('✅ Welcome message has been reset to default!');
        }
        
        // RESET GOODBYE
        else if (command === 'resetgoodbye') {
          if (!isAdmins && !isOwner) {
            return reply('❌ Only admins can use this command!');
          }
          
          groupSetting.goodbyeMsg = DEFAULT_GOODBYE;
          groupSettings.set(from, groupSetting);
          saveGroupSettings();
          reply('✅ Goodbye message has been reset to default!');
        }
        
        // SHOW WELCOME SETTINGS
        else if (command === 'welcomesettings' || command === 'wsettings') {
          if (!isAdmins && !isOwner) {
            return reply('❌ Only admins can use this command!');
          }
          
          const settingsMsg = `╭──❍ *WELCOME SETTINGS* ❍──╮
│
├─❍ *Status:* ${groupSetting.welcome ? '✅ ON' : '❌ OFF'}
├─❍ *Goodbye:* ${groupSetting.goodbye ? '✅ ON' : '❌ OFF'}
│
├─❍ *Welcome Message:*
├─❍ ${groupSetting.welcomeMsg.substring(0, 50)}...
│
├─❍ *Goodbye Message:*
├─❍ ${groupSetting.goodbyeMsg.substring(0, 50)}...
│
╰──────────────────────❍

Commands:
.welcome on/off
.goodbye on/off
.setwelcome <text>
.setgoodbye <text>
.resetwelcome
.resetgoodbye`;
          
          reply(settingsMsg);
        }
      }
      
      // ============ COMMAND HANDLER (for other commands) ============
      const commandsPath = './lib/command';
      if (fs.existsSync(commandsPath + '.js')) {
        const commands = require(commandsPath);
        
        if (commands.commands && Array.isArray(commands.commands)) {
          
          // Handle prefix commands (skip welcome/goodbye commands as we handled them above)
          if (isCmd && !['welcome', 'goodbye', 'setwelcome', 'setgoodbye', 'resetwelcome', 'resetgoodbye', 'welcomesettings', 'wsettings'].includes(command)) {
            const commandObj = commands.commands.find(cmd => cmd.pattern === command) || 
                             commands.commands.find(cmd => cmd.alias && cmd.alias.includes(command));
            
            if (commandObj) {
              
              // Check permissions
              if (commandObj.category === 'owner' && !isOwner) {
                return reply('❌ This command is only for bot owner!');
              }
              
              if (commandObj.category === 'group' && !isGroup) {
                return reply('❌ This command can only be used in groups!');
              }
              
              if (commandObj.category === 'admin' && !isAdmins && !isOwner) {
                return reply('❌ This command is only for group admins!');
              }
              
              // Check if command is enabled for group
              if (commandObj.pattern === 'antilink' && groupSetting.antilink === false) {
                return reply('❌ Anti-link is disabled in this group!');
              }
              
              // React if specified
              if (commandObj.react) {
                await sock.sendMessage(from, { 
                  react: { text: commandObj.react, key: msg.key } 
                }).catch(() => {});
              }
              
              // Execute command
              try {
                await commandObj.function(sock, msg, m, {
                  from, reply, body, isCmd, command: commandObj,
                  args, q, isGroup, sender, senderNumber, botNumber,
                  pushname: pushName, isMe, isOwner, groupMetadata,
                  groupName, participants, groupAdmins, isBotAdmins, isAdmins,
                  getBuffer, fetchJson, mentions, prefix, runtime, sleep, isUrl,
                  groupSettings: groupSetting
                });
                console.log(`✅ Command executed: ${command}`);
              } catch (err) {
                console.error(`❌ Command error:`, err);
                reply(`❌ Error: ${err.message}`);
              }
            }
          }
          
          // Handle non-command triggers
          for (const cmd of commands.commands) {
            try {
              if (cmd.on === 'text' && body && !isCmd) {
                await cmd.function(sock, msg, m, {
                  from, reply, body, isCmd: false, command: cmd,
                  args, q, isGroup, sender, senderNumber, botNumber,
                  pushname: pushName, isMe, isOwner, groupMetadata,
                  groupName, participants, groupAdmins, isBotAdmins, isAdmins,
                  getBuffer, fetchJson, mentions, prefix, runtime, sleep, isUrl,
                  groupSettings: groupSetting
                });
              } else if ((cmd.on === 'image' || cmd.on === 'photo') && msgType === 'imageMessage') {
                await cmd.function(sock, msg, m, {
                  from, reply, body, isCmd, command: cmd,
                  args, q, isGroup, sender, senderNumber, botNumber,
                  pushname: pushName, isMe, isOwner, groupMetadata,
                  groupName, participants, groupAdmins, isBotAdmins, isAdmins,
                  getBuffer, fetchJson, mentions, prefix, runtime, sleep, isUrl,
                  groupSettings: groupSetting
                });
              } else if (cmd.on === 'sticker' && msgType === 'stickerMessage') {
                await cmd.function(sock, msg, m, {
                  from, reply, body, isCmd, command: cmd,
                  args, q, isGroup, sender, senderNumber, botNumber,
                  pushname: pushName, isMe, isOwner, groupMetadata,
                  groupName, participants, groupAdmins, isBotAdmins, isAdmins,
                  getBuffer, fetchJson, mentions, prefix, runtime, sleep, isUrl,
                  groupSettings: groupSetting
                });
              }
            } catch (e) {}
          }
        }
      }
      
      // ============ READ COMMANDS ============
      if (config.READ_CMD === 'true' && isCmd) {
        await sock.readMessages([msg.key]).catch(() => {});
      }
      
      // ============ AUTO RECORDING ============
      if (config.AUTO_RECORDING === 'true' && !msg.key.fromMe) {
        await sock.sendPresenceUpdate('recording', from).catch(() => {});
      }
      
      // ============ ANTI LINK ============
      if (config.ANTI_LINK === 'true' && isGroup && !isAdmins && !isOwner && !msg.key.fromMe && groupSetting.antilink !== false) {
        const linkRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(chat\.whatsapp\.com\/[^\s]+)|(wa\.me\/[^\s]+)/gi;
        if (linkRegex.test(body)) {
          await sock.sendMessage(from, { delete: msg.key }).catch(() => {});
          reply('[WARN] *Links are not allowed in this group!*');
        }
      }
      
      // ============ ANTI DELETE ============
      if (config.ANTI_DELETE === 'true') {
        try {
          if (msg.message?.protocolMessage && msg.message.protocolMessage.type === 0) {
            if (msg.key.fromMe) return;
            
            const deletedMsgKey = msg.message.protocolMessage.key;
            const deletedMsg = messageStore.get(deletedMsgKey.id);
            
            if (deletedMsg) {
              const deletedBy = msg.key.participant || msg.key.remoteJid;
              const originalSender = deletedMsg.key.participant || deletedMsg.key.remoteJid;
              
              // Send to owner's inbox
              const sendTo = ownerNumber[0] + '@s.whatsapp.net';
              
              // Get original message content
              let originalContent = '';
              let messageType = '';
              const originalType = getContentType(deletedMsg.message);
              
              if (originalType === 'conversation') {
                originalContent = deletedMsg.message.conversation || '';
                messageType = 'Text';
              } else if (originalType === 'extendedTextMessage') {
                originalContent = deletedMsg.message.extendedTextMessage?.text || '';
                messageType = 'Text';
              } else if (originalType === 'imageMessage') {
                originalContent = deletedMsg.message.imageMessage?.caption || 'No caption';
                messageType = 'Image Image';
              } else if (originalType === 'videoMessage') {
                originalContent = deletedMsg.message.videoMessage?.caption || 'No caption';
                messageType = '🎥 Video';
              } else if (originalType === 'audioMessage') {
                originalContent = 'Audio message';
                messageType = '🎵 Audio';
              } else if (originalType === 'stickerMessage') {
                originalContent = 'Sticker';
                messageType = '🎨 Sticker';
              } else {
                originalContent = 'Media message';
                messageType = '📎 Media';
              }
              
              const chatType = from.includes('@g.us') ? '👥 Group' : '👤 Private Chat';
              let groupNameText = '';
              
              if (from.includes('@g.us') && groupName) {
                groupNameText = `\n├─❍ *Group:* ${groupName}`;
              }
              
              const now = new Date();
              const timeStr = now.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
              const dateStr = now.toLocaleDateString('en-PK');
              
              const deleteMessage = `
╭──❍ *🚫 ANTI-DELETE ALERT* ❍──╮
│
├─❍ *Time:* ${timeStr}
├─❍ *Date:* ${dateStr}
├─❍ *Chat Type:* ${chatType}${groupNameText}
│
├─❍ *Deleted By:* @${deletedBy.split('@')[0]}
├─❍ *Original Sender:* @${originalSender.split('@')[0]}
│
├─❍ *Message Type:* ${messageType}
├─❍ *Content:* 
├─❍ \`${originalContent.substring(0, 500)}${originalContent.length > 500 ? '...' : ''}\`
│
╰──────────────────────❍
        
> _Message was deleted but bot saved it_ 🔰`;
              
              await sock.sendMessage(sendTo, {
                text: deleteMessage,
                mentions: [deletedBy, originalSender]
              }).catch(() => {});
              
              console.log(`🚫 Anti-delete: Message saved to inbox`);
            }
          }
        } catch (e) {
          console.error("Anti-delete error:", e);
        }
      }
      
    } catch (error) {
      console.error("❌ Message handler error:", error);
    }
  });
}

// Start bot
setTimeout(() => {
  connectToWA();
}, 4000);

// BOT SALLERS KI MKC
# 🤖 ABDULLAH-BOTZ v9.0.0

WhatsApp Multi-Device Bot built with Baileys — by ABDULLAH Official

---

## ⚡ Deploy on Railway (Recommended)

### Step 1: Upload to GitHub
1. Create a new **private** repo on [github.com](https://github.com/new)
2. Upload all these files (drag & drop ZIP or use Git)
3. ⚠️ Make sure `auth_info_baileys/` and `config.env` are NOT uploaded (`.gitignore` handles this)

### Step 2: Deploy on Railway
1. Go to [railway.app](https://railway.app) → **New Project**
2. Click **Deploy from GitHub repo**
3. Select your repository
4. Railway will auto-detect the Dockerfile and start building

### Step 3: Set Environment Variables on Railway
In Railway dashboard → your project → **Variables**, add:

| Variable | Value | Required |
|----------|-------|----------|
| `OWNER_NUMBER` | `923041956023` (your number, no +) | ✅ |
| `OWNER_NAME` | `ABDULLAH` | ✅ |
| `BOT_NAME` | `ABDULLAH-BOTZ` | ✅ |
| `PREFIX` | `.` | ✅ |
| `MODE` | `public` | ✅ |
| `GROQ_API_KEY` | Get free at [console.groq.com](https://console.groq.com) | Optional |
| `ANTI_DELETE` | `true` | Optional |
| `ANTI_LINK` | `true` | Optional |
| `ALWAYS_ONLINE` | `true` | Optional |

### Step 4: Link WhatsApp
1. After deploy, open Railway **Logs**
2. You'll see a **PAIRING CODE** printed
3. On your phone: WhatsApp → **⋮ Menu → Linked Devices → Link with phone number**
4. Enter the pairing code
5. ✅ Bot is connected!

---

## 🖥️ Run Locally

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO
cd YOUR_REPO
npm install
# Edit config.env with your details
node index.js
```

---

## 📋 Commands

Send `.menu` in WhatsApp to see all available commands.

---

## ⚙️ Configuration (config.env)

Edit `config.env` before running locally:
```
OWNER_NUMBER=923041956023
OWNER_NAME=ABDULLAH
BOT_NAME=ABDULLAH-BOTZ
PREFIX=.
MODE=public
GROQ_API_KEY=your_key_here
```

---

## 🔧 Features

- ✅ Auto Pairing (no SESSION_ID needed)
- ✅ Anti-Delete, Anti-Link, Anti-Bad
- ✅ Welcome/Goodbye messages
- ✅ AI commands (Groq)
- ✅ Sticker maker
- ✅ Group management
- ✅ YouTube search
- ✅ Web panel at your Railway URL

---

**Made by ABDULLAH Official** 🤍

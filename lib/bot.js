const fs = require('fs');
if (fs.existsSync('bot.env')) require('dotenv').config({ path: './bot.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
BOT_URL: process.env.BOT_URL || "https://raw.githubusercontent.com/ArslanMDofficial/ARSLAN-MD-DATA/refs/heads/main/datafile.json",
AUTO_SITE: process.env.AUTO_SITE || "https://arslan-apis.vercel.app",
BAND_URL: process.env.BAND_URL || "https://raw.githubusercontent.com/ArslanMDofficial/ARSLAN-MD-DATA/refs/heads/main/bandusers.json",
REPO_LINK: process.env.REPO_LINK || "https://github.com/ABDULLAH-XMD/ABDULLAH-BOTZ",
REPO_NAME: process.env.REPO_NAME || "ABDULLAH-BOTZ",
BOT_NAME: process.env.BOT_NAME || "ABDULLAH-BOTZ",
DESCRIPTION: process.env.DESCRIPTION || "ABDULLAH BOTZ PAKISTANI POWERFULL WHATSAPP BOT",
OWNER_NUMBER: process.env.OWNER_NUMBER || "923041956023",
OWNER_NAME: process.env.OWNER_NAME || "ABDULLAH",
ST_SAVE: process.env.ST_SAVE || "ABDULLAH-BOTZ-STATUS-SERVER",
BIO_TEXT: process.env.BIO_TEXT || "ABDULLAH-BOTZ-BY-ABDULLAH-OFFICIAL",
AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*`STATUS SEEN BY ABDULLAH-BOTZ`* _*POWERD BY*_ *ABDULLAH-BOTZ Whatsapp Bot*",
FOOTER: process.env.FOOTER || "ABDULLAH-BOTZ",
COPYRIGHT: process.env.COPYRIGHT || "*㋛ ABDULLAH-BOTZ BY ABDULLAH OFFICIAL*",
VERSION: process.env.VERSION || "9.0.0",
NEWSLETTER: process.env.NEWSLETTER || "120363348739987203@newsletter",
WA_CHANNEL: process.env.WA_CHANNEL || "https://whatsapp.com/channel/0029VbCBz2LJpe8jIivIFL2H",
INSTA: process.env.INSTA || "https://Instagram.com/arslanmdoFQXfficial",
ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/yba2f9.jpg",
OWNER_IMG: process.env.OWNER_IMG || "https://files.catbox.moe/yba2f9.jpg",
CONVERT_IMG: process.env.CONVERT_IMG || "https://files.catbox.moe/yba2f9.jpg",
AI_IMG: process.env.AI_IMG || "https://files.catbox.moe/yba2f9.jpg",
SEARCH_IMG: process.env.SEARCH_IMG || "https://files.catbox.moe/yba2f9.jpg",
DOWNLOAD_IMG: process.env.DOWNLOAD_IMG || "https://files.catbox.moe/yba2f9.jpg",
MAIN_IMG: process.env.MAIN_IMG || "https://files.catbox.moe/yba2f9.jpg",
GROUP_IMG: process.env.GROUP_IMG || "https://files.catbox.moe/yba2f9.jpg",
FUN_IMG: process.env.FUN_IMG || "https://files.catbox.moe/yba2f9.jpg",
TOOLS_IMG: process.env.TOOLS_IMG || "https://files.catbox.moe/yba2f9.jpg",
OTHER_IMG: process.env.OTHER_IMG || "https://files.catbox.moe/yba2f9.jpg",
MOVIE_IMG: process.env.MOVIE_IMG || "https://files.catbox.moe/yba2f9.jpg",
NEWS_IMG: process.env.NEWS_IMG || "https://files.catbox.moe/yba2f9.jpg",
PP_IMG: process.env.PP_IMG || "https://files.catbox.moe/yba2f9.jpg"
};

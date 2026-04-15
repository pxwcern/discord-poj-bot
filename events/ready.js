const { Events, REST, Routes } = require('discord.js');
require('dotenv').config();

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        // Giveaway Background Task
        const db = require('../db');
        const { EmbedBuilder } = require('discord.js');

        setInterval(async () => {
            const now = Date.now();
            const giveaways = db.prepare('SELECT * FROM giveaways WHERE status = ? AND endTime <= ?').all('active', now);

            for (const g of giveaways) {
                db.prepare('UPDATE giveaways SET status = ? WHERE messageId = ?').run('ended', g.messageId);

                const channel = client.channels.cache.get(g.channelId);
                if (!channel) continue;

                const msg = await channel.messages.fetch(g.messageId).catch(() => null);
                if (!msg) continue;

                const entries = db.prepare('SELECT userId FROM giveaway_entries WHERE messageId = ?').all(g.messageId);
                const winners = [];
                const validUsers = entries.map(e => e.userId);

                if (validUsers.length === 0) {
                    await channel.send(`The giveaway for **${g.prize}** ended, but nobody joined! 😔`);
                } else {
                    for (let i = 0; i < g.winnersCount; i++) {
                        if (validUsers.length === 0) break;
                        const winnerIndex = Math.floor(Math.random() * validUsers.length);
                        winners.push(`<@${validUsers[winnerIndex]}>`);
                        validUsers.splice(winnerIndex, 1);
                    }

                    const endEmbed = EmbedBuilder.from(msg.embeds[0])
                        .setTitle('🎁 GIVEAWAY ENDED 🎁')
                        .setColor('Red')
                        .setDescription(`**Prize:** ${g.prize}\n**Winners:** ${winners.join(', ')}\n**Hosted By:** <@${g.hostedBy}>`);

                    await msg.edit({ embeds: [endEmbed], components: [] });
                    await channel.send(`🎊 Congratulations ${winners.join(', ')}! You won the **${g.prize}**!`);
                }
            }
        }, 30000); // Check every 30 seconds
        
        // Set status to idle
        client.user.setStatus('idle');

        // Register slash commands
        const commands = [];
        client.commands.forEach(command => {
            commands.push(command.data.toJSON());
        });

        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);

            // The put method is used to fully refresh all commands globally
            const data = await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID || client.user.id),
                { body: commands },
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error('Error refreshing slash commands:', error);
        }
    },
};

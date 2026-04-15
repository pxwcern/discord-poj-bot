const { Events } = require('discord.js');
const db = require('../db');

const xpCooldowns = new Set();

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (message.author.bot || !message.guild) return;

        // 1. AFK Remove Check
        const afkCheck = db.prepare('SELECT * FROM users_afk WHERE userId = ?').get(message.author.id);
        if (afkCheck) {
            db.prepare('DELETE FROM users_afk WHERE userId = ?').run(message.author.id);
            message.channel.send(`Welcome back ${message.author}! Your AFK status has been removed.`).then(m => setTimeout(() => m.delete().catch(()=>{}), 7000));
        }

        // 2. Mention AFK Check
        message.mentions.users.forEach(user => {
            const afkMention = db.prepare('SELECT * FROM users_afk WHERE userId = ?').get(user.id);
            if (afkMention) {
                message.reply(`Zzz... ${user.username} is currently AFK: **${afkMention.reason}**`);
            }
        });

        // 3. Leveling System (XP Logic)
        if (!message.content.startsWith(client.prefix)) {
            if (!xpCooldowns.has(message.author.id)) {
                let lvlRow = db.prepare('SELECT * FROM users_level WHERE guildId = ? AND userId = ?').get(message.guild.id, message.author.id);
                if (!lvlRow) {
                    db.prepare('INSERT INTO users_level (guildId, userId, xp, level) VALUES (?, ?, ?, ?)').run(message.guild.id, message.author.id, 0, 0);
                    lvlRow = { xp: 0, level: 0 };
                }

                const xpGained = Math.floor(Math.random() * 15) + 10;
                const newXp = lvlRow.xp + xpGained;
                const newLevel = Math.floor(newXp / 300); // 300 XP per level

                if (newLevel > lvlRow.level) {
                    // Level Up!
                    db.prepare('UPDATE users_level SET xp = ?, level = ? WHERE guildId = ? AND userId = ?').run(newXp, newLevel, message.guild.id, message.author.id);
                    
                    // Check for role rewards
                    const roleReward = db.prepare('SELECT roleId FROM level_roles WHERE guildId = ? AND level <= ? ORDER BY level DESC LIMIT 1').get(message.guild.id, newLevel);
                    if (roleReward) {
                        const role = message.guild.roles.cache.get(roleReward.roleId);
                        if (role) message.member.roles.add(role).catch(() => {});
                    }

                    // Send announcement
                    const settings = db.prepare('SELECT * FROM leveling_settings WHERE guildId = ?').get(message.guild.id);
                    const targetChannel = (settings && settings.toggle && settings.channelId) ? message.guild.channels.cache.get(settings.channelId) : message.channel;
                    
                    if (targetChannel && (!settings || settings.toggle)) {
                        targetChannel.send(`🎉 **LEVEL UP!** ${message.author} is now level **${newLevel}**!`);
                    }
                } else {
                    db.prepare('UPDATE users_level SET xp = ? WHERE guildId = ? AND userId = ?').run(newXp, message.guild.id, message.author.id);
                }

                xpCooldowns.add(message.author.id);
                setTimeout(() => {
                    xpCooldowns.delete(message.author.id);
                }, 60000);
            }
        }

        // 4. Prefix Commands Parser
        if (!message.content.startsWith(client.prefix)) return;

        const args = message.content.slice(client.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.prefixCommands.get(commandName);

        if (!command) return;

        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(`Error executing prefix command ${commandName}`, error);
            message.channel.send('An error occurred while executing that command!');
        }
    },
};

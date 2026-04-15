const { SlashCommandBuilder } = require('discord.js');
const db = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Leave yourself AFK (auto-replies to mentions).')
        .addStringOption(option => option.setName('reason').setDescription('Reason for being AFK').setRequired(true)),
    async execute(interaction) {
        const reason = interaction.options.getString('reason');
        
        db.prepare(`
            INSERT INTO users_afk (userId, reason, timestamp)
            VALUES (?, ?, ?)
            ON CONFLICT(userId) DO UPDATE SET reason = excluded.reason
        `).run(interaction.user.id, reason, Date.now());

        await interaction.reply({ content: `You are now AFK. Reason: **${reason}**` });
    }
};

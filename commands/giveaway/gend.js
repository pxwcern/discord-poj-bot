const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gend')
        .setDescription('Ends a giveaway early.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
        .addStringOption(o => o.setName('messageid').setDescription('The ID of the giveaway message').setRequired(true)),
    async execute(interaction) {
        const msgId = interaction.options.getString('messageid');
        const giveaway = db.prepare('SELECT * FROM giveaways WHERE messageId = ? AND status = ?').get(msgId, 'active');

        if (!giveaway) return interaction.reply({ content: 'Giveaway not found or already ended.', ephemeral: true });

        db.prepare('UPDATE giveaways SET endTime = ? WHERE messageId = ?').run(Date.now(), msgId);
        await interaction.reply({ content: 'Giveaway will end shortly...', ephemeral: true });
    }
};

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('glist')
        .setDescription('Lists all active giveaways.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),
    async execute(interaction) {
        const giveaways = db.prepare('SELECT * FROM giveaways WHERE status = ?').all('active');

        if (giveaways.length === 0) return interaction.reply({ content: 'No active giveaways.', ephemeral: true });

        const embed = new EmbedBuilder()
            .setTitle('🎫 Active Giveaways')
            .setColor('Blue')
            .setDescription(giveaways.map(g => `**Prize:** ${g.prize}\n**Ends:** <t:${Math.floor(g.endTime / 1000)}:R>\n**Message ID:** \`${g.messageId}\``).join('\n\n'));

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};

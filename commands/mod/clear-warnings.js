const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear-warnings')
        .setDescription('Clears all warnings for a user.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option => option.setName('user').setDescription('The user').setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const guildId = interaction.guild.id;

        const info = db.prepare('DELETE FROM warnings WHERE guildId = ? AND userId = ?').run(guildId, user.id);

        if (info.changes > 0) {
            await interaction.reply({ content: `Successfully cleared ${info.changes} warnings for ${user.tag}.`, ephemeral: true });
        } else {
            await interaction.reply({ content: `${user.tag} has no warnings to clear.`, ephemeral: true });
        }
    }
};

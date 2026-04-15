const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unbans a user from the server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(option => option.setName('userid').setDescription('The ID of the user to unban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for the unban')),
    async execute(interaction) {
        const userId = interaction.options.getString('userid');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        try {
            await interaction.guild.members.unban(userId, reason);
            await interaction.reply({ content: `Successfully unbanned user <@${userId}>.`, ephemeral: true });
        } catch (e) {
            console.error(e);
            await interaction.reply({ content: 'Failed to unban user. Make sure the ID is correct and they are banned.', ephemeral: true });
        }
    },
};

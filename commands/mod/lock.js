const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Locks the current channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        try {
            await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SendMessages: false
            });
            await interaction.reply({ content: 'Channel has been locked 🔒' });
        } catch (e) {
            await interaction.reply({ content: 'Failed to lock channel. Check my permissions.', ephemeral: true });
        }
    }
};

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlocks the current channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        try {
            await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SendMessages: null
            });
            await interaction.reply({ content: 'Channel has been unlocked 🔓' });
        } catch (e) {
            await interaction.reply({ content: 'Failed to unlock channel. Check my permissions.', ephemeral: true });
        }
    }
};

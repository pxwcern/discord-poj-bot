const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Sets the slowmode for the channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addIntegerOption(option => option.setName('seconds').setDescription('Slowmode duration in seconds (0 to disable)').setRequired(true)),
    async execute(interaction) {
        const seconds = interaction.options.getInteger('seconds');
        try {
            await interaction.channel.setRateLimitPerUser(seconds);
            if (seconds === 0) {
                await interaction.reply({ content: 'Slowmode disabled.' });
            } else {
                await interaction.reply({ content: `Slowmode set to ${seconds} seconds.` });
            }
        } catch (e) {
            await interaction.reply({ content: 'Failed to set slowmode.', ephemeral: true });
        }
    }
};

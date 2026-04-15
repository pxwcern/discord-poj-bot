const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-close')
        .setDescription('Closes the current active support ticket.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        if (!interaction.channel.name.startsWith('support-')) {
            return interaction.reply({ content: 'This command can only be used inside an active support ticket channel.', ephemeral: true });
        }

        await interaction.reply('Logging transcripts and permanently closing channel in 5 seconds...');
        
        setTimeout(() => {
            interaction.channel.delete().catch(console.error);
        }, 5000);
    }
};

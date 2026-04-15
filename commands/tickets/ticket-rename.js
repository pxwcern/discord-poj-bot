const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-rename')
        .setDescription('Renames the current ticket channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addStringOption(o => o.setName('name').setDescription('The new name').setRequired(true)),
    async execute(interaction) {
        if (!interaction.channel.name.startsWith('support-')) {
            return interaction.reply({ content: 'This command can only be used inside a ticket channel.', ephemeral: true });
        }

        const newName = interaction.options.getString('name').toLowerCase().replace(/[^a-z0-9]/g, '-');

        try {
            await interaction.channel.setName(`support-${newName}`);
            await interaction.reply({ content: `Successfully renamed channel to **support-${newName}**.` });
        } catch (e) {
            await interaction.reply({ content: 'Failed to rename channel.', ephemeral: true });
        }
    }
};

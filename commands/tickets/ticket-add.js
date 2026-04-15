const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-add')
        .setDescription('Adds a user to the current ticket channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addUserOption(o => o.setName('user').setDescription('The user to add').setRequired(true)),
    async execute(interaction) {
        if (!interaction.channel.name.startsWith('support-')) {
            return interaction.reply({ content: 'This command can only be used inside a ticket channel.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');

        try {
            await interaction.channel.permissionOverwrites.edit(user, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true
            });
            await interaction.reply({ content: `Successfully added ${user} to the ticket.` });
        } catch (e) {
            await interaction.reply({ content: 'Failed to add user. Ensure I have "Manage Channels" permission.', ephemeral: true });
        }
    }
};

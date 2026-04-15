const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-remove')
        .setDescription('Removes a user from the current ticket channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addUserOption(o => o.setName('user').setDescription('The user to remove').setRequired(true)),
    async execute(interaction) {
        if (!interaction.channel.name.startsWith('support-')) {
            return interaction.reply({ content: 'This command can only be used inside a ticket channel.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');

        try {
            await interaction.channel.permissionOverwrites.delete(user);
            await interaction.reply({ content: `Successfully removed ${user} from the ticket.` });
        } catch (e) {
            await interaction.reply({ content: 'Failed to remove user.', ephemeral: true });
        }
    }
};

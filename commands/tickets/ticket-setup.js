const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-setup')
        .setDescription('Sets up a support ticket creation panel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🎫 Support Tickets')
            .setDescription('Need help? Click the button below to open a private ticket and speak directly with a moderator.')
            .setColor('DarkNavy');

        const button = new ButtonBuilder()
            .setCustomId('ticket_open')
            .setLabel('Open Support Ticket')
            .setStyle(ButtonStyle.Success)
            .setEmoji('📩');

        const row = new ActionRowBuilder().addComponents(button);

        await interaction.channel.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: 'Ticket system successfully deployed to this channel!', ephemeral: true });
    }
};

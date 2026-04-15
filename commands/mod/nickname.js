const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nickname')
        .setDescription('Changes a user\'s server nickname.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
        .addUserOption(option => option.setName('user').setDescription('The user to change').setRequired(true))
        .addStringOption(option => option.setName('nick').setDescription('The new nickname (leave empty to reset)').setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getMember('user');
        const nick = interaction.options.getString('nick') || null;

        if (!user) return interaction.reply({ content: 'Member not found.', ephemeral: true });

        try {
            await user.setNickname(nick);
            await interaction.reply({ content: `Successfully ${nick ? `changed nickname to **${nick}**` : 'reset nickname'} for ${user.user.tag}.`, ephemeral: true });
        } catch (e) {
            console.error(e);
            await interaction.reply({ content: 'Failed to change nickname. Ensure my role is higher than the target user.', ephemeral: true });
        }
    },
};

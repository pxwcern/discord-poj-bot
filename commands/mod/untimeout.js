const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('untimeout')
        .setDescription('Removes timeout from a user.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option => option.setName('user').setDescription('The user to untimeout').setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!member) return interaction.reply({ content: 'User not found in this server.', ephemeral: true });

        try {
            await member.timeout(null);
            await interaction.reply({ content: `Successfully removed timeout for ${user.tag}.`, ephemeral: true });
        } catch (e) {
            await interaction.reply({ content: 'Failed to untimeout user. Check my permissions.', ephemeral: true });
        }
    }
};

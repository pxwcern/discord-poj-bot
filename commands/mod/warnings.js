const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnings')
        .setDescription('Check warnings for a user.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option => option.setName('user').setDescription('The user to check').setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const guildId = interaction.guild.id;

        const rows = db.prepare('SELECT * FROM warnings WHERE guildId = ? AND userId = ?').all(guildId, user.id);

        if (!rows || rows.length === 0) {
            return interaction.reply({ content: `${user.tag} has 0 warnings.`, ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle(`Warnings for ${user.tag}`)
            .setColor('Blurple');

        rows.forEach((row, i) => {
            const date = new Date(row.timestamp).toLocaleString();
            embed.addFields({ name: `Warning #${i + 1}`, value: `**Reason:** ${row.reason}\n**Mod:** <@${row.moderatorId}>\n**Date:** ${date}` });
        });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};

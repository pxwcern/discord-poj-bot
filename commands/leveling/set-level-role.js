const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-level-role')
        .setDescription('Set a role reward for a specific level.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addIntegerOption(o => o.setName('level').setDescription('The level required').setRequired(true))
        .addRoleOption(o => o.setName('role').setDescription('The role to reward').setRequired(true)),
    async execute(interaction) {
        const level = interaction.options.getInteger('level');
        const role = interaction.options.getRole('role');

        try {
            db.prepare('INSERT OR REPLACE INTO level_roles (guildId, level, roleId) VALUES (?, ?, ?)').run(interaction.guild.id, level, role.id);
            await interaction.reply({ content: `Role ${role} will now be rewarded at **Level ${level}**!`, ephemeral: true });
        } catch (e) {
            console.error(e);
            await interaction.reply({ content: 'Failed to set level role.', ephemeral: true });
        }
    },
};

const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Role management commands.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addSubcommand(sub => sub.setName('add').setDescription('Adds a role to a user.')
            .addUserOption(o => o.setName('user').setDescription('The user').setRequired(true))
            .addRoleOption(o => o.setName('role').setDescription('The role').setRequired(true)))
        .addSubcommand(sub => sub.setName('remove').setDescription('Removes a role from a user.')
            .addUserOption(o => o.setName('user').setDescription('The user').setRequired(true))
            .addRoleOption(o => o.setName('role').setDescription('The role').setRequired(true)))
        .addSubcommand(sub => sub.setName('info').setDescription('Displays info about a role.')
            .addRoleOption(o => o.setName('role').setDescription('The role').setRequired(true))),
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        const member = interaction.options.getMember('user');
        const role = interaction.options.getRole('role');

        if (sub === 'add') {
            try {
                await member.roles.add(role);
                await interaction.reply({ content: `Successfully added role ${role} to ${member.user.tag}.`, ephemeral: true });
            } catch (e) {
                await interaction.reply({ content: 'Failed to add role. Check permissions and hierarchy.', ephemeral: true });
            }
        } else if (sub === 'remove') {
            try {
                await member.roles.remove(role);
                await interaction.reply({ content: `Successfully removed role ${role} from ${member.user.tag}.`, ephemeral: true });
            } catch (e) {
                await interaction.reply({ content: 'Failed to remove role. Check permissions and hierarchy.', ephemeral: true });
            }
        } else if (sub === 'info') {
            const embed = new EmbedBuilder()
                .setTitle(`Role Info: ${role.name}`)
                .setColor(role.color)
                .addFields(
                    { name: 'ID', value: `\`${role.id}\``, inline: true },
                    { name: 'Hex', value: `\`${role.hexColor}\``, inline: true },
                    { name: 'Position', value: `\`${role.position}\``, inline: true },
                    { name: 'Mentionable', value: `\`${role.mentionable}\``, inline: true },
                    { name: 'Managed', value: `\`${role.managed}\``, inline: true }
                )
                .setTimestamp();
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
